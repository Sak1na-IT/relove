import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, Sparkles, X, Heart, Plus, MapPin, Clock, RotateCcw } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import SwapModal from '../components/SwapModal'
import { CATEGORIES, formatPrice } from '../data'
import { useApp } from '../store'

const TABS = [
  { id: 'mine', label: 'Dəyişmək istədiklərim' },
  { id: 'wants', label: 'Mənim axtardıqlarım' },
  { id: 'offers', label: 'Təkliflərim' },
]

export default function Swap() {
  const { listings, myItems, offers, getItem, notify } = useApp()
  const [tab, setTab] = useState('mine')
  const [target, setTarget] = useState(null)
  const [cat, setCat] = useState('')
  const [deck, setDeck] = useState(0)
  const [wants, setWants] = useState(['Fotoaparat', 'Kitab rəfi', 'Vinil plastinkalar'])
  const [wantInput, setWantInput] = useState('')

  const mySwap = myItems.filter((m) => m.modes.includes('swap'))
  const openToSwap = listings.filter((l) => l.modes.includes('swap'))

  const matches = useMemo(() => {
    const pairs = []
    mySwap.forEach((mine) => {
      openToSwap.forEach((theirs) => {
        if (theirs.wants.includes(mine.category) && mine.wants.includes(theirs.category)) {
          const score = 100 - Math.min(40, Math.round((Math.abs(theirs.price - mine.price) / Math.max(theirs.price, mine.price, 1)) * 60))
          pairs.push({ mine, theirs, score })
        }
      })
    })
    return pairs.sort((a, b) => b.score - a.score).slice(0, 3)
  }, [mySwap, openToSwap])

  const grid = cat ? openToSwap.filter((l) => l.category === cat) : openToSwap
  const card = openToSwap[deck % openToSwap.length]

  const addWant = (e) => {
    e.preventDefault()
    const w = wantInput.trim()
    if (w && !wants.includes(w)) setWants([...wants, w])
    setWantInput('')
  }

  return (
    <div className="swap-page">
      <section className="swap-hero">
        <div className="container swap-hero-inner">
          <p className="eyebrow eyebrow-lime">Dəyiş</p>
          <h1 className="display">
            Axtardığını tap. <em>Əlindəkini dəyərləndir.</em>
          </h1>
          <p className="lead lead-light">
            Pul ödəmədən, əşyanı əşya ilə dəyiş. Hər iki tərəf razılaşmadan heç nə tamamlanmır.
          </p>
        </div>
      </section>

      <div className="container">
        {/* MATCHES */}
        {matches.length > 0 && (
          <section className="section section-tight">
            <div className="section-head">
              <div>
                <p className="eyebrow"><Sparkles size={14} /> Sənin üçün</p>
                <h2 className="h2">Sənin əşyanla <em>uyğun təkliflər</em> tapıldı</h2>
              </div>
            </div>
            <div className="matches">
              {matches.map(({ mine, theirs, score }) => (
                <article key={mine.id + theirs.id} className="match">
                  <div className="match-score">{score}% uyğun</div>
                  <div className="match-pair">
                    <div className="match-side">
                      <Img src={mine.images[0]} alt={mine.title} />
                      <small>Sənin</small>
                      <strong>{mine.title}</strong>
                      <span>{formatPrice(mine.price)}</span>
                    </div>
                    <span className="match-arrow"><ArrowLeftRight size={18} /></span>
                    <Link to={`/elan/${theirs.id}`} className="match-side">
                      <Img src={theirs.images[0]} alt={theirs.title} />
                      <small>Onun</small>
                      <strong>{theirs.title}</strong>
                      <span>{formatPrice(theirs.price)}</span>
                    </Link>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={() => setTarget(theirs)}>
                    Dəyiş təklif et
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* QUICK DECK + TABS */}
        <section className="section section-tight swap-split">
          <div className="deck-wrap">
            <h2 className="h2">Sürətli <em>kəşf</em></h2>
            <p className="section-text">Bəyən və ya keç. Bəyəndiyinə dərhal təklif göndər.</p>
            {card && (
              <div className="deck">
                <div className="deck-shadow deck-shadow-2" />
                <div className="deck-shadow" />
                <Link to={`/elan/${card.id}`} className="deck-card" key={card.id}>
                  <Img src={card.images[0]} alt={card.title} />
                  <div className="deck-info">
                    <strong>{card.title}</strong>
                    <span>
                      {formatPrice(card.price)} · <MapPin size={12} /> {card.district}
                    </span>
                  </div>
                </Link>
              </div>
            )}
            <div className="deck-actions">
              <button className="round-btn" onClick={() => setDeck((d) => d + 1)} aria-label="Keç">
                <X size={22} />
              </button>
              <button className="round-btn round-btn-sm" onClick={() => setDeck(0)} aria-label="Yenidən başla">
                <RotateCcw size={16} />
              </button>
              <button className="round-btn round-btn-lime" onClick={() => setTarget(card)} aria-label="Bəyən və təklif et">
                <Heart size={22} fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="tabs-wrap">
            <div className="tabs" role="tablist">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => setTab(t.id)}>
                  {t.label}
                  {t.id === 'offers' && offers.length > 0 && <span className="pill-count">{offers.length}</span>}
                </button>
              ))}
            </div>

            {tab === 'mine' && (
              <div className="my-swap-list">
                {mySwap.map((m) => (
                  <Link to={`/elan/${m.id}`} key={m.id} className="row-item">
                    <Img src={m.images[0]} alt={m.title} />
                    <div>
                      <strong>{m.title}</strong>
                      <small>Axtarır: {m.wantsText.join(', ') || 'Təklifə açıqdır'}</small>
                    </div>
                    <span className="row-price">{formatPrice(m.price)}</span>
                  </Link>
                ))}
                <Link to="/paylas" className="row-add">
                  <Plus size={18} /> Dəyişmək üçün yeni əşya əlavə et
                </Link>
              </div>
            )}

            {tab === 'wants' && (
              <div className="wants-editor">
                <p className="section-text">Bu əşyalar paylaşılanda sənə ilk olaraq göstərəcəyik.</p>
                <div className="chip-wrap">
                  {wants.map((w) => (
                    <span key={w} className="chip chip-static chip-removable">
                      {w}
                      <button onClick={() => setWants(wants.filter((x) => x !== w))} aria-label={`${w} sil`}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={addWant} className="inline-form">
                  <input value={wantInput} onChange={(e) => setWantInput(e.target.value)} placeholder="Məsələn: Planşet" />
                  <button className="btn btn-primary btn-sm" type="submit">Əlavə et</button>
                </form>
                <button className="link-arrow" onClick={() => notify('Axtarışların yadda saxlanıldı')}>
                  Yadda saxla
                </button>
              </div>
            )}

            {tab === 'offers' && (
              <div className="my-swap-list">
                {offers.length === 0 ? (
                  <div className="empty empty-sm">
                    <h3>Hələ təklif göndərməmisən</h3>
                    <p>Uyğun təkliflərdən birini seç və ya sürətli kəşfdə bəyən.</p>
                  </div>
                ) : (
                  offers.map((o) => {
                    const t = getItem(o.targetId)
                    const m = getItem(o.myItemId)
                    return (
                      <div key={o.id} className="offer-row">
                        <div className="offer-thumbs">
                          <Img src={m.images[0]} alt={m.title} />
                          <span><ArrowLeftRight size={14} /></span>
                          <Img src={t.images[0]} alt={t.title} />
                        </div>
                        <div>
                          <strong>{m.title} ↔ {t.title}</strong>
                          <small>
                            {o.cash > 0 ? `+ ${formatPrice(o.cash)} fərq · ` : ''}
                            {o.created}
                          </small>
                        </div>
                        <span className="status"><Clock size={13} /> {o.status}</span>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </section>

        {/* ALL SWAP LISTINGS */}
        <section className="section section-tight">
          <div className="section-head">
            <div>
              <p className="eyebrow">Barter</p>
              <h2 className="h2">Dəyişməyə <em>açıq olan hər şey</em></h2>
            </div>
          </div>
          <div className="chips-scroll">
            <button className={`chip ${!cat ? 'is-on' : ''}`} onClick={() => setCat('')}>Hamısı</button>
            {CATEGORIES.filter((c) => openToSwap.some((l) => l.category === c.id)).map((c) => (
              <button key={c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => setCat(c.id)}>
                {c.short}
              </button>
            ))}
          </div>
          <div className="grid-4">
            {grid.map((l) => <ProductCard key={l.id} item={l} />)}
          </div>
        </section>
      </div>

      {target && <SwapModal target={target} onClose={() => setTarget(null)} />}
    </div>
  )
}
