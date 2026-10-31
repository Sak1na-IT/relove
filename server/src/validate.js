// Gələn məlumatın yoxlanması. Hər funksiya xəta tapanda 400 qaytarır.
import { badRequest } from './http.js'

export const MODES = ['sale', 'swap', 'free']
export const DELIVERY = ['meet', 'courier']
export const CONTACT_PREFS = ['Mesaj', 'Zəng', 'WhatsApp']
export const LISTING_STATUSES = ['active', 'sold', 'hidden']
export const REPAIR_LEVELS = ['Kiçik təmir', 'Ciddi təmir', 'Hissələr üçün']

export function str(value, field, { min = 0, max = 500, required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw badRequest(`"${field}" tələb olunur`)
    return undefined
  }
  if (typeof value !== 'string') throw badRequest(`"${field}" mətn olmalıdır`)
  const v = value.trim()
  if (required && !v) throw badRequest(`"${field}" boş ola bilməz`)
  if (v.length < min) throw badRequest(`"${field}" ən azı ${min} simvol olmalıdır`)
  if (v.length > max) throw badRequest(`"${field}" ən çoxu ${max} simvol ola bilər`)
  return v
}

export function int(value, field, { min = 0, max = 1_000_000, required = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw badRequest(`"${field}" tələb olunur`)
    return undefined
  }
  const n = Number(value)
  if (!Number.isInteger(n)) throw badRequest(`"${field}" tam ədəd olmalıdır`)
  if (n < min || n > max) throw badRequest(`"${field}" ${min} və ${max} arasında olmalıdır`)
  return n
}

export function bool(value, field) {
  if (value === undefined) return undefined
  if (typeof value !== 'boolean') throw badRequest(`"${field}" true və ya false olmalıdır`)
  return value
}

export function oneOf(value, field, allowed, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw badRequest(`"${field}" tələb olunur`)
    return undefined
  }
  if (!allowed.includes(value)) throw badRequest(`"${field}" bunlardan biri olmalıdır: ${allowed.join(', ')}`)
  return value
}

export function strList(value, field, { maxItems = 12, maxLen = 80, allowed } = {}) {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw badRequest(`"${field}" siyahı olmalıdır`)
  if (value.length > maxItems) throw badRequest(`"${field}" ən çoxu ${maxItems} element ola bilər`)
  const out = value.map((v, i) => {
    if (typeof v !== 'string' || !v.trim()) throw badRequest(`"${field}[${i}]" boş olmayan mətn olmalıdır`)
    if (v.length > maxLen) throw badRequest(`"${field}[${i}]" çox uzundur`)
    if (allowed && !allowed.includes(v)) throw badRequest(`"${field}" yalnız bunlardan ibarət ola bilər: ${allowed.join(', ')}`)
    return v.trim()
  })
  return [...new Set(out)]
}

// Şəkillər: http(s) linki, saytın öz şəkli (/elanlar/...) və ya cihazdan seçilmiş sıxılmış şəkil (data:image/...;base64)
const DATA_IMAGE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/
const MAX_DATA_IMAGE = 900_000 // ~650 KB şəkil

export function imageUrls(value, { required = false } = {}) {
  if (value === undefined) {
    if (required) throw badRequest('Ən azı bir şəkil tələb olunur')
    return undefined
  }
  const list = strList(value, 'images', { maxItems: 10, maxLen: MAX_DATA_IMAGE })
  if (required && list.length === 0) throw badRequest('Ən azı bir şəkil tələb olunur')
  for (const u of list) {
    if (u.startsWith('data:')) {
      if (!DATA_IMAGE.test(u)) throw badRequest('Şəkil formatı dəstəklənmir (JPEG, PNG və ya WebP olmalıdır)')
      continue
    }
    if (/^\/elanlar\/[a-z0-9-]+\.(jpe?g|png|webp)$/i.test(u)) continue
    if (u.length > 1000) throw badRequest('Şəkil linki çox uzundur')
    let url
    try {
      url = new URL(u)
    } catch {
      throw badRequest(`Şəkil linki düzgün deyil: ${u}`)
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw badRequest('Şəkil linki http və ya https ilə başlamalıdır')
  }
  return list
}

export function email(value) {
  const v = str(value, 'email', { required: true, max: 200 }).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw badRequest('E-poçt ünvanı düzgün deyil')
  return v
}

export function password(value) {
  if (typeof value !== 'string') throw badRequest('"password" tələb olunur')
  if (value.length < 8) throw badRequest('Parol ən azı 8 simvol olmalıdır')
  if (value.length > 200) throw badRequest('Parol çox uzundur')
  return value
}
