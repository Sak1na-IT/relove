// Elanlar: siyahı, axtarış, bir elan, yaratmaq, dəyişmək, silmək, bəyənmək
import { newId } from '../db.js'
import { badRequest, forbidden } from '../http.js'
import { requireUser } from '../auth.js'
import { serializeListing } from '../serialize.js'
import { LISTING_SELECT, listingsByIds, nowIso, requireListing } from '../queries.js'
import * as v from '../validate.js'

const SORTS = {
  new: 'l.created_at DESC',
  low: 'l.price ASC, l.created_at DESC',
  high: 'l.price DESC, l.created_at DESC',
  likes: '(l.likes_base + fav_count) DESC, l.created_at DESC',
}

// Elan məlumatını yoxlayır. partial=true olduqda yalnız göndərilən sahələr.
function readListingInput(b, { partial = false } = {}) {
  const req = !partial
  const out = {
    title: v.str(b.title, 'title', { required: req, min: 3, max: 120 }),
    category: v.str(b.category, 'category', { max: 40 }),
    dept: v.str(b.dept, 'dept', { max: 40 }),
    sub: v.str(b.sub, 'sub', { max: 60 }),
    price: v.int(b.price, 'price', { min: 0, max: 1_000_000 }),
    condition: v.str(b.condition, 'condition', { max: 40 }),
    district: v.str(b.district, 'district', { max: 60 }),
    description: v.str(b.description, 'description', { max: 2000 }),
    story: v.str(b.story, 'story', { max: 600 }),
    defect: v.str(b.defect, 'defect', { max: 600 }),
    repair: v.oneOf(b.repair, 'repair', v.REPAIR_LEVELS),
    aspect: v.oneOf(b.aspect, 'aspect', ['square', 'tall', 'wide']),
  }
  const modes = v.strList(b.modes, 'modes', { allowed: v.MODES, maxItems: 3 })
  if (req && (!modes || !modes.length)) throw badRequest('Ən azı bir bölmə seç: sale, swap və ya free')
  if (modes) {
    if (!modes.length) throw badRequest('Ən azı bir bölmə seç')
    if (modes.includes('free') && modes.length > 1) throw badRequest('İkinci şans elanı başqa bölmə ilə birləşə bilməz')
    out.modes = JSON.stringify(modes)
  }
  const images = v.imageUrls(b.images, { required: req })
  if (images) out.images = JSON.stringify(images)
  const wants = v.strList(b.wants, 'wants', { maxItems: 10, maxLen: 40 })
  if (wants) out.wants = JSON.stringify(wants)
  const wantsText = v.strList(b.wantsText, 'wantsText', { maxItems: 10, maxLen: 60 })
  if (wantsText) out.wants_text = JSON.stringify(wantsText)
  const delivery = v.strList(b.delivery, 'delivery', { allowed: v.DELIVERY })
  if (delivery) {
    if (!delivery.length) throw badRequest('Ən azı bir təhvil üsulu seç')
    out.delivery = JSON.stringify(delivery)
  }
  // İkinci şans: qüsur mütləq yazılmalıdır, qiymət 0–10 AZN
  if (modes?.includes('free')) {
    if (req && !out.defect) throw badRequest('İkinci şans elanında qüsuru yaz ("defect")')
    if (out.price !== undefined && out.price > 10) throw badRequest('İkinci şans elanının qiyməti 0–10 AZN ola bilər')
  }
  if (req && modes.includes('sale') && out.price === undefined) throw badRequest('Satış elanı üçün qiymət yaz')
  return Object.fromEntries(Object.entries(out).filter(([, val]) => val !== undefined))
}

export default function listingRoutes(router) {
  // GET /api/listings?mode=swap&dept=ev&sub=Kreslo&q=lampa&district=Yasamal&minPrice=10&maxPrice=200&repair=Kiçik təmir&seller=u_..&sort=low&limit=24&offset=0
  router.get('/api/listings', ({ db, query }) => {
    const where = ["l.status = 'active'"]
    const args = []
    const mode = v.oneOf(query.get('mode') || undefined, 'mode', v.MODES)
    if (mode) {
      where.push('EXISTS (SELECT 1 FROM json_each(l.modes) WHERE value = ?)')
      args.push(mode)
    }
    for (const [param, col] of [['dept', 'l.dept'], ['sub', 'l.sub'], ['district', 'l.district'], ['category', 'l.category'], ['repair', 'l.repair'], ['seller', 'l.owner_id']]) {
      const val = query.get(param)
      if (val) {
        where.push(`${col} = ?`)
        args.push(val)
      }
    }
    const min = v.int(query.get('minPrice'), 'minPrice')
    const max = v.int(query.get('maxPrice'), 'maxPrice')
    if (min !== undefined) { where.push('l.price >= ?'); args.push(min) }
    if (max !== undefined) { where.push('l.price <= ?'); args.push(max) }
    const q = (query.get('q') || '').trim()
    if (q) {
      where.push("(l.title LIKE ? OR l.description LIKE ? OR l.wants_text LIKE ? OR IFNULL(l.defect,'') LIKE ? OR IFNULL(l.sub,'') LIKE ?)")
      const like = `%${q.replace(/[%_]/g, '')}%`
      args.push(like, like, like, like, like)
    }
    const sort = SORTS[query.get('sort')] || SORTS.new
    const limit = v.int(query.get('limit'), 'limit', { min: 1, max: 100 }) ?? 60
    const offset = v.int(query.get('offset'), 'offset', { min: 0, max: 100000 }) ?? 0

    const total = db.prepare(`SELECT COUNT(*) AS n FROM listings l WHERE ${where.join(' AND ')}`).get(...args).n
    const rows = db
      .prepare(`${LISTING_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} LIMIT ? OFFSET ?`)
      .all(...args, limit, offset)
    return { total, items: rows.map((r) => serializeListing(r)) }
  })

  // Gizli və satılmış elanları yalnız sahibi görür
  router.get('/api/listings/:id', ({ db, params, user }) => {
    const row = requireListing(db, params.id)
    if (row.status !== 'active' && row.owner_id !== user?.id) throw forbidden('Bu elan hazırda aktiv deyil')
    const isFavorite = user
      ? Boolean(db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?').get(user.id, row.id))
      : false
    return serializeListing(row, { isFavorite, isMine: row.owner_id === user?.id })
  })

  router.post('/api/listings', (ctx) => {
    const me = requireUser(ctx)
    const data = readListingInput(ctx.body)
    data.district ??= me.district
    data.delivery ??= me.delivery
    const id = newId('l')
    const cols = ['id', 'owner_id', ...Object.keys(data)]
    ctx.db
      .prepare(`INSERT INTO listings (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
      .run(id, me.id, ...Object.values(data))
    return { status: 201, data: serializeListing(requireListing(ctx.db, id), { isMine: true }) }
  })

  router.patch('/api/listings/:id', (ctx) => {
    const me = requireUser(ctx)
    const row = requireListing(ctx.db, ctx.params.id)
    if (row.owner_id !== me.id) throw forbidden('Yalnız öz elanını dəyişə bilərsən')
    const data = readListingInput(ctx.body, { partial: true })
    const status = v.oneOf(ctx.body.status, 'status', v.LISTING_STATUSES)
    if (status) data.status = status
    if (!Object.keys(data).length) throw badRequest('Dəyişiləcək sahə göndərilməyib')
    data.updated_at = nowIso()
    ctx.db
      .prepare(`UPDATE listings SET ${Object.keys(data).map((k) => `${k} = ?`).join(', ')} WHERE id = ?`)
      .run(...Object.values(data), row.id)
    return serializeListing(requireListing(ctx.db, row.id), { isMine: true })
  })

  router.delete('/api/listings/:id', (ctx) => {
    const me = requireUser(ctx)
    const row = requireListing(ctx.db, ctx.params.id)
    if (row.owner_id !== me.id) throw forbidden('Yalnız öz elanını silə bilərsən')
    ctx.db.prepare('DELETE FROM listings WHERE id = ?').run(row.id)
    return { status: 204 }
  })

  // Mənim elanlarım (bütün statuslar)
  router.get('/api/me/listings', (ctx) => {
    const me = requireUser(ctx)
    const rows = ctx.db.prepare(`${LISTING_SELECT} WHERE l.owner_id = ? ORDER BY l.created_at DESC`).all(me.id)
    return rows.map((r) => serializeListing(r, { isMine: true }))
  })

  // Bəyəndiklərim
  router.get('/api/me/favorites', (ctx) => {
    const me = requireUser(ctx)
    const ids = ctx.db
      .prepare(`SELECT f.listing_id FROM favorites f JOIN listings l ON l.id = f.listing_id
                WHERE f.user_id = ? AND (l.status = 'active' OR l.owner_id = ?) ORDER BY f.created_at DESC`)
      .all(me.id, me.id)
      .map((r) => r.listing_id)
    return listingsByIds(ctx.db, ids)
  })

  router.post('/api/listings/:id/favorite', (ctx) => {
    const me = requireUser(ctx)
    const row = requireListing(ctx.db, ctx.params.id)
    ctx.db.prepare('INSERT OR IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)').run(me.id, row.id)
    return { favorite: true, likes: serializeListing(requireListing(ctx.db, row.id)).likes }
  })

  router.delete('/api/listings/:id/favorite', (ctx) => {
    const me = requireUser(ctx)
    const row = requireListing(ctx.db, ctx.params.id)
    ctx.db.prepare('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?').run(me.id, row.id)
    return { favorite: false, likes: serializeListing(requireListing(ctx.db, row.id)).likes }
  })
}
