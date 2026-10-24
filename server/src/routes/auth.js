// Qeydiyyat, giriş və öz profilim
import { newId } from '../db.js'
import { badRequest, conflict, HttpError, unauthorized } from '../http.js'
import { checkRateLimit, hashPassword, requireUser, signToken, verifyPassword } from '../auth.js'
import { serializeMe } from '../serialize.js'
import { userStats } from '../queries.js'
import * as v from '../validate.js'

const clientIp = (req) => req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown'

export default function authRoutes(router) {
  router.post('/api/auth/register', ({ req, db, body, config }) => {
    if (!checkRateLimit(`auth:${clientIp(req)}`)) throw new HttpError(429, 'Çox cəhd edildi. Bir az sonra yenidən yoxla.')
    const name = v.str(body.name, 'name', { required: true, min: 2, max: 80 })
    const email = v.email(body.email)
    const password = v.password(body.password)
    const district = v.str(body.district, 'district', { max: 60 }) ?? ''

    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) throw conflict('Bu e-poçtla hesab artıq var')

    const id = newId('u')
    db.prepare('INSERT INTO users (id, email, password_hash, name, district) VALUES (?, ?, ?, ?, ?)').run(
      id, email, hashPassword(password), name, district,
    )
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    return { status: 201, data: { token: signToken({ sub: id }, config.jwtSecret), user: serializeMe(user, userStats(db, id)) } }
  })

  router.post('/api/auth/login', ({ req, db, body, config }) => {
    if (!checkRateLimit(`auth:${clientIp(req)}`)) throw new HttpError(429, 'Çox cəhd edildi. Bir az sonra yenidən yoxla.')
    if (typeof body.email !== 'string' || typeof body.password !== 'string') throw badRequest('E-poçt və parol tələb olunur')
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(body.email.trim().toLowerCase())
    if (!user || !verifyPassword(body.password, user.password_hash)) throw unauthorized('E-poçt və ya parol yanlışdır')
    return { token: signToken({ sub: user.id }, config.jwtSecret), user: serializeMe(user, userStats(db, user.id)) }
  })

  router.get('/api/me', (ctx) => {
    const me = requireUser(ctx)
    return serializeMe(me, userStats(ctx.db, me.id))
  })

  // Ad, haqqımda, əlaqə və təhvil seçimləri
  router.patch('/api/me', (ctx) => {
    const me = requireUser(ctx)
    const b = ctx.body
    const patch = {
      name: v.str(b.name, 'name', { min: 2, max: 80 }),
      bio: v.str(b.bio, 'bio', { max: 300 }),
      phone: v.str(b.phone, 'phone', { max: 30 }),
      district: v.str(b.district, 'district', { max: 60 }),
      contact_pref: v.oneOf(b.contactPref ?? b.pref, 'contactPref', v.CONTACT_PREFS),
      whatsapp: v.bool(b.whatsapp, 'whatsapp'),
      show_phone: v.bool(b.showPhone, 'showPhone'),
      avatar: b.avatar === null ? null : b.avatar !== undefined ? v.imageUrls([b.avatar])[0] : undefined,
    }
    const delivery = v.strList(b.delivery, 'delivery', { allowed: v.DELIVERY })
    if (delivery !== undefined) {
      if (!delivery.length) throw badRequest('Ən azı bir təhvil üsulu seç')
      patch.delivery = JSON.stringify(delivery)
    }
    // undefined = dəyişmə; null = sil (yalnız avatar üçün)
    const set = Object.entries(patch).filter(([, val]) => val !== undefined)
    if (set.length) {
      ctx.db
        .prepare(`UPDATE users SET ${set.map(([k]) => `${k} = ?`).join(', ')} WHERE id = ?`)
        .run(...set.map(([, val]) => (typeof val === 'boolean' ? Number(val) : val)), me.id)
    }
    const fresh = ctx.db.prepare('SELECT * FROM users WHERE id = ?').get(me.id)
    return serializeMe(fresh, userStats(ctx.db, me.id))
  })

  router.post('/api/me/password', (ctx) => {
    const me = requireUser(ctx)
    if (typeof ctx.body.currentPassword !== 'string' || !verifyPassword(ctx.body.currentPassword, me.password_hash)) {
      throw badRequest('Hazırkı parol yanlışdır')
    }
    const next = v.password(ctx.body.newPassword)
    ctx.db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(next), me.id)
    return { ok: true }
  })
}
