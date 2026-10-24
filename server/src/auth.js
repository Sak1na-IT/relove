// Parol (scrypt) və token (JWT, HS256) — yalnız Node-un crypto modulu ilə.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { unauthorized } from './http.js'

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 gün

export function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

export function verifyPassword(password, stored) {
  const [algo, saltHex, hashHex] = String(stored).split('$')
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(expected, actual)
}

const b64url = (input) => Buffer.from(input).toString('base64url')

export function signToken(payload, secret, ttl = TOKEN_TTL_SECONDS) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + ttl }))
  const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token, secret) {
  const parts = String(token).split('.')
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest()
  const given = Buffer.from(sig, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const head = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'))
    if (head.alg !== 'HS256') return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// Authorization: Bearer <token> başlığından istifadəçini tapır
export function userFromRequest(req, db, secret) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  const payload = verifyToken(token, secret)
  if (!payload?.sub) return null
  return db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub) || null
}

export function requireUser(ctx) {
  if (!ctx.user) throw unauthorized()
  return ctx.user
}

// Giriş cəhdləri üçün sadə məhdudiyyət (eyni IP-dən 15 dəqiqədə 20 cəhd)
const attempts = new Map()
export function checkRateLimit(key, limit = 20, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now - entry.start > windowMs) {
    attempts.set(key, { start: now, count: 1 })
    return true
  }
  entry.count += 1
  return entry.count <= limit
}
export const resetRateLimits = () => attempts.clear()
