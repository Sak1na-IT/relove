import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

export default function Collections() {
  const { listings } = useApp()

  return (
    <div className="container collections-page">
      <header className="explore-head">
        <div className="explore-title-row">
          <h1 className="page-title">Kolleksiyalar</h1>
          <span className="explore-count">{CURATED.length} kolleksiya</span>
        </div>
        <p className="page-lead">Redaksiyamızın seçimi: mövzu ilə bir araya gətirilmiş tapıntılar.</p>
      </header>

      <div className="curated-grid">
        {CURATED.map((c) => {
          const items = listings.filter(c.match)
          return (
            <Link key={c.id} to={`/kolleksiyalar/${c.id}`} className="curated-card">
              <CollectionCover items={items} />
              <div className="curated-body">
                <strong>{c.title}</strong>
                <p>{c.text}</p>
                <small>{items.length} məhsul</small>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function CollectionDetail() {
  const { id } = useParams()
  const { listings } = useApp()
  const c = curatedById(id)
  if (!c) return <NotFound />
  const items = listings.filter(c.match)
  const others = CURATED.filter((x) => x.id !== c.id).slice(0, 4)

  return (
    <div className="container collections-page">
      <Link to="/kolleksiyalar" className="back-link">
        <ArrowLeft size={16} /> Bütün kolleksiyalar
      </Link>
      <header className="collection-hero">
        <CollectionCover items={items} />
        <div>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-lead">{c.text}</p>
          <span className="explore-count">{items.length} məhsul</span>
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
