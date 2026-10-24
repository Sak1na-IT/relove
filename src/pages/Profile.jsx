import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Star, Calendar, Zap, Plus, Lock, Globe } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import { USERS, COLLECTIONS, REVIEWS } from '../data'
import { useApp } from '../store'

export default function Profile() {
  const me = USERS.me
  const { myItems, getItem, offers } = useApp()
  const [tab, setTab] = useState('items')
  const swapItems = myItems.filter((m) => m.modes.includes('swap'))

  const TABS = [
    { id: 'items', label: 'Elanlarım', count: myItems.length },
    { id: 'swap', label: 'Dəyişməyə açıq', count: swapItems.length },
    { id: 'collections', label: 'Kolleksiyalar', count: COLLECTIONS.length },
    { id: 'reviews', label: 'Rəylər', count: me.reviews },
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
              {t.label} <span className="tab-count">{t.count}</span>
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

        {tab === 'collections' && (
          <div className="collections section-tight">
            {COLLECTIONS.map((c) => (
              <article key={c.id} className="collection">
                <div className="collection-mosaic">
                  {c.items.slice(0, 3).map((id) => {
                    const it = getItem(id)
                    return it ? <Img key={id} src={it.images[0]} alt={it.title} /> : null
                  })}
                </div>
                <div className="collection-info">
                  <strong>{c.name}</strong>
                  <span className="with-icon">
                    {c.public ? <Globe size={13} /> : <Lock size={13} />} {c.public ? 'İctimai' : 'Şəxsi'} · {c.items.length} əşya
                  </span>
                </div>
              </article>
            ))}
          </div>
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
