import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Star, Calendar, LayoutList, ArrowRight, Camera, LogOut } from 'lucide-react'
import Img from '../components/Img'
import { USERS } from '../data'
import { useApp } from '../store'

const NOTIFY = [
  { id: 'msg', title: 'Yeni mesajlar', text: 'Kimsə elanına yazanda bildiriş al.' },
  { id: 'offer', title: 'Dəyiş təklifləri', text: 'Gələn və cavablanan təkliflər haqqında.' },
  { id: 'saved', title: 'Saxladığım axtarışlar', text: 'Uyğun əşya paylaşılanda xəbər ver.' },
  { id: 'news', title: 'Relove xəbərləri', text: 'Həftənin tapıntıları, ayda iki dəfə.' },
]

// Profil — yalnız hesab ayarları. Elanlar, əlaqə məlumatları və rəylər "Paylaşdıqlarım"dadır.
export default function Profile() {
  const me = USERS.me
  const { notify } = useApp()
  const [info, setInfo] = useState({ name: me.name, email: 'nermin@example.com', bio: me.bio })
  const [notifs, setNotifs] = useState({ msg: true, offer: true, saved: true, news: false })

  return (
    <div className="container account">
      <header className="account-head">
        <div className="account-avatar">
          <Img src={me.avatar} alt={me.name} />
          <button className="account-avatar-btn" aria-label="Şəkli dəyiş" onClick={() => notify('Şəkil yükləmə backend mərhələsində əlavə olunacaq')}>
            <Camera size={15} />
          </button>
        </div>
        <div>
          <h1 className="page-title">
            {info.name} {me.verified && <BadgeCheck size={22} className="verified" />}
          </h1>
          <p className="account-meta">
            <span className="with-icon"><Star size={14} fill="currentColor" /> {me.rating} · {me.reviews} rəy</span>
            <span className="with-icon"><Calendar size={14} /> {me.joined}-dan Relove-da</span>
          </p>
        </div>
      </header>

      <Link to="/paylasdiqlarim" className="account-link">
        <LayoutList size={20} strokeWidth={1.6} />
        <span>
          <strong>Paylaşdıqlarım</strong>
          <small>Elanların, əlaqə məlumatların və haqqında yazılan rəylər burada.</small>
        </span>
        <ArrowRight size={18} />
      </Link>

      <div className="account-grid">
        <form
          className="account-card"
          onSubmit={(e) => {
            e.preventDefault()
            notify('Şəxsi məlumatların yadda saxlanıldı')
          }}
        >
          <h2>Şəxsi məlumatlar</h2>
          <label className="field">
            <span>Ad və soyad</span>
            <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
          </label>
          <label className="field">
            <span>E-poçt</span>
            <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
          </label>
          <label className="field">
            <span>Haqqımda <small>(profilində görünür)</small></span>
            <textarea rows={3} value={info.bio} onChange={(e) => setInfo({ ...info, bio: e.target.value })} />
          </label>
          <button className="btn btn-primary btn-sm" type="submit">Yadda saxla</button>
        </form>

        <div className="account-card">
          <h2>Bildirişlər</h2>
          {NOTIFY.map((n) => (
            <label key={n.id} className="toggle-row">
              <input type="checkbox" checked={notifs[n.id]} onChange={(e) => setNotifs({ ...notifs, [n.id]: e.target.checked })} />
              <span className="toggle" />
              <span>
                <strong>{n.title}</strong>
                <small>{n.text}</small>
              </span>
            </label>
          ))}
        </div>

        <div className="account-card account-card-wide">
          <h2>Hesab</h2>
          <div className="account-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => notify('Şifrə dəyişmə backend mərhələsində əlavə olunacaq')}>
              Şifrəni dəyiş
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => notify('Çıxış backend mərhələsində işləyəcək')}>
              <LogOut size={15} /> Hesabdan çıx
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
