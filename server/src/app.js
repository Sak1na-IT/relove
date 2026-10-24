// Tətbiqin özü: sorğunu uyğun marşruta ötürür, xətaları JSON kimi qaytarır.
import { Router, HttpError, corsHeaders, readJson, send } from './http.js'
import { userFromRequest } from './auth.js'
import authRoutes from './routes/auth.js'
import listingRoutes from './routes/listings.js'
import offerRoutes from './routes/offers.js'
import conversationRoutes from './routes/conversations.js'
import collectionRoutes from './routes/collections.js'
import userRoutes from './routes/users.js'

export function createApp({ db, jwtSecret, origins = ['*'], log = false }) {
  const router = new Router()
  router.get('/api/health', () => ({ status: 'ok', time: new Date().toISOString() }))
  authRoutes(router)
  listingRoutes(router)
  offerRoutes(router)
  conversationRoutes(router)
  collectionRoutes(router)
  userRoutes(router)

  const config = { jwtSecret }

  return async function handle(req, res) {
    const started = Date.now()
    const cors = corsHeaders(req, origins)
    const url = new URL(req.url, 'http://localhost')

    try {
      if (req.method === 'OPTIONS') return send(res, 204, undefined, cors)

      const found = router.match(req.method, url.pathname)
      if (!found) throw new HttpError(404, 'Belə ünvan yoxdur')
      if (found.methodNotAllowed) throw new HttpError(405, 'Bu metod dəstəklənmir')

      const body = await readJson(req)
      const ctx = {
        req, res, db, config, body,
        params: found.params,
        query: url.searchParams,
        user: userFromRequest(req, db, jwtSecret),
      }
      const result = await found.handler(ctx)
      if (result && typeof result === 'object' && 'status' in result && Object.keys(result).every((k) => k === 'status' || k === 'data')) {
        send(res, result.status, result.status === 204 ? undefined : result.data, cors)
      } else {
        send(res, 200, result, cors)
      }
    } catch (err) {
      if (err instanceof HttpError) {
        send(res, err.status, { message: err.message, ...(err.details ? { details: err.details } : {}) }, cors)
      } else {
        console.error(err)
        send(res, 500, { message: 'Serverdə xəta baş verdi' }, cors)
      }
    } finally {
      if (log) console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - started}ms`)
    }
  }
}
