import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Repeat, Plus, Clock, MapPin, Heart, Check, X } from 'lucide-react'
import Img from '../components/Img'
import CollectButton from '../components/CollectButton'
import SwapModal from '../components/SwapModal'
import { formatPrice, isFashion } from '../data'
import CategoryBrowser from '../components/CategoryBrowser'
import { useApp } from '../store'

const firstName = (user) => (user?.name || 'Satıcı').split(' ')[0]

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
        <CollectButton item={item} />
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


export default function Swap() {
  const navigate = useNavigate()
  const { listings, myItems, incomingOffers: incoming, outgoingOffers: offers, respondOffer, users, startConversation, notify, requireAuth } = useApp()
  const [target, setTarget] = useState(null)
  const [tab, setTab] = useState(new URLSearchParams(window.location.search).get('tab') || 'all')

  const mySwap = myItems.filter((m) => m.modes.includes('swap') && m.status === 'active')
  const open = listings.filter((l) => l.modes.includes('swap'))

  const matches = useMemo(() => {
    const pairs = []
    mySwap.forEach((mine) =>
      open.forEach((theirs) => {
        // paltar paltarla, ev əşyası ev əşyası ilə; eyni növ əşya (hudi↔hudi) cütləşmir
        if (isFashion(mine) !== isFashion(theirs)) return
        if (mine.sub && mine.sub === theirs.sub) return
        if (mine.category === 'kitab' && theirs.category === 'kitab') return
        if (isFashion(mine) && (mine.dept === 'usaq') !== (theirs.dept === 'usaq')) return
        if (theirs.wants.includes(mine.category) && mine.wants.includes(theirs.category)) {
          const diff = Math.abs(theirs.price - mine.price) / Math.max(theirs.price, mine.price, 1)
          pairs.push({ mine, theirs, score: 100 - Math.min(40, Math.round(diff * 60)) })
        }
      }),
    )
    // hər qrupdan 10 cüt; öz əşyaların növbə ilə paylanır ki, eyni əşya təkrarlanmasın
    const taken = new Set()
    const used = new Map()
    const pick = (group) => {
      const out = []
      const cands = pairs.filter((p) => group(p.theirs))
      while (out.length < 10) {
        let best = null
        for (const p of cands) {
          if (taken.has(p.theirs.id)) continue
          const u = used.get(p.mine.id) || 0
          if (!best || u < best.u || (u === best.u && p.score > best.p.score)) best = { p, u }
        }
        if (!best) break
        out.push(best.p)
        taken.add(best.p.theirs.id)
        used.set(best.p.mine.id, best.u + 1)
      }
      return out
    }
    const wear = pick(isFashion)
    const rest = pick((l) => !isFashion(l))
    // geyim və ev əşyaları növbə ilə
    const mixed = []
    for (let i = 0; i < Math.max(wear.length, rest.length); i++) {
      if (wear[i]) mixed.push(wear[i])
      if (rest[i]) mixed.push(rest[i])
    }
    return mixed
  }, [mySwap, open])

  const newIncoming = incoming.filter((o) => o.status === 'pending').length

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

  const accept = async (o) => {
    if (await respondOffer(o.id, 'accepted')) notify('Təklif qəbul edildi — indi mesajlaşa bilərsiniz')
  }
  const decline = async (o) => {
    if (await respondOffer(o.id, 'rejected')) notify('Təklif rədd edildi')
  }
  const cancel = async (o) => {
    if (await respondOffer(o.id, 'cancelled')) notify('Təklif ləğv edildi')
  }
  const openOffer = (item) => requireAuth() && setTarget(item)

  return (
    <div className="swap3">
      {/* intro */}
      <section className="container swap3-intro">
        <div className="swap3-intro-text">
          <h1 className="page-title">Dəyiş-düyüş</h1>
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
            <CategoryBrowser
              pool={open}
              renderItem={(item) => <SwapCard key={item.id} item={item} onOffer={openOffer} />}
              gridClass="swap2-grid"
              searchPlaceholder="Dəyiş elanlarında axtar — məs. qulaqlıq, palto..."
              allTitle="Bütün dəyiş elanları"
            />
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
                    <button className="btn btn-primary btn-sm" onClick={() => openOffer(theirs)}>Təklif göndər</button>
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
                {incoming.length === 0 && <p className="myswap-empty">Hələ sənə təklif gəlməyib.</p>}
                {incoming.map((o) => {
                  const theirs = o.offered
                  const mine = o.target
                  const who = users[o.from] || { name: 'İstifadəçi' }
                  if (!theirs || !mine) return null
                  return (
                    <div key={o.id} className="offer-card">
                      <div className="myswap-thumb myswap-thumb-pair">
                        <Img src={theirs.images[0]} alt={theirs.title} />
                        <Img src={mine.images[0]} alt={mine.title} />
                      </div>
                      <div className="myswap-text">
                        <strong>{who.name} təklif edir: {theirs.title}</strong>
                        <span>
                          Sənin “{mine.title}” əşyanın əvəzinə{o.cash > 0 ? ` · üstünə ${formatPrice(o.cash)}` : ''} · {o.created}
                        </span>
                        {o.note && <span className="offer-note">“{o.note}”</span>}
                      </div>
                      {o.status === 'pending' && (
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
                            onClick={async () => {
                              const convId = await startConversation(o.from, theirs.id, 'Salam! Təklifinizi qəbul etdim. Nə vaxt görüşək?')
                              if (convId) navigate(`/mesajlar?c=${convId}`)
                            }}
                          >
                            Mesaj yaz
                          </button>
                          {who.phone && <a className="btn btn-ghost btn-sm" href={`tel:+${who.phone.replace(/\D/g, '')}`}>{who.phone}</a>}
                        </div>
                      )}
                      {o.status === 'rejected' && <span className="status">Rədd edildi</span>}
                      {o.status === 'cancelled' && <span className="status">Ləğv edildi</span>}
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
                    const t = o.target
                    const m = o.offered
                    if (!t || !m) return null
                    return (
                      <div key={o.id} className="offer-card">
                        <div className="myswap-thumb myswap-thumb-pair">
                          <Img src={m.images[0]} alt={m.title} />
                          <Img src={t.images[0]} alt={t.title} />
                        </div>
                        <div className="myswap-text">
                          <strong>{m.title} → {t.title}</strong>
                          <span>{firstName(users[t.seller])} · {o.cash > 0 ? `üstünə ${formatPrice(o.cash)} · ` : ''}{o.created}</span>
                        </div>
                        {o.status === 'pending' && (
                          <div className="offer-actions">
                            <span className="status"><Clock size={13} /> Cavab gözlənilir</span>
                            <button className="btn btn-ghost btn-sm" onClick={() => cancel(o)}>
                              <X size={14} /> Ləğv et
                            </button>
                          </div>
                        )}
                        {o.status === 'accepted' && <span className="status status-ok"><Check size={13} /> Qəbul edildi</span>}
                        {o.status === 'rejected' && <span className="status">Rədd edildi</span>}
                        {o.status === 'cancelled' && <span className="status">Ləğv edildi</span>}
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
