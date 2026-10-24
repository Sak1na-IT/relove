import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import Img from './Img'
import { formatPrice, likesOf } from '../data'
import { useApp } from '../store'

const BADGE = { sale: 'Satış', swap: 'Dəyiş-düyüş', free: 'Pulsuz paylaşım' }

export default function ProductCard({ item }) {
  const { favorites, toggleFavorite } = useApp()
  const fav = favorites.includes(item.id)
  const likes = likesOf(item.id) + (fav ? 1 : 0)

  return (
    <article className="card">
      <div className="card-media">
        <Link to={`/elan/${item.id}`} className="card-media-link" aria-label={item.title}>
          <Img src={item.images[0]} alt={item.title} />
        </Link>
        <button
          className={`card-heart ${fav ? 'is-on' : ''}`}
          onClick={() => toggleFavorite(item.id)}
          aria-label={fav ? 'Seçilmişlərdən çıxar' : 'Seçilmişlərə əlavə et'}
        >
          <Heart size={16} strokeWidth={1.8} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <div className="card-badges">
          {item.modes.map((m) => (
            <span key={m} className={`tag tag-${m}`}>{BADGE[m]}</span>
          ))}
        </div>
      </div>
      <Link to={`/elan/${item.id}`} className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <span className={`card-price ${item.price === 0 ? 'is-free' : ''}`}>{formatPrice(item.price)}</span>
        <span className="card-meta">
          <span className="with-icon"><MapPin size={12} /> {item.district}</span>
          <span className="with-icon"><Heart size={12} /> {likes}</span>
        </span>
      </Link>
    </article>
  )
}
