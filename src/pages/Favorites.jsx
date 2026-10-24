import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useApp } from '../store'

export default function Favorites() {
  const { favorites, getItem } = useApp()
  const items = favorites.map(getItem).filter(Boolean)

  return (
    <div className="container favorites">
      <header className="explore-head">
        <div className="explore-title-row">
          <h1 className="page-title">Bəyəndiklərim</h1>
          <span className="explore-count">{items.length} əşya</span>
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
          <Heart size={30} strokeWidth={1.4} />
          <h3>Hələ heç nə bəyənməmisən</h3>
          <p>Əşyanın üzərindəki ürək işarəsinə bas — burada saxlanacaq.</p>
          <Link to="/ikinci-el" className="btn btn-primary">Kəşfə başla</Link>
        </div>
      )}
    </div>
  )
}
