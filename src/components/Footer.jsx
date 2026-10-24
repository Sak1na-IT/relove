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
    <footer className="footer">
      <Leaves className="footer-leaves" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark light />
            <p className="footer-claim">Əşyaların ikinci həyatı</p>
            <p className="footer-place with-icon"><MapPin size={14} /> Bakı, Azərbaycan</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Sürətli keçid</h4>
              <Link to="/">Ana səhifə</Link>
              <Link to="/kesf">Kəşf et</Link>
              <Link to="/deyis">Dəyiş-düyüş</Link>
              <Link to="/ikinci-sans">İkinci şans</Link>
              <Link to="/kolleksiyalar">Kolleksiyalar</Link>
            </div>
            <div>
              <h4>İstifadəçi üçün</h4>
              <Link to="/paylas">Əşya paylaş</Link>
              <Link to="/profil">Profilim</Link>
              <span>Təhlükəsiz görüş qaydaları</span>
              <span>Şərtlər və məxfilik</span>
            </div>
          </div>
          <div className="footer-news">
            <h4>Yeniliklərdən xəbərdar ol</h4>
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
        <div className="footer-bottom">
          <span>© 2026 Relove. Bütün hüquqlar qorunur.</span>
          <span>Az al. Daha çox paylaş.</span>
        </div>
      </div>
    </footer>
  )
}
