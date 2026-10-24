// Mesajlar: hər elan + alıcı üçün bir söhbət
import { newId, transaction } from '../db.js'
import { badRequest, notFound } from '../http.js'
import { requireUser } from '../auth.js'
import { serializeListing, serializeMessage, serializePublicUser } from '../serialize.js'
import { getListingRow, nowIso, requireListing, userStats } from '../queries.js'
import * as v from '../validate.js'

function requireConversation(db, id, meId) {
  const c = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)
  if (!c || (c.buyer_id !== meId && c.seller_id !== meId)) throw notFound('Söhbət tapılmadı')
  return c
}

function summarize(db, c, meId) {
  const otherId = c.buyer_id === meId ? c.seller_id : c.buyer_id
  const other = db.prepare('SELECT * FROM users WHERE id = ?').get(otherId)
  const last = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC, rowid DESC LIMIT 1').get(c.id)
  const unread = db
    .prepare('SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL')
    .get(c.id, meId).n
  return {
    id: c.id,
    with: otherId,
    withUser: serializePublicUser(other, userStats(db, otherId)),
    listing: c.listing_id,
    listingItem: serializeListing(getListingRow(db, c.listing_id)),
    role: c.buyer_id === meId ? 'buyer' : 'seller',
    unread,
    lastMessage: last ? serializeMessage(last, meId) : null,
    updatedAt: last?.created_at || c.created_at,
  }
}

function addMessage(db, convId, senderId, text) {
  const id = newId('m')
  db.prepare('INSERT INTO messages (id, conversation_id, sender_id, text, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(id, convId, senderId, text, nowIso())
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id)
}

export default function conversationRoutes(router) {
  router.get('/api/conversations', (ctx) => {
    const me = requireUser(ctx)
    const rows = ctx.db.prepare('SELECT * FROM conversations WHERE buyer_id = ? OR seller_id = ?').all(me.id, me.id)
    return rows.map((c) => summarize(ctx.db, c, me.id)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  })

  router.get('/api/conversations/unread-count', (ctx) => {
    const me = requireUser(ctx)
    const n = ctx.db
      .prepare(`SELECT COUNT(*) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
                WHERE (c.buyer_id = ? OR c.seller_id = ?) AND m.sender_id != ? AND m.read_at IS NULL`)
      .get(me.id, me.id, me.id).n
    return { unread: n }
  })

  // Elan sahibinə yazmaq: { listingId, text } — söhbət varsa ona əlavə olunur
  router.post('/api/conversations', (ctx) => {
    const me = requireUser(ctx)
    const listingId = v.str(ctx.body.listingId, 'listingId', { required: true, max: 40 })
    const text = v.str(ctx.body.text, 'text', { required: true, max: 2000 })
    const listing = requireListing(ctx.db, listingId)
    if (listing.owner_id === me.id) throw badRequest('Öz elanına mesaj yaza bilməzsən')
    if (listing.status !== 'active') throw badRequest('Bu elan artıq aktiv deyil')

    const conv = transaction(ctx.db, () => {
      let c = ctx.db.prepare('SELECT * FROM conversations WHERE listing_id = ? AND buyer_id = ?').get(listing.id, me.id)
      if (!c) {
        const id = newId('c')
        ctx.db.prepare('INSERT INTO conversations (id, listing_id, buyer_id, seller_id) VALUES (?, ?, ?, ?)')
          .run(id, listing.id, me.id, listing.owner_id)
        c = ctx.db.prepare('SELECT * FROM conversations WHERE id = ?').get(id)
      }
      addMessage(ctx.db, c.id, me.id, text)
      return c
    })
    return { status: 201, data: summarize(ctx.db, conv, me.id) }
  })

  // Söhbətin mesajları; açılanda qarşı tərəfin mesajları oxunmuş sayılır
  router.get('/api/conversations/:id/messages', (ctx) => {
    const me = requireUser(ctx)
    const c = requireConversation(ctx.db, ctx.params.id, me.id)
    ctx.db
      .prepare('UPDATE messages SET read_at = ? WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL')
      .run(nowIso(), c.id, me.id)
    const rows = ctx.db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at, rowid').all(c.id)
    return { conversation: summarize(ctx.db, c, me.id), messages: rows.map((m) => serializeMessage(m, me.id)) }
  })

  router.post('/api/conversations/:id/messages', (ctx) => {
    const me = requireUser(ctx)
    const c = requireConversation(ctx.db, ctx.params.id, me.id)
    const text = v.str(ctx.body.text, 'text', { required: true, max: 2000 })
    const row = addMessage(ctx.db, c.id, me.id, text)
    return { status: 201, data: serializeMessage(row, me.id) }
  })
}
