import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag, Repeat, Sparkles, Phone, MessageCircle, MapPin, Handshake, Truck, Eye, EyeOff, Trash2, Check, Pencil, RotateCcw,
} from 'lucide-react'
import Img from '../components/Img'
import { formatPrice, likesOf } from '../data'
import { useApp } from '../store'

const SECTIONS = {
  sale: { label: 'İkinci əl', icon: Tag, add: 'Satış elanı', text: 'Yaxşı vəziyyətdə əşyanı sat.' },
  swap: { label: 'Dəyiş-düyüş', icon: Repeat, add: 'Dəyiş elanı', text: 'Əşyanı başqa əşya ilə dəyiş.' },
  free: { label: 'İkinci şans', icon: Sparkles, add: 'İkinci şans elanı', text: 'Qüsurlu əşyanı atma, paylaş.' },
}

const STATUS = { active: 'Aktiv', sold: 'Satıldı', hidden: 'Gizli' }

export default function MyListings() {
  const { myItems, updateItem, removeItem, profile, notify, offers } = useApp()
  const [tab, setTab] = useState('all')
  const [confirm, setConfirm] = useState(null)

  const items = myItems.map((m) => ({ ...m, status: m.status || 'active' }))
  const count = (k) => items.filter((m) => m.modes.includes(k)).length
  const shown = tab === 'all' ? items : items.filter((m) => m.modes.includes(tab))
  const active = items.filter((m) => m.status === 'active').length

  const TABS = [
    { id: 'all', label: 'Hamısı', n: items.length },
    ...Object.entries(SECTIONS).map(([id, s]) => ({ id, label: s.label, n: count(id) })),
  ]

  return (
    <div className="container mine">
      <header className="mine-head">
        <div>
          <h1 className="page-title">Paylaşdıqlarım</h1>
          <p className="page-lead">Bütün elanlarını — satış, dəyiş-düyüş və İkinci şans — bir yerdən idarə et.</p>
        </div>
        <div className="mine-stats">
          <div><strong>{active}</strong><span>aktiv elan</span></div>
          <div><strong>{offers.length + 1}</strong><span>dəyiş təklifi</span></div>
          <div><strong>{items.reduce((n, m) => n + likesOf(m.id), 0)}</strong><span>bəyənmə</span></div>
        </div>
      </header>

      <div className="mine-add">
        {Object.entries(SECTIONS).map(([id, s]) => (
          <Link key={id} to={`/paylas?mode=${id}`} className={`mine-add-card mine-add-${id}`}>
            <span className="mine-add-icon"><s.icon size={20} strokeWidth={1.6} /></span>
            <span>
              <strong>+ {s.add}</strong>
              <small>{s.text}</small>
            </span>
          </Link>
        ))}
      </div>

      <div className="mine-layout">
        <section>
          <div className="tabs2" role="tablist">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
                {t.label} <em>{t.n}</em>
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="empty explore2-empty">
              <h3>Bu bölmədə hələ elanın yoxdur</h3>
              <p>Yuxarıdakı düymələrdən biri ilə ilk elanını yerləşdir.</p>
            </div>
          ) : (
            <ul className="mine-list">
              {shown.map((m) => (
                <li key={m.id} className={`mine-row is-${m.status}`}>
                  <Link to={`/elan/${m.id}`} className="mine-thumb">
                    <Img src={m.images[0]} alt={m.title} />
                  </Link>
                  <div className="mine-info">
                    <div className="mine-tags">
                      {m.modes.map((k) => (
                        <span key={k} className={`tag tag-${k}`}>{SECTIONS[k].label}</span>
                      ))}
                      <span className={`mine-status mine-status-${m.status}`}>{STATUS[m.status]}</span>
                    </div>
                    <Link to={`/elan/${m.id}`} className="mine-title">{m.title}</Link>
                    <p className="mine-sub">
                      {m.modes.includes('free') ? (m.price ? `Simvolik ${formatPrice(m.price)}` : 'Pulsuz') : formatPrice(m.price)}
                      {m.modes.includes('swap') && m.wantsText.length > 0 && <> · Əvəzində: {m.wantsText.join(', ')}</>}
                    </p>
                    <p className="mine-meta">
                      <span className="with-icon"><MapPin size={12} /> {m.district}</span>
                      <span>{m.posted}</span>
                      <span>♡ {likesOf(m.id)}</span>
                    </p>
                  </div>
                  <div className="mine-actions">
                    <Link to={`/elan/${m.id}`} className="mine-act" title="Elana bax"><Pencil size={15} /> Bax</Link>
                    {m.status === 'active' && (
                      <button className="mine-act" onClick={() => { updateItem(m.id, { status: 'sold' }); notify('Elan “satıldı” kimi qeyd edildi') }}>
                        <Check size={15} /> {m.modes.includes('swap') && !m.modes.includes('sale') ? 'Dəyişildi' : 'Satıldı'}
                      </button>
                    )}
                    {m.status !== 'active' ? (
                      <button className="mine-act" onClick={() => updateItem(m.id, { status: 'active' })}>
                        <RotateCcw size={15} /> Aktivləşdir
                      </button>
                    ) : (
                      <button className="mine-act" onClick={() => { updateItem(m.id, { status: 'hidden' }); notify('Elan gizlədildi') }}>
                        <EyeOff size={15} /> Gizlət
                      </button>
                    )}
                    {confirm === m.id ? (
                      <span className="mine-confirm">
                        Silinsin?
                        <button onClick={() => { removeItem(m.id); setConfirm(null); notify('Elan silindi') }}>Bəli</button>
                        <button onClick={() => setConfirm(null)}>Xeyr</button>
                      </span>
                    ) : (
                      <button className="mine-act mine-act-danger" onClick={() => setConfirm(m.id)}>
                        <Trash2 size={15} /> Sil
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="mine-side">
          <div className="mine-card">
            <h3>Əlaqə və seçimlərin</h3>
            <p className="mine-card-note">Alıcılar bütün elanlarında bu məlumatları görür.</p>
            <dl className="mine-dl">
              <div>
                <dt><Phone size={14} /> Telefon</dt>
                <dd>
                  {profile.phone}
                  <small>{profile.showPhone ? 'Elanlarda görünür' : 'Gizlidir'}</small>
                </dd>
              </div>
              <div>
                <dt><MessageCircle size={14} /> Əlaqə üsulu</dt>
                <dd>
                  {profile.pref}
                  <small>{profile.whatsapp ? 'WhatsApp açıqdır' : 'WhatsApp bağlıdır'}</small>
                </dd>
              </div>
              <div>
                <dt><MapPin size={14} /> Ərazi</dt>
                <dd>{profile.district}</dd>
              </div>
              <div>
                <dt>{profile.delivery.includes('courier') ? <Truck size={14} /> : <Handshake size={14} />} Təhvil</dt>
                <dd>{profile.delivery.map((d) => ({ meet: 'Şəxsi görüş', courier: 'Kuryer' })[d]).join(', ')}</dd>
              </div>
            </dl>
            <Link to="/profil?tab=contact" className="btn btn-ghost btn-sm btn-block">
              <Eye size={15} /> Məlumatları dəyiş
            </Link>
          </div>
          <Link to="/deyis?tab=offers" className="mine-card mine-card-link">
            <Repeat size={18} strokeWidth={1.6} />
            <span>
              <strong>Dəyiş təklifləri</strong>
              <small>Gələn və göndərdiyin təkliflərə bax</small>
            </span>
          </Link>
        </aside>
      </div>
    </div>
  )
}
