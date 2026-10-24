import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryBrowser from '../components/CategoryBrowser'
import { useApp } from '../store'

// İkinci əl — satış elanları
export default function Explore() {
  const { listings } = useApp()
  const pool = useMemo(() => listings.filter((l) => l.modes.includes('sale')), [listings])

  return (
    <div className="container section-page">
      <header className="section-page-head">
        <div>
          <h1 className="page-title">İkinci əl</h1>
        </div>
        <Link to="/paylas?mode=sale" className="btn btn-primary">
          <Plus size={16} /> Satış elanı yerləşdir
        </Link>
      </header>

      <CategoryBrowser
        pool={pool}
        renderItem={(item) => <ProductCard key={item.id} item={item} />}
        searchPlaceholder="İkinci əl elanlarında axtar — məs. palto, lampa..."
        footer={
          <div className="results-end">
            <div>
              <h3>Axtardığını tapmadın?</h3>
              <p>Bəlkə kimsə onu dəyişmək istəyir — dəyiş-düyüş elanlarına da bax.</p>
            </div>
            <div className="results-end-actions">
              <Link to="/deyis" className="btn btn-primary">Dəyiş-düyüşə bax</Link>
              <Link to="/paylas?mode=sale" className="btn btn-ghost">Satış elanı yerləşdir</Link>
            </div>
          </div>
        }
      />
    </div>
  )
}
