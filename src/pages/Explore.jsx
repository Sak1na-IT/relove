import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Dropdown from '../components/Dropdown'
import { CATEGORIES, CONDITIONS, DISTRICTS, catById } from '../data'
import { useApp } from '../store'

const SORTS = [
  { value: 'new', label: 'Ən yeni' },
  { value: 'low', label: 'Ucuzdan bahaya' },
  { value: 'high', label: 'Bahadan ucuza' },
]
const PRICES = [
  { value: '0-50', label: '50 AZN-ə qədər' },
  { value: '50-200', label: '50–200 AZN' },
  { value: '200-', label: '200 AZN-dən çox' },
]
const MODE_LABELS = { sale: 'Satış', swap: 'Dəyiş-düyüş', free: 'Pulsuz paylaşım' }

export default function Explore() {
  const { listings } = useApp()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const mode = params.get('mode') || ''
  const cond = params.get('cond') || ''
  const district = params.get('district') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || 'new'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const [min, max] = price ? price.split('-').map((n) => (n === '' ? null : Number(n))) : [null, null]
    let r = listings.filter((l) => {
      if (q && !`${l.title} ${l.description}`.toLowerCase().includes(q.toLowerCase())) return false
      if (cat && l.category !== cat) return false
      if (mode && !l.modes.includes(mode)) return false
      if (cond && l.condition !== cond) return false
      if (district && l.district !== district) return false
      if (min !== null && l.price < min) return false
      if (max !== null && l.price > max) return false
      return true
    })
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    return r
  }, [listings, q, cat, mode, cond, district, price, sort])

  const hasFilters = [q, cat, mode, cond, district, price].some(Boolean)
  const title = cat ? catById(cat)?.label : mode ? MODE_LABELS[mode] : 'Kəşf et'

  return (
    <div className="container explore">
      <header className="explore-head">
        <div className="explore-title-row">
          <h1 className="page-title">{title}</h1>
          <span className="explore-count">{results.length} elan</span>
        </div>
        <form className="search-big" onSubmit={(e) => e.preventDefault()} role="search">
          <Search size={18} />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Əşya, marka və ya kateqoriya axtar..." aria-label="Axtarış" />
          {q && (
            <button type="button" className="icon-btn icon-btn-sm" onClick={() => set('q', '')} aria-label="Təmizlə">
              <X size={16} />
            </button>
          )}
        </form>
      </header>

      <div className="cat-chips" role="tablist" aria-label="Kateqoriyalar">
        <button className={`cat-chip ${!cat ? 'is-on' : ''}`} onClick={() => set('cat', '')}>
          Hamısı
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cat-chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => set('cat', cat === c.id ? '' : c.id)}>
            <span className="cat-chip-img">
              <img src={c.photo} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
            </span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <Dropdown label="Satış növü" allLabel="Hamısı" value={mode} onChange={(v) => set('mode', v)} options={Object.entries(MODE_LABELS).map(([value, label]) => ({ value, label }))} />
          <Dropdown label="Qiymət" allLabel="İstənilən qiymət" value={price} onChange={(v) => set('price', v)} options={PRICES} />
          <Dropdown label="Vəziyyət" allLabel="İstənilən vəziyyət" value={cond} onChange={(v) => set('cond', v)} options={CONDITIONS.map((c) => ({ value: c, label: c }))} />
          <Dropdown label="Ərazi" allLabel="Bütün Bakı" value={district} onChange={(v) => set('district', v)} options={DISTRICTS.map((d) => ({ value: d, label: d }))} />
          {hasFilters && (
            <button className="filter-clear" onClick={() => setParams({}, { replace: true })}>
              <X size={14} /> Filterləri təmizlə
            </button>
          )}
        </div>
        <div className="filter-sort-wrap">
          <span>Sırala:</span>
          <Dropdown label="Sırala" align="right" value={sort} onChange={(v) => set('sort', v === 'new' ? '' : v)} options={SORTS} />
        </div>
      </div>

      {results.length > 0 ? (
        <>
          <div className="grid-4 explore-grid">
            {results.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          <div className="results-end">
            <div>
              <h3>Axtardığını tapmadın?</h3>
              <p>Axtarışını yadda saxla — uyğun əşya paylaşılanda sənə ilk biz xəbər verək.</p>
            </div>
            <div className="results-end-actions">
              <Link to="/deyis" className="btn btn-primary">Axtarışı yadda saxla</Link>
              <Link to="/paylas" className="btn btn-ghost">Öz əşyanı paylaş</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty">
          <h3>Heç nə tapılmadı</h3>
          <p>Filterləri dəyiş və ya başqa söz yoxla.</p>
          <button className="btn btn-ghost" onClick={() => setParams({})}>
            Filterləri sıfırla
          </button>
        </div>
      )}
    </div>
  )
}
