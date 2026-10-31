import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Send } from 'lucide-react'
import { Wordmark } from './Logo'
import Leaves from './Leaves'
import { useApp } from '../store'

export default function Footer() {
  const { notify } = useApp()
  const [email, setEmail] = useState('')

  return (
    <footer className="footer footer2">
      <Leaves className="footer-leaves" />
      <div className="container">
        <div className="f2-top">
          <div className="f2-brand">
            <Wordmark light />
            <p className="footer-claim">Əşyaların ikinci həyatı</p>
          </div>
          <div className="f2-news">
            <p>Həftənin ən maraqlı tapıntıları, ayda iki dəfə.</p>
            <form
              className="footer-form"
              onSubmit={(e) => {
                e.preventDefault()
                if (!email.trim()) return
                notify('Abunə oldun — ilk məktub tezliklə gələcək')
                setEmail('')
              }}
            >
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-poçt ünvanın" aria-label="E-poçt" />
              <button type="submit" aria-label="Abunə ol">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
        <nav className="f2-links" aria-label="Sayt xəritəsi">
          <Link to="/">Ana səhifə</Link>
          <Link to="/ikinci-el">İkinci əl</Link>
          <Link to="/deyis">Dəyiş-düyüş</Link>
          <Link to="/ikinci-sans">İkinci şans</Link>
          <Link to="/kolleksiyalar">Kolleksiyalar</Link>
          <span className="f2-sep" aria-hidden="true" />
          <Link to="/paylasdiqlarim">Paylaşdıqlarım</Link>
          <Link to="/profil">Profilim</Link>
          <span>Təhlükəsiz görüş qaydaları</span>
          <span>Şərtlər və məxfilik</span>
        </nav>
        <div className="footer-bottom f2-bottom">
          <span>© 2026 Relove · <MapPin size={13} /> Bakı, Azərbaycan</span>
          <span>Az al. Daha çox paylaş.</span>
        </div>
      </div>
    </footer>
  )
}
