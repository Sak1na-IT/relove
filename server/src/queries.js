// Bir neçə marşrutun istifadə etdiyi ortaq sorğular.
import { notFound } from './http.js'
import { serializeListing } from './serialize.js'

// Elan + neçə nəfərin bəyəndiyi
export const LISTING_SELECT = `
  SELECT l.*, (SELECT COUNT(*) FROM favorites f WHERE f.listing_id = l.id) AS fav_count
  FROM listings l
`

export function getListingRow(db, id) {
  return db.prepare(`${LISTING_SELECT} WHERE l.id = ?`).get(id)
}

export function requireListing(db, id) {
  const row = getListingRow(db, id)
  if (!row) throw notFound('Elan tapılmadı')
  return row
}

// Siyahını bir sorğu ilə gətirir (id ardıcıllığı saxlanılır)
export function listingsByIds(db, ids) {
  if (!ids.length) return []
  const rows = db.prepare(`${LISTING_SELECT} WHERE l.id IN (${ids.map(() => '?').join(',')})`).all(...ids)
  const byId = new Map(rows.map((r) => [r.id, r]))
  return ids.map((id) => byId.get(id)).filter(Boolean).map((r) => serializeListing(r))
}

export function userStats(db, userId) {
  const r = db.prepare('SELECT COUNT(*) AS n, AVG(stars) AS avg FROM reviews WHERE target_id = ?').get(userId)
  return { reviews: r.n, rating: r.n ? Math.round(r.avg * 10) / 10 : null }
}

export const nowIso = () => new Date().toISOString()
