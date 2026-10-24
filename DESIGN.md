# Relove — Dizayn sistemi

**Əsas kombinasiya:** Premium Editorial + Quiet Luxury + Modern Minimalism

Relove həm lüks, həm də adi istifadəçi üçün rahat və anlaşıqlı görünməlidir. Hər yeni səhifə və komponent bu qaydalara uyğun qurulur.

| Dizayn elementi | Stil adı | Layihədə necə tətbiq olunur |
| --- | --- | --- |
| Ümumi dizayn | Premium Editorial Marketplace | Jurnal kimi başlıqlar, böyük fotolar, geniş boşluqlar |
| Brend üslubu | Modern Quiet Luxury | Az rəng, səs-küysüz detallar; nar rəngi yalnız kiçik vurğu |
| Başlıq stili | Elegant Editorial Serif | **Cormorant Garamond** 600 |
| Əsas mətn | Clean Modern Sans-serif | **Onest**, 400–700 |
| Rəng sistemi | Bottle green & Linen | aşağıdakı cədvələ bax |
| Məhsul kartları | Editorial Product Cards | kvadrat foto, ad + qiymət, sakit nişanlar, ürək ikonu |
| Düymələr | Soft Rounded Minimal | tam yuvarlaq, `btn-primary` şüşə yaşılı, `btn-ghost` yaşıl haşiyəli |
| İkonlar | Minimal Outline Icons | `lucide-react`, `strokeWidth` 1.4–1.7 |
| Şəkillər | Warm Lifestyle Photography | isti işıq, təbii interyer, real əşyalar |
| Animasiya | Subtle Micro-interactions | yüngül hover, şəkil zoom 1.05, yumşaq keçidlər, `prefers-reduced-motion` dəstəyi |
| Səhifə düzülüşü | Spacious Asymmetric Grid | bölmələr arası 80px, 7/5 asimmetrik editorial bölmələr |
| Mobil dizayn | Mobile-first Responsive UI | 900px-dən aşağı alt menyu, 2 sütunlu kartlar, üfüqi sürüşən sıralar |

## Rənglər — "Bottle green & Linen" (v4)

| Token | HEX | İstifadə |
| --- | --- | --- |
| `--ivory` | `#F6F3EC` | kətan — səhifə fonu |
| `--ivory-2` | `#ECE6DA` | qum — foto fonları |
| `--forest` | `#1F3D33` | şüşə yaşılı — başlıqlar, düymələr, banner, footer |
| `--lime` | `#E4E9DF` | adaçayı dumanı — dəyərlər zolağı, "Dəyiş-düyüş" nişanı |
| `--brass` | `#B08D57` | mis — loqodakı Ø, aktiv menyu xətti, incə vurğular |
| `--pom` | `#9E3B3B` | yalnız bəyənilmiş ürək |
| `--ink` | `#1D221E` | mətn |

## Şrift

- Başlıqlar: **Cormorant Garamond** 600 (lüks moda jurnalı hissi), kursiv yalnız qısa qeydlərdə ("Daha yaxşı bir gələcək üçün, birlikdə.")
- Mətn və interfeys: **Onest** 400–700

## Loqo

**RELØVE** — Cormorant Garamond, böyük hərflər, `letter-spacing: 0.08em`; "Ø" mis rəngdədir və sıfır tullantıya işarə edir.

## Ana səhifə quruluşu

Tam enli foto hero → fotolu kateqoriya kartları (elan sayı ilə) → dəyərlər zolağı → "İndi kəşf edilənlər" karuseli → yaşıl dəyiş-düyüş banneri → kolleksiyalar → yaşıl footer (abunə forması).

## Ölçülər

- Künclər: `--radius` 14px · `--radius-lg` 20px · `--radius-xl` 26px; düymələr tam yuvarlaq
- Kölgələr isti tonda və zəif: `--shadow-sm`, `--shadow`, `--shadow-lg`
- Konteyner eni: 1240px, kənar boşluq 32px (mobil 16px)

## Qaydalar

1. Bir ekranda bir əsas düymə (`btn-primary`).
2. Mis rəngi yalnız kiçik vurğulardadır; böyük səthdə istifadə olunmur.
3. Təhlükəsizlik mesajları həmişə görünən yerdədir.
4. Dəstəklənməyən funksiyalar (ödəniş, çatdırılma) mövcud kimi göstərilmir.
