import { NavLink } from 'react-router-dom'
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react'
import { useApp } from '../store'

const ITEMS = [
  { to: '/', label: 'Ana səhifə', icon: Home, end: true },
  { to: '/kesf', label: 'Kəşf et', icon: Compass },
  { to: '/paylas', label: 'Paylaş', icon: PlusCircle },
  { to: '/mesajlar', label: 'Mesajlar', icon: MessageCircle, badge: true },
  { to: '/profil', label: 'Profil', icon: User },
]

export default function MobileNav() {
  const { conversations } = useApp()
  const unread = conversations.reduce((n, c) => n + c.unread, 0)

  return (
    <nav className="mobile-nav" aria-label="Mobil menyu">
      {ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink key={to} to={to} end={end} className="mnav-item">
          <span className="mnav-icon">
            <Icon size={21} strokeWidth={1.6} />
            {badge && unread > 0 && <span className="mnav-dot" />}
          </span>
          <span className="mnav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
