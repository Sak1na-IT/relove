import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Heart, MessageCircle, User, Plus, ChevronDown } from 'lucide-react'
import MegaMenu from './MegaMenu'
import Logo from './Logo'
import { useApp } from '../store'

const LINKS = [
  { to: '/', label: 'Ana səhifə' },
  { to: '/kesf', label: 'Kəşf et' },
  { to: '/deyis', label: 'Dəyiş-düyüş' },
  { to: '/ikinci-sans', label: 'İkinci şans' },
  { to: '/kolleksiyalar', label: 'Kolleksiyalar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { conversations, favorites } = useApp()
  const unread = conversations.reduce((n, c) => n + c.unread, 0)

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  // mega-menyu: üzərinə gələndə açılır, çıxanda kiçik gecikmə ilə bağlanır
  const [mega, setMega] = useState(false)
  const timer = useRef(null)
  const openMega = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMega(true), 120)
  }
  const closeMega = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMega(false), 180)
  }

  useEffect(() => {
    setMega(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!mega) return
    const onKey = (e) => e.key === 'Escape' && setMega(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mega])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    navigate(`/kesf${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Əsas menyu">
          {LINKS.map((l) =>
            l.to === '/kesf' ? (
              <div key={l.label} className="nav-mega-trigger" onMouseEnter={openMega} onMouseLeave={closeMega}>
                <Link
                  to={l.to}
                  className={`nav-link ${isActive(l.to) || mega ? 'active' : ''}`}
                  aria-expanded={mega}
                  onFocus={openMega}
                >
                  {l.label} <ChevronDown size={14} className={`nav-chev ${mega ? 'is-open' : ''}`} />
                </Link>
              </div>
            ) : (
              <Link key={l.label} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <form className="nav-search" onSubmit={submit} role="search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nə axtarırsan?" aria-label="Axtarış" />
        </form>

        <div className="nav-actions">
          <Link to="/kesf" className="icon-btn show-sm" aria-label="Axtarış">
            <Search size={20} strokeWidth={1.6} />
          </Link>
          <Link to="/secilmisler" className="icon-btn" aria-label="Seçilmişlər">
            <Heart size={20} strokeWidth={1.6} />
            {favorites.length > 0 && <span className="dot-count">{favorites.length}</span>}
          </Link>
          <Link to="/mesajlar" className="icon-btn" aria-label="Mesajlar">
            <MessageCircle size={20} strokeWidth={1.6} />
            {unread > 0 && <span className="dot-count">{unread}</span>}
          </Link>
          <Link to="/profil" className="icon-btn hide-sm" aria-label="Profilim">
            <User size={20} strokeWidth={1.6} />
          </Link>
          <Link to="/paylas" className="btn btn-primary btn-sm hide-md">
            <Plus size={16} strokeWidth={2} /> Əşya paylaş
          </Link>
        </div>
      </div>
      {mega && (
        <div className="mega-wrap" onMouseEnter={openMega} onMouseLeave={closeMega}>
          <MegaMenu onNavigate={() => setMega(false)} />
        </div>
      )}
      {mega && <div className="mega-backdrop" onMouseEnter={closeMega} onClick={() => setMega(false)} />}
    </header>
  )
}
