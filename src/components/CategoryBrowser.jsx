import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, LayoutGrid } from 'lucide-react'
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

const POPULAR_SUBS = [
  ['qadin', 'Palto və gödəkçə'],
  ['ev', 'Kreslo'],
  ['elektronika', 'Qulaqlıq'],
  ['kisi', 'Krossovka'],
  ['elektronika', 'Fotoaparat'],
  ['ev', 'Masa lampası'],
]

function TopNav({ dept, sub, pool, onPick }) {
  const [hover, setHover] = useState('')
  const timer = useRef(null)
  const count = (id) => pool.filter((l) => l.dept === id).length
  const subCount = (d, s) => pool.filter((l) => l.dept === d && l.sub === s).length

  const enter = (id) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHover(id), 140)
  }
  const leave = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHover(''), 160)
  }

  const active = dept ? deptById(dept) : null
  const hovered = hover && hover !== dept ? deptById(hover) : null

  return (
    <div className="topcat" onMouseLeave={leave}>
      <div className="topcat-bar" role="tablist" aria-label="Kateqoriyalar">
        <button role="tab" aria-selected={!dept} className={`topcat-tab ${!dept ? 'is-on' : ''}`} onClick={() => onPick('', '')} onMouseEnter={() => enter('')}>
          <span className="topcat-dot"><LayoutGrid size={14} strokeWidth={1.6} /></span>
          Hamısı
        </button>
        {DEPARTMENTS.map((d) => {
          const n = count(d.id)
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={dept === d.id}
              className={`topcat-tab ${dept === d.id ? 'is-on' : ''} ${hover === d.id ? 'is-hover' : ''}`}
              onClick={() => onPick(d.id, '')}
              onMouseEnter={() => enter(d.id)}
              onFocus={() => setHover('')}
              disabled={n === 0}
            >
              <span className="topcat-dot">
                <Img src={d.photo} alt="" />
              </span>
              {d.label}
            </button>
          )
        })}
      </div>

      {hovered && (
        <div className="topcat-pop" onMouseEnter={() => enter(hovered.id)}>
          {hovered.groups.map((g) => (
            <div key={g.title} className="topcat-pop-col">
              <span>{g.title}</span>
              {g.items.map((it) => {
                const c = subCount(hovered.id, it)
                return (
                  <button key={it} onClick={() => { onPick(hovered.id, it); setHover('') }} disabled={!c}>
                    {it}
                    {c > 0 && <em>{c}</em>}
                  </button>
                )
              })}
            </div>
          ))}
          <button className="topcat-pop-all" onClick={() => { onPick(hovered.id, ''); setHover('') }}>
            Bütün “{hovered.label}” elanları <em>{count(hovered.id)}</em>
          </button>
        </div>
      )}

      <div className="topcat-subs">
        {active ? (
          <>
            <button className={!sub ? 'is-on' : ''} onClick={() => onPick(dept, '')}>
              Hamısı <em>{count(dept)}</em>
            </button>
            {active.groups.flatMap((g) => g.items).map((it) => {
              const c = subCount(dept, it)
              return (
                <button key={it} className={sub === it ? 'is-on' : ''} onClick={() => onPick(dept, sub === it ? '' : it)} disabled={!c}>
                  {it} {c > 0 && <em>{c}</em>}
                </button>
              )
            })}
          </>
        ) : (
          <>
            <span className="topcat-subs-label">Populyar:</span>
            {POPULAR_SUBS.filter(([d, s]) => subCount(d, s) > 0).map(([d, s]) => (
              <button key={s} onClick={() => onPick(d, s)}>
                {s}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
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
    <div className="browse4">
      <TopNav dept={dept} sub={sub} pool={pool} onPick={pick} />

      <div className="browse4-main">
        <form className="search-big browse-search" onSubmit={(e) => e.preventDefault()} role="search">
          <Search size={18} />
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder={d ? `${d.label} bölməsində axtar...` : searchPlaceholder} aria-label="Axtarış" />
          {q && (
            <button type="button" className="icon-btn icon-btn-sm" onClick={() => set('q', '')} aria-label="Təmizlə">
              <X size={16} />
            </button>
          )}
        </form>

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
