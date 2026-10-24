import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, MessageCircle, User, LayoutList, LogIn } from 'lucide-react'
import Logo from './Logo'
import { useApp } from '../store'

const LINKS = [
  { to: '/', label: 'Ana səhifə' },
  { to: '/ikinci-el', label: 'İkinci əl' },
  { to: '/deyis', label: 'Dəyiş-düyüş' },
  { to: '/ikinci-sans', label: 'İkinci şans' },
  { to: '/kolleksiyalar', label: 'Kolleksiyalar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { conversations, favorites, me } = useApp()
  const unread = conversations.reduce((n, c) => n + c.unread, 0)

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

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
            <Link key={l.label} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
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
