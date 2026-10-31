// Kiçik HTTP köməkçiləri: marşrutlaşdırma, JSON, xətalar, CORS.
// Heç bir xarici paket istifadə olunmur.

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details)
export const unauthorized = (message = 'Giriş tələb olunur') => new HttpError(401, message)
export const forbidden = (message = 'Bu əməliyyata icazən yoxdur') => new HttpError(403, message)
export const notFound = (message = 'Tapılmadı') => new HttpError(404, message)
export const conflict = (message) => new HttpError(409, message)

const MAX_BODY = 1024 * 1024 // 1 MB — şəkillər link kimi gəldiyi üçün kifayətdir

export function readJson(req) {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') return resolve({})
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new HttpError(413, 'Sorğu çox böyükdür'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      if (!chunks.length) return resolve({})
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
          return reject(badRequest('Sorğunun gövdəsi JSON obyekti olmalıdır'))
        }
        resolve(data)
      } catch {
        reject(badRequest('JSON düzgün deyil'))
      }
    })
    req.on('error', reject)
  })
}

export function send(res, status, data, headers = {}) {
  const body = data === undefined ? '' : JSON.stringify(data)
  res.writeHead(status, {
    ...(body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
    ...headers,
  })
  res.end(body)
}

// Sadə router: router.get('/api/listings/:id', handler)
export class Router {
  constructor() {
    this.routes = []
  }

  add(method, pattern, handler) {
    const keys = []
    const regex = new RegExp(
      '^' +
        pattern.replace(/\/:([a-zA-Z]+)/g, (_, k) => {
          keys.push(k)
          return '/([^/]+)'
        }) +
        '/?$',
    )
    this.routes.push({ method, regex, keys, handler })
  }

  get(p, h) { this.add('GET', p, h) }
  post(p, h) { this.add('POST', p, h) }
  patch(p, h) { this.add('PATCH', p, h) }
  delete(p, h) { this.add('DELETE', p, h) }

  match(method, pathname) {
    let pathMatched = false
    for (const r of this.routes) {
      const m = r.regex.exec(pathname)
      if (!m) continue
      pathMatched = true
      if (r.method !== method) continue
      const params = {}
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])))
      return { handler: r.handler, params }
    }
    return pathMatched ? { methodNotAllowed: true } : null
  }
}

// "https://relove-*-sakina16.vercel.app" kimi ulduzlu nümunələri də qəbul edir (Vercel önizləmələri üçün)
function originMatches(pattern, origin) {
  if (pattern === '*' || pattern === origin) return true
  if (!pattern.includes('*')) return false
  const re = new RegExp('^' + pattern.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[a-z0-9-]+') + '$')
  return re.test(origin)
}

export function corsHeaders(req, allowedOrigins) {
  const origin = req.headers.origin
  if (!origin) return {}
  const ok = allowedOrigins.some((p) => originMatches(p, origin))
  if (!ok) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  }
}
