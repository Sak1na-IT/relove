# Relove

**Əşyalar bir daha sevilsin.** — Bakı üçün ikinci əl alış-satış, dəyiş-düyüş və pulsuz paylaşım platforması.

## İşə salmaq

```bash
npm install
npm run dev
```

Brauzerdə `http://localhost:5173` açılır.

## Texnologiyalar

- React 18 + Vite
- React Router (səhifələr)
- lucide-react (ikonlar)
- Sadə CSS dizayn sistemi (`src/styles.css`)

## Struktur

```
src/
  data.js          → nümunə elanlar, istifadəçilər, kateqoriyalar
  store.jsx        → seçilmişlər, təkliflər, mesajlar (global state)
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
