// İstifadəçi kolleksiyaları
import { newId, transaction } from '../db.js'
import { badRequest, forbidden, notFound } from '../http.js'
import { requireUser } from '../auth.js'
import { serializeCollection } from '../serialize.js'
import { listingsByIds, requireListing } from '../queries.js'
import * as v from '../validate.js'

const itemIds = (db, collId) =>
  db.prepare('SELECT listing_id FROM collection_items WHERE collection_id = ? ORDER BY added_at, rowid').all(collId).map((r) => r.listing_id)

function full(db, row, { expand = false } = {}) {
  const ids = itemIds(db, row.id)
  const c = serializeCollection(row, ids)
  if (expand) c.listings = listingsByIds(db, ids)
  return c
}

function requireOwn(db, id, meId) {
  const row = db.prepare('SELECT * FROM collections WHERE id = ?').get(id)
  if (!row) throw notFound('Kolleksiya tapılmadı')
  if (row.owner_id !== meId) throw forbidden('Yalnız öz kolleksiyanı dəyişə bilərsən')
  return row
}

export default function collectionRoutes(router) {
  // ?mine=1 — mənimkilər (gizlilər də); yoxsa hamının açıq kolleksiyaları
  router.get('/api/collections', (ctx) => {
    if (ctx.query.get('mine')) {
      const me = requireUser(ctx)
      return ctx.db.prepare('SELECT * FROM collections WHERE owner_id = ? ORDER BY created_at DESC').all(me.id).map((r) => full(ctx.db, r))
    }
    return ctx.db.prepare('SELECT * FROM collections WHERE is_public = 1 ORDER BY created_at DESC LIMIT 100').all().map((r) => full(ctx.db, r))
  })

  router.get('/api/collections/:id', (ctx) => {
    const row = ctx.db.prepare('SELECT * FROM collections WHERE id = ?').get(ctx.params.id)
    if (!row || (!row.is_public && row.owner_id !== ctx.user?.id)) throw notFound('Kolleksiya tapılmadı')
    return full(ctx.db, row, { expand: true })
  })

  // { title, text?, isPublic?, items?: [listingId] }
  router.post('/api/collections', (ctx) => {
    const me = requireUser(ctx)
    const title = v.str(ctx.body.title, 'title', { required: true, min: 2, max: 40 })
    const text = v.str(ctx.body.text, 'text', { max: 120 }) ?? ''
    const isPublic = v.bool(ctx.body.isPublic, 'isPublic') ?? true
    const items = v.strList(ctx.body.items, 'items', { maxItems: 200, maxLen: 40 }) ?? []
    items.forEach((id) => requireListing(ctx.db, id))
    const id = newId('k')
    transaction(ctx.db, () => {
      ctx.db.prepare('INSERT INTO collections (id, owner_id, title, text, is_public) VALUES (?, ?, ?, ?, ?)').run(id, me.id, title, text, Number(isPublic))
      const add = ctx.db.prepare('INSERT OR IGNORE INTO collection_items (collection_id, listing_id) VALUES (?, ?)')
      items.forEach((lid) => add.run(id, lid))
    })
    return { status: 201, data: full(ctx.db, ctx.db.prepare('SELECT * FROM collections WHERE id = ?').get(id)) }
  })

  router.patch('/api/collections/:id', (ctx) => {
    const me = requireUser(ctx)
    const row = requireOwn(ctx.db, ctx.params.id, me.id)
    const patch = {
      title: v.str(ctx.body.title, 'title', { min: 2, max: 40 }),
      text: v.str(ctx.body.text, 'text', { max: 120 }),
      is_public: v.bool(ctx.body.isPublic, 'isPublic'),
    }
    const set = Object.entries(patch).filter(([, val]) => val !== undefined)
    if (!set.length) throw badRequest('Dəyişiləcək sahə göndərilməyib')
    ctx.db
      .prepare(`UPDATE collections SET ${set.map(([k]) => `${k} = ?`).join(', ')} WHERE id = ?`)
      .run(...set.map(([, val]) => (typeof val === 'boolean' ? Number(val) : val)), row.id)
    return full(ctx.db, ctx.db.prepare('SELECT * FROM collections WHERE id = ?').get(row.id))
  })

  router.delete('/api/collections/:id', (ctx) => {
    const me = requireUser(ctx)
    const row = requireOwn(ctx.db, ctx.params.id, me.id)
    ctx.db.prepare('DELETE FROM collections WHERE id = ?').run(row.id)
    return { status: 204 }
  })

  router.post('/api/collections/:id/items', (ctx) => {
    const me = requireUser(ctx)
    const row = requireOwn(ctx.db, ctx.params.id, me.id)
    const listingId = v.str(ctx.body.listingId, 'listingId', { required: true, max: 40 })
    requireListing(ctx.db, listingId)
    ctx.db.prepare('INSERT OR IGNORE INTO collection_items (collection_id, listing_id) VALUES (?, ?)').run(row.id, listingId)
    return full(ctx.db, row)
  })

  router.delete('/api/collections/:id/items/:listingId', (ctx) => {
    const me = requireUser(ctx)
    const row = requireOwn(ctx.db, ctx.params.id, me.id)
    ctx.db.prepare('DELETE FROM collection_items WHERE collection_id = ? AND listing_id = ?').run(row.id, ctx.params.listingId)
    return full(ctx.db, row)
  })
}
