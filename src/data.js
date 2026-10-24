// Nümunə (demo) məlumatlar. Backend qoşulanda bunlar API-dən gələcək.
// Şəkillər Unsplash-dandır; açılmasa, kart zərif bir "placeholder" göstərir.

export const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const MODES = {
  sale: { label: 'Satış', short: 'Satış', tone: 'sale' },
  swap: { label: 'Dəyiş-düyüş', short: 'Dəyiş', tone: 'swap' },
  free: { label: 'Pulsuz', short: 'Hədiyyə', tone: 'free' },
}

export const CONDITIONS = ['Yeni kimi', 'Çox yaxşı', 'Yaxşı', 'İstifadə olunub']

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

export const HOME_COLLECTIONS = [
  { title: 'Minimalist ev', image: img('1524758631624-e2822e304c36', 700), to: '/kesf?cat=ev', match: (l) => l.category === 'ev' },
  { title: 'Vintage tapıntılar', image: img('1526170375885-4d8ecf77b99f', 700), to: '/kesf?q=vintage', match: (l) => /vintage|retro/i.test(l.title) },
  { title: 'Payız kolleksiyası', image: img('1591047139829-d91aecb6caea', 700), to: '/kesf?cat=geyim', match: (l) => l.category === 'geyim' },
  { title: 'Eko seçimlər', image: img('1614594975525-e45190c55d0b', 700), to: '/kesf?mode=free', match: (l) => l.modes.includes('free') },
  { title: '50 AZN-dən aşağı', image: img('1542291026-7eec264c27ff', 700), to: '/kesf?price=0-50', match: (l) => l.price <= 50 },
  { title: 'Kitab həvəskarları', image: img('1512820790803-83ca734da794', 700), to: '/kesf?cat=kitab', match: (l) => l.category === 'kitab' },
]

export const catById = (id) => CATEGORIES.find((c) => c.id === id)

export const USERS = {
  me: {
    id: 'me', name: 'Nərmin Əliyeva', handle: 'nermin', avatar: img('1494790108377-be9c29b29330', 300),
    district: 'Yasamal', joined: 'Mart 2026', rating: 4.9, reviews: 23, verified: true, fastReply: true,
    bio: 'Minimalist yaşamağa çalışıram — sevdiyim əşyaların yeni sahiblərini tapıram.',
  },
  u1: { id: 'u1', name: 'Rəşad Məmmədov', handle: 'reshad', avatar: img('1500648767791-00dcc994a43e', 300), district: 'Nərimanov', joined: 'Yanvar 2026', rating: 4.8, reviews: 41, verified: true, fastReply: true },
  u2: { id: 'u2', name: 'Leyla Həsənli', handle: 'leyla', avatar: img('1438761681033-6461ffad8d80', 300), district: 'Nəsimi', joined: 'Fevral 2026', rating: 5.0, reviews: 17, verified: true, fastReply: false },
  u3: { id: 'u3', name: 'Elvin Quliyev', handle: 'elvin', avatar: img('1507003211169-0a1dd7228f2d', 300), district: 'Xətai', joined: 'Aprel 2026', rating: 4.7, reviews: 9, verified: false, fastReply: true },
  u4: { id: 'u4', name: 'Aytən Kərimova', handle: 'ayten', avatar: img('1544005313-94ddf0286df2', 300), district: 'Səbail', joined: 'May 2026', rating: 4.9, reviews: 32, verified: true, fastReply: true },
  u5: { id: 'u5', name: 'Murad Rzayev', handle: 'murad', avatar: img('1506794778202-cad84cf45f1d', 300), district: 'Binəqədi', joined: 'İyun 2026', rating: 4.6, reviews: 12, verified: true, fastReply: false },
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
    district: 'Səbail', modes: ['sale'], seller: 'u4', posted: 'Dünən', aspect: 'square',
    images: [img('1578500494198-246f612d3b3d'), img('1612196808214-b8e1d6145a8c')],
    description: 'Əl işi, üç ölçüdə. Heç bir çat və ya qırıq yoxdur.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
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
    id: 'l6', title: '12 kitablıq klassika kolleksiyası', category: 'kitab', price: 0, condition: 'Yaxşı',
    district: 'Nəsimi', modes: ['free'], seller: 'u2', posted: '1 saat əvvəl', aspect: 'tall',
    images: [img('1544947950-fa07a98d237f'), img('1532012197267-da84d127e765')],
    description: 'Dostoyevski, Tolstoy, Sabahattin Əli və başqaları. Pulsuz — sadəcə yaxşı oxucuya getsin.',
    story: 'Bu kitabları universitet illərində almışam. İndi kitabxanamı yeniləyirəm.',
    wants: [], wantsText: [], delivery: ['meet'],
  },
  {
    id: 'l7', title: 'Nike Air Max 90', category: 'ayaqqabi', price: 95, condition: 'Çox yaxşı',
    district: 'Binəqədi', modes: ['sale'], seller: 'u5', posted: 'Bu gün', aspect: 'square',
    images: [img('1542291026-7eec264c27ff'), img('1600185365483-26d7a4cc7519')],
    description: '42 ölçü, cəmi bir neçə dəfə geyinilib.',
    wants: [], wantsText: [], delivery: ['meet', 'courier'],
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
    id: 'l11', title: 'Uşaq taxta oyuncaq dəsti', category: 'usaq', price: 0, condition: 'Çox yaxşı',
    district: 'Yasamal', modes: ['free'], seller: 'u3', posted: '6 saat əvvəl', aspect: 'square',
    images: [img('1515488042361-ee00e0ddd4e4'), img('1558060370-d644479cb6f7')],
    description: 'Ekoloji taxtadan, 20+ hissə. Uşaqlar böyüdü — başqa balaca əllərə getsin.',
    wants: [], wantsText: [], delivery: ['meet'],
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
    id: 'l14', title: 'Monstera bitkisi və saksı', category: 'ev', price: 0, condition: 'Yeni kimi',
    district: 'Nizami', modes: ['free'], seller: 'u5', posted: 'Bu gün', aspect: 'tall',
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
    district: 'Nəsimi', modes: ['sale'], seller: 'u2', posted: 'Bu gün', aspect: 'tall',
    images: [img('1539533018447-63fcce2678e3'), img('1591047139829-d91aecb6caea')],
    description: 'M ölçü, isti və yüngül. Payız üçün ideal.',
    wants: [], wantsText: [], delivery: ['meet'],
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
