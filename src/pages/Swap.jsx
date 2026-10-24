import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Repeat, Plus, Clock, MapPin, Heart, Search, X, Check, Sparkles } from 'lucide-react'
import Img from '../components/Img'
import SwapModal from '../components/SwapModal'
import { DEPARTMENTS, USERS, formatPrice } from '../data'
import { useApp } from '../store'

const firstName = (id) => USERS[id].name.split(' ')[0]

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
        <p className="swapcard-wants">
          <span>Əvəzində istəyir:</span> {item.wantsText.length ? item.wantsText.join(', ') : 'təklifə açıqdır'}
        </p>
        <button className="btn btn-ghost btn-sm swapcard-btn" onClick={() => onOffer(item)}>
          <Repeat size={14} /> Təklif göndər
        </button>
      </div>
    </article>
  )
}

const INCOMING = [{ id: 'in1', from: 'u1', theirId: 'l9', myId: 'm1', created: 'Bu gün, 14:20' }]

export default function Swap() {
  const navigate = useNavigate()
  const { listings, myItems, offers, getItem, startConversation, notify } = useApp()
  const [target, setTarget] = useState(null)
  const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'all')
  const [dept, setDept] = useState('')
  const [sub, setSub] = useState('')
  const [q, setQ] = useState('')
  const [incoming, setIncoming] = useState(INCOMING.map((o) => ({ ...o, status: 'new' })))

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
    const seen = new Set()
    return pairs.sort((a, b) => b.score - a.score).filter((p) => !seen.has(p.theirs.id) && seen.add(p.theirs.id))
  }, [mySwap, open])

  const grid = open.filter(
    (l) => (!dept || l.dept === dept) && (!sub || l.sub === sub) && (!q || `${l.title} ${l.wantsText.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
  )
  const newIncoming = incoming.filter((o) => o.status === 'new').length

  const TABS = [
    { id: 'all', label: 'Dəyiş elanları', count: open.length },
    { id: 'match', label: 'Sənə uyğun', count: matches.length },
    { id: 'mine', label: 'Mənim dəyiş elanlarım', count: mySwap.length },
    { id: 'offers', label: 'Təkliflər', count: offers.length + incoming.length, dot: newIncoming > 0 },
  ]

  const go = (id) => {
    setTab(id)
    document.getElementById('swap-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const accept = (o) => {
    setIncoming((list) => list.map((x) => (x.id === o.id ? { ...x, status: 'accepted' } : x)))
    notify('Təklif qəbul edildi — indi mesajlaşa bilərsiniz')
  }
  const decline = (o) => setIncoming((list) => list.map((x) => (x.id === o.id ? { ...x, status: 'declined' } : x)))

  return (
    <div className="swap3">
      {/* intro */}
      <section className="container swap3-intro">
        <div className="swap3-intro-text">
          <h1 className="page-title">Dəyiş-düyüş</h1>
          <p className="page-lead">Əşyanı ver, əvəzində ehtiyacın olanı al — pul xərcləmədən.</p>
        </div>
        <Link to="/paylas?mode=swap" className="btn btn-primary btn-lg">
          <Plus size={18} /> Dəyiş elanı yerləşdir
        </Link>
      </section>

      {/* tabs */}
      <section className="container block-sm" id="swap-tabs">
        <div className="tabs2 tabs2-big" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
              {t.label} <em>{t.count}</em>
              {t.dot && <span className="tab-dot" aria-label="Yeni təklif" />}
            </button>
          ))}
        </div>

        {tab === 'all' && (
          <>
            {matches.length > 0 && (
              <button className="match-hint" onClick={() => setTab('match')}>
                <Sparkles size={16} />
                <span>
                  Sənin əşyalarına uyğun <b>{matches.length} təklif</b> tapdıq
                </span>
                <em>Bax</em>
              </button>
            )}
            <form className="search-big swap3-search" onSubmit={(e) => e.preventDefault()} role="search">
              <Search size={18} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Dəyiş elanlarında axtar — məs. qulaqlıq, palto..." aria-label="Axtarış" />
              {q && (
                <button type="button" className="icon-btn icon-btn-sm" onClick={() => setQ('')} aria-label="Təmizlə">
                  <X size={16} />
                </button>
              )}
            </form>
            <div className="dept-pills">
              <button className={!dept ? 'is-on' : ''} onClick={() => { setDept(''); setSub('') }}>
                Hamısı <em>{open.length}</em>
              </button>
              {DEPARTMENTS.map((d) => {
                const n = open.filter((l) => l.dept === d.id).length
                return (
                  <button key={d.id} className={dept === d.id ? 'is-on' : ''} onClick={() => { setDept(dept === d.id ? '' : d.id); setSub('') }} disabled={n === 0}>
                    {d.label} <em>{n}</em>
                  </button>
                )
              })}
            </div>
            {dept && (
              <div className="sub-row" aria-label="Alt-kateqoriyalar">
                {DEPARTMENTS.find((d) => d.id === dept).groups.map((g) => (
                  <div key={g.title} className="sub-group">
                    <span className="sub-group-title">{g.title}</span>
                    {g.items.map((it) => {
                      const n = open.filter((l) => l.dept === dept && l.sub === it).length
                      return (
                        <button
                          key={it}
                          className={`sub-link ${sub === it ? 'is-on' : ''}`}
                          onClick={() => setSub(sub === it ? '' : it)}
                          disabled={n === 0}
                        >
                          {it}
                          {n > 0 && <em>{n}</em>}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
            {grid.length > 0 ? (
              <div className="swap2-grid">
                {grid.map((item) => (
                  <SwapCard key={item.id} item={item} onOffer={setTarget} />
                ))}
              </div>
            ) : (
              <div className="empty explore2-empty">
                <h3>Bu seçimə uyğun dəyiş elanı yoxdur</h3>
                <p>Başqa bölməyə bax və ya öz əşyanı dəyişə qoy.</p>
              </div>
            )}
          </>
        )}

        {tab === 'match' && (
          <>
            <p className="tab-intro">Sənin dəyiş elanlarınla qarşılıqlı maraq olan əşyalar. Hər iki tərəf bir-birinin əşyasını axtarır.</p>
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
                    <span className="match2-score"><span style={{ width: `${score}%` }} /></span>
                    <span className="match2-score-text">{score}% uyğun</span>
                    <button className="btn btn-primary btn-sm" onClick={() => setTarget(theirs)}>Təklif göndər</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'mine' && (
          <div className="myswap">
            <p className="tab-intro">Dəyişmək üçün paylaşdığın əşyalar. Kimsə təklif göndərəndə “Təkliflər” bölməsində görəcəksən.</p>
            <div className="myswap-list">
              {mySwap.map((m) => (
                <Link key={m.id} to={`/elan/${m.id}`} className="myswap-row">
                  <div className="myswap-thumb"><Img src={m.images[0]} alt={m.title} /></div>
                  <div className="myswap-text">
                    <strong>{m.title}</strong>
                    <span>Əvəzində istəyirəm: {m.wantsText.join(', ') || 'təklifə açığam'}</span>
                  </div>
                  <span className="myswap-price">~{formatPrice(m.price)}</span>
                </Link>
              ))}
              <Link to="/paylas?mode=swap" className="myswap-add">
                <Plus size={16} /> Yeni dəyiş elanı yerləşdir
              </Link>
            </div>
          </div>
        )}

        {tab === 'offers' && (
          <div className="offers-cols">
            <div className="myswap">
              <h3 className="offers-title">Mənə gələn təkliflər</h3>
              <div className="myswap-list">
                {incoming.map((o) => {
                  const theirs = getItem(o.theirId)
                  const mine = getItem(o.myId)
                  const who = USERS[o.from]
                  return (
                    <div key={o.id} className="offer-card">
                      <div className="myswap-thumb myswap-thumb-pair">
                        <Img src={theirs.images[0]} alt={theirs.title} />
                        <Img src={mine.images[0]} alt={mine.title} />
                      </div>
                      <div className="myswap-text">
                        <strong>{who.name} təklif edir: {theirs.title}</strong>
                        <span>Sənin “{mine.title}” əşyanın əvəzinə · {o.created}</span>
                      </div>
                      {o.status === 'new' && (
                        <div className="offer-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => accept(o)}>
                            <Check size={14} /> Qəbul et
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => decline(o)}>Rədd et</button>
                        </div>
                      )}
                      {o.status === 'accepted' && (
                        <div className="offer-actions">
                          <span className="status status-ok"><Check size={13} /> Qəbul edildi</span>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              startConversation(o.from, o.theirId, 'Salam! Təklifinizi qəbul etdim. Nə vaxt görüşək?')
                              navigate('/mesajlar')
                            }}
                          >
                            Mesaj yaz
                          </button>
                          {who.phone && <a className="btn btn-ghost btn-sm" href={`tel:+${who.phone.replace(/\D/g, '')}`}>{who.phone}</a>}
                        </div>
                      )}
                      {o.status === 'declined' && <span className="status">Rədd edildi</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="myswap">
              <h3 className="offers-title">Göndərdiyim təkliflər</h3>
              <div className="myswap-list">
                {offers.length === 0 ? (
                  <p className="myswap-empty">
                    Hələ təklif göndərməmisən. <button onClick={() => setTab('all')}>Dəyiş elanlarına bax</button>
                  </p>
                ) : (
                  offers.map((o) => {
                    const t = getItem(o.targetId)
                    const m = getItem(o.myItemId)
                    return (
                      <div key={o.id} className="offer-card">
                        <div className="myswap-thumb myswap-thumb-pair">
                          <Img src={m.images[0]} alt={m.title} />
                          <Img src={t.images[0]} alt={t.title} />
                        </div>
                        <div className="myswap-text">
                          <strong>{m.title} → {t.title}</strong>
                          <span>{firstName(t.seller)} · {o.cash > 0 ? `üstünə ${formatPrice(o.cash)} · ` : ''}{o.created}</span>
                        </div>
                        <span className="status"><Clock size={13} /> Cavab gözlənilir</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {target && <SwapModal target={target} onClose={() => setTarget(null)} />}
    </div>
  )
}
