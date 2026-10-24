import { Link } from 'react-router-dom'
import { Heart, Globe, Lock } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import { COLLECTIONS } from '../data'
import { useApp } from '../store'

export default function Favorites() {
  const { favorites, getItem } = useApp()
  const items = favorites.map(getItem).filter(Boolean)

  return (
    <div className="container favorites">
      <header className="explore-head">
        <p className="eyebrow">Seçilmişlər</p>
        <h1 className="display display-md">Bir gün <em>sənin olacaqlar</em></h1>
      </header>

      <section className="section-tight">
        <h2 className="h3">Kolleksiyalarım</h2>
        <div className="collections collections-row">
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
                  {c.public ? <Globe size={13} /> : <Lock size={13} />} {c.items.length} əşya
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <h2 className="h3">Bəyəndiklərim ({items.length})</h2>
        {items.length > 0 ? (
          <div className="grid-4">{items.map((it) => <ProductCard key={it.id} item={it} />)}</div>
        ) : (
          <div className="empty">
            <Heart size={30} strokeWidth={1.4} />
            <h3>Hələ heç nə bəyənməmisən</h3>
            <p>Ürək ikonuna basaraq əşyaları burada saxla.</p>
            <Link to="/kesf" className="btn btn-primary">Kəşfə başla</Link>
          </div>
        )}
      </section>
    </div>
  )
}
