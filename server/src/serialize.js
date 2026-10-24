// Bazadakı sətirləri frontend-in gözlədiyi formaya çevirir.

const json = (v, fallback) => {
  try {
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

// "2 saat əvvəl", "Dünən", "3 gün əvvəl" kimi
export function relativeTime(iso, now = Date.now()) {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  const sec = Math.max(0, Math.floor((now - t) / 1000))
  if (sec < 60) return 'İndicə'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} dəqiqə əvvəl`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} saat əvvəl`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Dünən'
  if (days < 7) return `${days} gün əvvəl`
  if (days < 30) return `${Math.floor(days / 7)} həftə əvvəl`
  const d = new Date(t)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export const monthYear = (iso) => {
  const d = new Date(iso)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function serializeListing(row, extra = {}) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    dept: row.dept,
    sub: row.sub,
    price: row.price,
    condition: row.condition,
    district: row.district,
    modes: json(row.modes, []),
    seller: row.owner_id,
    images: json(row.images, []),
    description: row.description,
    story: row.story || undefined,
    wants: json(row.wants, []),
    wantsText: json(row.wants_text, []),
    delivery: json(row.delivery, ['meet']),
    defect: row.defect || undefined,
    repair: row.repair || undefined,
    aspect: row.aspect,
    status: row.status,
    likes: (row.likes_base || 0) + (row.fav_count || 0),
    posted: relativeTime(row.created_at),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...extra,
  }
}

// Başqalarına görünən profil (telefon yalnız icazə varsa)
export function serializePublicUser(row, stats = {}) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    bio: row.bio,
    district: row.district,
    phone: row.show_phone ? row.phone : null,
    whatsapp: Boolean(row.whatsapp),
    contactPref: row.contact_pref,
    delivery: json(row.delivery, ['meet']),
    verified: Boolean(row.verified),
    fastReply: Boolean(row.fast_reply),
    joined: monthYear(row.created_at),
    rating: stats.rating ?? null,
    reviews: stats.reviews ?? 0,
  }
}

// Sahibin özünə görünən profil
export function serializeMe(row, stats = {}) {
  return {
    ...serializePublicUser(row, stats),
    email: row.email,
    phone: row.phone,
    showPhone: Boolean(row.show_phone),
  }
}

export function serializeOffer(row) {
  return {
    id: row.id,
    from: row.from_user_id,
    to: row.to_user_id,
    targetId: row.target_listing_id,
    offeredId: row.offered_listing_id,
    cash: row.cash,
    note: row.note,
    status: row.status,
    created: relativeTime(row.created_at),
    createdAt: row.created_at,
  }
}

export function serializeMessage(row, meId) {
  return {
    id: row.id,
    from: row.sender_id === meId ? 'me' : row.sender_id,
    senderId: row.sender_id,
    text: row.text,
    time: relativeTime(row.created_at),
    createdAt: row.created_at,
    read: Boolean(row.read_at),
  }
}

export function serializeCollection(row, items) {
  return {
    id: row.id,
    owner: row.owner_id,
    title: row.title,
    text: row.text,
    isPublic: Boolean(row.is_public),
    items,
    createdAt: row.created_at,
  }
}

export function serializeReview(row) {
  return {
    id: row.id,
    from: row.author_id,
    to: row.target_id,
    stars: row.stars,
    text: row.text,
    when: monthYear(row.created_at),
    createdAt: row.created_at,
  }
}
