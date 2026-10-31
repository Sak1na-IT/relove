# Relove

**Əşyalar bir daha sevilsin.** — Bakı üçün ikinci əl alış-satış, dəyiş-düyüş və pulsuz paylaşım platforması.

**Canlı versiya:** [relove.vercel.app](https://relove.vercel.app) (sayt, Vercel) · [relove-api-py9o.onrender.com](https://relove-api-py9o.onrender.com/api/health) (API, Render). Demo giriş: `sakina@relove.demo` / `parol123`.

## Bölmələr

- **İkinci əl** — yaxşı vəziyyətdə əşyaların satışı, bölmə və alt kateqoriya üzrə axtarış, qiymət və ərazi filtrləri
- **Dəyiş-düyüş** — pul əvəzinə əşya ilə dəyişmək; "Sənə uyğun" bölməsi öz əşyalarına uyğun təklifləri göstərir
- **İkinci şans** — qüsurlu, amma atılmağa qıyılmayan əşyalar (kiçik təmir, ciddi təmir, hissələr üçün)
- **Kolleksiyalar** — mövzu üzrə seçilmiş toplular və istifadəçinin öz kolleksiyaları
- **Paylaşdıqlarım, Seçilmişlər, Mesajlar, Profil** — elanları idarə etmək, bəyənmələr, satıcı ilə yazışma, rəylər

## İşə salmaq

Sayt məlumatları backend-dən götürür, ona görə iki terminal lazımdır:

```bash
# 1-ci terminal — backend (http://localhost:4000/api)
npm run server

# 2-ci terminal — sayt (http://localhost:5173)
npm install
npm run dev
```

Demo giriş: `sakina@relove.demo` / `parol123` (giriş səhifəsində də göstərilir).

Demo elanları və şəkilləri yeniləyəndən sonra lokal bazanı yenidən doldurmaq üçün: `npm run server:seed` (bazaya özün əlavə etdiyin elanları da silir).

Sayt kompüterdə açılanda `http://localhost:4000/api`-yə, internetdə isə Render-dəki serverə qoşulur. Başqa server lazımdırsa, kökdə `.env` faylı yarat və `VITE_API_URL` yaz (nümunə: `.env.example`).

## Backend (server/)

`server/` qovluğunda paketsiz Node.js API var (yalnız Node 22-nin öz modulları: `http`, `sqlite`, `crypto`): giriş, elanlar, bəyənmələr, dəyiş təklifləri, mesajlar, kolleksiyalar və rəylər. SQLite bazası ilk açılışda özü yaranır və demo məlumatla dolur.

```bash
npm run server        # http://localhost:4000/api
npm run server:seed   # bazanı sıfırlayıb demo məlumatla doldurur
npm run server:test   # API testləri
```

Ətraflı: [server/README.md](server/README.md).

## Şəkillər

- Elan paylaşanda şəkillər **kompüterdən və ya telefondan seçilir** (və ya sürüklənib atılır), brauzerdə kiçildilib sıxılır və elanla birlikdə saxlanılır. Bir elana ən çoxu 8 şəkil.
- Demo elanların bir hissəsinin şəkilləri `public/elanlar/` qovluğundadır, qalanları Unsplash linkləridir.

## Deploy

| Hissə | Harada | Necə yenilənir |
| --- | --- | --- |
| Sayt | Vercel — [relove.vercel.app](https://relove.vercel.app) | `main`-ə hər `git push`-dan sonra özü (ayarlar: `vercel.json`) |
| API | Render — [relove-api-py9o.onrender.com](https://relove-api-py9o.onrender.com/api/health) | `main`-ə push-dan sonra özü (ayarlar: `render.yaml`) |

- Render-in pulsuz planında disk daimi deyil: server yatıb oyananda və ya yenilənəndə baza sıfırlanır və demo elanlar özü yenidən yazılır. 15 dəqiqə istifadə olunmayanda server yatır, ilk açılış bir dəqiqəyə qədər çəkə bilər.
- Serverin hansı saytlardan sorğu qəbul etdiyi `render.yaml`-dakı `CLIENT_ORIGIN`-dədir.
- Vercel-də ayrı branch-a push edəndə önizləmə linki yaranır (`relove-git-<branch>-sakina16.vercel.app`): dəyişikliyi əsas sayta keçirmədən əvvəl yoxlamaq üçün.

## Texnologiyalar

- React 18 + Vite
- React Router (səhifələr)
- lucide-react (ikonlar)
- Sadə CSS dizayn sistemi (`src/styles.css`, rəng və şriftlər: [DESIGN.md](DESIGN.md))

## Struktur

```
src/
  api.js           → backend ilə əlaqə (token, sorğular)
  data.js          → kateqoriyalar, rayonlar; demo məlumat (server bunu bazaya yazır)
  store.jsx        → serverdən gələn məlumat və əməliyyatlar (global state)
  components/      → Navbar, footer, məhsul kartı, kateqoriya brauzeri, dəyiş modalı…
  pages/           → səhifələr (aşağıdakı cədvəl)
public/elanlar/    → demo elanların şəkilləri
server/            → API və SQLite bazası
```

## Səhifələr

| Yol | Səhifə |
| --- | --- |
| `/` | Ana səhifə |
| `/ikinci-el` | İkinci əl (axtarış, bölmələr, filtrlər) |
| `/elan/:id` | Elan səhifəsi |
| `/deyis` | Dəyiş-düyüş (elanlar, Sənə uyğun, öz dəyiş elanlarım, təkliflər) |
| `/ikinci-sans` | İkinci şans |
| `/kolleksiyalar`, `/kolleksiyalar/:id` | Kolleksiyalar |
| `/paylas` | Elan paylaş (5 addım) |
| `/paylasdiqlarim` | Paylaşdıqlarım |
| `/secilmisler` | Seçilmişlər |
| `/mesajlar` | Mesajlar |
| `/profil` | Profilim |
| `/giris`, `/qeydiyyat` | Giriş və qeydiyyat |

Giriş tələb edən səhifələr (paylaş, paylaşdıqlarım, seçilmişlər, mesajlar, profil) daxil olmayan istifadəçini giriş səhifəsinə yönləndirir.
