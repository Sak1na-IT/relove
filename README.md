# Relove

**Əşyalar bir daha sevilsin.** — Bakı üçün ikinci əl alış-satış, dəyiş-düyüş və pulsuz paylaşım platforması.

## İşə salmaq

Sayt məlumatları backend-dən götürür, ona görə iki terminal lazımdır:

```bash
# 1-ci terminal — backend (http://localhost:4000/api)
npm run server

# 2-ci terminal — sayt (http://localhost:5173)
npm install
npm run dev
```

Demo giriş: `sakina@relove.demo` / `parol123` (giriş səhifəsində "Demo hesabla yoxla" düyməsi var).
Backend başqa ünvandadırsa, kökdə `.env` faylı yarat və `VITE_API_URL` yaz (nümunə: `.env.example`).


## Backend (server/)

`server/` qovluğunda paketsiz Node.js API var: giriş, elanlar, bəyənmələr, dəyiş təklifləri, mesajlar, kolleksiyalar və rəylər. SQLite bazası ilk açılışda özü yaranır və demo məlumatla dolur. Şəkillər hələlik link kimi saxlanılır.

```bash
npm run server        # http://localhost:4000/api
npm run server:test   # API testləri
```

Ətraflı: [server/README.md](server/README.md). Demo giriş: `sakina@relove.demo` / `parol123`.

## Texnologiyalar

- React 18 + Vite
- React Router (səhifələr)
- lucide-react (ikonlar)
- Sadə CSS dizayn sistemi (`src/styles.css`)

## Struktur

```
src/
  api.js           → backend ilə əlaqə (token, sorğular)
  data.js          → kateqoriyalar, rayonlar; demo məlumat (server bunu bazaya yazır)
  store.jsx        → serverdən gələn məlumat və əməliyyatlar (global state)
  components/      → Navbar, mobil menyu, məhsul kartı, dəyiş modalı…
  pages/           → Ana səhifə, Kəşf et, Məhsul, Dəyiş, Paylaş, Profil, Seçilmişlər, Mesajlar
```

## Səhifələr

| Yol | Səhifə |
| --- | --- |
| `/` | Ana səhifə |
| `/kesf` | Kəşf et (axtarış, filterlər) |
| `/elan/:id` | Məhsul səhifəsi |
| `/deyis` | Dəyiş-düyüş (uyğun təkliflər, sürətli kəşf) |
| `/paylas` | Əşya paylaş (5 addım) |
| `/profil` | Profilim |
| `/secilmisler` | Seçilmişlər və kolleksiyalar |
| `/mesajlar` | Mesajlar |

> Hazırda bütün məlumatlar nümunədir (frontend versiya). Növbəti mərhələ: backend, qeydiyyat və real şəkil yükləmə.
