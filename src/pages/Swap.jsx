import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Repeat, Plus, Clock, ArrowRight, MapPin, Heart } from 'lucide-react'
import Img from '../components/Img'
import SwapModal from '../components/SwapModal'
import { CATEGORIES, USERS, formatPrice } from '../data'
import { useApp } from '../store'

const STEPS = [
  { title: 'Təklif göndər', text: 'Bəyəndiyin əşya üçün öz əşyanı təklif et.' },
  { title: 'Qarşı tərəf təsdiqləyir', text: 'Razılaşmadan heç nə tamamlanmır.' },
  { title: 'Görüşüb dəyişin', text: 'Yeri və vaxtı mesajlarda seçin.' },
]

const firstName = (id) => (id === 'me' ? 'Sənin' : `${USERS[id].name.split(' ')[0]}`)

function SwapCard({ item, onOffer }) {
  const { favorites, toggleFavorite } = useApp()
  const fav = favorites.includes(item.id)
  return (
    <article className="swapcard">
      <div className="swapcard-media">
        <Link to={`/elan/${item.id}`} className="card-media-link" aria-label={item.title}>
          <Img src={item.images[0]} alt={item.title} />
        </Link>
        <button className={`card-heart ${fav ? 'is-on' : ''}`} onClick={() => toggleFavorite(item.id)} aria-label="Seçilmişlər">
          <Heart size={16} strokeWidth={1.8} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="swapcard-body">
        <Link to={`/elan/${item.id}`} className="swapcard-title">{item.title}</Link>
        <div className="swapcard-meta">
          <span>Dəyəri ~{formatPrice(item.price)}</span>
          <span className="with-icon"><MapPin size={12} /> {item.district}</span>
        </div>
        {item.wantsText.length > 0 && (
          <p className="swapcard-wants">
            <span>Əvəzində istəyir:</span> {item.wantsText.join(', ')}
          </p>
        )}
        <button className="btn btn-ghost btn-sm swapcard-btn" onClick={() => onOffer(item)}>
          <Repeat size={14} /> Təklif göndər
        </button>
      </div>
    </article>
  )
}

export default function Swap() {
  const { listings, myItems, offers, getItem } = useApp()
  const [target, setTarget] = useState(null)
  const [cat, setCat] = useState('')
  const [tab, setTab] = useState('items')

  const mySwap = myItems.filter((m) => m.modes.includes('swap'))
  const open = listings.filter((l) => l.modes.includes('swap'))

  const matches = useMemo(() => {
    const pairs = []
    mySwap.forEach((mine) =>
      open.forEach((theirs) => {
        if (theirs.wants.includes(mine.category) && mine.wants.includes(theirs.category)) {
          const diff = Math.abs(theirs.price - mine.price) / Math.max(theirs.price, mine.price, 1)
          pairs.push({ mine, theirs, score: 100 - Math.min(40, Math.round(diff * 60)) })
        }
      }),
    )
    // hər qarşı əşya yalnız bir dəfə
    const seen = new Set()
    return pairs
      .sort((a, b) => b.score - a.score)
      .filter((p) => !seen.has(p.theirs.id) && seen.add(p.theirs.id))
      .slice(0, 3)
  }, [mySwap, open])

  const cats = CATEGORIES.filter((c) => open.some((l) => l.category === c.id))
  const grid = cat ? open.filter((l) => l.category === cat) : open

  return (
    <div className="swap2">
      {/* intro */}
      <section className="container swap2-intro">
        <div>
          <h1 className="page-title">Dəyiş-düyüş</h1>
          <p className="page-lead">
            Pul xərcləmədən əşyanı əşya ilə dəyiş. Hər iki tərəf razılaşmadan heç bir dəyiş tamamlanmır.
          </p>
        </div>
        <ol className="swap2-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="swap2-step-num">{i + 1}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* matches */}
      {matches.length > 0 && (
        <section className="container block-sm">
          <div className="block-head">
            <div>
              <h2 className="h2">Sənə uyğun təkliflər</h2>
              <p className="block-sub">Sənin əşyalarınla qarşılıqlı maraq olan elanlar.</p>
            </div>
          </div>
          <div className="match2-grid">
            {matches.map(({ mine, theirs, score }) => (
              <article key={theirs.id} className="match2">
                <div className="match2-pair">
                  <div className="match2-side">
                    <div className="match2-photo"><Img src={mine.images[0]} alt={mine.title} /></div>
                    <small>Sənin</small>
                    <strong>{mine.title}</strong>
                  </div>
                  <span className="match2-icon"><Repeat size={18} strokeWidth={1.7} /></span>
                  <Link to={`/elan/${theirs.id}`} className="match2-side">
                    <div className="match2-photo"><Img src={theirs.images[0]} alt={theirs.title} /></div>
                    <small>{firstName(theirs.seller)}</small>
                    <strong>{theirs.title}</strong>
                  </Link>
                </div>
                <div className="match2-foot">
                  <span className="match2-score">
                    <span style={{ width: `${score}%` }} />
                  </span>
                  <span className="match2-score-text">{score}% uyğun</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setTarget(theirs)}>
                    Təklif göndər
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* open to swap */}
      <section className="container block">
        <div className="block-head">
          <div>
            <h2 className="h2">Dəyişməyə açıq əşyalar</h2>
            <p className="block-sub">Sahibləri pul əvəzinə başqa əşya qəbul edir.</p>
          </div>
          <span className="explore-count">{grid.length} əşya</span>
        </div>
        <div className="tabs2" role="tablist" aria-label="Kateqoriya">
          <button role="tab" aria-selected={!cat} className={!cat ? 'is-on' : ''} onClick={() => setCat('')}>
            Hamısı <em>{open.length}</em>
          </button>
          {cats.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'is-on' : ''} onClick={() => setCat(c.id)}>
              {c.label} <em>{open.filter((l) => l.category === c.id).length}</em>
            </button>
          ))}
        </div>
        <div className="swap2-grid">
          {grid.map((item) => (
            <SwapCard key={item.id} item={item} onOffer={setTarget} />
          ))}
        </div>
      </section>

      {/* my swaps */}
      <section className="container block">
        <div className="myswap">
          <div className="myswap-head">
            <h2 className="h2">Mənim dəyişlərim</h2>
            <div className="tabs2 tabs2-light" role="tablist">
              <button role="tab" aria-selected={tab === 'items'} className={tab === 'items' ? 'is-on' : ''} onClick={() => setTab('items')}>
                Dəyişməyə qoyduqlarım <em>{mySwap.length}</em>
              </button>
              <button role="tab" aria-selected={tab === 'offers'} className={tab === 'offers' ? 'is-on' : ''} onClick={() => setTab('offers')}>
                Göndərdiyim təkliflər <em>{offers.length}</em>
              </button>
            </div>
          </div>

          {tab === 'items' && (
            <div className="myswap-list">
              {mySwap.map((m) => (
                <Link key={m.id} to={`/elan/${m.id}`} className="myswap-row">
                  <div className="myswap-thumb"><Img src={m.images[0]} alt={m.title} /></div>
                  <div className="myswap-text">
                    <strong>{m.title}</strong>
                    <span>Əvəzində istəyirəm: {m.wantsText.join(', ') || 'təklifə açığam'}</span>
                  </div>
                  <span className="myswap-price">~{formatPrice(m.price)}</span>
                  <ArrowRight size={16} className="myswap-arrow" />
                </Link>
              ))}
              <Link to="/paylas" className="myswap-add">
                <Plus size={16} /> Dəyişmək üçün əşya əlavə et
              </Link>
            </div>
          )}

          {tab === 'offers' && (
            <div className="myswap-list">
              {offers.length === 0 ? (
                <p className="myswap-empty">Hələ təklif göndərməmisən. Yuxarıdakı uyğun təkliflərdən başlaya bilərsən.</p>
              ) : (
                offers.map((o) => {
                  const t = getItem(o.targetId)
                  const m = getItem(o.myItemId)
                  return (
                    <div key={o.id} className="myswap-row">
                      <div className="myswap-thumb myswap-thumb-pair">
                        <Img src={m.images[0]} alt={m.title} />
                        <Img src={t.images[0]} alt={t.title} />
                      </div>
                      <div className="myswap-text">
                        <strong>{m.title} → {t.title}</strong>
                        <span>{o.cash > 0 ? `Üstünə ${formatPrice(o.cash)} · ` : ''}{o.created}</span>
                      </div>
                      <span className="status"><Clock size={13} /> Cavab gözlənilir</span>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </section>

      {target && <SwapModal target={target} onClose={() => setTarget(null)} />}
    </div>
  )
}
