// İstifadəçi profilləri və rəylər
import { newId } from '../db.js'
import { badRequest, conflict, forbidden, notFound } from '../http.js'
import { requireUser } from '../auth.js'
import { serializeListing, serializePublicUser, serializeReview } from '../serialize.js'
import { LISTING_SELECT, userStats } from '../queries.js'
import * as v from '../validate.js'

function requireUserRow(db, id) {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!u) throw notFound('İstifadəçi tapılmadı')
  return u
}

const reviewsFor = (db, userId) =>
  db.prepare('SELECT * FROM reviews WHERE target_id = ? ORDER BY created_at DESC').all(userId).map(serializeReview)

export default function userRoutes(router) {
  router.get('/api/users/:id', ({ db, params }) => {
    const u = requireUserRow(db, params.id)
    const listings = db
      .prepare(`${LISTING_SELECT} WHERE l.owner_id = ? AND l.status = 'active' ORDER BY l.created_at DESC`)
      .all(u.id)
      .map((r) => serializeListing(r))
    return { user: serializePublicUser(u, userStats(db, u.id)), listings, reviews: reviewsFor(db, u.id) }
  })

  router.get('/api/users/:id/reviews', ({ db, params }) => {
    requireUserRow(db, params.id)
    return reviewsFor(db, params.id)
  })

  router.get('/api/me/reviews', (ctx) => {
    const me = requireUser(ctx)
    return reviewsFor(ctx.db, me.id)
  })

  // Rəyi yalnız qarşı tərəflə alış-veriş və ya dəyiş-düyüş tamamlayan yaza bilər:
  // qəbul olunmuş dəyiş təklifi və ya satılmış elan üzrə söhbət olmalıdır.
  router.post('/api/users/:id/reviews', (ctx) => {
    const me = requireUser(ctx)
    const target = requireUserRow(ctx.db, ctx.params.id)
    if (target.id === me.id) throw badRequest('Özünə rəy yaza bilməzsən')
    const stars = v.int(ctx.body.stars, 'stars', { min: 1, max: 5, required: true })
    const text = v.str(ctx.body.text, 'text', { max: 600 }) ?? ''

    const swapped = ctx.db
      .prepare(`SELECT 1 FROM offers WHERE status = 'accepted'
                AND ((from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?))`)
      .get(me.id, target.id, target.id, me.id)
    const bought = ctx.db
      .prepare(`SELECT 1 FROM conversations c JOIN listings l ON l.id = c.listing_id
                WHERE l.status = 'sold' AND ((c.buyer_id = ? AND c.seller_id = ?) OR (c.buyer_id = ? AND c.seller_id = ?))`)
      .get(me.id, target.id, target.id, me.id)
    if (!swapped && !bought) throw forbidden('Rəyi yalnız bu istifadəçi ilə alış-veriş və ya dəyiş-düyüş tamamlandıqdan sonra yaza bilərsən')

    if (ctx.db.prepare('SELECT 1 FROM reviews WHERE author_id = ? AND target_id = ?').get(me.id, target.id)) {
      throw conflict('Bu istifadəçiyə artıq rəy yazmısan')
    }
    const id = newId('r')
    ctx.db.prepare('INSERT INTO reviews (id, author_id, target_id, stars, text) VALUES (?, ?, ?, ?, ?)').run(id, me.id, target.id, stars, text)
    return { status: 201, data: serializeReview(ctx.db.prepare('SELECT * FROM reviews WHERE id = ?').get(id)) }
  })
}
