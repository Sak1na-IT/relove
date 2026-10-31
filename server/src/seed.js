// Demo məlumatlar: frontend-dəki src/data.js-dən götürülür ki, sayt eyni görünsün.
// İşə salmaq: npm run seed  (bazanı sıfırlayıb yenidən doldurur)
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { openDb, transaction } from './db.js'
import { hashPassword } from './auth.js'
import { getConfig } from './env.js'
import { LISTINGS, MY_ITEMS, USERS, CONVERSATIONS, REVIEWS, likesOf } from '../../src/data.js'

export const DEMO_PASSWORD = 'parol123'

// data.js-dəki "me" bazada Sakina hesabıdır
const userId = (id) => (id === 'me' ? 'u_sakina' : `u_${id}`)
const emailOf = (u) => `${u.handle}@relove.demo`

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
// "Mart 2026" → 2026-03-01
function joinedDate(joined) {
  const [m, y] = String(joined || '').split(' ')
  const mi = MONTHS.indexOf(m)
  return mi >= 0 && y ? new Date(Date.UTC(Number(y), mi, 1)).toISOString() : new Date().toISOString()
}

// "2 saat əvvəl" kimi mətnləri təxmini tarixə çevirir (demo üçün)
function backdate(posted, i) {
  const now = Date.now()
  const H = 3600_000
  const map = { 'Bu gün': 3 * H, 'Dünən': 26 * H, 'İndicə': 0 }
  let ms = map[posted]
  if (ms === undefined) {
    const n = parseInt(posted, 10) || 1
    if (/saat/.test(posted)) ms = n * H
    else if (/gün/.test(posted)) ms = n * 24 * H
    else if (/həftə/.test(posted)) ms = n * 7 * 24 * H
    else ms = 2 * 24 * H
  }
  return new Date(now - ms - i * 1000).toISOString()
}

export function seed(db) {
  const hash = hashPassword(DEMO_PASSWORD)
  transaction(db, () => {
    for (const t of ['reviews', 'collection_items', 'collections', 'messages', 'conversations', 'offers', 'favorites', 'listings', 'users']) {
      db.exec(`DELETE FROM ${t}`)
    }

    const insUser = db.prepare(`INSERT INTO users (id, email, password_hash, name, avatar, bio, phone, whatsapp, show_phone,
      contact_pref, district, delivery, verified, fast_reply, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`)
    for (const u of Object.values(USERS)) {
      insUser.run(userId(u.id), emailOf(u), hash, u.name, u.avatar || null, u.bio || '', u.phone || '', Number(!!u.whatsapp),
        u.contactPref || 'Mesaj', u.district || '', '["meet"]', Number(!!u.verified), Number(!!u.fastReply), joinedDate(u.joined))
    }

    const insListing = db.prepare(`INSERT INTO listings (id, owner_id, title, category, dept, sub, price, condition, district,
      modes, images, description, story, wants, wants_text, delivery, defect, repair, aspect, status, likes_base, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    ;[...LISTINGS, ...MY_ITEMS].forEach((l, i) => {
      const created = backdate(l.posted, i)
      insListing.run(l.id, userId(l.seller), l.title, l.category, l.dept || null, l.sub || null, l.price, l.condition, l.district,
        JSON.stringify(l.modes), JSON.stringify(l.images), l.description || '', l.story || null, JSON.stringify(l.wants || []),
        JSON.stringify(l.wantsText || []), JSON.stringify(l.delivery || ['meet']), l.defect || null, l.repair || null,
        l.aspect || 'square', 'active', l.likesBase ?? likesOf(l.id), created, created)
    })

    const fav = db.prepare('INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)')
    ;['l2', 'l5', 'l9'].forEach((id) => fav.run('u_sakina', id))

    // Söhbətlər: Sakina alıcıdır, elan sahibi satıcı
    const insConv = db.prepare('INSERT INTO conversations (id, listing_id, buyer_id, seller_id, created_at) VALUES (?, ?, ?, ?, ?)')
    const insMsg = db.prepare('INSERT INTO messages (id, conversation_id, sender_id, text, read_at, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    CONVERSATIONS.forEach((c, ci) => {
      const start = Date.now() - (ci + 1) * 26 * 3600_000
      insConv.run(c.id, c.listing, 'u_sakina', userId(c.with), new Date(start).toISOString())
      const unreadFrom = c.messages.length - c.unread
      c.messages.forEach((m, mi) => {
        const at = new Date(start + (mi + 1) * 60_000 + (ci === 0 ? 25 * 3600_000 : 0)).toISOString()
        const read = m.from === 'me' || mi < unreadFrom ? at : null
        insMsg.run(`${c.id}_m${mi}`, c.id, userId(m.from), m.text, read, at)
      })
    })

    // Sakina-ya gələn bir dəyiş təklifi (Rəşadın elanı → Sakinanın qulaqlığı)
    db.prepare(`INSERT INTO offers (id, from_user_id, to_user_id, target_listing_id, offered_listing_id, cash, note)
      VALUES ('o_demo1', 'u_u4', 'u_sakina', 'm1', 'l9', 0, 'Salam! Plyonka fotoaparatımı qulaqlığınla dəyişməyə hazıram.')`).run()

    const insRev = db.prepare('INSERT INTO reviews (id, author_id, target_id, stars, text, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    REVIEWS.forEach((r, i) => insRev.run(`r_demo${i}`, userId(r.from), 'u_sakina', r.stars, r.text, new Date(Date.now() - (i + 1) * 30 * 24 * 3600_000).toISOString()))

    const insColl = db.prepare('INSERT INTO collections (id, owner_id, title, text, is_public) VALUES (?, ?, ?, ?, ?)')
    insColl.run('k_demo1', 'u_sakina', 'Yeni evim üçün', 'Köçəndə lazım olacaqlar', 1)
    const insItem = db.prepare('INSERT INTO collection_items (collection_id, listing_id) VALUES (?, ?)')
    ;['l5', 'l3'].forEach((id) => insItem.run('k_demo1', id))
  })
}

// Birbaşa işə salınanda (npm run seed)
if (process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) {
  const config = getConfig()
  const db = openDb(config.dbPath)
  seed(db)
  const n = db.prepare('SELECT COUNT(*) AS n FROM listings').get().n
  console.log(`Demo məlumat yazıldı: ${n} elan. Giriş: sakina@relove.demo / ${DEMO_PASSWORD}`)
}
