import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api, fetchAllListings, getToken, setToken } from './api'

const AppContext = createContext(null)

// Bütün məlumat backend-dən gəlir. Bu fayl həm yaddaşı (state), həm də
// serverə gedən əməliyyatları bir yerdə saxlayır.
export function AppProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [ready, setReady] = useState(false) // ilk yükləmə bitdi
  const [loadError, setLoadError] = useState('') // server açılmadısa
  const [me, setMe] = useState(null)
  const [listings, setListings] = useState([]) // başqalarının aktiv elanları
  const [myItems, setMyItems] = useState([]) // mənim bütün elanlarım
  const [favorites, setFavorites] = useState([]) // bəyəndiyim elanların id-ləri
  const [users, setUsers] = useState({}) // id → qısa profil
  const [incomingOffers, setIncoming] = useState([])
  const [outgoingOffers, setOutgoing] = useState([])
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({}) // söhbət id → mesajlar
  const [userCollections, setUserCollections] = useState([])
  const [myReviews, setMyReviews] = useState([])
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const usersRef = useRef(users)
  usersRef.current = users

  const notify = useCallback((message, tone = 'default') => {
    clearTimeout(timer.current)
    setToast({ message, tone, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const fail = useCallback((e) => notify(e?.message || 'Xəta baş verdi'), [notify])

  /* ---------------- istifadəçi profilləri ---------------- */

  const rememberUsers = useCallback((list) => {
    const valid = list.filter(Boolean)
    if (!valid.length) return
    setUsers((u) => ({ ...u, ...Object.fromEntries(valid.map((x) => [x.id, x])) }))
  }, [])

  const ensureUsers = useCallback(
    async (ids) => {
      const missing = [...new Set(ids.filter((id) => id && !usersRef.current[id]))]
      if (!missing.length) return
      try {
        rememberUsers(await api(`/users?ids=${missing.map(encodeURIComponent).join(',')}`))
      } catch {
        /* profil gəlməsə də səhifə işləyir */
      }
    },
    [rememberUsers],
  )

  /* ---------------- yükləmə ---------------- */

  const loadPrivate = useCallback(async () => {
    const [meData, mine, favs, offers, convs, colls, reviews] = await Promise.all([
      api('/me'),
      api('/me/listings'),
      api('/me/favorites'),
      api('/offers'),
      api('/conversations'),
      api('/collections?mine=1'),
      api('/me/reviews'),
    ])
    setMe(meData)
    rememberUsers([meData, ...convs.map((c) => c.withUser)])
    setMyItems(mine)
    setFavorites(favs.map((l) => l.id))
    setIncoming(offers.incoming)
    setOutgoing(offers.outgoing)
    setConversations(convs)
    setUserCollections(colls)
    setMyReviews(reviews)
    ensureUsers([...offers.incoming.map((o) => o.from), ...offers.outgoing.map((o) => o.to), ...reviews.map((r) => r.from)])
    return meData
  }, [ensureUsers, rememberUsers])

  const loadListings = useCallback(
    async (meId) => {
      const all = await fetchAllListings()
      setListings(all.filter((l) => l.seller !== meId))
      ensureUsers(all.map((l) => l.seller))
    },
    [ensureUsers],
  )

  const clearPrivate = useCallback(() => {
    setMe(null)
    setMyItems([])
    setFavorites([])
    setIncoming([])
    setOutgoing([])
    setConversations([])
    setMessages({})
    setUserCollections([])
    setMyReviews([])
  }, [])

  const loadAll = useCallback(async () => {
    setLoadError('')
    try {
      let meId = null
      if (getToken()) {
        try {
          meId = (await loadPrivate()).id
        } catch (e) {
          if (e.status !== 401) throw e
          clearPrivate() // token köhnədir — qonaq kimi davam
        }
      }
      await loadListings(meId)
      setReady(true)
    } catch (e) {
      setLoadError(e.message || 'Serverə qoşulmaq olmadı')
    }
  }, [loadPrivate, loadListings, clearPrivate])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  /* ---------------- giriş ---------------- */

  const afterAuth = useCallback(
    async ({ token }) => {
      setToken(token)
      const meData = await loadPrivate()
      await loadListings(meData.id)
      return meData
    },
    [loadPrivate, loadListings],
  )

  const login = useCallback((email, password) => api('/auth/login', { method: 'POST', body: { email, password } }).then(afterAuth), [afterAuth])

  const register = useCallback((data) => api('/auth/register', { method: 'POST', body: data }).then(afterAuth), [afterAuth])

  const logout = useCallback(async () => {
    setToken(null)
    clearPrivate()
    await loadListings(null).catch(() => {})
    notify('Hesabdan çıxdın')
    navigate('/')
  }, [clearPrivate, loadListings, navigate, notify])

  // Giriş tələb edən əməliyyatlardan əvvəl: girməyibsə giriş səhifəsinə apar
  const requireAuth = useCallback(() => {
    if (me) return true
    notify('Bunun üçün hesabına daxil ol')
    navigate(`/giris?next=${encodeURIComponent(location.pathname + location.search)}`)
    return false
  }, [me, navigate, notify, location])

  /* ---------------- elanlar ---------------- */

  const allItems = useMemo(() => [...myItems, ...listings], [myItems, listings])
  const getItem = useCallback((id) => allItems.find((l) => l.id === id), [allItems])

  const replaceItem = useCallback((item) => {
    setMyItems((m) => m.map((it) => (it.id === item.id ? item : it)))
    setListings((ls) => ls.map((it) => (it.id === item.id ? item : it)))
  }, [])

  const addListing = useCallback(async (input) => {
    const created = await api('/listings', { method: 'POST', body: input })
    setMyItems((m) => [created, ...m])
    return created
  }, [])

  const updateItem = useCallback(
    async (id, patch) => {
      try {
        replaceItem(await api(`/listings/${id}`, { method: 'PATCH', body: patch }))
        return true
      } catch (e) {
        fail(e)
        return false
      }
    },
    [replaceItem, fail],
  )

  const removeItem = useCallback(
    async (id) => {
      try {
        await api(`/listings/${id}`, { method: 'DELETE' })
        setMyItems((m) => m.filter((it) => it.id !== id))
        return true
      } catch (e) {
        fail(e)
        return false
      }
    },
    [fail],
  )

  /* ---------------- bəyənmələr ---------------- */

  const bumpLikes = useCallback((id, delta) => {
    const bump = (list) => list.map((it) => (it.id === id ? { ...it, likes: (it.likes || 0) + delta } : it))
    setListings(bump)
    setMyItems(bump)
  }, [])

  const toggleFavorite = useCallback(
    async (id) => {
      if (!requireAuth()) return
      const has = favorites.includes(id)
      setFavorites((f) => (has ? f.filter((x) => x !== id) : [...f, id]))
      bumpLikes(id, has ? -1 : 1)
      notify(has ? 'Seçilmişlərdən çıxarıldı' : 'Seçilmişlərə əlavə edildi ♡')
      try {
        await api(`/listings/${id}/favorite`, { method: has ? 'DELETE' : 'POST' })
      } catch (e) {
        setFavorites((f) => (has ? [...f, id] : f.filter((x) => x !== id)))
        bumpLikes(id, has ? 1 : -1)
        fail(e)
      }
    },
    [favorites, requireAuth, bumpLikes, notify, fail],
  )

  /* ---------------- profil ---------------- */

  const profile = useMemo(
    () => ({
      phone: me?.phone || '',
      whatsapp: me?.whatsapp ?? false,
      showPhone: me?.showPhone ?? true,
      pref: me?.contactPref || 'Mesaj',
      district: me?.district || '',
      delivery: me?.delivery || ['meet'],
    }),
    [me],
  )

  const updateMe = useCallback(
    async (patch) => {
      const fresh = await api('/me', { method: 'PATCH', body: patch })
      setMe(fresh)
      rememberUsers([fresh])
      return fresh
    },
    [rememberUsers],
  )

  // Paylaşdıqlarım-dakı əlaqə redaktoru bu formanı göndərir
  const setProfile = useCallback(
    (v) =>
      updateMe({ phone: v.phone, whatsapp: v.whatsapp, showPhone: v.showPhone, contactPref: v.pref, district: v.district, delivery: v.delivery }).catch(fail),
    [updateMe, fail],
  )

  const changePassword = useCallback(
    (currentPassword, newPassword) => api('/me/password', { method: 'POST', body: { currentPassword, newPassword } }),
    [],
  )

  /* ---------------- dəyiş təklifləri ---------------- */

  const sendOffer = useCallback(
    async ({ targetId, myItemId, cash, note }) => {
      try {
        const offer = await api('/offers', { method: 'POST', body: { targetId, offeredId: myItemId, cash, note } })
        setOutgoing((o) => [offer, ...o])
        notify('Dəyiş təklifi göndərildi ✦', 'lime')
        return true
      } catch (e) {
        fail(e)
        return false
      }
    },
    [notify, fail],
  )

  const respondOffer = useCallback(
    async (id, status) => {
      try {
        const offer = await api(`/offers/${id}`, { method: 'PATCH', body: { status } })
        const swap = (list) => list.map((o) => (o.id === id ? offer : o))
        setIncoming(swap)
        setOutgoing(swap)
        if (status === 'accepted') {
          // əşyalar "satıldı" oldu, digər təkliflər bağlandı — təzələ
          const [mine, offers] = await Promise.all([api('/me/listings'), api('/offers')])
          setMyItems(mine)
          setIncoming(offers.incoming)
          setOutgoing(offers.outgoing)
          loadListings(me?.id)
        }
        return offer
      } catch (e) {
        fail(e)
        return null
      }
    },
    [fail, loadListings, me],
  )

  /* ---------------- mesajlar ---------------- */

  const upsertConversation = useCallback(
    (conv) => {
      rememberUsers([conv.withUser])
      setConversations((cs) => [conv, ...cs.filter((c) => c.id !== conv.id)])
    },
    [rememberUsers],
  )

  const openConversation = useCallback(async (id) => {
    try {
      const data = await api(`/conversations/${id}/messages`)
      setMessages((m) => ({ ...m, [id]: data.messages }))
      setConversations((cs) => cs.map((c) => (c.id === id ? { ...data.conversation, unread: 0 } : c)))
    } catch (e) {
      fail(e)
    }
  }, [fail])

  // Elan sahibinə ilk mesaj (və ya mövcud söhbətə əlavə). Söhbət id-sini qaytarır.
  const startConversation = useCallback(
    async (_sellerId, listingId, text) => {
      if (!requireAuth()) return null
      try {
        const conv = await api('/conversations', { method: 'POST', body: { listingId, text } })
        upsertConversation(conv)
        setMessages((m) => {
          const copy = { ...m }
          delete copy[conv.id] // açılanda təzədən yüklənsin
          return copy
        })
        return conv.id
      } catch (e) {
        fail(e)
        return null
      }
    },
    [requireAuth, upsertConversation, fail],
  )

  const sendMessage = useCallback(
    async (convId, text) => {
      try {
        const msg = await api(`/conversations/${convId}/messages`, { method: 'POST', body: { text } })
        setMessages((m) => ({ ...m, [convId]: [...(m[convId] || []), msg] }))
        setConversations((cs) => {
          const c = cs.find((x) => x.id === convId)
          return c ? [{ ...c, lastMessage: msg, updatedAt: msg.createdAt }, ...cs.filter((x) => x.id !== convId)] : cs
        })
      } catch (e) {
        fail(e)
      }
    },
    [fail],
  )

  /* ---------------- kolleksiyalar ---------------- */

  const addCollection = useCallback(
    async ({ title, text, items, isPublic }) => {
      if (!requireAuth()) return null
      try {
        const created = await api('/collections', { method: 'POST', body: { title, text, items, isPublic } })
        setUserCollections((list) => [created, ...list])
        return created
      } catch (e) {
        fail(e)
        return null
      }
    },
    [requireAuth, fail],
  )

  const toggleInCollection = useCallback(
    async (collId, itemId) => {
      const coll = userCollections.find((c) => c.id === collId)
      if (!coll) return
      const has = coll.items.includes(itemId)
      try {
        const updated = has
          ? await api(`/collections/${collId}/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' })
          : await api(`/collections/${collId}/items`, { method: 'POST', body: { listingId: itemId } })
        setUserCollections((list) => list.map((c) => (c.id === collId ? updated : c)))
      } catch (e) {
        fail(e)
      }
    },
    [userCollections, fail],
  )

  const value = {
    ready, loadError, retry: loadAll,
    me, login, register, logout, requireAuth, changePassword, updateMe,
    users, ensureUsers,
    listings, myItems, allItems, getItem, addListing, updateItem, removeItem,
    profile, setProfile, myReviews,
    userCollections, addCollection, toggleInCollection,
    favorites, toggleFavorite,
    incomingOffers, outgoingOffers, offers: outgoingOffers, sendOffer, respondOffer,
    conversations, messages, openConversation, sendMessage, startConversation,
    toast, notify,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
