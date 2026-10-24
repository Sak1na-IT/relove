import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Heart, Bell, Plus } from 'lucide-react'
import Logo from './Logo'
import Img from './Img'
import { USERS } from '../data'
import { useApp } from '../store'

const LINKS = [
  { to: '/kesf', label: 'Kəşf et' },
  { to: '/kesf?mode=sale', label: 'Satış' },
  { to: '/deyis', label: 'Dəyiş-düyüş' },
  { to: '/paylas', label: 'Paylaş' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')
  const { conversations, favorites } = useApp()
  const unread = conversations.reduce((n, c) => n + c.unread, 0)

  const isActive = (to) => {
    const [path, query = ''] = to.split('?')
    if (path !== location.pathname) return false
    return path !== '/kesf' || location.search.replace('?', '') === query
  }

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

        <form className="nav-search" onSubmit={submit} role="search">
          <Search size={17} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Axtarış et..." aria-label="Axtarış" />
        </form>

        <nav className="nav-links" aria-label="Əsas menyu">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/kesf" className="icon-btn show-sm" aria-label="Axtarış">
            <Search size={20} strokeWidth={1.7} />
          </Link>
          <Link to="/secilmisler" className="icon-btn" aria-label="Seçilmişlər">
            <Heart size={20} strokeWidth={1.7} />
            {favorites.length > 0 && <span className="dot-count">{favorites.length}</span>}
          </Link>
          <Link to="/mesajlar" className="icon-btn" aria-label="Bildirişlər və mesajlar">
            <Bell size={20} strokeWidth={1.7} />
            {unread > 0 && <span className="dot-count">{unread}</span>}
          </Link>
          <Link to="/profil" className="avatar-btn hide-sm" aria-label="Profilim">
            <Img src={USERS.me.avatar} alt="Profil" />
          </Link>
          <Link to="/paylas" className="btn btn-primary btn-sm hide-md">
            <Plus size={16} strokeWidth={2.2} /> Elan yerləşdir
          </Link>
        </div>
      </div>
    </header>
  )
}
