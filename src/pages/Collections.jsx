import { createPortal } from 'react-dom'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Plus, X, Check, Search, Lock, Globe } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import { CURATED, curatedById } from '../data'
import { useApp } from '../store'
import NotFound from './NotFound'

export function CollectionCover({ items }) {
  const pics = items.slice(0, 3)
  return (
    <div className={`cover cover-${Math.max(pics.length, 1)}`}>
      {pics.length === 0 ? <div className="cover-empty" /> : pics.map((it) => <Img key={it.id} src={it.images[0]} alt="" />)}
    </div>
  )
}

// istifadəçi kolleksiyalarını CURATED formatına salır
function useAllCollections() {
  const { userCollections } = useApp()
  return useMemo(
    () => [
      ...userCollections.map((c) => ({ ...c, mine: true, match: (l) => c.items.includes(l.id) })),
      ...CURATED,
    ],
    [userCollections],
  )
}

function CreateCollection({ onClose }) {
  const { listings, favorites, addCollection, notify } = useApp()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [picked, setPicked] = useState(favorites.filter((id) => listings.some((l) => l.id === id)))
  const [q, setQ] = useState('')

  const ordered = useMemo(() => {
    const fav = listings.filter((l) => favorites.includes(l.id))
    const rest = listings.filter((l) => !favorites.includes(l.id))
    return [...fav, ...rest].filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase()))
  }, [listings, favorites, q])

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const valid = title.trim() && picked.length > 0

  const save = async (e) => {
    e.preventDefault()
    if (!valid) return
    const created = await addCollection({ title: title.trim(), text: text.trim(), items: picked, isPublic })
    if (!created) return
    notify('Kolleksiya yaradıldı')
    onClose()
    navigate(`/kolleksiyalar/${created.id}`)
  }

  return (
    createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal cc" onClick={(e) => e.stopPropagation()} onSubmit={save} role="dialog" aria-label="Kolleksiya yarat">
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Bağla">
          <X size={20} />
        </button>
        <h2 className="cc-title">Yeni kolleksiya</h2>

        <label className="field">
          <span>Adı</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Məsələn: Yeni evim üçün" maxLength={40} autoFocus />
        </label>
        <label className="field">
          <span>Qısa təsvir <small>(istəyə bağlı)</small></span>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Bu kolleksiyada nə var?" maxLength={90} />
        </label>

        <div className="field">
          <span>Görünmə</span>
          <div className="seg2 seg2-auto cc-seg">
            <button type="button" className={isPublic ? 'is-on' : ''} onClick={() => setIsPublic(true)}>
              <Globe size={14} /> Hamı görsün
            </button>
            <button type="button" className={!isPublic ? 'is-on' : ''} onClick={() => setIsPublic(false)}>
              <Lock size={14} /> Yalnız mən
            </button>
          </div>
        </div>

        <div className="field">
          <span>
            Əşyalar seç <small>· {picked.length} seçilib · bəyəndiklərin əvvəldədir</small>
          </span>
          <div className="cc-search">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Əşya axtar..." aria-label="Əşya axtar" />
          </div>
          <div className="cc-grid">
            {ordered.map((l) => {
              const on = picked.includes(l.id)
              return (
                <button type="button" key={l.id} className={`cc-item ${on ? 'is-on' : ''}`} onClick={() => toggle(l.id)} aria-pressed={on}>
                  <span className="cc-photo">
                    <Img src={l.images[0]} alt="" />
                    <span className="cc-check">{on && <Check size={13} strokeWidth={3} />}</span>
                  </span>
                  <span className="cc-name">{l.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="cc-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Ləğv et</button>
          <button type="submit" className="btn btn-primary" disabled={!valid}>
            Kolleksiyanı yarat
          </button>
        </div>
      </form>
    </div>,
      document.body,
    )
  )
}

function CollectionCard({ c, items, cover, index }) {
  const prices = items.map((l) => l.price).filter((n) => n > 0)
  const min = prices.length ? Math.min(...prices) : 0
  const max = prices.length ? Math.max(...prices) : 0
  // üz şəkli birinci, sonra fərqli şəkilli iki əşya — kiçik mozaika
  const pics = []
  for (const l of [cover, ...items]) {
    if (l && !pics.includes(l.images[0])) pics.push(l.images[0])
    if (pics.length === 3) break
  }
  const href = `/kolleksiyalar/${c.id}`
  return (
    <article className="coll3">
      <Link to={href} className={`coll3-media coll3-media-${Math.max(pics.length, 1)}`} aria-label={c.title}>
        {pics.length ? pics.map((src) => <Img key={src} src={src} alt="" />) : <div className="cover-empty" />}
        {c.mine && <span className="coll3-tag">{c.isPublic ? 'Mənim' : 'Mənim · gizli'}</span>}
      </Link>
      <div className="coll3-body">
        <span className="coll3-index">{String(index + 1).padStart(2, '0')}</span>
        <Link to={href} className="coll3-title">{c.title}</Link>
        {c.text && <p className="coll3-text">{c.text}</p>}
        <div className="coll3-foot">
          <span>
            {items.length} əşya
            {prices.length > 0 && <> · {min === max ? `${min} AZN` : `${min}–${max} AZN`}</>}
          </span>
          <Link to={href} className="coll3-link">
            Bax <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Collections() {
  const { listings, requireAuth } = useApp()
  const all = useAllCollections()
  const [creating, setCreating] = useState(false)

  return (
    <div className="container section-page collections-page">
      <header className="section-page-head">
        <div>
          <span className="coll3-eyebrow">Seçilmiş toplular</span>
          <h1 className="page-title">Kolleksiyalar</h1>
          <p className="coll3-lead">Mövzu üzrə seçilmiş tapıntılar — evin, qarderobun və hobbilərin üçün.</p>
        </div>
        <button className="btn btn-primary" onClick={() => requireAuth() && setCreating(true)}>
          <Plus size={16} /> Kolleksiya yarat
        </button>
      </header>

      <div className="coll3-grid">
        {(() => {
          // hər kolleksiya fərqli üz şəkli ilə görünsün
          const used = new Set()
          return all.map((c, i) => {
            const items = listings.filter(c.match)
            const cover = items.find((l) => !used.has(l.images[0])) || items[0]
            if (cover) used.add(cover.images[0])
            return <CollectionCard key={c.id} c={c} items={items} cover={cover} index={i} />
          })
        })()}
      </div>

      {creating && <CreateCollection onClose={() => setCreating(false)} />}
    </div>
  )
}

export function CollectionDetail() {
  const { id } = useParams()
  const { listings } = useApp()
  const all = useAllCollections()
  const c = all.find((x) => x.id === id) || curatedById(id)
  if (!c) return <NotFound />
  const items = listings.filter(c.match)
  const others = all.filter((x) => x.id !== c.id).slice(0, 4)

  return (
    <div className="container collections-page">
      <Link to="/kolleksiyalar" className="back-link">
        <ArrowLeft size={16} /> Bütün kolleksiyalar
      </Link>
      <header className="collection-hero">
        <CollectionCover items={items} />
        <div>
          <h1 className="page-title">{c.title}</h1>
          {c.text && <p className="page-lead">{c.text}</p>}
          <span className="explore-count">
            {items.length} məhsul{c.mine ? ` · ${c.isPublic ? 'hamı görür' : 'yalnız sən görürsən'}` : ''}
          </span>
        </div>
      </header>

      {items.length > 0 ? (
        <div className="grid-4 explore-grid">
          {items.map((it) => (
            <ProductCard key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Bu kolleksiyada hələ əşya yoxdur</h3>
          <p>Tezliklə yeni tapıntılar əlavə olunacaq.</p>
        </div>
      )}

      <section className="block">
        <div className="block-head">
          <h2 className="h2">Digər kolleksiyalar</h2>
        </div>
        <div className="curated-grid curated-grid-sm">
          {others.map((o) => {
            const its = listings.filter(o.match)
            return (
              <Link key={o.id} to={`/kolleksiyalar/${o.id}`} className="curated-card">
                <CollectionCover items={its} />
                <div className="curated-body">
                  <strong>{o.title}</strong>
                  <small>{its.length} məhsul</small>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
