import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryBrowser from '../components/CategoryBrowser'
import { useApp } from '../store'
import { deptById } from '../data'

const HEADS = {
  qadin: 'Qadın qarderobu',
  kisi: 'Kişi qarderobu',
  usaq: 'Uşaqlar üçün',
}

// İkinci əl — satış elanları
export default function Explore() {
  const { listings } = useApp()
  const [params] = useSearchParams()
  const dept = params.get('dept') || ''
  const title = HEADS[dept] || deptById(dept)?.label || 'İkinci əl'
  const pool = useMemo(() => listings.filter((l) => l.modes.includes('sale')), [listings])

  return (
    <div className="container section-page">
      <header className="section-page-head">
        <div>
          <span className="coll3-eyebrow">İkinci əl · geyim və daha çox</span>
          <h1 className="page-title">{title}</h1>
        </div>
        <Link to="/paylas?mode=sale" className="btn btn-primary">
          <Plus size={16} /> Satış elanı yerləşdir
        </Link>
      </header>

      <CategoryBrowser
        pool={pool}
        renderItem={(item) => <ProductCard key={item.id} item={item} />}
        searchPlaceholder="Axtar — məs. dəri gödəkçə, cins, çəkmə..."
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
