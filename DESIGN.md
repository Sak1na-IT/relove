# Relove — Dizayn sistemi

**Əsas kombinasiya:** Premium Editorial + Quiet Luxury + Modern Minimalism

Relove həm lüks, həm də adi istifadəçi üçün rahat və anlaşıqlı görünməlidir. Hər yeni səhifə və komponent bu qaydalara uyğun qurulur.

| Dizayn elementi | Stil adı | Layihədə necə tətbiq olunur |
| --- | --- | --- |
| Ümumi dizayn | Premium Editorial Marketplace | Jurnal kimi başlıqlar, böyük fotolar, geniş boşluqlar |
| Brend üslubu | Modern Quiet Luxury | Az rəng, səs-küysüz detallar; lime yalnız kiçik vurğu |
| Başlıq stili | Elegant Editorial Serif | **Fraunces**, 400 çəki, `SOFT 30`, `letter-spacing: -0.02em`, vurğu kursivdə yaşıl |
| Əsas mətn | Clean Modern Sans-serif | **Onest**, 400–700 |
| Rəng sistemi | Forest & Ivory | aşağıdakı cədvələ bax |
| Məhsul kartları | Editorial Product Cards | kvadrat foto, ad + qiymət, sakit nişanlar, ürək ikonu |
| Düymələr | Soft Rounded Minimal | tam yuvarlaq (pill), `btn-primary` yaşıl, `btn-ghost` haşiyəli |
| İkonlar | Minimal Outline Icons | `lucide-react`, `strokeWidth` 1.4–1.7 |
| Şəkillər | Warm Lifestyle Photography | isti işıq, təbii interyer, real əşyalar |
| Animasiya | Subtle Micro-interactions | yüngül hover, şəkil zoom 1.05, yumşaq keçidlər, `prefers-reduced-motion` dəstəyi |
| Səhifə düzülüşü | Spacious Asymmetric Grid | bölmələr arası 80px, 7/5 asimmetrik editorial bölmələr |
| Mobil dizayn | Mobile-first Responsive UI | 900px-dən aşağı alt menyu, 2 sütunlu kartlar, üfüqi sürüşən sıralar |

## Rənglər (Forest & Ivory)

| Token | HEX | İstifadə |
| --- | --- | --- |
| `--ivory` | `#F7F4EE` | səhifə fonu |
| `--ivory-2` | `#EFEAE0` | yumşaq səthlər, şəkil fonu |
| `--forest` | `#214E3D` | əsas düymələr, brend |
| `--lime` | `#DDF278` | yalnız kiçik vurğular |
| `--ink` | `#222520` | başlıqlar və mətn |
| `--white` | `#FFFFFF` | kartlar |
| `--line` | `#E7E2D8` | haşiyələr |

## Ölçülər

- Künclər: `--radius` 14px · `--radius-lg` 22px · `--radius-xl` 28px
- Kölgələr isti tonda və zəif: `--shadow-sm`, `--shadow`, `--shadow-lg`
- Konteyner eni: 1240px, kənar boşluq 32px (mobil 16px)

## Qaydalar

1. Bir ekranda bir əsas düymə (`btn-primary`).
2. Lime rəngi heç vaxt böyük səthdə istifadə edilmir.
3. Başlıqlarda vurğu üçün `<em>` (kursiv, yaşıl) istifadə olunur.
4. Dəstəklənməyən funksiyalar (ödəniş, çatdırılma) mövcud kimi göstərilmir.
