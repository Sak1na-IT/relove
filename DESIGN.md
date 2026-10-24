# Relove — Dizayn sistemi

**Əsas kombinasiya:** Premium Editorial + Quiet Luxury + Modern Minimalism

Relove həm lüks, həm də adi istifadəçi üçün rahat və anlaşıqlı görünməlidir. Hər yeni səhifə və komponent bu qaydalara uyğun qurulur.

| Dizayn elementi | Stil adı | Layihədə necə tətbiq olunur |
| --- | --- | --- |
| Ümumi dizayn | Premium Editorial Marketplace | Jurnal kimi başlıqlar, böyük fotolar, geniş boşluqlar |
| Brend üslubu | Modern Quiet Luxury | Az rəng, səs-küysüz detallar; lime yalnız kiçik vurğu |
| Başlıq stili | Elegant Editorial Serif | **Noto Serif Display** 500 |
| Əsas mətn | Clean Modern Sans-serif | **Onest**, 400–700 |
| Rəng sistemi | Xəzər (Caspian & Stone) | aşağıdakı cədvələ bax |
| Məhsul kartları | Editorial Product Cards | kvadrat foto, ad + qiymət, sakit nişanlar, ürək ikonu |
| Düymələr | Soft Rounded Minimal | tam yuvarlaq (pill), `btn-primary` yaşıl, `btn-ghost` haşiyəli |
| İkonlar | Minimal Outline Icons | `lucide-react`, `strokeWidth` 1.4–1.7 |
| Şəkillər | Warm Lifestyle Photography | isti işıq, təbii interyer, real əşyalar |
| Animasiya | Subtle Micro-interactions | yüngül hover, şəkil zoom 1.05, yumşaq keçidlər, `prefers-reduced-motion` dəstəyi |
| Səhifə düzülüşü | Spacious Asymmetric Grid | bölmələr arası 80px, 7/5 asimmetrik editorial bölmələr |
| Mobil dizayn | Mobile-first Responsive UI | 900px-dən aşağı alt menyu, 2 sütunlu kartlar, üfüqi sürüşən sıralar |

## Rənglər — "Xəzər" palitrası (2026-10-24 yeniləndi)

Sakit, etibar hissi verən mavi əsas rəng; yaşıl və lime istifadə olunmur.

| Token | HEX | İstifadə |
| --- | --- | --- |
| `--ivory` | `#F4F5F2` | daş ağı — səhifə fonu |
| `--ivory-2` | `#EBE7DF` | qum — foto fonları |
| `--forest` | `#1F3A4A` | Xəzər mavisi — əsas düymələr, təhlükəsizlik zolağı, footer |
| `--lime` | `#D6E4EA` | duman — yumşaq vurğu səthləri |
| `--pom` | `#A3354A` | nar — yalnız bəyənmə/sevgi |
| `--ink` | `#18242C` | başlıqlar və mətn |
| `--line` | `#DFE4E5` | haşiyələr |

## Şrift

- Başlıqlar: **Noto Serif Display** 500, `letter-spacing: -0.02em`
- Mətn və interfeys: **Onest** 400–700
- Başlıqda tək sözü rəng/kursivlə vurğulamırıq; böyük hərflə yazılmış etiketlər yoxdur.

## Loqo

Dairə iki yarıya bölünüb (bir sahibdən digərinə keçən əşya), aşağı yarıda kiçik nar nöqtəsi. Yanında kiçik hərflə **relove**.

## Ana səhifənin əsas elementi

**Əşya pasportu** — real elan kartı və onun yolu: təsdiqlənmiş satıcı → yoxlanılmış elan → növbəti sahib. Altında mavi təhlükəsizlik zolağı.

## Ölçülər

- Künclər: `--radius` 12px · `--radius-lg` 18px · `--radius-xl` 24px; düymələr 12px (pill deyil), çiplər tam yuvarlaq
- Kölgələr isti tonda və zəif: `--shadow-sm`, `--shadow`, `--shadow-lg`
- Konteyner eni: 1240px, kənar boşluq 32px (mobil 16px)

## Qaydalar

1. Bir ekranda bir əsas düymə (`btn-primary`).
2. Nar rəngi yalnız bəyənmə üçündür.
3. Təhlükəsizlik mesajları həmişə görünən yerdədir.
4. Dəstəklənməyən funksiyalar (ödəniş, çatdırılma) mövcud kimi göstərilmir.
