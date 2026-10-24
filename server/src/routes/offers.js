// Dəyiş-düyüş təklifləri
import { newId, transaction } from '../db.js'
import { badRequest, conflict, forbidden, notFound } from '../http.js'
import { requireUser } from '../auth.js'
import { serializeOffer } from '../serialize.js'
import { listingsByIds, nowIso, requireListing } from '../queries.js'
import * as v from '../validate.js'

const hasMode = (row, mode) => JSON.parse(row.modes).includes(mode)

function withListings(db, offers) {
  const ids = [...new Set(offers.flatMap((o) => [o.targetId, o.offeredId]))]
  const byId = new Map(listingsByIds(db, ids).map((l) => [l.id, l]))
  return offers.map((o) => ({ ...o, target: byId.get(o.targetId) || null, offered: byId.get(o.offeredId) || null }))
}

export default function offerRoutes(router) {
  // Mənə gələn və mənim göndərdiyim təkliflər
  router.get('/api/offers', (ctx) => {
    const me = requireUser(ctx)
    const all = (col) =>
      ctx.db.prepare(`SELECT * FROM offers WHERE ${col} = ? ORDER BY created_at DESC`).all(me.id).map(serializeOffer)
    return { incoming: withListings(ctx.db, all('to_user_id')), outgoing: withListings(ctx.db, all('from_user_id')) }
  })

  // { targetId, offeredId, cash?, note? }
  router.post('/api/offers', (ctx) => {
    const me = requireUser(ctx)
    const targetId = v.str(ctx.body.targetId, 'targetId', { required: true, max: 40 })
    const offeredId = v.str(ctx.body.offeredId ?? ctx.body.myItemId, 'offeredId', { required: true, max: 40 })
    const cash = v.int(ctx.body.cash, 'cash', { min: 0, max: 100000 }) ?? 0
    const note = v.str(ctx.body.note, 'note', { max: 500 }) ?? ''

    const target = requireListing(ctx.db, targetId)
    const offered = requireListing(ctx.db, offeredId)
    if (target.owner_id === me.id) throw badRequest('Öz elanına təklif göndərə bilməzsən')
    if (offered.owner_id !== me.id) throw forbidden('Yalnız öz əşyanı təklif edə bilərsən')
    if (target.status !== 'active' || offered.status !== 'active') throw badRequest('Hər iki elan aktiv olmalıdır')
    if (!hasMode(target, 'swap')) throw badRequest('Bu elan dəyiş-düyüş üçün deyil')
    const dup = ctx.db
      .prepare("SELECT 1 FROM offers WHERE from_user_id = ? AND target_listing_id = ? AND offered_listing_id = ? AND status = 'pending'")
      .get(me.id, target.id, offered.id)
    if (dup) throw conflict('Bu təklifi artıq göndərmisən')

    const id = newId('o')
    ctx.db
      .prepare('INSERT INTO offers (id, from_user_id, to_user_id, target_listing_id, offered_listing_id, cash, note) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, me.id, target.owner_id, target.id, offered.id, cash, note)
    const row = ctx.db.prepare('SELECT * FROM offers WHERE id = ?').get(id)
    return { status: 201, data: withListings(ctx.db, [serializeOffer(row)])[0] }
  })

  // { status: 'accepted' | 'rejected' } — alan tərəf; { status: 'cancelled' } — göndərən
  router.patch('/api/offers/:id', (ctx) => {
    const me = requireUser(ctx)
    const offer = ctx.db.prepare('SELECT * FROM offers WHERE id = ?').get(ctx.params.id)
    if (!offer || (offer.to_user_id !== me.id && offer.from_user_id !== me.id)) throw notFound('Təklif tapılmadı')
    const status = v.oneOf(ctx.body.status, 'status', ['accepted', 'rejected', 'cancelled'], { required: true })
    if (offer.status !== 'pending') throw conflict('Bu təklif artıq cavablandırılıb')
    if (status === 'cancelled' && offer.from_user_id !== me.id) throw forbidden('Yalnız göndərən ləğv edə bilər')
    if (status !== 'cancelled' && offer.to_user_id !== me.id) throw forbidden('Yalnız təklifi alan cavab verə bilər')

    transaction(ctx.db, () => {
      ctx.db.prepare('UPDATE offers SET status = ?, updated_at = ? WHERE id = ?').run(status, nowIso(), offer.id)
      // Qəbul olunanda: hər iki əşya "satıldı" olur, eyni əşyalara olan digər gözləyən təkliflər bağlanır
      if (status === 'accepted') {
        ctx.db
          .prepare("UPDATE listings SET status = 'sold', updated_at = ? WHERE id IN (?, ?)")
          .run(nowIso(), offer.target_listing_id, offer.offered_listing_id)
        ctx.db
          .prepare(`UPDATE offers SET status = 'rejected', updated_at = ?
                    WHERE status = 'pending' AND id != ?
                    AND (target_listing_id IN (?, ?) OR offered_listing_id IN (?, ?))`)
          .run(nowIso(), offer.id, offer.target_listing_id, offer.offered_listing_id, offer.target_listing_id, offer.offered_listing_id)
      }
    })
    const row = ctx.db.prepare('SELECT * FROM offers WHERE id = ?').get(offer.id)
    return withListings(ctx.db, [serializeOffer(row)])[0]
  })
}
