import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag, Repeat, Sparkles, Phone, Star, MessageCircle, MapPin, Handshake, Truck, Eye, EyeOff, Trash2, Check, Pencil, RotateCcw,
} from 'lucide-react'
import Img from '../components/Img'
import Avatar from '../components/Avatar'
import { formatPrice, DISTRICTS } from '../data'
import { useApp } from '../store'

const SECTIONS = {
  sale: { label: 'İkinci əl', icon: Tag, add: 'Satış elanı', text: 'Yaxşı vəziyyətdə əşyanı sat.' },
  swap: { label: 'Dəyiş-düyüş', icon: Repeat, add: 'Dəyiş elanı', text: 'Əşyanı başqa əşya ilə dəyiş.' },
  free: { label: 'İkinci şans', icon: Sparkles, add: 'İkinci şans elanı', text: 'Qüsurlu əşyanı atma, paylaş.' },
}

const STATUS = { active: 'Aktiv', sold: 'Satıldı', hidden: 'Gizli' }

function ContactEditor({ value, onSave, onCancel }) {
  const [v, setV] = useState(value)
  const toggleDelivery = (d) =>
    setV((x) => {
      const has = x.delivery.includes(d)
      const next = has ? x.delivery.filter((y) => y !== d) : [...x.delivery, d]
      return { ...x, delivery: next.length ? next : x.delivery }
    })
  return (
    <form
      className="ce"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(v)
      }}
    >
      <label className="ce-field">
        <span>Telefon</span>
        <input value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} placeholder="+994 50 000 00 00" />
      </label>
      <div className="ce-field">
        <span>Əlaqə üsulu</span>
        <div className="seg2 seg2-auto">
          {['Mesaj', 'Zəng', 'WhatsApp'].map((p) => (
            <button type="button" key={p} className={v.pref === p ? 'is-on' : ''} onClick={() => setV({ ...v, pref: p })}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <label className="ce-field">
        <span>Ərazi</span>
        <select value={v.district} onChange={(e) => setV({ ...v, district: e.target.value })}>
          {DISTRICTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <div className="ce-field">
        <span>Təhvil</span>
        <div className="ce-checks">
          <label><input type="checkbox" checked={v.delivery.includes('meet')} onChange={() => toggleDelivery('meet')} /> Şəxsi görüş</label>
          <label><input type="checkbox" checked={v.delivery.includes('courier')} onChange={() => toggleDelivery('courier')} /> Kuryer</label>
        </div>
      </div>
      <div className="ce-checks ce-checks-col">
        <label><input type="checkbox" checked={v.showPhone} onChange={(e) => setV({ ...v, showPhone: e.target.checked })} /> Nömrəm elanlarda görünsün</label>
        <label><input type="checkbox" checked={v.whatsapp} onChange={(e) => setV({ ...v, whatsapp: e.target.checked })} /> WhatsApp ilə yazmaq olar</label>
      </div>
      <div className="ce-actions">
        <button type="submit" className="btn btn-primary btn-sm">Yadda saxla</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Ləğv et</button>
      </div>
    </form>
  )
}

export default function MyListings() {
  const { myItems, updateItem, removeItem, profile, setProfile, notify, incomingOffers, outgoingOffers, me, myReviews, users } = useApp()
  const [tab, setTab] = useState('all')
  const [confirm, setConfirm] = useState(null)
  const [editing, setEditing] = useState(false)

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
        </div>
        <div className="mine-stats">
          <div><strong>{active}</strong><span>aktiv elan</span></div>
          <div><strong>{incomingOffers.length + outgoingOffers.length}</strong><span>dəyiş təklifi</span></div>
          <div><strong>{items.reduce((n, m) => n + (m.likes || 0), 0)}</strong><span>bəyənmə</span></div>
        </div>
      </header>

      <div className="mine-add">
        {Object.entries(SECTIONS).map(([id, s]) => (
          <Link key={id} to={`/paylas?mode=${id}`} className={`mine-add-card mine-add-${id}`}>
            <span className="mine-add-icon"><s.icon size={20} strokeWidth={1.6} /></span>
            <span>
              <strong>+ {s.add}</strong>
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
                      <span>♡ {m.likes || 0}</span>
                    </p>
                  </div>
                  <div className="mine-actions">
                    <Link to={`/elan/${m.id}`} className="mine-act" title="Elana bax"><Pencil size={15} /> Bax</Link>
                    {m.status === 'active' && (
                      <button className="mine-act" onClick={async () => { if (await updateItem(m.id, { status: 'sold' })) notify('Elan “satıldı” kimi qeyd edildi') }}>
                        <Check size={15} /> {m.modes.includes('swap') && !m.modes.includes('sale') ? 'Dəyişildi' : 'Satıldı'}
                      </button>
                    )}
                    {m.status !== 'active' ? (
                      <button className="mine-act" onClick={() => updateItem(m.id, { status: 'active' })}>
                        <RotateCcw size={15} /> Aktivləşdir
                      </button>
                    ) : (
                      <button className="mine-act" onClick={async () => { if (await updateItem(m.id, { status: 'hidden' })) notify('Elan gizlədildi') }}>
                        <EyeOff size={15} /> Gizlət
                      </button>
                    )}
                    {confirm === m.id ? (
                      <span className="mine-confirm">
                        Silinsin?
                        <button onClick={async () => { setConfirm(null); if (await removeItem(m.id)) notify('Elan silindi') }}>Bəli</button>
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

          <section className="mine-reviews" id="reyler">
            <div className="mine-reviews-head">
              <h2 className="h3-serif">Haqqımda rəylər</h2>
              <span className="mine-rating">
                <Star size={16} fill="currentColor" /> {me?.rating ?? '—'} <small>· {me?.reviews ?? 0} rəy</small>
              </span>
            </div>
            <ul className="mine-review-list">
              {myReviews.length === 0 && <li className="mine-review-empty">Hələ rəy yoxdur.</li>}
              {myReviews.map((r) => {
                const u = users[r.from] || { name: 'İstifadəçi' }
                return (
                  <li key={r.id}>
                    <Avatar user={u} className="mine-review-avatar" />
                    <div>
                      <div className="mine-review-top">
                        <strong>{u.name}</strong>
                        <span className="stars">{'★'.repeat(r.stars)}<em>{'★'.repeat(5 - r.stars)}</em></span>
                        <small>{r.when}</small>
                      </div>
                      <p>{r.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mine-reviews-note">Rəyi yalnız səninlə alış-veriş və ya dəyiş-düyüş tamamlayan istifadəçi yaza bilər.</p>
          </section>
        </section>

        <aside className="mine-side">
          <div className="mine-card">
            <h3>Əlaqə və seçimlərin</h3>
            <p className="mine-card-note">Alıcılar bütün elanlarında bu məlumatları görür.</p>
            {editing ? (
              <ContactEditor
                value={profile}
                onCancel={() => setEditing(false)}
                onSave={(v) => {
                  setProfile(v)
                  setEditing(false)
                  notify('Əlaqə məlumatların yeniləndi')
                }}
              />
            ) : (
            <>
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
            <button className="btn btn-ghost btn-sm btn-block" onClick={() => setEditing(true)}>
              <Pencil size={15} /> Məlumatları dəyiş
            </button>
            </>
            )}
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
