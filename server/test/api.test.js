// API-nin bütün əsas yollarını real HTTP sorğuları ilə yoxlayır.
// İşə salmaq: npm test
import { test, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { openDb } from '../src/db.js'
import { createApp } from '../src/app.js'
import { seed, DEMO_PASSWORD } from '../src/seed.js'
import { resetRateLimits, signToken, verifyToken } from '../src/auth.js'

const SECRET = 'test-secret-test-secret-test-secret'
let server, base, db

before(async () => {
  db = openDb(':memory:')
  server = createServer(createApp({ db, jwtSecret: SECRET, origins: ['http://localhost:5173'] }))
  await new Promise((r) => server.listen(0, r))
  base = `http://localhost:${server.address().port}/api`
})
after(() => new Promise((r) => server.close(r)))
beforeEach(() => {
  seed(db)
  resetRateLimits()
})

async function api(path, { method = 'GET', token, body, headers = {} } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  })
  const text = await res.text()
  return { status: res.status, data: text ? JSON.parse(text) : null, headers: res.headers }
}

async function login(email = 'sakina@relove.demo', password = DEMO_PASSWORD) {
  const r = await api('/auth/login', { method: 'POST', body: { email, password } })
  assert.equal(r.status, 200, JSON.stringify(r.data))
  return r.data.token
}

const NEW_LISTING = {
  title: 'Mid-century masa lampası',
  category: 'ev',
  dept: 'ev',
  sub: 'Masa lampası',
  price: 60,
  condition: 'Yaxşı',
  modes: ['sale', 'swap'],
  images: ['https://example.com/lampa.jpg'],
  description: 'İşləyir, kabeli təzədir.',
  wantsText: ['Kitab'],
}

/* ---------------- ümumi ---------------- */

test('health və naməlum ünvan', async () => {
  assert.equal((await api('/health')).data.status, 'ok')
  assert.equal((await api('/yoxdur')).status, 404)
  assert.equal((await api('/health', { method: 'DELETE' })).status, 405)
})

test('CORS: icazəli mənbəyə başlıq qaytarılır, OPTIONS 204', async () => {
  const ok = await api('/health', { headers: { Origin: 'http://localhost:5173' } })
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173')
  const bad = await api('/health', { headers: { Origin: 'https://pis.example' } })
  assert.equal(bad.headers.get('access-control-allow-origin'), null)
  const pre = await api('/listings', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' } })
  assert.equal(pre.status, 204)
})

test('pis JSON 400 qaytarır', async () => {
  const token = await login()
  const r = await api('/listings', { method: 'POST', token, body: '{pis', headers: { 'Content-Type': 'application/json' } })
  assert.equal(r.status, 400)
  assert.match(r.data.message, /JSON/)
})

/* ---------------- auth ---------------- */

test('qeydiyyat → giriş → /me', async () => {
  const reg = await api('/auth/register', { method: 'POST', body: { name: 'Nigar Əliyeva', email: 'Nigar@Example.com', password: 'gizliparol1' } })
  assert.equal(reg.status, 201)
  assert.equal(reg.data.user.email, 'nigar@example.com')
  assert.ok(reg.data.token)
  assert.equal(reg.data.user.password_hash, undefined)

  const dup = await api('/auth/register', { method: 'POST', body: { name: 'X Y', email: 'nigar@example.com', password: 'gizliparol1' } })
  assert.equal(dup.status, 409)

  const token = await login('nigar@example.com', 'gizliparol1')
  const me = await api('/me', { token })
  assert.equal(me.data.name, 'Nigar Əliyeva')
})

test('qeydiyyat yoxlamaları', async () => {
  assert.equal((await api('/auth/register', { method: 'POST', body: { name: 'A', email: 'a@b.c', password: 'gizliparol1' } })).status, 400)
  assert.equal((await api('/auth/register', { method: 'POST', body: { name: 'Ad Soyad', email: 'pis', password: 'gizliparol1' } })).status, 400)
  assert.equal((await api('/auth/register', { method: 'POST', body: { name: 'Ad Soyad', email: 'a@b.c', password: 'qisa' } })).status, 400)
})

test('yanlış parol 401, tokensiz /me 401, saxta token 401', async () => {
  assert.equal((await api('/auth/login', { method: 'POST', body: { email: 'sakina@relove.demo', password: 'yanlis-parol' } })).status, 401)
  assert.equal((await api('/me')).status, 401)
  assert.equal((await api('/me', { token: 'a.b.c' })).status, 401)
  const forged = signToken({ sub: 'u_sakina' }, 'basqa-sirr')
  assert.equal((await api('/me', { token: forged })).status, 401)
})

test('vaxtı bitmiş token qəbul olunmur', () => {
  const t = signToken({ sub: 'x' }, SECRET, -10)
  assert.equal(verifyToken(t, SECRET), null)
  assert.equal(verifyToken(signToken({ sub: 'x' }, SECRET), SECRET).sub, 'x')
})

test('giriş cəhdləri məhdudlaşdırılır', async () => {
  let last
  for (let i = 0; i < 22; i++) last = await api('/auth/login', { method: 'POST', body: { email: 'x@y.z', password: 'yanlis-parol' } })
  assert.equal(last.status, 429)
})

test('profil və əlaqə məlumatlarını yeniləmək', async () => {
  const token = await login()
  const r = await api('/me', { method: 'PATCH', token, body: { phone: '+994 55 000 00 00', showPhone: false, contactPref: 'WhatsApp', delivery: ['meet', 'courier'], district: 'Nəsimi' } })
  assert.equal(r.status, 200)
  assert.equal(r.data.phone, '+994 55 000 00 00')
  assert.equal(r.data.showPhone, false)
  assert.deepEqual(r.data.delivery, ['meet', 'courier'])
  // nömrə gizlidirsə, başqaları görmür
  const pub = await api('/users/u_sakina')
  assert.equal(pub.data.user.phone, null)
  assert.equal((await api('/me', { method: 'PATCH', token, body: { contactPref: 'Faks' } })).status, 400)
  assert.equal((await api('/me', { method: 'PATCH', token, body: { delivery: [] } })).status, 400)
})

test('parolu dəyişmək', async () => {
  const token = await login()
  assert.equal((await api('/me/password', { method: 'POST', token, body: { currentPassword: 'yanlis', newPassword: 'yeniparol123' } })).status, 400)
  assert.equal((await api('/me/password', { method: 'POST', token, body: { currentPassword: DEMO_PASSWORD, newPassword: 'yeniparol123' } })).status, 200)
  await login('sakina@relove.demo', 'yeniparol123')
})

/* ---------------- elanlar ---------------- */

test('elan siyahısı və filtrlər', async () => {
  const all = await api('/listings?limit=100')
  assert.equal(all.status, 200)
  assert.ok(all.data.total > 20)
  assert.ok(all.data.items.every((l) => l.status === 'active'))

  const free = await api('/listings?mode=free&limit=100')
  assert.ok(free.data.items.length > 0 && free.data.items.every((l) => l.modes.includes('free')))

  const cheap = await api('/listings?maxPrice=50&limit=100')
  assert.ok(cheap.data.items.every((l) => l.price <= 50))

  const low = await api('/listings?sort=low&limit=100')
  const prices = low.data.items.map((l) => l.price)
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b))

  const q = await api('/listings?q=fotoaparat')
  assert.ok(q.data.items.some((l) => /fotoaparat/i.test(l.title)))

  const page = await api('/listings?limit=5&offset=5')
  assert.equal(page.data.items.length, 5)
  assert.equal((await api('/listings?mode=pis')).status, 400)
})

test('bir elan: sahibi, bəyənmə sayı, posted mətni', async () => {
  const r = await api('/listings/l1')
  assert.equal(r.status, 200)
  assert.equal(r.data.seller, 'u_u1')
  assert.equal(typeof r.data.likes, 'number')
  assert.ok(r.data.posted)
  assert.equal((await api('/listings/yoxdur')).status, 404)
})

test('elan yaratmaq, dəyişmək, gizlətmək, silmək', async () => {
  const token = await login()
  assert.equal((await api('/listings', { method: 'POST', body: NEW_LISTING })).status, 401)

  const created = await api('/listings', { method: 'POST', token, body: NEW_LISTING })
  assert.equal(created.status, 201)
  const id = created.data.id
  assert.equal(created.data.seller, 'u_sakina')
  assert.equal(created.data.district, 'Yasamal') // profildən götürülür

  const patched = await api(`/listings/${id}`, { method: 'PATCH', token, body: { price: 55, status: 'hidden' } })
  assert.equal(patched.data.price, 55)
  assert.equal(patched.data.status, 'hidden')

  // gizli elanı başqası görmür, siyahıda da yoxdur
  const other = await login('reshad@relove.demo')
  assert.equal((await api(`/listings/${id}`, { token: other })).status, 403)
  assert.equal((await api(`/listings/${id}`, { token })).status, 200)
  const list = await api('/listings?limit=100')
  assert.ok(!list.data.items.some((l) => l.id === id))

  const mine = await api('/me/listings', { token })
  assert.ok(mine.data.some((l) => l.id === id && l.status === 'hidden'))

  assert.equal((await api(`/listings/${id}`, { method: 'DELETE', token })).status, 204)
  assert.equal((await api(`/listings/${id}`, { token })).status, 404)
})

test('başqasının elanını dəyişmək və silmək olmur', async () => {
  const token = await login()
  assert.equal((await api('/listings/l1', { method: 'PATCH', token, body: { price: 1 } })).status, 403)
  assert.equal((await api('/listings/l1', { method: 'DELETE', token })).status, 403)
})

test('cihazdan seçilmiş şəkil (data URL) qəbul olunur', async () => {
  const token = await login()
  const tiny = 'data:image/jpeg;base64,' + 'A'.repeat(4000)
  const res = await api('/listings', { method: 'POST', token, body: { ...NEW_LISTING, images: [tiny] } })
  assert.equal(res.status, 201)
  assert.equal((res.data.listing || res.data).images[0], tiny)
})

test('elan yoxlamaları', async () => {
  const token = await login()
  const bad = async (patch) => (await api('/listings', { method: 'POST', token, body: { ...NEW_LISTING, ...patch } })).status
  assert.equal(await bad({ title: 'ab' }), 400)
  assert.equal(await bad({ modes: [] }), 400)
  assert.equal(await bad({ modes: ['auction'] }), 400)
  assert.equal(await bad({ images: [] }), 400)
  assert.equal(await bad({ images: ['javascript:alert(1)'] }), 400)
  assert.equal(await bad({ images: ['yox-link'] }), 400)
  assert.equal(await bad({ images: ['data:image/svg+xml;base64,PHN2Zz4='] }), 400)
  assert.equal(await bad({ images: ['data:text/html;base64,PGI+'] }), 400)
  assert.equal(await bad({ price: -5 }), 400)
  assert.equal(await bad({ price: 12.5 }), 400)
  // İkinci şans: qüsur mütləqdir, qiymət ən çoxu 10, başqa bölmə ilə qarışmır
  assert.equal(await bad({ modes: ['free'], price: 0 }), 400)
  assert.equal(await bad({ modes: ['free'], price: 50, defect: 'Ayağı laxlayır' }), 400)
  assert.equal(await bad({ modes: ['free', 'sale'], price: 0, defect: 'Ayağı laxlayır' }), 400)
  const ok = await api('/listings', { method: 'POST', token, body: { ...NEW_LISTING, modes: ['free'], price: 5, defect: 'Ayağı laxlayır', repair: 'Kiçik təmir' } })
  assert.equal(ok.status, 201)
  assert.equal(ok.data.repair, 'Kiçik təmir')
})

/* ---------------- bəyənmələr ---------------- */

test('bəyənmək və geri almaq, say dəyişir', async () => {
  const token = await login()
  const before = (await api('/listings/l1')).data.likes
  const add = await api('/listings/l1/favorite', { method: 'POST', token })
  assert.equal(add.data.likes, before + 1)
  await api('/listings/l1/favorite', { method: 'POST', token }) // təkrar — say artmır
  assert.equal((await api('/listings/l1')).data.likes, before + 1)
  assert.ok((await api('/me/favorites', { token })).data.some((l) => l.id === 'l1'))
  assert.equal((await api('/listings/l1', { token })).data.isFavorite, true)
  const del = await api('/listings/l1/favorite', { method: 'DELETE', token })
  assert.equal(del.data.likes, before)
  assert.equal((await api('/listings/l1/favorite', { method: 'POST' })).status, 401)
})

/* ---------------- dəyiş təklifləri ---------------- */

test('dəyiş təklifi: göndər → qəbul et → elanlar satılır', async () => {
  const sakina = await login()
  const reshad = await login('reshad@relove.demo')
  // Sakina öz m1 qulaqlığını Rəşadın l1 fotoaparatına təklif edir
  const sent = await api('/offers', { method: 'POST', token: sakina, body: { targetId: 'l1', offeredId: 'm1', cash: 50, note: 'Fərqi verərəm' } })
  assert.equal(sent.status, 201)
  assert.equal(sent.data.status, 'pending')
  assert.equal(sent.data.target.id, 'l1')

  assert.equal((await api('/offers', { method: 'POST', token: sakina, body: { targetId: 'l1', offeredId: 'm1' } })).status, 409)

  const inbox = await api('/offers', { token: reshad })
  assert.ok(inbox.data.incoming.some((o) => o.id === sent.data.id))

  // göndərən özü qəbul edə bilməz
  assert.equal((await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: sakina, body: { status: 'accepted' } })).status, 403)
  const acc = await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: reshad, body: { status: 'accepted' } })
  assert.equal(acc.data.status, 'accepted')
  assert.equal((await api('/listings/l1', { token: reshad })).data.status, 'sold')
  assert.equal((await api('/listings/m1', { token: sakina })).data.status, 'sold')
  // eyni əşyaya olan digər gözləyən təklif (demo: o_demo1 → m1) avtomatik rədd olunur
  const demo = (await api('/offers', { token: sakina })).data.incoming.find((o) => o.id === 'o_demo1')
  assert.equal(demo.status, 'rejected')
  assert.equal((await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: reshad, body: { status: 'rejected' } })).status, 409)
})

test('dəyiş təklifi qaydaları', async () => {
  const sakina = await login()
  const post = async (body, token = sakina) => (await api('/offers', { method: 'POST', token, body })).status
  assert.equal(await post({ targetId: 'm1', offeredId: 'm2' }), 400) // öz elanına
  assert.equal(await post({ targetId: 'l1', offeredId: 'l2' }), 403) // başqasının əşyasını təklif
  assert.equal(await post({ targetId: 's1', offeredId: 'm1' }), 400) // İkinci şans dəyiş üçün deyil
  assert.equal(await post({ targetId: 'yox', offeredId: 'm1' }), 404)
  // göndərən ləğv edə bilər, alan ləğv edə bilməz
  const sent = await api('/offers', { method: 'POST', token: sakina, body: { targetId: 'l2', offeredId: 'm2' } })
  const leyla = await login('leyla@relove.demo')
  assert.equal((await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: leyla, body: { status: 'cancelled' } })).status, 403)
  assert.equal((await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: sakina, body: { status: 'cancelled' } })).data.status, 'cancelled')
  // kənar şəxs təklifi görmür
  const murad = await login('murad@relove.demo')
  assert.equal((await api(`/offers/${sent.data.id}`, { method: 'PATCH', token: murad, body: { status: 'rejected' } })).status, 404)
})

/* ---------------- mesajlar ---------------- */

test('söhbətlər: siyahı, oxunmamış say, oxuyanda sıfırlanır', async () => {
  const token = await login()
  const list = await api('/conversations', { token })
  assert.equal(list.data.length, 3)
  const c1 = list.data.find((c) => c.id === 'c1')
  assert.equal(c1.unread, 2)
  assert.equal(c1.withUser.name, 'Rəşad Məmmədov')
  assert.equal((await api('/conversations/unread-count', { token })).data.unread, 3)

  const msgs = await api('/conversations/c1/messages', { token })
  assert.equal(msgs.data.messages[0].from, 'me')
  assert.equal((await api('/conversations/unread-count', { token })).data.unread, 1)
})

test('elan sahibinə yazmaq, cavab almaq, kənar şəxs görə bilməz', async () => {
  const sakina = await login()
  const start = await api('/conversations', { method: 'POST', token: sakina, body: { listingId: 'l4', text: 'Salam, qulaqlıq hələ satılır?' } })
  assert.equal(start.status, 201)
  const id = start.data.id
  // ikinci dəfə yazanda eyni söhbətə düşür
  const again = await api('/conversations', { method: 'POST', token: sakina, body: { listingId: 'l4', text: 'Bəs qiymətdə endirim?' } })
  assert.equal(again.data.id, id)

  const elvin = await login('elvin@relove.demo')
  const inbox = await api('/conversations', { token: elvin })
  const conv = inbox.data.find((c) => c.id === id)
  assert.equal(conv.unread, 2)
  assert.equal(conv.role, 'seller')
  const reply = await api(`/conversations/${id}/messages`, { method: 'POST', token: elvin, body: { text: 'Bəli, satılır.' } })
  assert.equal(reply.status, 201)

  const murad = await login('murad@relove.demo')
  assert.equal((await api(`/conversations/${id}/messages`, { token: murad })).status, 404)
  assert.equal((await api('/conversations', { method: 'POST', token: sakina, body: { listingId: 'm1', text: 'öz elanım' } })).status, 400)
  assert.equal((await api(`/conversations/${id}/messages`, { method: 'POST', token: sakina, body: { text: '   ' } })).status, 400)
})

/* ---------------- kolleksiyalar ---------------- */

test('kolleksiya: yarat, əşya əlavə et/çıxar, gizlilik, sil', async () => {
  const token = await login()
  const created = await api('/collections', { method: 'POST', token, body: { title: 'Kitab guşəsi', items: ['l6'], isPublic: false } })
  assert.equal(created.status, 201)
  const id = created.data.id
  assert.deepEqual(created.data.items, ['l6'])

  const added = await api(`/collections/${id}/items`, { method: 'POST', token, body: { listingId: 'l3' } })
  assert.deepEqual(added.data.items, ['l6', 'l3'])
  const removed = await api(`/collections/${id}/items/l6`, { method: 'DELETE', token })
  assert.deepEqual(removed.data.items, ['l3'])

  // gizli kolleksiyanı başqası görmür, açıq olandan sonra görür
  const other = await login('reshad@relove.demo')
  assert.equal((await api(`/collections/${id}`, { token: other })).status, 404)
  assert.ok(!(await api('/collections')).data.some((c) => c.id === id))
  await api(`/collections/${id}`, { method: 'PATCH', token, body: { isPublic: true } })
  const seen = await api(`/collections/${id}`, { token: other })
  assert.equal(seen.data.listings[0].id, 'l3')

  assert.equal((await api(`/collections/${id}`, { method: 'PATCH', token: other, body: { title: 'Mənimdir' } })).status, 403)
  assert.ok((await api('/collections?mine=1', { token })).data.some((c) => c.id === id))
  assert.equal((await api(`/collections/${id}`, { method: 'DELETE', token })).status, 204)
  assert.equal((await api(`/collections/${id}`, { token })).status, 404)
  assert.equal((await api('/collections', { method: 'POST', token, body: { title: 'X' } })).status, 400)
  assert.equal((await api('/collections', { method: 'POST', token, body: { title: 'Yox elan', items: ['yox'] } })).status, 404)
})

/* ---------------- istifadəçilər və rəylər ---------------- */

test('ictimai profil: reytinq, rəylər, aktiv elanlar; parol heş-i görünmür', async () => {
  const r = await api('/users/u_sakina')
  assert.equal(r.data.user.name, 'Sakina Pashayeva')
  assert.equal(r.data.user.reviews, 3)
  assert.equal(r.data.user.rating, 4.7)
  assert.equal(r.data.user.email, undefined)
  assert.equal(JSON.stringify(r.data).includes('scrypt'), false)
  assert.ok(r.data.listings.every((l) => l.seller === 'u_sakina'))
  assert.equal((await api('/users/yox')).status, 404)
})

test('bir neçə istifadəçinin qısa profili', async () => {
  const r = await api('/users?ids=u_u1,u_u2,yox')
  assert.equal(r.status, 200)
  assert.deepEqual(r.data.map((u) => u.id).sort(), ['u_u1', 'u_u2'])
  assert.equal(r.data[0].email, undefined)
  assert.deepEqual((await api('/users')).data, [])
})

test('rəy yalnız tamamlanmış dəyiş-düyüşdən sonra', async () => {
  const sakina = await login()
  const reshad = await login('reshad@relove.demo')
  assert.equal((await api('/users/u_u1/reviews', { method: 'POST', token: sakina, body: { stars: 5, text: 'Əla' } })).status, 403)

  const offer = await api('/offers', { method: 'POST', token: sakina, body: { targetId: 'l1', offeredId: 'm1' } })
  await api(`/offers/${offer.data.id}`, { method: 'PATCH', token: reshad, body: { status: 'accepted' } })

  const ok = await api('/users/u_u1/reviews', { method: 'POST', token: sakina, body: { stars: 5, text: 'Çox rahat dəyişdik' } })
  assert.equal(ok.status, 201)
  assert.equal((await api('/users/u_u1/reviews', { method: 'POST', token: sakina, body: { stars: 4 } })).status, 409)
  assert.equal((await api('/users/u_sakina/reviews', { method: 'POST', token: reshad, body: { stars: 9 } })).status, 400)
  assert.equal((await api('/users/u_sakina/reviews', { method: 'POST', token: sakina, body: { stars: 5 } })).status, 400)
  assert.equal((await api('/users/u_u1')).data.user.reviews, 1)
})
