import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
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

function SlimNav({ dept, sub, pool, onPick, unit }) {
  const count = (id) => pool.filter((l) => l.dept === id).length
  const subCount = (d, s) => pool.filter((l) => l.dept === d && l.sub === s).length
  return (
    <nav className="slim" aria-label="Kateqoriyalar">
      <button className={`slim-row slim-all ${!dept ? 'is-on' : ''}`} onClick={() => onPick('', '')}>
        <span>Hamısı</span>
        <em>{pool.length}</em>
      </button>
      {DEPARTMENTS.map((d) => {
        const n = count(d.id)
        const open = dept === d.id
        return (
          <div key={d.id} className={`slim-dept ${open ? 'is-open' : ''}`}>
            <button className={`slim-row ${open && !sub ? 'is-on' : ''} ${open ? 'is-parent' : ''}`} onClick={() => onPick(open && !sub ? '' : d.id, '')} disabled={n === 0} aria-expanded={open}>
              <span>{d.label}</span>
              <em>{n}</em>
            </button>
            {open && (
              <div className="slim-sub">
                {d.groups.map((g) =>
                  g.items.map((it) => {
                    const c = subCount(d.id, it)
                    if (!c) return null
                    return (
                      <button key={it} className={`slim-subrow ${sub === it ? 'is-on' : ''}`} onClick={() => onPick(d.id, sub === it ? '' : it)}>
                        <span>{it}</span>
                        <em>{c}</em>
                      </button>
                    )
                  }),
                )}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

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

  const results = useMemo(() => {
    let r = pool.filter((l) => {
      if (dept && l.dept !== dept) return false
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
  }, [pool, params])

  const d = dept ? deptById(dept) : null
  const title = q ? `“${q}” üzrə nəticələr` : sub || d?.label || allTitle
  const activeFilters = filters.filter((f) => get(f.key))
  const pick = (dd, ss) => setMany({ dept: dd, sub: ss })

  return (
    <div className="browse3">
      <aside className="browse3-side">
        <SlimNav dept={dept} sub={sub} pool={pool} onPick={pick} unit={unit} />
      </aside>

      <div className="browse3-main">
        <form className="search-big browse-search" onSubmit={(e) => e.preventDefault()} role="search">
          <Search size={18} />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder={d ? `${d.label} bölməsində axtar...` : searchPlaceholder} aria-label="Axtarış" />
          {q && (
            <button type="button" className="icon-btn icon-btn-sm" onClick={() => set('q', '')} aria-label="Təmizlə">
              <X size={16} />
            </button>
          )}
        </form>

        {/* mobil: kateqoriya seçimi */}
        <div className="browse3-mobile">
          <select value={dept} onChange={(e) => pick(e.target.value, '')} aria-label="Kateqoriya">
            <option value="">Bütün kateqoriyalar</option>
            {DEPARTMENTS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
          {d && (
            <select value={sub} onChange={(e) => pick(dept, e.target.value)} aria-label="Alt-kateqoriya">
              <option value="">Hamısı</option>
              {d.groups.flatMap((g) => g.items).map((it) => (
                <option key={it} value={it}>{it}</option>
              ))}
            </select>
          )}
        </div>

        <div className="browse3-head">
          <div className="browse3-title">
            {d && (
              <span className="browse3-crumb">
                <button onClick={() => pick('', '')}>Hamısı</button> / {sub ? <button onClick={() => pick(dept, '')}>{d.label}</button> : d.label}
              </span>
            )}
            <h2>{title}</h2>
          </div>
          <span className="explore-count">
            {results.length} {unit}
          </span>
        </div>

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

        {results.length > 0 ? (
          <div className={gridClass}>{results.map(renderItem)}</div>
        ) : (
          <div className="empty explore2-empty">
            <h3>Bu seçimə uyğun {unit} yoxdur</h3>
            <p>Filteri dəyiş və ya başqa kateqoriyaya bax.</p>
            <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>
              Hamısına qayıt
            </button>
          </div>
        )}
        {footer}
      </div>
    </div>
  )
}
