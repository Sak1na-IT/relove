import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Img from './Img'
import ModeBadge from './ModeBadge'
import { formatPrice } from '../data'
import { useApp } from '../store'

export default function ProductCard({ item }) {
  const { favorites, toggleFavorite } = useApp()
  const fav = favorites.includes(item.id)
  const extraModes = item.modes.filter((m) => m !== 'sale')

  return (
    <article className="card">
      <Link to={`/elan/${item.id}`} className="card-media">
        <Img src={item.images[0]} alt={item.title} />
        {extraModes.length > 0 && (
          <div className="card-badges">
            {extraModes.map((m) => (
              <ModeBadge key={m} mode={m} />
            ))}
          </div>
        )}
      </Link>
      <div className="card-body">
        <Link to={`/elan/${item.id}`} className="card-text">
          <h3 className="card-title">{item.title}</h3>
          <span className={`card-price ${item.price === 0 ? 'is-free' : ''}`}>{formatPrice(item.price)}</span>
        </Link>
        <button
          className={`card-fav ${fav ? 'is-on' : ''}`}
          onClick={() => toggleFavorite(item.id)}
          aria-label={fav ? 'Seçilmişlərdən çıxar' : 'Seçilmişlərə əlavə et'}
        >
          <Heart size={17} strokeWidth={1.7} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  )
}
