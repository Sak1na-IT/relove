// Nümunə (demo) məlumatlar. Backend qoşulanda bunlar API-dən gələcək.
// Şəkillər Unsplash-dandır; açılmasa, kart zərif bir "placeholder" göstərir.

export const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const MODES = {
  sale: { label: 'Satış', short: 'Satış', tone: 'sale' },
  swap: { label: 'Dəyiş-düyüş', short: 'Dəyiş', tone: 'swap' },
  free: { label: 'İkinci şans', short: 'İkinci şans', tone: 'free' },
}

export const CONDITIONS = ['Yeni kimi', 'Çox yaxşı', 'Yaxşı', 'İstifadə olunmayıb']
export const REPAIR_LEVELS = ['Kiçik təmir', 'Ciddi təmir', 'Hissələr üçün']

export const DISTRICTS = [
  'Nəsimi', 'Yasamal', 'Nərimanov', 'Səbail', 'Xətai', 'Binəqədi', 'Nizami', 'Xəzər',
]

export const CATEGORIES = [
  { id: 'geyim', label: 'Geyim', short: 'Geyim', icon: 'Shirt', photo: '/elanlar/yun-palto.jpg' },
  { id: 'ayaqqabi', label: 'Ayaqqabı', short: 'Ayaqqabı', icon: 'Footprints', photo: '/elanlar/nike-air-max.jpg' },
  { id: 'canta', label: 'Çanta', short: 'Çanta', icon: 'ShoppingBag', photo: img('1590874103328-eac38a683ce7', 240) },
  { id: 'aksesuar', label: 'Aksesuar', short: 'Aksesuar', icon: 'Watch', photo: img('1621891336630-b48679cb379a', 240) },
  { id: 'usaq', label: 'Uşaq', short: 'Uşaq', icon: 'Baby', photo: '/elanlar/taxta-oyuncaq.jpg' },
  { id: 'ev', label: 'Ev əşyaları', short: 'Ev əşyaları', icon: 'Sofa', photo: '/elanlar/masa-lampasi.jpg' },
  { id: 'elektronika', label: 'Elektronika', short: 'Elektronika', icon: 'Smartphone', photo: '/elanlar/fujifilm.jpg' },
  { id: 'kitab', label: 'Kitab', short: 'Kitab', icon: 'BookOpen', photo: img('1544947950-fa07a98d237f', 240) },
  { id: 'idman', label: 'İdman və hobbi', short: 'Hobbi', icon: 'Bike', photo: img('1485965120184-e220f721d03e', 240) },
  { id: 'kolleksiya', label: 'Kolleksiya', short: 'Kolleksiya', icon: 'Gem', photo: '/elanlar/kodak-plyonka.jpg' },
  { id: 'diger', label: 'Digər', short: 'Digər', icon: 'Ellipsis', photo: '/elanlar/monstera.jpg' },
]

// Relove-un əsas istiqaməti: geyim, ayaqqabı, çanta və aksesuar
export const FASHION_CATS = ['geyim', 'ayaqqabi', 'canta', 'aksesuar']
export const isFashion = (l) => FASHION_CATS.includes(l.category)

// Ana səhifədəki "Şkafa göz at" plitələri
export const WARDROBE = [
  { label: 'Palto və gödəkçə', photo: '/elanlar/yun-palto.jpg', to: '/ikinci-el?sub=Palto və gödəkçə' },
  { label: 'Köynək və bluz', photo: '/elanlar/damali-koynek.jpg', to: '/ikinci-el?q=köynək' },
  { label: 'Cins və şalvar', photo: img('1614990354198-b06764dcb13c', 600), to: '/ikinci-el?sub=Şalvar və cins' },
  { label: 'Trikotaj', photo: img('1545590148-584b2278bb37', 600), to: '/ikinci-el?sub=Trikotaj' },
  { label: 'Ayaqqabı', photo: '/elanlar/nike-air-max.jpg', to: '/ikinci-el?cat=ayaqqabi' },
  { label: 'Çanta', photo: img('1590874103328-eac38a683ce7', 600), to: '/ikinci-el?cat=canta' },
  { label: 'Aksesuar', photo: img('1621891336630-b48679cb379a', 600), to: '/ikinci-el?cat=aksesuar' },
]

export const HERO_SLIDES = [
  { image: img('1555041469-a586c61ea9bc', 2000), title: ['Əşyaların', 'ikinci həyatı.'], text: 'Sat. Dəyiş. Paylaş. Yenidən sev.' },
  { image: img('1490481651871-ab68de25d43d', 1800), title: ['Stilinə', 'yeni bir həyat ver.'], text: 'İkinci əl geyim, yeni hekayələr.' },
  { image: img('1513506003901-1e6a229e2d15', 1800), title: ['Evinə', 'xarakter qat.'], text: 'Hər əşyanın bir keçmişi, sənin evində gələcəyi var.' },
]

export const HOME_CATEGORIES = [
  { id: 'geyim', label: 'Geyim və aksesuarlar', photo: img('1434389677669-e08b4cac3105', 600), cats: ['geyim', 'canta'] },
  { id: 'ev', label: 'Ev və dekor', photo: img('1507473885765-e6ed057f782c', 600), cats: ['ev'] },
  { id: 'elektronika', label: 'Elektronika', photo: img('1505740420928-5e560c06d30e', 600), cats: ['elektronika'] },
  { id: 'kitab', label: 'Kitablar və hobbilər', photo: img('1544947950-fa07a98d237f', 600), cats: ['kitab'] },
  { id: 'usaq', label: 'Uşaq əşyaları', photo: img('1515488042361-ee00e0ddd4e4', 600), cats: ['usaq'] },
  { id: 'idman', label: 'İdman və outdoor', photo: img('1485965120184-e220f721d03e', 600), cats: ['idman'] },
  { id: 'kolleksiya', label: 'Kolleksiya əşyaları', photo: img('1526170375885-4d8ecf77b99f', 600), cats: ['kolleksiya'] },
  { id: 'ayaqqabi', label: 'Ayaqqabı', photo: img('1542291026-7eec264c27ff', 600), cats: ['ayaqqabi'] },
]


export const catById = (id) => CATEGORIES.find((c) => c.id === id)

export const USERS = {
  me: {
    id: 'me', phone: '+994 50 412 33 18', whatsapp: true, contactPref: 'Mesaj', name: 'Sakina Pashayeva', handle: 'sakina', avatar: null,
    district: 'Yasamal', joined: 'Mart 2026', rating: 4.9, reviews: 23, verified: true, fastReply: true,
    bio: 'Minimalist yaşamağa çalışıram — sevdiyim əşyaların yeni sahiblərini tapıram.',
  },
  u1: { id: 'u1', phone: '+994 55 218 47 90', whatsapp: true, name: 'Rəşad Məmmədov', handle: 'reshad', avatar: img('1500648767791-00dcc994a43e', 300), district: 'Nərimanov', joined: 'Yanvar 2026', rating: 4.8, reviews: 41, verified: true, fastReply: true },
  u2: { id: 'u2', phone: '+994 50 677 12 05', whatsapp: true, name: 'Leyla Həsənli', handle: 'leyla', avatar: img('1438761681033-6461ffad8d80', 300), district: 'Nəsimi', joined: 'Fevral 2026', rating: 5.0, reviews: 17, verified: true, fastReply: false },
  u3: { id: 'u3', phone: '+994 70 341 88 26', whatsapp: true, name: 'Elvin Quliyev', handle: 'elvin', avatar: img('1507003211169-0a1dd7228f2d', 300), district: 'Xətai', joined: 'Aprel 2026', rating: 4.7, reviews: 9, verified: false, fastReply: true },
  u4: { id: 'u4', phone: '+994 51 905 63 40', whatsapp: true, name: 'Aytən Kərimova', handle: 'ayten', avatar: img('1544005313-94ddf0286df2', 300), district: 'Səbail', joined: 'May 2026', rating: 4.9, reviews: 32, verified: true, fastReply: true },
  u5: { id: 'u5', phone: '+994 77 120 54 81', whatsapp: false, name: 'Murad Rzayev', handle: 'murad', avatar: img('1506794778202-cad84cf45f1d', 300), district: 'Binəqədi', joined: 'İyun 2026', rating: 4.6, reviews: 12, verified: true, fastReply: false },
}

export const LISTINGS = [
  {
    id: 'l1', title: 'Fujifilm X-T5 fotoaparat', category: 'elektronika', price: 1900, condition: 'Çox yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u1', posted: '2 saat əvvəl', aspect: 'tall',
    images: ['/elanlar/fujifilm.jpg'],
    description: 'Gümüşü korpus, obyektivsiz. Ekranında cızıq yoxdur, batareya yaxşı saxlayır. Qutusu və şarj cihazı var.',
    story: 'İki il səyahətlərimdə yanımda olub. İndi telefonla çəkirəm, onun daha çox çəkiliş görməsini istəyirəm.',
    wants: ['elektronika', 'kitab'], wantsText: ['Qulaqlıq', 'Planşet', 'Fotoaparat aksesuarları', 'Təklifə açıqdır'],
    delivery: ['meet', 'courier'],
  },
  {
    id: 'l2', title: 'Vintage dəri gödəkçə', category: 'geyim', price: 60, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: ['/elanlar/deri-godekce.jpg'],
    description: 'M ölçü, əsl dəri, bomber kəsimi. Dərisi vaxtla yumşalıb, fermuarları işləyir.',
    story: 'Nənəmin şkafından tapdığım ilk vintage parça idi.',
    wants: ['geyim', 'ev'], wantsText: ['Vintage çanta', 'Ev dekoru'], delivery: ['meet'],
  },
  {
    id: 'l3', title: 'Keramika vaza', category: 'ev', price: 20, condition: 'Yeni kimi',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: 'Dünən', aspect: 'square',
    images: ['/elanlar/keramika-vaza.jpg'],
    description: 'Əl işi, üzərində çiçək naxışı var. Heç bir çat və ya qırıq yoxdur.',
    wants: ['ev', 'kitab'], wantsText: ['Kitab', 'Bitki', 'Təklifə açığam'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l4', title: 'Sony WH-1000XM4 qulaqlıq', category: 'elektronika', price: 170, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u3', posted: '5 saat əvvəl', aspect: 'square',
    images: [img('1673056922463-8c4639755cab'), img('1484704849700-f032a568e944')],
    description: 'Səs-küy azaltma mükəmməl işləyir. Çantası və kabelləri ilə.',
    wants: ['elektronika', 'idman'], wantsText: ['Ağıllı saat', 'Velosiped aksesuarları'], delivery: ['meet'],
  },
  {
    id: 'l5', title: 'Taxta çərçivəli kreslo', category: 'ev', price: 150, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u4', posted: '3 gün əvvəl', aspect: 'wide',
    images: ['/elanlar/kreslo.jpg'],
    description: 'Rahat, dayanıqlı. Köçdüyümüz üçün yer qalmayıb.',
    story: 'Bütün qış axşamlarımın kitab küncü idi.',
    wants: ['ev', 'kitab'], wantsText: ['Kitab rəfi', 'Döşəmə lampası'], delivery: ['meet'],
  },
  {
    id: 'l6', title: '12 kitablıq klassika kolleksiyası', category: 'kitab', price: 12, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: '1 saat əvvəl', aspect: 'tall',
    images: [img('1495446815901-a7297e633e8d'), img('1532012197267-da84d127e765')],
    description: 'Dostoyevski, Tolstoy, Sabahattin Əli və başqaları. Simvolik qiymətə — sadəcə yaxşı oxucuya getsin.',
    story: 'Bu kitabları universitet illərində almışam. İndi kitabxanamı yeniləyirəm.',
    wants: ['kitab', 'usaq'], wantsText: ['Başqa kitablar', 'Uşaq kitabları'], delivery: ['meet'],
  },
  {
    id: 'l7', title: 'Nike Air Max 90', category: 'ayaqqabi', price: 45, condition: 'Çox yaxşı',
    district: 'Binəqədi', modes: ['sale', 'swap'], seller: 'u5', posted: 'Bu gün', aspect: 'square',
    images: ['/elanlar/nike-air-max.jpg'],
    description: '38 ölçü, cəmi bir neçə dəfə geyinilib. Qutusu ilə.',
    wants: ['ayaqqabi', 'idman'], wantsText: ['Başqa ölçü krossovka', 'Fitnes əşyaları'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l8', title: 'Akustik gitara Yamaha', category: 'idman', price: 110, condition: 'Yaxşı',
    district: 'Xəzər', modes: ['swap'], seller: 'u1', posted: '4 gün əvvəl', aspect: 'tall',
    images: [img('1608470639012-3b64ec3c61a2'), img('1525201548942-d8732f6617a0')],
    description: 'Simləri təzə dəyişilib. Futlyarı ilə birlikdə.',
    wants: ['elektronika', 'kitab'], wantsText: ['Qulaqlıq', 'Musiqi kitabları'], delivery: ['meet'],
  },
  {
    id: 'l9', title: 'Kodak Ektar H35 plyonka fotoaparatı', category: 'kolleksiya', price: 70, condition: 'Yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: 'Dünən', aspect: 'square',
    images: ['/elanlar/kodak-plyonka.jpg'],
    description: 'Yarım kadrlı plyonka fotoaparatı, bir plyonkadan 72 kadr çıxır. İşlək vəziyyətdədir, yeni plyonka ilə yoxlanılıb.',
    wants: ['kolleksiya', 'elektronika'], wantsText: ['Vinil plastinkalar', 'Köhnə saatlar'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l10', title: 'Şəhər velosipedi', category: 'idman', price: 130, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u5', posted: '2 gün əvvəl', aspect: 'wide',
    images: [img('1631443412966-2a2ab5e18c3b'), img('1507035895480-2b3156c31fc8')],
    description: '28 təkər, 7 sürət. Təkərlər yenidir.',
    wants: ['elektronika', 'idman'], wantsText: ['Elektrik skuter', 'Qulaqlıq'], delivery: ['meet'],
  },
  {
    id: 'l11', title: 'Uşaq taxta oyuncaq dəsti', category: 'usaq', price: 12, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u3', posted: '6 saat əvvəl', aspect: 'square',
    images: ['/elanlar/taxta-oyuncaq.jpg'],
    description: 'Taxta mətbəx dəsti: taxta lövhə, bıçaq, qaşıq, fincanlar və meyvələr. Uşaqlar böyüdü — başqa balaca əllərə getsin.',
    wants: ['usaq', 'kitab'], wantsText: ['Uşaq kitabları', 'Konstruktor'], delivery: ['meet'],
  },
  {
    id: 'l12', title: 'MacBook Air M2', category: 'elektronika', price: 1350, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u1', posted: 'Bu gün', aspect: 'wide',
    images: ['/elanlar/macbook-air.jpg'],
    description: 'Midnight rəngi, 8GB / 256GB, batareya 94%. Qutusu və şarj cihazı ilə.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'l13', title: 'Damalı köynək', category: 'geyim', price: 15, condition: 'Yaxşı',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u2', posted: '3 saat əvvəl', aspect: 'tall',
    images: ['/elanlar/damali-koynek.jpg'],
    description: 'M ölçü, bir neçə dəfə geyinilib, yuyulub ütülənib.',
    wants: ['geyim'], wantsText: ['Aksesuarlar'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l14', title: 'Monstera bitkisi və saksı', category: 'ev', price: 15, condition: 'Yeni kimi',
    district: 'Nizami', modes: ['sale', 'swap'], seller: 'u5', posted: 'Bu gün', aspect: 'tall',
    images: ['/elanlar/monstera.jpg'],
    description: 'Çox böyüdü, evə sığmır. Qayğı ilə baxacaq birini axtarır.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'l15', title: 'Mid-century masa lampası', category: 'ev', price: 30, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: '1 gün əvvəl', aspect: 'square',
    images: ['/elanlar/masa-lampasi.jpg'],
    description: 'Mis detallı, isti işıq. Lampası daxildir.',
    wants: ['ev', 'kolleksiya'], wantsText: ['Vinil', 'Keramika'], delivery: ['meet'],
  },
  {
    id: 'l16', title: 'Ağıllı saat', category: 'elektronika', price: 80, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale', 'swap'], seller: 'u3', posted: '2 gün əvvəl', aspect: 'square',
    images: ['/elanlar/agilli-saat.jpg'],
    description: 'Qutusu ilə, dörd qayış və şarj kabeli daxildir. Ekran qoruyucusu var.',
    wants: ['elektronika'], wantsText: ['Qulaqlıq', 'Planşet'], delivery: ['meet', 'courier'],
  },
]

LISTINGS.splice(1, 0,
  {
    id: 'l17', title: 'Dəri bel çantası', category: 'canta', price: 70, condition: 'Yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: '1 saat əvvəl', aspect: 'square',
    images: [img('1596100617872-e8239bfee5f8')],
    description: 'Təbii qəhvəyi dəri, iki ön cibi var. Bir az işlənib, kəmərləri möhkəmdir.',
    story: 'Bir neçə səyahətə yoldaşlıq edib, indi daha kiçik çantaya keçmişəm.',
    wants: ['geyim', 'ayaqqabi'], wantsText: ['Palto', 'Çəkmə'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l18', title: 'Yun palto — bej', category: 'geyim', price: 45, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: ['/elanlar/yun-palto.jpg'],
    description: 'M ölçü, isti və yüngül. Payız üçün ideal.',
    wants: ['geyim', 'canta'], wantsText: ['Çanta', 'Şərf', 'Çəkmə'], delivery: ['meet'],
  },
  {
    id: 'f1', title: 'Mom jeans — açıq mavi', category: 'geyim', price: 25, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale'], seller: 'u2', posted: '2 saat əvvəl', aspect: 'tall',
    images: [img('1614990354198-b06764dcb13c')], dept: 'qadin', sub: 'Şalvar və cins',
    description: 'Ölçü: W27 / 36. Yüksək bel, düz kəsim. Rəngi solmayıb.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f2', title: 'Klassik cins şalvar', category: 'geyim', price: 30, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u1', posted: 'Dünən', aspect: 'tall',
    images: [img('1515459961680-58264ee27219')], dept: 'kisi', sub: 'Şalvar və cins',
    description: 'Ölçü: W32 / L32. Tünd mavi, qalın parça. Diz hissəsi yeyilməyib.',
    wants: ['geyim'], wantsText: ['Gödəkçə', 'Sviter'], delivery: ['meet'],
  },
  {
    id: 'f3', title: 'Boz yun sviter', category: 'geyim', price: 22, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u4', posted: '5 saat əvvəl', aspect: 'tall',
    images: [img('1545590148-584b2278bb37')], dept: 'qadin', sub: 'Trikotaj',
    description: 'Ölçü: S–M, oversize. Yun qarışığı, tükləşməyib.',
    story: 'Ötən qışın ən çox geyindiyim sviteri idi, indi şkafda yer açıram.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f4', title: 'Payız dəsti — sviter, cins və bere', category: 'geyim', price: 45, condition: 'Yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u2', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1556905055-8f358a7a47b2')], dept: 'qadin', sub: 'Trikotaj',
    description: 'Ölçü: M. Üç parça birlikdə satılır — ayrıca da soruşa bilərsən.',
    wants: ['canta', 'ayaqqabi'], wantsText: ['Çəkmə', 'Kiçik çanta'], delivery: ['meet'],
  },
  {
    id: 'f5', title: 'Çəhrayı yüngül gödəkçə', category: 'geyim', price: 35, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u4', posted: 'Bu gün', aspect: 'tall',
    images: [img('1542901689-f103b03b9e97')], dept: 'qadin', sub: 'Palto və gödəkçə',
    description: 'Ölçü: S. Yaz və erkən payız üçün, astarı təmizdir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f6', title: 'Terrakota bomber gödəkçə', category: 'geyim', price: 40, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u2', posted: '4 saat əvvəl', aspect: 'tall',
    images: [img('1591047139829-d91aecb6caea')], dept: 'qadin', sub: 'Palto və gödəkçə',
    description: 'Ölçü: M. Fermuarı və cibləri işləyir, rəngi canlıdır.',
    wants: ['geyim'], wantsText: ['Trikotaj', 'Don'], delivery: ['meet'],
  },
  {
    id: 'f7', title: 'Tünd qış gödəkçəsi', category: 'geyim', price: 55, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: 'Dünən', aspect: 'tall',
    images: [img('1693733575626-c990dca10e7a')], dept: 'kisi', sub: 'Palto və gödəkçə',
    description: 'Ölçü: L. İsti, kapüşonlu. Bir mövsüm geyinilib.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'f8', title: 'Damalı flanel köynək', category: 'geyim', price: 15, condition: 'Yaxşı',
    district: 'Nizami', modes: ['sale', 'swap'], seller: 'u3', posted: '6 saat əvvəl', aspect: 'tall',
    images: [img('1600247354058-a55b0f6fb720')], dept: 'kisi', sub: 'Köynək',
    description: 'Ölçü: M. Yumşaq flanel, düymələri tamdır.',
    wants: ['geyim'], wantsText: ['Futbolka', 'Kəmər'], delivery: ['meet'],
  },
  {
    id: 'f9', title: 'Dəri çəkmə — qəhvəyi', category: 'ayaqqabi', price: 60, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u4', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1511283402428-355853756676')], dept: 'qadin', sub: 'Çəkmə',
    description: 'Ölçü: 38. Təbii dəri, dabanı yenilənib. Payız-qış üçün.',
    wants: ['geyim', 'canta'], wantsText: ['Palto', 'Çanta'], delivery: ['meet'],
  },
  {
    id: 'f10', title: 'Ağ-qəhvəyi kətan krossovka', category: 'ayaqqabi', price: 30, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u3', posted: 'Bu gün', aspect: 'tall',
    images: [img('1592670587543-f409a95839e0')], dept: 'kisi', sub: 'Krossovka',
    description: 'Ölçü: 43. Bir neçə dəfə geyinilib, altı təmizdir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f11', title: 'Qara dəri əl çantası', category: 'canta', price: 45, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale'], seller: 'u4', posted: '3 saat əvvəl', aspect: 'tall',
    images: [img('1614179689702-355944cd0918')], dept: 'qadin', sub: 'Əl çantası',
    description: 'Gümüşü furnitura, içi təmizdir. Qayışı uzanır.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f12', title: 'Qəhvəyi dəri çiyin çantası', category: 'canta', price: 50, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u2', posted: 'Dünən', aspect: 'tall',
    images: [img('1590874103328-eac38a683ce7')], dept: 'qadin', sub: 'Çiyin çantası',
    description: 'Təbii dəri, vaxtla gözəl rəng alıb. Fermuarı işləyir.',
    wants: ['ayaqqabi'], wantsText: ['Çəkmə', 'Loafer'], delivery: ['meet'],
  },
  {
    id: 'f13', title: 'Ağ kiçik çanta', category: 'canta', price: 25, condition: 'Yeni kimi',
    district: 'Nərimanov', modes: ['sale'], seller: 'u1', posted: '5 gün əvvəl', aspect: 'tall',
    images: [img('1682745230951-8a5aa9a474a0')], dept: 'qadin', sub: 'Əl çantası',
    description: 'Cəmi iki dəfə istifadə olunub. Axşam çıxışları üçün.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'f14', title: 'Klassik qol saatı', category: 'aksesuar', price: 70, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u1', posted: '1 həftə əvvəl', aspect: 'tall',
    images: [img('1621891336630-b48679cb379a')], dept: 'kisi', sub: 'Saat',
    description: 'Mexaniki, gümüşü korpus. Batareya tələb etmir, dəqiq işləyir.',
    wants: ['geyim'], wantsText: ['Ceket', 'Palto'], delivery: ['meet'],
  },
  {
    id: 'f15', title: 'İki cins — tünd və açıq', category: 'geyim', price: 35, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: '4 gün əvvəl', aspect: 'tall',
    images: [img('1566564206548-3d8eb5bf9875')], dept: 'qadin', sub: 'Şalvar və cins',
    description: 'Ölçü: W28. İkisi birlikdə satılır, hər ikisi skinny kəsimdir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g1', title: 'Yaşıl atlaz don', category: 'geyim', price: 35, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u2', posted: '1 saat əvvəl', aspect: 'tall',
    images: ['https://images.unsplash.com/flagged/photo-1585052201332-b8c0ce30972f?auto=format&fit=crop&w=900&q=80'], dept: 'qadin', sub: 'Don',
    description: 'Ölçü: S. Atlaz parça, bir dəfə toyda geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g2', title: 'Uzunqol donlar — 3 ədəd', category: 'geyim', price: 50, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u4', posted: '3 saat əvvəl', aspect: 'tall',
    images: [img('1560506840-ec148e82a604')], dept: 'qadin', sub: 'Don',
    description: 'Ölçü: M. Üçü birlikdə və ya ayrı-ayrı satılır.',
    wants: ['geyim'], wantsText: ['Palto', 'Çəkmə'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g3', title: 'Ağ krujeva top', category: 'geyim', price: 12, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: [img('1599971284305-674fb528fa78')], dept: 'qadin', sub: 'Futbolka və top',
    description: 'Ölçü: XS–S. Yay üçün, pambıq krujeva.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g4', title: 'Çiçəkli uzunqol bluz', category: 'geyim', price: 18, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale'], seller: 'u4', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1609709295948-17d77cb2a69b')], dept: 'qadin', sub: 'Köynək və bluz',
    description: 'Ölçü: M. Yüngül, ütü tələb etmir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g5', title: 'Ağ klassik köynək', category: 'geyim', price: 20, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u2', posted: '5 saat əvvəl', aspect: 'tall',
    images: [img('1604506847073-4a8e18e07d92')], dept: 'qadin', sub: 'Köynək və bluz',
    description: 'Ölçü: S. Pambıq, ofis və gündəlik üçün.',
    wants: ['geyim'], wantsText: ['Ətək', 'Kəmər'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g6', title: 'Qəhvəyi-ağ palto', category: 'geyim', price: 65, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u4', posted: 'Dünən', aspect: 'tall',
    images: [img('1604882767135-b41fac508fff')], dept: 'qadin', sub: 'Palto və gödəkçə',
    description: 'Ölçü: M. Yun qarışığı, iki mövsüm geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g7', title: 'Damalı blazer — boz', category: 'geyim', price: 40, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u2', posted: '4 saat əvvəl', aspect: 'tall',
    images: [img('1598915850252-fb07ad1e6768')], dept: 'qadin', sub: 'Ceket və blazer',
    description: 'Ölçü: S–M. Oversize kəsim, çiyinləri formadadır.',
    wants: ['geyim'], wantsText: ['Şalvar', 'Bluz'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g8', title: 'Çiçəkli tufli', category: 'ayaqqabi', price: 30, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u4', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1543163521-1bf539c55dd2')], dept: 'qadin', sub: 'Hündürdaban',
    description: 'Ölçü: 37. Alçaq daban, rahatdır.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g9', title: 'Qəhvəyi dəri tufli', category: 'ayaqqabi', price: 35, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale'], seller: 'u2', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1621996659490-3275b4d0d951')], dept: 'qadin', sub: 'Hündürdaban',
    description: 'Ölçü: 38. Açıq burun, təbii dəri.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g10', title: 'Ağ hündürdaban', category: 'ayaqqabi', price: 28, condition: 'Yeni kimi',
    district: 'Nərimanov', modes: ['sale'], seller: 'u1', posted: 'Bu gün', aspect: 'tall',
    images: [img('1670938258821-2956d4ce9c9b')], dept: 'qadin', sub: 'Hündürdaban',
    description: 'Ölçü: 37. Cəmi bir dəfə geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g11', title: 'Gümüşü hündürdaban', category: 'ayaqqabi', price: 40, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: '1 həftə əvvəl', aspect: 'tall',
    images: [img('1632761298177-51e35403e27e')], dept: 'qadin', sub: 'Hündürdaban',
    description: 'Ölçü: 38. Axşam tədbirləri üçün.',
    wants: ['geyim'], wantsText: ['Klatç', 'Don'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g12', title: 'Ağ hudi və açıq cins', category: 'geyim', price: 30, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: '6 saat əvvəl', aspect: 'tall',
    images: [img('1620799140188-3b2a02fd9a77')], dept: 'qadin', sub: 'Hudi və sviterşot',
    description: 'Ölçü: M. İkisi birlikdə satılır.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g13', title: 'Qırmızı kətan krossovka', category: 'ayaqqabi', price: 25, condition: 'Yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u3', posted: 'Dünən', aspect: 'tall',
    images: [img('1650320079970-b4ee8f0dae33')], dept: 'qadin', sub: 'Krossovka',
    description: 'Ölçü: 39. Yuyulub, bağları təzədir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g14', title: 'Yaşıl dəri loafer', category: 'ayaqqabi', price: 30, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u2', posted: '4 gün əvvəl', aspect: 'tall',
    images: [img('1560343090-f0409e92791a')], dept: 'qadin', sub: 'Balet və loafer',
    description: 'Ölçü: 38. Yumşaq dəri, qutusu ilə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g15', title: 'Qızılı sırğalar', category: 'aksesuar', price: 20, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale'], seller: 'u4', posted: '2 saat əvvəl', aspect: 'tall',
    images: [img('1561828995-aa79a2db86dd')], dept: 'qadin', sub: 'Zərgərlik',
    description: 'Qızılı rəngli, bir neçə cüt birlikdə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g16', title: 'Günəş eynəyi', category: 'aksesuar', price: 25, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u2', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1511556820780-d912e42b4980')], dept: 'qadin', sub: 'Eynək',
    description: 'UV qoruyucu, qabı ilə birlikdə.',
    wants: ['geyim'], wantsText: ['Şərf', 'Kəmər'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g17', title: 'Qara klassik pencək', category: 'geyim', price: 55, condition: 'Çox yaxşı',
    district: 'Nərimanov', modes: ['sale'], seller: 'u1', posted: 'Bu gün', aspect: 'tall',
    images: [img('1592343516109-362f7bd871aa')], dept: 'kisi', sub: 'Ceket və blazer',
    description: 'Ölçü: 50 (L). Bir neçə dəfə tədbirdə geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g18', title: 'Slim kostyum pencəyi', category: 'geyim', price: 70, condition: 'Çox yaxşı',
    district: 'Nizami', modes: ['sale', 'swap'], seller: 'u3', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1598808503746-f34c53b9323e')], dept: 'kisi', sub: 'Kostyum',
    description: 'Ölçü: 48 (M). Şalvarı da var, birlikdə 90 AZN.',
    wants: ['geyim'], wantsText: ['Klassik ayaqqabı'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g19', title: 'Ağ düyməli köynək', category: 'geyim', price: 18, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u3', posted: '5 saat əvvəl', aspect: 'tall',
    images: [img('1602810318383-e386cc2a3ccf')], dept: 'kisi', sub: 'Köynək',
    description: 'Ölçü: M. Pambıq, yaxası formasını saxlayır.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g20', title: 'Rəngli köynəklər — 5 ədəd', category: 'geyim', price: 40, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: 'Dünən', aspect: 'tall',
    images: [img('1562157873-818bc0726f68')], dept: 'kisi', sub: 'Köynək',
    description: 'Ölçü: L. Beşi birlikdə, tək-tək də olar.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g21', title: 'Flanel köynək — damalı', category: 'geyim', price: 20, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u1', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1782227282777-31e421d02eaf')], dept: 'kisi', sub: 'Köynək',
    description: 'Ölçü: L. Qalın flanel, payız üçün.',
    wants: ['geyim'], wantsText: ['Hudi', 'Cins'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g22', title: 'Qəhvəyi dəri klassik ayaqqabı', category: 'ayaqqabi', price: 60, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale'], seller: 'u1', posted: '1 həftə əvvəl', aspect: 'tall',
    images: [img('1490114538077-0a7f8cb49891')], dept: 'kisi', sub: 'Klassik ayaqqabı',
    description: 'Ölçü: 43. Qutusu ilə, iki dəfə geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g23', title: 'Dəri çəkmə — kişi', category: 'ayaqqabi', price: 70, condition: 'Yaxşı',
    district: 'Nizami', modes: ['sale', 'swap'], seller: 'u3', posted: '4 gün əvvəl', aspect: 'tall',
    images: [img('1479064555552-3ef4979f8908')], dept: 'kisi', sub: 'Çəkmə',
    description: 'Ölçü: 42. Təbii dəri, altı möhkəmdir.',
    wants: ['geyim'], wantsText: ['Gödəkçə'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g24', title: 'Qara dəri kəmər', category: 'aksesuar', price: 15, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale'], seller: 'u3', posted: 'Bu gün', aspect: 'tall',
    images: [img('1603805752838-aa579d77da72')], dept: 'kisi', sub: 'Kəmər',
    description: 'Uzunluq: 105 sm. Metal toqqa.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g25', title: 'Qəhvəyi dəri kəmər', category: 'aksesuar', price: 15, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale'], seller: 'u1', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1614676471928-2ed0ad1061a4')], dept: 'kisi', sub: 'Kəmər',
    description: 'Uzunluq: 100 sm. Klassik ayaqqabı ilə uyğun gəlir.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g26', title: 'Adidas krossovka — qara-ağ', category: 'ayaqqabi', price: 40, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: '6 saat əvvəl', aspect: 'tall',
    images: [img('1605382165091-443eff32caf5')], dept: 'kisi', sub: 'Krossovka',
    description: 'Ölçü: 42. Gündəlik geyim üçün.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g27', title: 'Boz futbolka', category: 'geyim', price: 8, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale'], seller: 'u5', posted: 'Dünən', aspect: 'tall',
    images: [img('1564584217132-2271feaeb3c5')], dept: 'kisi', sub: 'Futbolka',
    description: 'Ölçü: M. Pambıq, yaxası uzanmayıb.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g28', title: 'Yaşıl futbolkalar — 3 ədəd', category: 'geyim', price: 15, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u1', posted: '3 saat əvvəl', aspect: 'tall',
    images: [img('1523381294911-8d3cead13475')], dept: 'kisi', sub: 'Futbolka',
    description: 'Ölçü: L. Üçü birlikdə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g29', title: 'Körpə bodiləri — 3 ədəd', category: 'geyim', price: 12, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale'], seller: 'u4', posted: 'Bu gün', aspect: 'tall',
    images: [img('1569974641446-22542de88536')], dept: 'usaq', sub: 'Körpə geyimi (0–2 yaş)',
    description: '6–9 ay. Pambıq, yuyulub ütülənib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g30', title: 'Ağ-mavi körpə bodisi', category: 'geyim', price: 6, condition: 'Yaxşı',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u3', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1622290319146-7b63df48a635')], dept: 'usaq', sub: 'Körpə geyimi (0–2 yaş)',
    description: '3–6 ay. Düymələri tamdır.',
    wants: ['geyim'], wantsText: ['Uşaq ayaqqabısı'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g31', title: 'Ayıcıq naxışlı bodilər', category: 'geyim', price: 8, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u2', posted: '5 saat əvvəl', aspect: 'tall',
    images: [img('1622290291720-ac961c43ee30')], dept: 'usaq', sub: 'Körpə geyimi (0–2 yaş)',
    description: '0–3 ay. İki ədəd birlikdə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g32', title: 'Uşaq ağ futbolkası', category: 'geyim', price: 5, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: 'Dünən', aspect: 'tall',
    images: [img('1622290291468-a28f7a7dc6a8')], dept: 'usaq', sub: 'Uşaq geyimi (3–7 yaş)',
    description: '4–5 yaş. Pambıq.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g33', title: 'Uşaq ağ donu', category: 'geyim', price: 15, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale'], seller: 'u4', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1684244160171-97f5dac39204')], dept: 'usaq', sub: 'Uşaq geyimi (3–7 yaş)',
    description: '5–6 yaş. Bayram üçün, bir dəfə geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g34', title: 'Uşaq corabları — 5 cüt', category: 'geyim', price: 5, condition: 'Yeni kimi',
    district: 'Nərimanov', modes: ['sale'], seller: 'u1', posted: '1 həftə əvvəl', aspect: 'tall',
    images: [img('1542355581-caf7454785ca')], dept: 'usaq', sub: 'Uşaq geyimi (3–7 yaş)',
    description: '3–5 yaş. Biri də geyinilməyib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g35', title: 'Mavi uşaq ayaqqabısı', category: 'ayaqqabi', price: 15, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale'], seller: 'u2', posted: '4 saat əvvəl', aspect: 'tall',
    images: [img('1678192568478-9488ee55def6')], dept: 'usaq', sub: 'Uşaq ayaqqabısı',
    description: 'Ölçü: 26. Yüngül, cırt-cırtlı.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 'g36', title: 'Uşaq krossovkası — ağ-qırmızı', category: 'ayaqqabi', price: 18, condition: 'Yaxşı',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u3', posted: 'Dünən', aspect: 'tall',
    images: [img('1584564515943-b54cbb61836b')], dept: 'usaq', sub: 'Uşaq ayaqqabısı',
    description: 'Ölçü: 30. Altı yeyilməyib.',
    wants: ['geyim'], wantsText: ['Uşaq gödəkçəsi'], delivery: ['meet', 'courier'],
  },
  {
    id: 'g37', title: 'Bej rezin ayaqqabı', category: 'ayaqqabi', price: 10, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1552912276-56ef47874741')], dept: 'usaq', sub: 'Uşaq ayaqqabısı',
    description: 'Ölçü: 28. Yay və dəniz üçün.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
)

// "Mənim" dəyişməyə hazır əşyalarım (Dəyiş səhifəsi üçün)
export const MY_ITEMS = [
  {
    id: 'm1', title: 'Bose QC35 qulaqlıq', category: 'elektronika', price: 110, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'me', posted: '1 həftə əvvəl', aspect: 'square',
    images: [img('1583394838336-acd977736f90')],
    description: 'Səs-küy azaltma ilə. Qutusu var.',
    wants: ['elektronika', 'kolleksiya'], wantsText: ['Fotoaparat', 'Planşet'], delivery: ['meet'],
  },
  {
    id: 'm2', title: 'Fotoqrafiya kitabları (5 ədəd)', category: 'kitab', price: 30, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['swap'], seller: 'me', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1497633762265-9d179a990aa6')],
    description: 'Albom formatlı, sərt üzlük.',
    wants: ['elektronika', 'ev', 'idman'], wantsText: ['Fotoaparat aksesuarları', 'Lampa'], delivery: ['meet'],
  },
  {
    id: 'm3', title: 'Rattan güzgü', category: 'ev', price: 30, condition: 'Yeni kimi',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'me', posted: '2 gün əvvəl', aspect: 'tall',
    images: [img('1618220179428-22790b461013')],
    description: '60 sm diametr. Divara asılmağa hazır.',
    wants: ['ev', 'kolleksiya'], wantsText: ['Kreslo', 'Vaza'], delivery: ['meet'],
  },
]

export const CONVERSATIONS = [
  {
    id: 'c1', with: 'u1', listing: 'l1', unread: 2,
    messages: [
      { from: 'me', text: 'Salam! Fotoaparat hələ də mövcuddur?', time: '14:02' },
      { from: 'u1', text: 'Salam, bəli mövcuddur 🙂', time: '14:05' },
      { from: 'u1', text: 'Qulaqlığınla dəyişməyə də açığam, fərqi danışarıq.', time: '14:06' },
    ],
  },
  {
    id: 'c2', with: 'u4', listing: 'l5', unread: 0,
    messages: [
      { from: 'u4', text: 'Kreslonu bu həftə sonu görmək istəyirsiniz?', time: 'Dünən' },
      { from: 'me', text: 'Bəli, şənbə günü uyğundur.', time: 'Dünən' },
    ],
  },
  {
    id: 'c3', with: 'u2', listing: 'l6', unread: 1,
    messages: [{ from: 'u2', text: 'Kitablar sizin üçün saxlanıldı ✨', time: 'Bazar ertəsi' }],
  },
]

export const COLLECTIONS = [
  { id: 'k1', name: 'Yeni evim üçün', items: ['l5', 'l15', 'l3'], public: true },
  { id: 'k2', name: 'Vintage tapıntılar', items: ['l2', 'l9'], public: true },
  { id: 'k3', name: '50 AZN-dən aşağı', items: ['l13', 'l3'], public: false },
]

export const REVIEWS = [
  { from: 'u2', stars: 5, text: 'Çox səmimi və dəqiq. Əşya şəkildəki kimi idi.', when: 'Sentyabr 2026' },
  { from: 'u4', stars: 5, text: 'Dəyiş-düyüş çox rahat keçdi, təşəkkürlər!', when: 'Avqust 2026' },
  { from: 'u5', stars: 4, text: 'Hər şey qaydasında, görüşə vaxtında gəldi.', when: 'İyul 2026' },
]

// Demo üçün sabit bəyənmə sayı (backend qoşulanda real olacaq)
export const likesOf = (id) => ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) * 7) % 140 + 12

export const formatPrice = (p) => (p === 0 ? 'Pulsuz' : `${p.toLocaleString('en-US').replace(/,/g, ' ')} AZN`)


/* =========================================================
   Kateqoriya iyerarxiyası (mega-menyu üçün)
   ========================================================= */
export const DEPARTMENTS = [
  {
    id: 'qadin', photo: '/elanlar/yun-palto.jpg', label: 'Qadın', icon: 'User',
    groups: [
      { title: 'Geyim', cat: 'geyim', items: ['Palto və gödəkçə', 'Ceket və blazer', 'Köynək və bluz', 'Futbolka və top', 'Trikotaj', 'Hudi və sviterşot', 'Don', 'Ətək', 'Şalvar və cins', 'İdman geyimi'] },
      { title: 'Ayaqqabı', cat: 'ayaqqabi', items: ['Krossovka', 'Çəkmə', 'Hündürdaban', 'Balet və loafer', 'Səndəl'] },
      { title: 'Çanta', cat: 'canta', items: ['Əl çantası', 'Çiyin çantası', 'Bel çantası', 'Klatç'] },
      { title: 'Aksesuar', cat: 'aksesuar', items: ['Şərf', 'Kəmər', 'Eynək', 'Zərgərlik', 'Papaq və bere', 'Saat'] },
    ],
  },
  {
    id: 'kisi', photo: '/elanlar/deri-godekce.jpg', label: 'Kişi', icon: 'UserRound',
    groups: [
      { title: 'Geyim', cat: 'geyim', items: ['Palto və gödəkçə', 'Ceket və blazer', 'Kostyum', 'Köynək', 'Futbolka', 'Trikotaj', 'Hudi', 'Şalvar və cins'] },
      { title: 'Ayaqqabı', cat: 'ayaqqabi', items: ['Krossovka', 'Çəkmə', 'Klassik ayaqqabı'] },
      { title: 'Aksesuar', cat: 'aksesuar', items: ['Saat', 'Kəmər', 'Eynək', 'Çanta', 'Papaq'] },
    ],
  },
  {
    id: 'usaq', photo: '/elanlar/taxta-oyuncaq.jpg', label: 'Uşaq', icon: 'Baby',
    groups: [
      { title: 'Uşaq geyimi', cat: 'geyim', items: ['Körpə geyimi (0–2 yaş)', 'Uşaq geyimi (3–7 yaş)', 'Yeniyetmə (8+ yaş)'] },
      { title: 'Uşaq ayaqqabısı', cat: 'ayaqqabi', items: ['Uşaq ayaqqabısı'] },
      { title: 'Oyuncaqlar', cat: 'usaq', items: ['Taxta oyuncaq', 'Konstruktor', 'Yumşaq oyuncaq'] },
      { title: 'Uşaq kitabları', cat: 'kitab', items: ['Nağıllar', 'Təhsil kitabları'] },
    ],
  },
  {
    id: 'ev', photo: '/elanlar/kreslo.jpg', label: 'Ev və yaşam', icon: 'Sofa',
    groups: [
      { title: 'Mebel', cat: 'ev', items: ['Kreslo', 'Stul', 'Stol', 'Rəf'] },
      { title: 'Dekor', cat: 'ev', items: ['Vaza', 'Güzgü', 'Bitki', 'Tablo'] },
      { title: 'İşıqlandırma', cat: 'ev', items: ['Masa lampası', 'Döşəmə lampası'] },
    ],
  },
  {
    id: 'elektronika', photo: '/elanlar/fujifilm.jpg', label: 'Elektronika', icon: 'Smartphone',
    groups: [
      { title: 'Səs', cat: 'elektronika', items: ['Qulaqlıq', 'Kolonka'] },
      { title: 'Foto və video', cat: 'elektronika', items: ['Fotoaparat', 'Obyektiv'] },
      { title: 'Kompüter və telefon', cat: 'elektronika', items: ['Noutbuk', 'Planşet', 'Ağıllı saat'] },
    ],
  },
  {
    id: 'hobbi', photo: img('1485965120184-e220f721d03e', 600), label: 'Hobbi', icon: 'Bike',
    groups: [
      { title: 'İdman', cat: 'idman', items: ['Velosiped', 'Fitnes'] },
      { title: 'Musiqi', cat: 'idman', items: ['Gitara', 'Klavişli alətlər'] },
      { title: 'Kolleksiya', cat: 'kolleksiya', items: ['Retro fotoaparat', 'Vinil', 'Köhnə saat'] },
    ],
  },
  {
    id: 'kitab', photo: img('1544947950-fa07a98d237f', 600), label: 'Kitablar', icon: 'BookOpen',
    groups: [
      { title: 'Bədii ədəbiyyat', cat: 'kitab', items: ['Klassika', 'Roman', 'Poeziya'] },
      { title: 'Albom və incəsənət', cat: 'kitab', items: ['Foto albom', 'İncəsənət'] },
    ],
  },
]

export const deptById = (id) => DEPARTMENTS.find((d) => d.id === id)

// hər elanın bölməsi və alt-kateqoriyası
const META = {
  l1: ['elektronika', 'Fotoaparat'], l2: ['qadin', 'Palto və gödəkçə'], l3: ['ev', 'Vaza'], l4: ['elektronika', 'Qulaqlıq'],
  l5: ['ev', 'Kreslo'], l6: ['kitab', 'Klassika'], l7: ['qadin', 'Krossovka'], l8: ['hobbi', 'Gitara'],
  l9: ['hobbi', 'Retro fotoaparat'], l10: ['hobbi', 'Velosiped'], l11: ['usaq', 'Taxta oyuncaq'],
  l12: ['elektronika', 'Noutbuk'], l13: ['qadin', 'Köynək və bluz'], l14: ['ev', 'Bitki'],
  l15: ['ev', 'Masa lampası'], l16: ['elektronika', 'Ağıllı saat'], l17: ['qadin', 'Bel çantası'],
  l18: ['qadin', 'Palto və gödəkçə'], m1: ['elektronika', 'Qulaqlıq'], m2: ['kitab', 'Foto albom'], m3: ['ev', 'Güzgü'],
}

/* =========================================================
   İkinci şans — qüsurlu, amma atılmağa qıyılmayan əşyalar
   ========================================================= */
export const SECOND_CHANCE = [
  {
    id: 's1', title: 'Yun şərf — kənarı sökülüb', category: 'aksesuar', price: 0, condition: 'Təmir tələb edir',
    district: 'Nəsimi', modes: ['free'], seller: 'u2', posted: 'Bu gün', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Bir kənarında 5 sm-lik sökülmə var, qalan hissəsi tam salamatdır.',
    images: [img('1564019472667-e568a3c0cde5')],
    description: 'Nənəmin toxuduğu şərfdir. Atmağa qıymadım — toxumağı bacaran biri bir axşama düzəldər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's2', title: 'Taxta stul — ayağı laxlayır', category: 'ev', price: 0, condition: 'Təmir tələb edir',
    district: 'Yasamal', modes: ['free'], seller: 'u4', posted: 'Dünən', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Arxa sol ayağın birləşməsi boşalıb, yapışqan və sıxacla düzəlir.',
    images: [img('1550985543-63a7794e883f')],
    description: 'Möhkəm palıd taxtadır. Bir az yapışqan və səbrlə yenidən illərlə xidmət edər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's3', title: 'Qulaqlıq — sol tərəf işləmir', category: 'elektronika', price: 5, condition: 'Təmir tələb edir',
    district: 'Xətai', modes: ['free'], seller: 'u3', posted: '3 saat əvvəl', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Sol dinamikdən səs gəlmir, ehtimal ki kabel qırılıb. Yastıqları təzədir.',
    images: [img('1484704849700-f032a568e944')],
    description: 'Elektronika ilə məşğul olan biri üçün yaxşı layihə və ya ehtiyat hissə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 's4', title: 'Masa lampası — kabeli köhnəlib', category: 'ev', price: 0, condition: 'Təmir tələb edir',
    district: 'Səbail', modes: ['free'], seller: 'u4', posted: '2 gün əvvəl', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Kabelin izolyasiyası çatlayıb — yeni kabel və fiş lazımdır. Gövdə salamatdır.',
    images: [img('1645454720244-29f8e894f662')],
    description: 'Dizaynı çox gözəldir, sadəcə təhlükəsiz istifadə üçün kabeli dəyişmək lazımdır.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's5', title: 'Krossovka — altı yeyilib', category: 'ayaqqabi', price: 0, condition: 'Təmir tələb edir',
    district: 'Binəqədi', modes: ['free'], seller: 'u5', posted: 'Bu gün', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Daban hissəsi yeyilib, üst hissə yaxşı vəziyyətdədir. Ayaqqabı ustası üçün uyğundur.',
    images: [img('1616119547809-588a65fdc7e8')],
    description: '42 ölçü. Yeni altlıq qoyulsa, hələ çox gəzər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's6', title: 'Plyonka fotoaparatı — hissələr üçün', category: 'kolleksiya', price: 10, condition: 'Hissələr üçün',
    district: 'Nərimanov', modes: ['free'], seller: 'u1', posted: '4 gün əvvəl', aspect: 'square', repair: 'Hissələr üçün',
    defect: 'Çəkmə mexanizmi ilişib. Obyektiv və gövdə ehtiyat hissə kimi istifadə oluna bilər.',
    images: [img('1486574655068-162e94137442')],
    description: 'Kolleksiyaçı və ya təmirçi üçün — simvolik qiymətə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 's7', title: 'Ağıllı saat — ekranı çatlayıb', category: 'elektronika', price: 10, condition: 'Təmir tələb edir',
    district: 'Nizami', modes: ['free'], seller: 'u3', posted: 'Dünən', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Ekran şüşəsi çatlayıb, toxunma işləyir. Batareya yaxşı saxlayır.',
    images: [img('1719744755507-a4c856c57cf7')],
    description: 'Ekran şüşəsini dəyişsəniz, tam işlək saat olacaq.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's8', title: 'Dəri gödəkçə — astarı cırılıb', category: 'geyim', price: 0, condition: 'Təmir tələb edir',
    district: 'Yasamal', modes: ['free'], seller: 'u2', posted: '5 saat əvvəl', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'İç astarı qolun altında cırılıb, dəri hissəsi salamatdır. Dərzi 1 saata düzəldər.',
    images: ['/elanlar/deri-godekce-2.jpg'],
    description: 'M ölçü. Mənə artıq kiçikdir, amma atmaq olmaz.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
]

const SC_META = {
  s1: ['qadin', 'Şərf'], s2: ['ev', 'Stul'], s3: ['elektronika', 'Qulaqlıq'], s4: ['ev', 'Masa lampası'],
  s5: ['kisi', 'Krossovka'], s6: ['hobbi', 'Retro fotoaparat'], s7: ['elektronika', 'Ağıllı saat'], s8: ['kisi', 'Palto və gödəkçə'],
}

;[...LISTINGS, ...MY_ITEMS, ...SECOND_CHANCE].forEach((l) => {
  const m = META[l.id] || SC_META[l.id]
  if (m) {
    l.dept = m[0]
    l.sub = m[1]
  }
})
LISTINGS.push(...SECOND_CHANCE)

export const isSecondChance = (l) => l.modes.includes('free')

/* =========================================================
   Seçilmiş kolleksiyalar (redaksiya seçimi)
   ========================================================= */
export const CURATED = [
  { id: 'payiz', title: 'Payız qarderobu', text: 'Palto, gödəkçə, trikotaj və çəkmə — soyuq günlərə hazırlıq.', match: (l) => ['Palto və gödəkçə', 'Trikotaj', 'Çəkmə'].includes(l.sub) && !isSecondChance(l) },
  { id: 'deri', title: 'Dəri parçalar', text: 'İllərlə yumşalan, köhnəldikcə gözəlləşən dəri gödəkçə və çantalar.', match: (l) => isFashion(l) && /dəri/i.test(l.title) && !isSecondChance(l) },
  { id: 'cins', title: 'Cins hər şeydir', text: 'Mom jeans, klassik kəsim, tünd və açıq tonlar.', match: (l) => l.sub === 'Şalvar və cins' },
  { id: 'vintage', title: 'Vintage tapıntılar', text: 'Keçmişin ruhunu daşıyan, bu gün də gözəl görünən parçalar.', match: (l) => /vintage|retro|plyonka|mid-century|flanel|klassik/i.test(l.title) && !isSecondChance(l) },
  { id: 'ayaqqabi', title: 'Ayaqqabı rəfi', text: 'Krossovkadan çəkməyə — ölçünü tap, yola çıx.', match: (l) => l.category === 'ayaqqabi' && !isSecondChance(l) },
  { id: 'canta-aksesuar', title: 'Çanta və aksesuar', text: 'Görünüşü tamamlayan kiçik detallar.', match: (l) => ['canta', 'aksesuar'].includes(l.category) && !isSecondChance(l) },
  { id: 'ucuz', title: '30 AZN-dən aşağı', text: 'Kiçik büdcə, böyük qarderob.', match: (l) => isFashion(l) && l.price > 0 && l.price <= 30 },
  { id: 'deyis', title: 'Dəyişməyə hazır', text: 'Sahibləri pul əvəzinə başqa parça qəbul edir.', match: (l) => isFashion(l) && l.modes.includes('swap') },
  { id: 'ikinci-sans', title: 'Düzəlt və yaşat', text: 'Bir az iynə-sap və ya usta əli ilə yenidən həyata qayıdan əşyalar.', match: (l) => isSecondChance(l) },
  { id: 'minimalist-ev', title: 'Minimalist ev', text: 'Sadə xətlər, təbii materiallar, sakit rənglər.', match: (l) => l.category === 'ev' && !isSecondChance(l) },
  { id: 'texnologiya', title: 'Texnologiya sevənlər', text: 'Yaxşı işləyən, yarı qiymətə texnika.', match: (l) => l.category === 'elektronika' && !isSecondChance(l) },
  { id: 'kitab', title: 'Kitab həvəskarları', text: 'Rəflərdən rəflərə keçən hekayələr.', match: (l) => l.category === 'kitab' },
  { id: 'usaq', title: 'Kiçiklər üçün', text: 'Uşaqlar tez böyüyür — əşyalar isə yaxşı qalır.', match: (l) => l.category === 'usaq' || l.dept === 'usaq' },
]

export const curatedById = (id) => CURATED.find((c) => c.id === id)
