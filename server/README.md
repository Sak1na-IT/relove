# Relove API

Relove-un backend hissəsi. Heç bir paket yükləmək lazım deyil: yalnız Node.js 22-nin öz modulları (`http`, `sqlite`, `crypto`) işlədilir.

- Baza: SQLite (`server/data/relove.db`, ilk açılışda özü yaranır və demo məlumatla dolur)
- Giriş: e-poçt + parol, parol `scrypt` ilə saxlanılır, giriş tokeni JWT (7 gün)
- Şəkillər: cihazdan seçilən şəkillər brauzerdə sıxılıb `data:image/...` kimi, demo şəkillər isə link və ya `/elanlar/...` yolu kimi saxlanılır

## İşə salmaq

Node.js **22.13 və ya daha yeni** olmalıdır (`node -v` ilə yoxla).

```bash
cd server
cp .env.example .env     # istəsən dəyərləri dəyiş
npm run dev              # http://localhost:4000/api
```

Kök qovluqdan da olar: `npm run server`.

| Əmr | Nə edir |
| --- | --- |
| `npm run dev` | Serveri açır, faylı dəyişəndə özü yenidən başlayır |
| `npm start` | Serveri açır (canlı server üçün) |
| `npm run seed` | Bazanı silib demo məlumatla yenidən doldurur |
| `npm test` | Bütün API testlərini işlədir |

### Demo hesablar

Parol hamısı üçün: `parol123`

| E-poçt | Kim |
| --- | --- |
| `sakina@relove.demo` | Sakina Pashayeva — elanları, söhbətləri, rəyləri var |
| `reshad@relove.demo` | Rəşad Məmmədov |
| `leyla@relove.demo` | Leyla Həsənli |
| `elvin@relove.demo` | Elvin Quliyev |
| `ayten@relove.demo` | Aytən Kərimova |
| `murad@relove.demo` | Murad Rzayev |

Demo elanlar frontend-dəki `src/data.js`-dən götürülür, ona görə sayt əvvəlki kimi görünür.

## API

Ünvan: `http://localhost:4000/api`. Qorunan yollar `Authorization: Bearer <token>` başlığı tələb edir. Xəta cavabı: `{ "message": "..." }`.

### Giriş və profil

| Metod | Yol | Qeyd |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password, district? }` → `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/me` | Öz profilim |
| PATCH | `/me` | `{ name?, bio?, phone?, showPhone?, whatsapp?, contactPref?, district?, delivery? }` |
| POST | `/me/password` | `{ currentPassword, newPassword }` |

### Elanlar

| Metod | Yol | Qeyd |
| --- | --- | --- |
| GET | `/listings` | Aktiv elanlar. Filtrlər: `mode` (sale/swap/free), `dept`, `sub`, `category`, `district`, `repair`, `seller`, `q`, `minPrice`, `maxPrice`, `sort` (new/low/high/likes), `limit`, `offset` → `{ total, items }` |
| GET | `/listings/:id` | Bir elan (gizli/satılmışı yalnız sahibi görür) |
| POST | `/listings` | Yeni elan (aşağıdakı nümunəyə bax) |
| PATCH | `/listings/:id` | Öz elanını dəyiş, `status`: active / sold / hidden |
| DELETE | `/listings/:id` | Öz elanını sil |
| GET | `/me/listings` | Bütün elanlarım (Paylaşdıqlarım) |
| POST / DELETE | `/listings/:id/favorite` | Bəyən / geri al |
| GET | `/me/favorites` | Bəyəndiklərim |

Yeni elan nümunəsi:

```json
{
  "title": "Velur kreslo",
  "category": "ev", "dept": "ev", "sub": "Kreslo",
  "price": 310, "condition": "Yaxşı",
  "modes": ["sale", "swap"],
  "images": ["https://images.unsplash.com/photo-..."],
  "description": "Rahat, dayanıqlı.",
  "wantsText": ["Kitab rəfi"],
  "delivery": ["meet"]
}
```

Qaydalar: ən azı bir şəkil linki; satış elanında qiymət; İkinci şans (`["free"]`) başqa bölmə ilə birləşmir, qüsur (`defect`) mütləqdir, qiymət 0–10 AZN.

### Dəyiş-düyüş təklifləri

| Metod | Yol | Qeyd |
| --- | --- | --- |
| GET | `/offers` | `{ incoming, outgoing }` |
| POST | `/offers` | `{ targetId, offeredId, cash?, note? }` — yalnız öz əşyanı, dəyiş elanına |
| PATCH | `/offers/:id` | Alan: `accepted` / `rejected`, göndərən: `cancelled`. Qəbul olunanda hər iki elan "satıldı" olur |

### Mesajlar

| Metod | Yol | Qeyd |
| --- | --- | --- |
| GET | `/conversations` | Söhbətlərim (qarşı tərəf, elan, son mesaj, oxunmamış say) |
| GET | `/conversations/unread-count` | `{ unread }` |
| POST | `/conversations` | `{ listingId, text }` — elan sahibinə yaz (söhbət varsa ona əlavə olunur) |
| GET | `/conversations/:id/messages` | Mesajlar (açılanda oxunmuş sayılır) |
| POST | `/conversations/:id/messages` | `{ text }` |

### Kolleksiyalar

| Metod | Yol | Qeyd |
| --- | --- | --- |
| GET | `/collections` | Hamının açıq kolleksiyaları; `?mine=1` — mənimkilər |
| GET | `/collections/:id` | Kolleksiya + elanları (gizlini yalnız sahibi görür) |
| POST | `/collections` | `{ title, text?, isPublic?, items? }` |
| PATCH / DELETE | `/collections/:id` | Dəyiş / sil |
| POST | `/collections/:id/items` | `{ listingId }` |
| DELETE | `/collections/:id/items/:listingId` | Əşyanı çıxar |

### İstifadəçilər və rəylər

| Metod | Yol | Qeyd |
| --- | --- | --- |
| GET | `/users/:id` | İctimai profil + aktiv elanlar + rəylər (nömrə yalnız icazə varsa) |
| GET | `/me/reviews` | Haqqımda rəylər |
| POST | `/users/:id/reviews` | `{ stars: 1–5, text? }` — yalnız onunla dəyiş-düyüş və ya alış-veriş tamamlandıqdan sonra, bir dəfə |

## Canlı serverə qoymaq (Render)

1. Render-də **New → Web Service**, GitHub-dakı `relove` reposunu seç.
2. **Root Directory:** `server`, **Build Command:** boş, **Start Command:** `npm start`.
3. Environment variables:
   - `NODE_VERSION` = `22`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = uzun təsadüfi mətn (ən azı 32 simvol)
   - `CLIENT_ORIGIN` = saytın ünvanı, məs. `https://relove.vercel.app` (bir neçə ünvan vergüllə: `https://relove.vercel.app,https://relove.netlify.app`)

Bilmək lazımdır: pulsuz Render-də SQLite faylı daimi deyil, server yenidən başlayanda yeni qeydiyyatlar və elanlar silinə bilər (demo məlumat hər dəfə yenidən yaranır). Daimi saxlama üçün Render-in pullu diskinə və ya PostgreSQL-ə keçmək lazımdır.

## Render-ə yerləşdirmək

Kökdəki `render.yaml` hazırdır: Render-də **New → Blueprint** seç, `Sak1na-IT/relove` repo-sunu göstər və **Apply** düyməsini bas.

- Pulsuz planda disk daimi deyil: server yatıb oyananda baza sıfırlanır və demo elanlar özü yenidən yazılır.
- Server hazır olandan sonra Vercel-də `VITE_API_URL` dəyişənini `https://<render-ünvanı>/api` kimi təyin et və saytı yenidən deploy et.
