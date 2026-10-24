import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryThumb from '../components/CategoryThumb'
import { CATEGORIES, CONDITIONS, DISTRICTS, MODES, catById } from '../data'
import { useApp } from '../store'

const SORTS = { new: 'Ən yeni', low: 'Ucuzdan bahaya', high: 'Bahadan ucuza' }
const PRICES = { '': 'Qiymət', '0-50': '50 AZN-ə qədər', '50-200': '50–200 AZN', '200-': '200 AZN-dən çox' }

function FilterSelect({ value, onChange, placeholder, options, label }) {
  return (
    <select className={`filter-select ${value ? 'is-on' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">{placeholder}</option>
      {options.map(([v, t]) => (
        <option key={v} value={v}>{t}</option>
      ))}
    </select>
  )
}

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
  const title = cat ? catById(cat)?.label : mode ? MODES[mode].label : 'Kəşf et'

  return (
    <div className="container explore">
      <header className="explore-head">
        <h1 className="page-title">{title}</h1>
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

      <div className="cat-row cat-row-sm">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cat-item ${cat === c.id ? 'is-on' : ''}`} onClick={() => set('cat', cat === c.id ? '' : c.id)}>
            <CategoryThumb category={c} small />
            <span className="cat-label">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <FilterSelect label="Satış növü" value={mode} onChange={(v) => set('mode', v)} placeholder="Satış növü" options={Object.entries(MODES).map(([k, m]) => [k, m.label])} />
        <FilterSelect label="Qiymət" value={price} onChange={(v) => set('price', v)} placeholder="Qiymət" options={Object.entries(PRICES).filter(([k]) => k)} />
        <FilterSelect label="Vəziyyət" value={cond} onChange={(v) => set('cond', v)} placeholder="Vəziyyət" options={CONDITIONS.map((c) => [c, c])} />
        <FilterSelect label="Ərazi" value={district} onChange={(v) => set('district', v)} placeholder="Ərazi" options={DISTRICTS.map((d) => [d, d])} />
        <select className="filter-select filter-sort" value={sort} onChange={(e) => set('sort', e.target.value === 'new' ? '' : e.target.value)} aria-label="Sıralama">
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        {hasFilters && (
          <button className="filter-clear" onClick={() => setParams({}, { replace: true })}>
            <X size={14} /> Təmizlə
          </button>
        )}
      </div>

      <p className="result-count">{results.length} elan</p>

      {results.length > 0 ? (
        <div className="grid-5">
          {results.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
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
