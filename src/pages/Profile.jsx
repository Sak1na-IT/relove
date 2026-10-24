import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Star, Calendar, Zap, Plus } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import { USERS, REVIEWS, DISTRICTS } from '../data'
import { useApp } from '../store'

export default function Profile() {
  const me = USERS.me
  const { myItems, getItem, offers } = useApp()
  const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'items')
  const { notify, profile, setProfile } = useApp()
  const [contact, setContact] = useState(profile)
  const swapItems = myItems.filter((m) => m.modes.includes('swap'))

  const TABS = [
    { id: 'items', label: 'Elanlarım', count: myItems.length },
    { id: 'swap', label: 'Dəyiş elanlarım', count: swapItems.length },
    { id: 'reviews', label: 'Rəylər', count: me.reviews },
    { id: 'contact', label: 'Əlaqə məlumatları' },
  ]

  return (
    <div className="profile">
      <section className="profile-cover">
        <div className="container profile-head">
          <Img src={me.avatar} alt={me.name} className="profile-avatar" />
          <div className="profile-id">
            <h1 className="display display-sm">
              {me.name} {me.verified && <BadgeCheck size={24} className="verified" />}
            </h1>
            <p className="profile-handle">@{me.handle}</p>
            <p className="profile-bio">{me.bio}</p>
            <div className="profile-meta">
              <span className="with-icon"><Star size={14} fill="currentColor" /> {me.rating} · {me.reviews} rəy</span>
              <span className="with-icon"><MapPin size={14} /> {me.district}</span>
              <span className="with-icon"><Calendar size={14} /> {me.joined}-dan bəri</span>
              {me.fastReply && <span className="with-icon fast"><Zap size={14} /> Sürətli cavab</span>}
            </div>
          </div>
          <div className="profile-stats">
            <div><strong>{myItems.length}</strong><span>Aktiv elan</span></div>
            <div><strong>14</strong><span>Tamamlanmış</span></div>
            <div><strong>{offers.length}</strong><span>Açıq təklif</span></div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="tabs tabs-line" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
              {t.label} {t.count !== undefined && <span className="tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {(tab === 'items' || tab === 'swap') && (
          <div className="grid-4 section-tight">
            <Link to="/paylas" className="add-card">
              <Plus size={28} strokeWidth={1.5} />
              <strong>Yeni əşya paylaş</strong>
            </Link>
            {(tab === 'items' ? myItems : swapItems).map((m) => <ProductCard key={m.id} item={m} />)}
          </div>
        )}

        {tab === 'contact' && (
          <form
            className="contact-form section-tight"
            onSubmit={(e) => {
              e.preventDefault()
              setProfile(contact)
              notify('Əlaqə məlumatların yadda saxlanıldı')
            }}
          >
            <div className="contact-form-intro">
              <h2 className="h2">Əlaqə məlumatları</h2>
              <p>
                Bu məlumatlar bütün elanlarında — satış, dəyiş-düyüş və İkinci şans — eyni şəkildə göstərilir. Alıcılar
                səninlə buradan əlaqə saxlayır.
              </p>
            </div>
            <label className="field">
              <span>Telefon nömrəsi</span>
              <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+994 50 000 00 00" />
            </label>
            <div className="field">
              <span>Ərazi (elanlarında görünür)</span>
              <div className="district-chips">
                {DISTRICTS.map((d) => (
                  <button type="button" key={d} className={contact.district === d ? 'is-on' : ''} onClick={() => setContact({ ...contact, district: d })}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span>Üstünlük verdiyin əlaqə</span>
              <div className="seg2 seg2-auto">
                {['Mesaj', 'Zəng', 'WhatsApp'].map((p) => (
                  <button type="button" key={p} className={contact.pref === p ? 'is-on' : ''} onClick={() => setContact({ ...contact, pref: p })}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <label className="toggle-row">
              <input type="checkbox" checked={contact.showPhone} onChange={(e) => setContact({ ...contact, showPhone: e.target.checked })} />
              <span className="toggle" />
              <span>
                <strong>Nömrəm elanlarda görünsün</strong>
                <small>Bağlı olsa, alıcılar yalnız Relove mesajları ilə yaza bilər.</small>
              </span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.checked })} />
              <span className="toggle" />
              <span>
                <strong>WhatsApp ilə yazmaq olar</strong>
                <small>Elanında WhatsApp düyməsi görünəcək.</small>
              </span>
            </label>
            <button className="btn btn-primary" type="submit">Yadda saxla</button>
          </form>
        )}

        {tab === 'reviews' && (
          <div className="reviews section-tight">
            {REVIEWS.map((r, i) => {
              const u = USERS[r.from]
              return (
                <article key={i} className="review">
                  <Img src={u.avatar} alt={u.name} className="review-avatar" />
                  <div>
                    <div className="review-head">
                      <strong>{u.name}</strong>
                      <span className="stars">{'★'.repeat(r.stars)}<em>{'★'.repeat(5 - r.stars)}</em></span>
                    </div>
                    <p>{r.text}</p>
                    <small>{r.when}</small>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
