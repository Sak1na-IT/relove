import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { LISTINGS, MY_ITEMS, CONVERSATIONS, USERS } from './data'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [listings, setListings] = useState(LISTINGS)
  const [myItems, setMyItems] = useState(MY_ITEMS)
  const [favorites, setFavorites] = useState(['l2', 'l5', 'l9'])
  const [offers, setOffers] = useState([])
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [toast, setToast] = useState(null)
  const [userCollections, setUserCollections] = useState([])
  // istifadəçinin əlaqə və ərazi seçimləri — bütün bölmələrdə eyni istifadə olunur
  const [profile, setProfile] = useState({
    phone: USERS.me.phone,
    whatsapp: USERS.me.whatsapp,
    showPhone: true,
    pref: USERS.me.contactPref,
    district: USERS.me.district,
    delivery: ['meet'],
  })
  const timer = useRef(null)

  const notify = useCallback((message, tone = 'default') => {
    clearTimeout(timer.current)
    setToast({ message, tone, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const toggleFavorite = useCallback(
    (id) => {
      const has = favorites.includes(id)
      setFavorites((f) => (has ? f.filter((x) => x !== id) : [...f, id]))
      notify(has ? 'Seçilmişlərdən çıxarıldı' : 'Seçilmişlərə əlavə edildi ♡')
    },
    [favorites, notify],
  )

  const allItems = useMemo(() => [...myItems, ...listings], [myItems, listings])
  const getItem = useCallback((id) => allItems.find((l) => l.id === id), [allItems])

  const addListing = useCallback((item) => {
    setMyItems((m) => [{ ...item, status: 'active' }, ...m])
  }, [])

  const updateItem = useCallback((id, patch) => {
    setMyItems((m) => m.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }, [])

  const removeItem = useCallback((id) => {
    setMyItems((m) => m.filter((it) => it.id !== id))
  }, [])

  const sendOffer = useCallback(
    (offer) => {
      setOffers((o) => [{ ...offer, id: `o${Date.now()}`, status: 'Gözləyir', created: 'İndicə' }, ...o])
      notify('Dəyiş təklifi göndərildi ✦', 'lime')
    },
    [notify],
  )

  const sendMessage = useCallback((convId, text) => {
    setConversations((cs) =>
      cs.map((c) =>
        c.id === convId
          ? { ...c, unread: 0, messages: [...c.messages, { from: 'me', text, time: 'İndi' }] }
          : c,
      ),
    )
  }, [])

  const startConversation = useCallback(
    (sellerId, listingId, text) => {
      const existing = conversations.find((c) => c.with === sellerId && c.listing === listingId)
      const id = existing ? existing.id : `c${Date.now()}`
      const msg = { from: 'me', text, time: 'İndi' }
      setConversations((cs) =>
        existing
          ? cs.map((c) => (c.id === id ? { ...c, messages: [...c.messages, msg] } : c))
          : [{ id, with: sellerId, listing: listingId, unread: 0, messages: [msg] }, ...cs],
      )
      return id
    },
    [conversations],
  )

  const value = {
    listings, myItems, allItems, getItem, addListing, updateItem, removeItem,
    profile, setProfile,
    userCollections,
    addCollection: (c) => setUserCollections((list) => [c, ...list]),
    toggleInCollection: (collId, itemId) =>
      setUserCollections((list) =>
        list.map((c) =>
          c.id !== collId
            ? c
            : { ...c, items: c.items.includes(itemId) ? c.items.filter((x) => x !== itemId) : [...c.items, itemId] },
        ),
      ),
    favorites, toggleFavorite,
    offers, sendOffer,
    conversations, sendMessage, startConversation,
    toast, notify,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
