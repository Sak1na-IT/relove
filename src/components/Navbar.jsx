import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, MessageCircle, User, LayoutList, LogIn } from 'lucide-react'
import Logo from './Logo'
import { useApp } from '../store'

const LINKS = [
  { to: '/ikinci-el?dept=qadin', label: 'Qadın' },
  { to: '/ikinci-el?dept=kisi', label: 'Kişi' },
  { to: '/ikinci-el?dept=usaq', label: 'Uşaq' },
  { to: '/ikinci-el', label: 'Hamısı', sep: true },
  { to: '/deyis', label: 'Dəyiş-düyüş' },
  { to: '/ikinci-sans', label: 'İkinci şans' },
  { to: '/kolleksiyalar', label: 'Kolleksiyalar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { conversations, favorites, me } = useApp()
  const unread = conversations.reduce((n, c) => n + c.unread, 0)

  const isActive = (to) => {
    const [path, query] = to.split('?')
    if (!location.pathname.startsWith(path)) return false
    const want = new URLSearchParams(query).get('dept') || ''
    const have = new URLSearchParams(location.search).get('dept') || ''
    if (path !== '/ikinci-el') return true
    return want ? want === have : !['qadin', 'kisi', 'usaq'].includes(have)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />

        <nav className="nav-links" aria-label="Əsas menyu">
          {LINKS.map((l) => (
            <span key={l.label} className="nav-link-wrap">
              <Link to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
              {l.sep && <span className="nav-sep" aria-hidden="true" />}
            </span>
          ))}
        </nav>


        <div className="nav-actions">
          <Link to="/secilmisler" className="icon-btn" aria-label="Seçilmişlər">
            <Heart size={20} strokeWidth={1.6} />
            {favorites.length > 0 && <span className="dot-count">{favorites.length}</span>}
          </Link>
          <Link to="/mesajlar" className="icon-btn" aria-label="Mesajlar">
            <MessageCircle size={20} strokeWidth={1.6} />
            {unread > 0 && <span className="dot-count">{unread}</span>}
          </Link>
          {me ? (
            <>
              <Link to="/profil" className="icon-btn" aria-label="Profilim">
                <User size={20} strokeWidth={1.6} />
              </Link>
              <Link to="/paylasdiqlarim" className={`btn btn-sm hide-md ${location.pathname === '/paylasdiqlarim' ? 'btn-primary' : 'btn-ghost'}`}>
                <LayoutList size={16} strokeWidth={1.8} /> Paylaşdıqlarım
              </Link>
            </>
          ) : (
            <Link to="/giris" className="btn btn-sm btn-primary">
              <LogIn size={16} strokeWidth={1.8} /> Daxil ol
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
