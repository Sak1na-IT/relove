import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, ArrowLeft } from 'lucide-react'
import Img from './Img'
import Dropdown from './Dropdown'
import { DEPARTMENTS, DISTRICTS, deptById } from '../data'

// Ortaq filter tərifləri
export const PRICE_FILTER = {
  key: 'price',
  label: 'Qiymət',
  allLabel: 'İstənilən qiymət',
  options: [
    { value: '0-50', label: '50 AZN-ə qədər' },
    { value: '50-200', label: '50 – 200 AZN' },
    { value: '200-500', label: '200 – 500 AZN' },
    { value: '500-', label: '500 AZN-dən çox' },
  ],
  test: (l, v) => {
    const [min, max] = v.split('-').map((n) => (n === '' ? null : Number(n)))
    return (min === null || l.price >= min) && (max === null || l.price <= max)
  },
}

export const DISTRICT_FILTER = {
  key: 'district',
  label: 'Ərazi',
  allLabel: 'Bütün Bakı',
  options: DISTRICTS.map((d) => ({ value: d, label: d })),
  test: (l, v) => l.district === v,
}

const SORTS = [
  { value: 'new', label: 'Ən yeni' },
  { value: 'low', label: 'Ucuzdan bahaya' },
  { value: 'high', label: 'Bahadan ucuza' },
]

/**
 * Bölmə seçilməyib → fotolu bölmə kartları + bütün elanlar.
 * Bölmə seçilib → tam en: bölmə adı, alt-kateqoriyalar, filterlər və əşyalar.
 */
export default function CategoryBrowser({
  pool,
  renderItem,
  gridClass = 'browse-grid',
  searchPlaceholder = 'Axtar...',
  filters = [PRICE_FILTER, DISTRICT_FILTER],
  allTitle = 'Bütün elanlar',
  unit = 'elan',
  footer = null,
}) {
  const [params, setParams] = useSearchParams()
  const get = (k) => params.get(k) || ''
  const dept = get('dept')
  const sub = get('sub')
  const q = get('q')
  const sort = get('sort') || 'new'

  const setMany = (obj) => {
    const next = new URLSearchParams(params)
    Object.entries(obj).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const set = (k, v) => setMany({ [k]: v })

  const deptCount = (id) => pool.filter((l) => l.dept === id).length
  const inDept = dept ? pool.filter((l) => l.dept === dept) : pool
  const subCount = (s) => inDept.filter((l) => l.sub === s).length

  const results = useMemo(() => {
    let r = inDept.filter((l) => {
      if (sub && l.sub !== sub) return false
      if (q) {
        const hay = `${l.title} ${l.description || ''} ${(l.wantsText || []).join(' ')} ${l.defect || ''}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return filters.every((f) => !get(f.key) || f.test(l, get(f.key)))
    })
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    return r
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inDept, sub, q, sort, params])

  const d = dept ? deptById(dept) : null
  const subs = d ? d.groups.flatMap((g) => g.items) : []
  const activeFilters = filters.filter((f) => get(f.key))

  const searchBox = (
    <form className="search-big browse-search" onSubmit={(e) => e.preventDefault()} role="search">
      <Search size={18} />
      <input
        value={q}
        onChange={(e) => set('q', e.target.value)}
        placeholder={d ? `${d.label} bölməsində axtar...` : searchPlaceholder}
        aria-label="Axtarış"
      />
      {q && (
        <button type="button" className="icon-btn icon-btn-sm" onClick={() => set('q', '')} aria-label="Təmizlə">
          <X size={16} />
        </button>
      )}
    </form>
  )

  const toolbar = (
    <div className="browse-toolbar">
      <div className="browse-filters">
        {filters.map((f) => (
          <Dropdown key={f.key} label={f.label} allLabel={f.allLabel} value={get(f.key)} onChange={(v) => set(f.key, v)} options={f.options} />
        ))}
        {activeFilters.length > 0 && (
          <button className="filter-clear" onClick={() => setMany(Object.fromEntries(filters.map((f) => [f.key, ''])))}>
            <X size={14} /> Filterləri təmizlə
          </button>
        )}
      </div>
      <div className="filter-sort-wrap">
        <span>Sırala:</span>
        <Dropdown label="Sırala" align="right" value={sort} onChange={(v) => set('sort', v === 'new' ? '' : v)} options={SORTS} />
      </div>
    </div>
  )

  const grid =
    results.length > 0 ? (
      <div className={gridClass}>{results.map(renderItem)}</div>
    ) : (
      <div className="empty explore2-empty">
        <h3>Bu seçimə uyğun {unit} yoxdur</h3>
        <p>Filteri dəyiş və ya başqa kateqoriyaya bax.</p>
        <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>
          Hamısına qayıt
        </button>
      </div>
    )

  // ---------- Bölmə seçilib: tam en ----------
  if (d) {
    return (
      <div className="browse is-focused">
        <div className="browse-focus-head">
          <button className="browse-back" onClick={() => setMany({ dept: '', sub: '' })}>
            <ArrowLeft size={16} /> Bütün kateqoriyalar
          </button>
          <div className="browse-focus-title">
            <span className="browse-focus-photo">
              <Img src={d.photo} alt="" />
            </span>
            <h2>{sub || d.label}</h2>
            <span className="explore-count">
              {results.length} {unit}
            </span>
          </div>
        </div>

        <div className="sub-pills" role="tablist" aria-label="Alt-kateqoriyalar">
          <button role="tab" aria-selected={!sub} className={!sub ? 'is-on' : ''} onClick={() => set('sub', '')}>
            Hamısı <em>{inDept.length}</em>
          </button>
          {subs.map((s) => {
            const n = subCount(s)
            return (
              <button key={s} role="tab" aria-selected={sub === s} className={sub === s ? 'is-on' : ''} onClick={() => set('sub', sub === s ? '' : s)} disabled={n === 0}>
                {s} {n > 0 && <em>{n}</em>}
              </button>
            )
          })}
        </div>

        {searchBox}
        {toolbar}
        {grid}
        {footer}
      </div>
    )
  }

  // ---------- Bölmə seçilməyib ----------
  return (
    <div className="browse">
      {searchBox}
      {!q && (
        <div className="dept-tiles" aria-label="Kateqoriyalar">
          {DEPARTMENTS.map((x) => {
            const n = deptCount(x.id)
            return (
              <button key={x.id} className="dept-tile" onClick={() => setMany({ dept: x.id, sub: '' })} disabled={n === 0}>
                <span className="dept-tile-photo">
                  <Img src={x.photo} alt="" />
                </span>
                <strong>{x.label}</strong>
                <small>
                  {n} {unit}
                </small>
              </button>
            )
          })}
        </div>
      )}
      <div className="browse-all-head">
        <h2 className="h3-serif">{q ? `“${q}” üzrə nəticələr` : allTitle}</h2>
        <span className="explore-count">
          {results.length} {unit}
        </span>
      </div>
      {toolbar}
      {grid}
      {footer}
    </div>
  )
}
