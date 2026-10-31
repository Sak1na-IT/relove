import { NavLink } from 'react-router-dom'
import { Home, Tag, Repeat, Sparkles, LayoutList } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Ana səhifə', icon: Home, end: true },
  { to: '/ikinci-el', label: 'Geyim', icon: Tag },
  { to: '/deyis', label: 'Dəyiş', icon: Repeat },
  { to: '/ikinci-sans', label: 'İkinci şans', icon: Sparkles },
  { to: '/paylasdiqlarim', label: 'Elanlarım', icon: LayoutList },
]

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobil menyu">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className="mnav-item">
          <span className="mnav-icon">
            <Icon size={21} strokeWidth={1.6} />
          </span>
          <span className="mnav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
