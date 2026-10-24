// Nümunə (demo) məlumatlar. Backend qoşulanda bunlar API-dən gələcək.
// Şəkillər Unsplash-dandır; açılmasa, kart zərif bir "placeholder" göstərir.

export const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const MODES = {
  sale: { label: 'Satış', short: 'Satış', tone: 'sale' },
  swap: { label: 'Dəyiş-düyüş', short: 'Dəyiş', tone: 'swap' },
  free: { label: 'İkinci şans', short: 'İkinci şans', tone: 'free' },
}

export const CONDITIONS = ['Yeni kimi', 'Çox yaxşı', 'Yaxşı', 'İstifadə olunub']
export const REPAIR_LEVELS = ['Kiçik təmir', 'Ciddi təmir', 'Hissələr üçün']

export const DISTRICTS = [
  'Nəsimi', 'Yasamal', 'Nərimanov', 'Səbail', 'Xətai', 'Binəqədi', 'Nizami', 'Xəzər',
]

export const CATEGORIES = [
  { id: 'geyim', label: 'Geyim', short: 'Geyim', icon: 'Shirt', photo: img('1434389677669-e08b4cac3105', 240) },
  { id: 'ayaqqabi', label: 'Ayaqqabı', short: 'Ayaqqabı', icon: 'Footprints', photo: img('1542291026-7eec264c27ff', 240) },
  { id: 'canta', label: 'Çanta', short: 'Çanta', icon: 'ShoppingBag', photo: img('1548036328-c9fa89d128fa', 240) },
  { id: 'ev', label: 'Ev əşyaları', short: 'Ev əşyaları', icon: 'Sofa', photo: img('1507473885765-e6ed057f782c', 240) },
  { id: 'elektronika', label: 'Elektronika', short: 'Elektronika', icon: 'Smartphone', photo: img('1505740420928-5e560c06d30e', 240) },
  { id: 'kitab', label: 'Kitab', short: 'Kitab', icon: 'BookOpen', photo: img('1544947950-fa07a98d237f', 240) },
  { id: 'usaq', label: 'Uşaq', short: 'Uşaq', icon: 'Baby', photo: img('1515488042361-ee00e0ddd4e4', 240) },
  { id: 'idman', label: 'İdman', short: 'İdman', icon: 'Bike', photo: img('1485965120184-e220f721d03e', 240) },
  { id: 'kolleksiya', label: 'Kolleksiya', short: 'Kolleksiya', icon: 'Gem', photo: img('1526170375885-4d8ecf77b99f', 240) },
  { id: 'diger', label: 'Digər', short: 'Digər', icon: 'Ellipsis', photo: img('1614594975525-e45190c55d0b', 240) },
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
    id: 'me', phone: '+994 50 412 33 18', whatsapp: true, contactPref: 'Mesaj', name: 'Sakina Pashayeva', handle: 'sakina', avatar: img('1494790108377-be9c29b29330', 300),
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
    id: 'l1', title: 'Fujifilm X-T20 fotoaparat', category: 'elektronika', price: 780, condition: 'Çox yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u1', posted: '2 saat əvvəl', aspect: 'tall',
    images: [img('1516035069371-29a1b244cc32'), img('1502920917128-1aa500764cbd'), img('1510127034890-ba27508e9f1c')],
    description: '15-45mm obyektivlə birlikdə. Ekranında cızıq yoxdur, batareya yaxşı saxlayır. Qutusu və şarj cihazı var.',
    story: 'İki il səyahətlərimdə yanımda olub. İndi telefonla çəkirəm, onun daha çox çəkiliş görməsini istəyirəm.',
    wants: ['elektronika', 'kitab'], wantsText: ['Qulaqlıq', 'Planşet', 'Fotoaparat aksesuarları', 'Təklifə açıqdır'],
    delivery: ['meet', 'courier'],
  },
  {
    id: 'l2', title: 'Vintage dəri gödəkçə', category: 'geyim', price: 120, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: [img('1551028719-00167b16eac5'), img('1521223890158-f9f7c3d5d504')],
    description: 'M ölçü, əsl dəri. Klassik kəsim, astarı təzə kimidir.',
    story: 'Nənəmin şkafından tapdığım ilk vintage parça idi.',
    wants: ['geyim', 'ev'], wantsText: ['Vintage çanta', 'Ev dekoru'], delivery: ['meet'],
  },
  {
    id: 'l3', title: 'Keramika vaza dəsti', category: 'ev', price: 45, condition: 'Yeni kimi',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: 'Dünən', aspect: 'square',
    images: [img('1578500494198-246f612d3b3d'), img('1612196808214-b8e1d6145a8c')],
    description: 'Əl işi, üç ölçüdə. Heç bir çat və ya qırıq yoxdur.',
    wants: ['ev', 'kitab'], wantsText: ['Kitab', 'Bitki', 'Təklifə açığam'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l4', title: 'Sony WH-1000XM4 qulaqlıq', category: 'elektronika', price: 260, condition: 'Çox yaxşı',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u3', posted: '5 saat əvvəl', aspect: 'square',
    images: [img('1505740420928-5e560c06d30e'), img('1484704849700-f032a568e944')],
    description: 'Səs-küy azaltma mükəmməl işləyir. Çantası və kabelləri ilə.',
    wants: ['elektronika', 'idman'], wantsText: ['Ağıllı saat', 'Velosiped aksesuarları'], delivery: ['meet'],
  },
  {
    id: 'l5', title: 'Velur kreslo — zeytun yaşılı', category: 'ev', price: 310, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u4', posted: '3 gün əvvəl', aspect: 'wide',
    images: [img('1567538096630-e0c55bd6374c'), img('1555041469-a586c61ea9bc')],
    description: 'Rahat, dayanıqlı. Köçdüyümüz üçün yer qalmayıb.',
    story: 'Bütün qış axşamlarımın kitab küncü idi.',
    wants: ['ev', 'kitab'], wantsText: ['Kitab rəfi', 'Döşəmə lampası'], delivery: ['meet'],
  },
  {
    id: 'l6', title: '12 kitablıq klassika kolleksiyası', category: 'kitab', price: 15, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: '1 saat əvvəl', aspect: 'tall',
    images: [img('1544947950-fa07a98d237f'), img('1532012197267-da84d127e765')],
    description: 'Dostoyevski, Tolstoy, Sabahattin Əli və başqaları. Simvolik qiymətə — sadəcə yaxşı oxucuya getsin.',
    story: 'Bu kitabları universitet illərində almışam. İndi kitabxanamı yeniləyirəm.',
    wants: ['kitab', 'usaq'], wantsText: ['Başqa kitablar', 'Uşaq kitabları'], delivery: ['meet'],
  },
  {
    id: 'l7', title: 'Nike Air Max 90', category: 'ayaqqabi', price: 95, condition: 'Çox yaxşı',
    district: 'Binəqədi', modes: ['sale', 'swap'], seller: 'u5', posted: 'Bu gün', aspect: 'square',
    images: [img('1542291026-7eec264c27ff'), img('1600185365483-26d7a4cc7519')],
    description: '42 ölçü, cəmi bir neçə dəfə geyinilib.',
    wants: ['ayaqqabi', 'idman'], wantsText: ['Başqa ölçü krossovka', 'Fitnes əşyaları'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l8', title: 'Akustik gitara Yamaha', category: 'idman', price: 180, condition: 'Yaxşı',
    district: 'Xəzər', modes: ['swap'], seller: 'u1', posted: '4 gün əvvəl', aspect: 'tall',
    images: [img('1510915361894-db8b60106cb1'), img('1525201548942-d8732f6617a0')],
    description: 'Simləri təzə dəyişilib. Futlyarı ilə birlikdə.',
    wants: ['elektronika', 'kitab'], wantsText: ['Qulaqlıq', 'Musiqi kitabları'], delivery: ['meet'],
  },
  {
    id: 'l9', title: 'Retro plyonka fotoaparatı', category: 'kolleksiya', price: 140, condition: 'Yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: 'Dünən', aspect: 'square',
    images: [img('1526170375885-4d8ecf77b99f'), img('1495121553079-4c61bcce1894')],
    description: '1970-ci illər. İşlək vəziyyətdədir, yeni plyonka ilə yoxlanılıb.',
    wants: ['kolleksiya', 'elektronika'], wantsText: ['Vinil plastinkalar', 'Köhnə saatlar'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l10', title: 'Şəhər velosipedi', category: 'idman', price: 220, condition: 'Yaxşı',
    district: 'Nərimanov', modes: ['sale', 'swap'], seller: 'u5', posted: '2 gün əvvəl', aspect: 'wide',
    images: [img('1485965120184-e220f721d03e'), img('1507035895480-2b3156c31fc8')],
    description: '28 təkər, 7 sürət. Təkərlər yenidir.',
    wants: ['elektronika', 'idman'], wantsText: ['Elektrik skuter', 'Qulaqlıq'], delivery: ['meet'],
  },
  {
    id: 'l11', title: 'Uşaq taxta oyuncaq dəsti', category: 'usaq', price: 20, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'u3', posted: '6 saat əvvəl', aspect: 'square',
    images: [img('1515488042361-ee00e0ddd4e4'), img('1558060370-d644479cb6f7')],
    description: 'Ekoloji taxtadan, 20+ hissə. Uşaqlar böyüdü — başqa balaca əllərə getsin.',
    wants: ['usaq', 'kitab'], wantsText: ['Uşaq kitabları', 'Konstruktor'], delivery: ['meet'],
  },
  {
    id: 'l12', title: 'MacBook Air M1', category: 'elektronika', price: 1150, condition: 'Çox yaxşı',
    district: 'Nəsimi', modes: ['sale'], seller: 'u1', posted: 'Bu gün', aspect: 'wide',
    images: [img('1517336714731-489689fd1ca8'), img('1611186871348-b1ce696e52c9')],
    description: '8GB / 256GB, batareya 91%. Qutusu ilə.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'l13', title: 'Kətan yay köynəyi', category: 'geyim', price: 35, condition: 'Yeni kimi',
    district: 'Xətai', modes: ['sale', 'swap'], seller: 'u2', posted: '3 saat əvvəl', aspect: 'tall',
    images: [img('1591047139829-d91aecb6caea'), img('1434389677669-e08b4cac3105')],
    description: 'S ölçü, etiketi üstündədir.',
    wants: ['geyim'], wantsText: ['Aksesuarlar'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l14', title: 'Monstera bitkisi və saksı', category: 'ev', price: 25, condition: 'Yeni kimi',
    district: 'Nizami', modes: ['sale', 'swap'], seller: 'u5', posted: 'Bu gün', aspect: 'tall',
    images: [img('1614594975525-e45190c55d0b'), img('1485955900006-10f4d324d411')],
    description: 'Çox böyüdü, evə sığmır. Qayğı ilə baxacaq birini axtarır.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'l15', title: 'Mid-century masa lampası', category: 'ev', price: 65, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: '1 gün əvvəl', aspect: 'square',
    images: [img('1507473885765-e6ed057f782c'), img('1513506003901-1e6a229e2d15')],
    description: 'Mis detallı, isti işıq. Lampası daxildir.',
    wants: ['ev', 'kolleksiya'], wantsText: ['Vinil', 'Keramika'], delivery: ['meet'],
  },
  {
    id: 'l16', title: 'Ağıllı saat', category: 'elektronika', price: 150, condition: 'Yaxşı',
    district: 'Binəqədi', modes: ['sale', 'swap'], seller: 'u3', posted: '2 gün əvvəl', aspect: 'square',
    images: [img('1523275335684-37898b6baf30'), img('1546868871-7041f2a55e12')],
    description: 'İki qayışla birlikdə. Ekran qoruyucusu var.',
    wants: ['elektronika'], wantsText: ['Qulaqlıq', 'Planşet'], delivery: ['meet', 'courier'],
  },
]

LISTINGS.splice(1, 0,
  {
    id: 'l17', title: 'Coach dəri çanta', category: 'canta', price: 120, condition: 'Çox yaxşı',
    district: 'Səbail', modes: ['sale', 'swap'], seller: 'u4', posted: '1 saat əvvəl', aspect: 'square',
    images: [img('1548036328-c9fa89d128fa'), img('1584917865442-de89df76afd3')],
    description: 'Orijinal, qəhvəyi dəri. Qoruyucu tozluğu ilə birlikdə.',
    story: 'Ad günümdə hədiyyə almışdım, indi daha kiçik çantalara keçmişəm.',
    wants: ['geyim', 'ayaqqabi'], wantsText: ['Palto', 'Çəkmə'], delivery: ['meet', 'courier'],
  },
  {
    id: 'l18', title: 'Yun palto — bej', category: 'geyim', price: 85, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['sale', 'swap'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: [img('1539533018447-63fcce2678e3'), img('1591047139829-d91aecb6caea')],
    description: 'M ölçü, isti və yüngül. Payız üçün ideal.',
    wants: ['geyim', 'canta'], wantsText: ['Çanta', 'Şərf', 'Çəkmə'], delivery: ['meet'],
  },
)

// "Mənim" dəyişməyə hazır əşyalarım (Dəyiş səhifəsi üçün)
export const MY_ITEMS = [
  {
    id: 'm1', title: 'Bose QC35 qulaqlıq', category: 'elektronika', price: 190, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['sale', 'swap'], seller: 'me', posted: '1 həftə əvvəl', aspect: 'square',
    images: [img('1583394838336-acd977736f90')],
    description: 'Səs-küy azaltma ilə. Qutusu var.',
    wants: ['elektronika', 'kolleksiya'], wantsText: ['Fotoaparat', 'Planşet'], delivery: ['meet'],
  },
  {
    id: 'm2', title: 'Fotoqrafiya kitabları (5 ədəd)', category: 'kitab', price: 70, condition: 'Yaxşı',
    district: 'Yasamal', modes: ['swap'], seller: 'me', posted: '3 gün əvvəl', aspect: 'tall',
    images: [img('1497633762265-9d179a990aa6')],
    description: 'Albom formatlı, sərt üzlük.',
    wants: ['elektronika', 'ev', 'idman'], wantsText: ['Fotoaparat aksesuarları', 'Lampa'], delivery: ['meet'],
  },
  {
    id: 'm3', title: 'Rattan güzgü', category: 'ev', price: 55, condition: 'Yeni kimi',
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
    id: 'qadin', photo: img('1490481651871-ab68de25d43d', 600), label: 'Qadın', icon: 'User',
    groups: [
      { title: 'Geyim', cat: 'geyim', items: ['Palto və gödəkçə', 'Köynək və bluz', 'Ətək və şalvar', 'Trikotaj'] },
      { title: 'Ayaqqabı', cat: 'ayaqqabi', items: ['Krossovka', 'Çəkmə', 'Klassik ayaqqabı'] },
      { title: 'Çanta və aksesuar', cat: 'canta', items: ['Əl çantası', 'Sırt çantası', 'Şərf', 'Saat'] },
    ],
  },
  {
    id: 'kisi', photo: img('1551028719-00167b16eac5', 600), label: 'Kişi', icon: 'UserRound',
    groups: [
      { title: 'Geyim', cat: 'geyim', items: ['Gödəkçə', 'Köynək', 'Şalvar'] },
      { title: 'Ayaqqabı', cat: 'ayaqqabi', items: ['Krossovka', 'Klassik ayaqqabı'] },
      { title: 'Aksesuar', cat: 'canta', items: ['Saat', 'Çanta', 'Kəmər'] },
    ],
  },
  {
    id: 'usaq', photo: img('1515488042361-ee00e0ddd4e4', 600), label: 'Uşaq', icon: 'Baby',
    groups: [
      { title: 'Oyuncaqlar', cat: 'usaq', items: ['Taxta oyuncaq', 'Konstruktor', 'Yumşaq oyuncaq'] },
      { title: 'Uşaq geyimi', cat: 'usaq', items: ['0–2 yaş', '3–7 yaş', '8+ yaş'] },
      { title: 'Uşaq kitabları', cat: 'kitab', items: ['Nağıllar', 'Təhsil kitabları'] },
    ],
  },
  {
    id: 'ev', photo: img('1586023492125-27b2c045efd7', 600), label: 'Ev və yaşam', icon: 'Sofa',
    groups: [
      { title: 'Mebel', cat: 'ev', items: ['Kreslo', 'Stul', 'Stol', 'Rəf'] },
      { title: 'Dekor', cat: 'ev', items: ['Vaza', 'Güzgü', 'Bitki', 'Tablo'] },
      { title: 'İşıqlandırma', cat: 'ev', items: ['Masa lampası', 'Döşəmə lampası'] },
    ],
  },
  {
    id: 'elektronika', photo: img('1505740420928-5e560c06d30e', 600), label: 'Elektronika', icon: 'Smartphone',
    groups: [
      { title: 'Səs', cat: 'elektronika', items: ['Qulaqlıq', 'Kolonka'] },
      { title: 'Foto və video', cat: 'elektronika', items: ['Fotoaparat', 'Obyektiv'] },
      { title: 'Kompüter və telefon', cat: 'elektronika', items: ['Noutbuk', 'Planşet', 'Ağıllı saat'] },
    ],
  },
  {
    id: 'hobbi', photo: img('1485965120184-e220f721d03e', 600), label: 'İdman və hobbi', icon: 'Bike',
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
  l1: ['elektronika', 'Fotoaparat'], l2: ['kisi', 'Gödəkçə'], l3: ['ev', 'Vaza'], l4: ['elektronika', 'Qulaqlıq'],
  l5: ['ev', 'Kreslo'], l6: ['kitab', 'Klassika'], l7: ['kisi', 'Krossovka'], l8: ['hobbi', 'Gitara'],
  l9: ['hobbi', 'Retro fotoaparat'], l10: ['hobbi', 'Velosiped'], l11: ['usaq', 'Taxta oyuncaq'],
  l12: ['elektronika', 'Noutbuk'], l13: ['qadin', 'Köynək və bluz'], l14: ['ev', 'Bitki'],
  l15: ['ev', 'Masa lampası'], l16: ['elektronika', 'Ağıllı saat'], l17: ['qadin', 'Əl çantası'],
  l18: ['qadin', 'Palto və gödəkçə'], m1: ['elektronika', 'Qulaqlıq'], m2: ['kitab', 'Foto albom'], m3: ['ev', 'Güzgü'],
}

/* =========================================================
   İkinci şans — qüsurlu, amma atılmağa qıyılmayan əşyalar
   ========================================================= */
export const SECOND_CHANCE = [
  {
    id: 's1', title: 'Yun şərf — kənarı sökülüb', category: 'canta', price: 0, condition: 'Təmir tələb edir',
    district: 'Nəsimi', modes: ['free'], seller: 'u2', posted: 'Bu gün', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Bir kənarında 5 sm-lik sökülmə var, qalan hissəsi tam salamatdır.',
    images: [img('1520903920243-00d872a2d1c9')],
    description: 'Nənəmin toxuduğu şərfdir. Atmağa qıymadım — toxumağı bacaran biri bir axşama düzəldər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's2', title: 'Taxta stul — ayağı laxlayır', category: 'ev', price: 0, condition: 'Təmir tələb edir',
    district: 'Yasamal', modes: ['free'], seller: 'u4', posted: 'Dünən', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Arxa sol ayağın birləşməsi boşalıb, yapışqan və sıxacla düzəlir.',
    images: [img('1503602642458-232111445657')],
    description: 'Möhkəm palıd taxtadır. Bir az yapışqan və səbrlə yenidən illərlə xidmət edər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's3', title: 'Qulaqlıq — sol tərəf işləmir', category: 'elektronika', price: 5, condition: 'Təmir tələb edir',
    district: 'Xətai', modes: ['free'], seller: 'u3', posted: '3 saat əvvəl', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Sol dinamikdən səs gəlmir, ehtimal ki kabel qırılıb. Yastıqları təzədir.',
    images: [img('1505740420928-5e560c06d30e')],
    description: 'Elektronika ilə məşğul olan biri üçün yaxşı layihə və ya ehtiyat hissə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 's4', title: 'Masa lampası — kabeli köhnəlib', category: 'ev', price: 0, condition: 'Təmir tələb edir',
    district: 'Səbail', modes: ['free'], seller: 'u4', posted: '2 gün əvvəl', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'Kabelin izolyasiyası çatlayıb — yeni kabel və fiş lazımdır. Gövdə salamatdır.',
    images: [img('1507473885765-e6ed057f782c')],
    description: 'Dizaynı çox gözəldir, sadəcə təhlükəsiz istifadə üçün kabeli dəyişmək lazımdır.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's5', title: 'Krossovka — altı yeyilib', category: 'ayaqqabi', price: 0, condition: 'Təmir tələb edir',
    district: 'Binəqədi', modes: ['free'], seller: 'u5', posted: 'Bu gün', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Daban hissəsi yeyilib, üst hissə yaxşı vəziyyətdədir. Ayaqqabı ustası üçün uyğundur.',
    images: [img('1542291026-7eec264c27ff')],
    description: '42 ölçü. Yeni altlıq qoyulsa, hələ çox gəzər.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's6', title: 'Plyonka fotoaparatı — hissələr üçün', category: 'kolleksiya', price: 10, condition: 'Hissələr üçün',
    district: 'Nərimanov', modes: ['free'], seller: 'u1', posted: '4 gün əvvəl', aspect: 'square', repair: 'Hissələr üçün',
    defect: 'Çəkmə mexanizmi ilişib. Obyektiv və gövdə ehtiyat hissə kimi istifadə oluna bilər.',
    images: [img('1526170375885-4d8ecf77b99f')],
    description: 'Kolleksiyaçı və ya təmirçi üçün — simvolik qiymətə.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
  },
  {
    id: 's7', title: 'Ağıllı saat — ekranı çatlayıb', category: 'elektronika', price: 10, condition: 'Təmir tələb edir',
    district: 'Nizami', modes: ['free'], seller: 'u3', posted: 'Dünən', aspect: 'square', repair: 'Ciddi təmir',
    defect: 'Ekran şüşəsi çatlayıb, toxunma işləyir. Batareya yaxşı saxlayır.',
    images: [img('1523275335684-37898b6baf30')],
    description: 'Ekran şüşəsini dəyişsəniz, tam işlək saat olacaq.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 's8', title: 'Dəri gödəkçə — astarı cırılıb', category: 'geyim', price: 0, condition: 'Təmir tələb edir',
    district: 'Yasamal', modes: ['free'], seller: 'u2', posted: '5 saat əvvəl', aspect: 'square', repair: 'Kiçik təmir',
    defect: 'İç astarı qolun altında cırılıb, dəri hissəsi salamatdır. Dərzi 1 saata düzəldər.',
    images: [img('1551028719-00167b16eac5')],
    description: 'M ölçü. Mənə artıq kiçikdir, amma atmaq olmaz.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
]

const SC_META = {
  s1: ['qadin', 'Şərf'], s2: ['ev', 'Stul'], s3: ['elektronika', 'Qulaqlıq'], s4: ['ev', 'Masa lampası'],
  s5: ['kisi', 'Krossovka'], s6: ['hobbi', 'Retro fotoaparat'], s7: ['elektronika', 'Ağıllı saat'], s8: ['kisi', 'Gödəkçə'],
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
  { id: 'minimalist-ev', title: 'Minimalist ev', text: 'Sadə xətlər, təbii materiallar, sakit rənglər.', match: (l) => l.category === 'ev' && !isSecondChance(l) },
  { id: 'vintage', title: 'Vintage tapıntılar', text: 'Keçmişin ruhunu daşıyan, bu gün də gözəl olan əşyalar.', match: (l) => /vintage|retro|plyonka|mid-century/i.test(l.title) && !isSecondChance(l) },
  { id: 'payiz', title: 'Payız qarderobu', text: 'Palto, gödəkçə və isti parçalar — yeni mövsümə hazırlıq.', match: (l) => ['geyim', 'canta'].includes(l.category) && !isSecondChance(l) },
  { id: 'ucuz', title: '50 AZN-dən aşağı', text: 'Kiçik büdcə, böyük sevinc.', match: (l) => l.price > 0 && l.price <= 50 },
  { id: 'kitab', title: 'Kitab həvəskarları', text: 'Rəflərdən rəflərə keçən hekayələr.', match: (l) => l.category === 'kitab' },
  { id: 'texnologiya', title: 'Texnologiya sevənlər', text: 'Yaxşı işləyən, yarı qiymətə texnika.', match: (l) => l.category === 'elektronika' && !isSecondChance(l) },
  { id: 'telebe', title: 'Tələbə evi üçün', text: 'İlk ev üçün lazım olan hər şey, sərfəli qiymətə.', match: (l) => ['ev', 'kitab'].includes(l.category) && l.price <= 100 && !isSecondChance(l) },
  { id: 'seyahet', title: 'Səyahət yoldaşları', text: 'Fotoaparat, çanta, qulaqlıq — yola çıxmağa hazır.', match: (l) => ['Fotoaparat', 'Qulaqlıq', 'Əl çantası', 'Retro fotoaparat'].includes(l.sub) && !isSecondChance(l) },
  { id: 'aktiv', title: 'Aktiv həyat', text: 'Velosiped, musiqi və hobbi üçün.', match: (l) => ['idman'].includes(l.category) },
  { id: 'usaq', title: 'Kiçiklər üçün', text: 'Uşaqlar tez böyüyür — əşyalar isə yaxşı qalır.', match: (l) => l.category === 'usaq' || l.dept === 'usaq' },
  { id: 'deyis', title: 'Dəyişməyə hazır', text: 'Sahibləri pul əvəzinə başqa əşya qəbul edir.', match: (l) => l.modes.includes('swap') },
  { id: 'ikinci-sans', title: 'Düzəlt və yaşat', text: 'Bir az əl işi ilə yenidən həyata qayıdan əşyalar.', match: (l) => isSecondChance(l) },
]

export const curatedById = (id) => CURATED.find((c) => c.id === id)
