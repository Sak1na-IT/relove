import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Star, Calendar, LayoutList, ArrowRight, Camera, LogOut } from 'lucide-react'
import Img from '../components/Img'
import { useApp } from '../store'

const initials = (n) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

const NOTIFY = [
  { id: 'msg', title: 'Yeni mesajlar', text: 'Kimsə elanına yazanda bildiriş al.' },
  { id: 'offer', title: 'Dəyiş təklifləri', text: 'Gələn və cavablanan təkliflər haqqında.' },
  { id: 'saved', title: 'Saxladığım axtarışlar', text: 'Uyğun əşya paylaşılanda xəbər ver.' },
  { id: 'news', title: 'Relove xəbərləri', text: 'Həftənin tapıntıları, ayda iki dəfə.' },
]

// Profil — yalnız hesab ayarları. Elanlar, əlaqə məlumatları və rəylər "Paylaşdıqlarım"dadır.
export default function Profile() {
  const { me, notify, updateMe, logout, changePassword } = useApp()
  const [info, setInfo] = useState({ name: me.name, email: me.email, bio: me.bio || '' })
  const [pw, setPw] = useState(null) // null = forma bağlı
  const [saving, setSaving] = useState(false)

  const savePassword = async (e) => {
    e.preventDefault()
    try {
      await changePassword(pw.current, pw.next)
      notify('Parol dəyişdirildi')
      setPw(null)
    } catch (err) {
      notify(err.message)
    }
  }
  const [notifs, setNotifs] = useState({ msg: true, offer: true, saved: true, news: false })

  return (
    <div className="container account">
      <header className="account-head">
        <div className="account-avatar">
          {me.avatar ? <Img src={me.avatar} alt={me.name} /> : <span className="avatar-initials">{initials(me.name)}</span>}
          <button className="account-avatar-btn" aria-label="Şəkli dəyiş" onClick={() => notify('Profil şəkli yükləmə tezliklə əlavə olunacaq')}>
            <Camera size={15} />
          </button>
        </div>
        <div>
          <h1 className="page-title">
            {me.name} {me.verified && <BadgeCheck size={22} className="verified" />}
          </h1>
          <p className="account-meta">
            <span className="with-icon"><Star size={14} fill="currentColor" /> {me.rating ?? 'Yeni'} · {me.reviews} rəy</span>
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
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await updateMe({ name: info.name, bio: info.bio })
              notify('Şəxsi məlumatların yadda saxlanıldı')
            } catch (err) {
              notify(err.message)
            } finally {
              setSaving(false)
            }
          }}
        >
          <h2>Şəxsi məlumatlar</h2>
          <label className="field">
            <span>Ad və soyad</span>
            <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
          </label>
          <label className="field">
            <span>E-poçt</span>
            <input type="email" value={info.email} readOnly className="is-readonly" />
          </label>
          <label className="field">
            <span>Haqqımda <small>(profilində görünür)</small></span>
            <textarea rows={3} value={info.bio} onChange={(e) => setInfo({ ...info, bio: e.target.value })} />
          </label>
          <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>{saving ? 'Saxlanılır…' : 'Yadda saxla'}</button>
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
            <button className="btn btn-ghost btn-sm" onClick={() => setPw(pw ? null : { current: '', next: '' })}>
              Parolu dəyiş
            </button>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <LogOut size={15} /> Hesabdan çıx
            </button>
          </div>
          {pw && (
            <form className="account-pw" onSubmit={savePassword}>
              <label className="field">
                <span>Hazırkı parol</span>
                <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
              </label>
              <label className="field">
                <span>Yeni parol <small>(ən azı 8 simvol)</small></span>
                <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
              </label>
              <button className="btn btn-primary btn-sm" type="submit" disabled={!pw.current || pw.next.length < 8}>Yadda saxla</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
