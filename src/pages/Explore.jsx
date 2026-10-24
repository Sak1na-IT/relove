import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, X, ChevronDown, LayoutGrid, User, UserRound, Baby, Sofa, Smartphone, Bike, BookOpen,
  SlidersHorizontal, Sparkles,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Dropdown from '../components/Dropdown'
import { DISTRICTS, DEPARTMENTS, deptById } from '../data'
import { useApp } from '../store'

const ICONS = { User, UserRound, Baby, Sofa, Smartphone, Bike, BookOpen }
const SORTS = [
  { value: 'new', label: 'Ən yeni' },
  { value: 'low', label: 'Ucuzdan bahaya' },
  { value: 'high', label: 'Bahadan ucuza' },
]
const PRICES = [
  { value: '0-50', label: '50 AZN-ə qədər' },
  { value: '50-200', label: '50 – 200 AZN' },
  { value: '200-500', label: '200 – 500 AZN' },
  { value: '500-', label: '500 AZN-dən çox' },
]
const MODE_LABELS = { sale: 'Satış', swap: 'Dəyiş-düyüş' }

function Sidebar({ p, setMany, counts, onDone }) {
  const [open, setOpen] = useState(p.dept)
  useEffect(() => setOpen(p.dept), [p.dept])

  const pickDept = (id) => {
    if (p.dept === id && !p.sub) {
      setOpen(open === id ? '' : id)
      return
    }
    setMany({ dept: id, cat: '', sub: '' })
    setOpen(id)
  }

  return (
    <nav className="catnav" aria-label="Kateqoriyalar">
      <p className="catnav-title">Kateqoriyalar</p>
      <ul className="catnav-list">
        <li>
          <button
            className={`catnav-dept ${!p.dept ? 'is-on' : ''}`}
            onClick={() => {
              setMany({ dept: '', cat: '', sub: '' })
              onDone?.()
            }}
          >
            <LayoutGrid size={18} strokeWidth={1.4} className="catnav-icon" />
            <span className="catnav-label">Bütün elanlar</span>
            <span className="catnav-count">{counts.all}</span>
          </button>
        </li>
        {DEPARTMENTS.map((d) => {
          const Icon = ICONS[d.icon] || LayoutGrid
          const isOpen = open === d.id
          return (
            <li key={d.id} className={isOpen ? 'is-open' : ''}>
              <button className={`catnav-dept ${p.dept === d.id ? 'is-on' : ''}`} onClick={() => pickDept(d.id)} aria-expanded={isOpen}>
                <Icon size={18} strokeWidth={1.4} className="catnav-icon" />
                <span className="catnav-label">{d.label}</span>
                <span className="catnav-count">{counts.dept[d.id] || 0}</span>
                <ChevronDown size={14} className="catnav-chev" />
              </button>
              <div className="catnav-sub" hidden={!isOpen}>
                {d.groups.map((g) => (
                  <div key={g.title} className="catnav-group">
                    <span className="catnav-group-title">{g.title}</span>
                    {g.items.map((it) => {
                      const n = counts.sub[`${d.id}:${it}`] || 0
                      return (
                        <button
                          key={it}
                          className={`catnav-item ${p.dept === d.id && p.sub === it ? 'is-on' : ''} ${n === 0 ? 'is-empty' : ''}`}
                          onClick={() => {
                            setMany({ dept: d.id, cat: '', sub: p.sub === it ? '' : it })
                            onDone?.()
                          }}
                        >
                          <span>{it}</span>
                          {n > 0 && <em>{n}</em>}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ul>

      <Link to="/ikinci-sans" className="catnav-promo">
        <Sparkles size={16} strokeWidth={1.5} />
        <span>
          <strong>İkinci şans</strong>
          Düzəldilə bilən qüsurlu əşyalar
        </span>
      </Link>
    </nav>
  )
}

export default function Explore() {
  const { listings } = useApp()
  const [params, setParams] = useSearchParams()
  const [sheet, setSheet] = useState(false)

  const p = {
    q: params.get('q') || '',
    cat: params.get('cat') || '',
    mode: params.get('mode') || '',
    district: params.get('district') || '',
    price: params.get('price') || '',
    sort: params.get('sort') || 'new',
    dept: params.get('dept') || '',
    sub: params.get('sub') || '',
  }

  const setMany = (obj) => {
    const next = new URLSearchParams(params)
    Object.entries(obj).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }
  const set = (k, v) => setMany({ [k]: v })

  const pool = useMemo(() => listings.filter((l) => !l.modes.includes('free')), [listings])

  const counts = useMemo(() => {
    const c = { all: pool.length, dept: {}, sub: {} }
    pool.forEach((l) => {
      c.dept[l.dept] = (c.dept[l.dept] || 0) + 1
      c.sub[`${l.dept}:${l.sub}`] = (c.sub[`${l.dept}:${l.sub}`] || 0) + 1
    })
    return c
  }, [pool])

  const results = useMemo(() => {
    const [min, max] = p.price ? p.price.split('-').map((n) => (n === '' ? null : Number(n))) : [null, null]
    let r = pool.filter((l) => {
      if (p.q && !`${l.title} ${l.description}`.toLowerCase().includes(p.q.toLowerCase())) return false
      if (p.dept && l.dept !== p.dept) return false
      if (p.sub && l.sub !== p.sub) return false
      if (p.cat && l.category !== p.cat) return false
      if (p.mode && !l.modes.includes(p.mode)) return false
      if (p.district && l.district !== p.district) return false
      if (min !== null && l.price < min) return false
      if (max !== null && l.price > max) return false
      return true
    })
    if (p.sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (p.sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    return r
  }, [pool, p.q, p.dept, p.sub, p.cat, p.mode, p.district, p.price, p.sort])

  const deptLabel = p.dept ? deptById(p.dept)?.label : ''
  const title = p.sub || deptLabel || 'Bütün elanlar'

  const active = [
    p.mode && { k: 'mode', label: MODE_LABELS[p.mode] },
    p.price && { k: 'price', label: PRICES.find((x) => x.value === p.price)?.label },
    p.district && { k: 'district', label: p.district },
    p.q && { k: 'q', label: `“${p.q}”` },
  ].filter(Boolean)

  return (
    <div className="container explore2">
      <aside className="explore2-side" aria-label="Kateqoriyalar və filterlər">
        <Sidebar p={p} setMany={setMany} counts={counts} />
      </aside>

      <div className="explore2-main">
        <header className="explore2-head">
          <nav className="crumbs2" aria-label="Yol">
            <button onClick={() => setMany({ dept: '', sub: '', cat: '' })}>Kəşf et</button>
            {deptLabel && (
              <>
                <span>/</span>
                <button onClick={() => setMany({ sub: '', cat: '' })}>{deptLabel}</button>
              </>
            )}
            {p.sub && (
              <>
                <span>/</span>
                <b>{p.sub}</b>
              </>
            )}
          </nav>
          <div className="explore-title-row">
            <h1 className="page-title">{title}</h1>
            <span className="explore-count">{results.length} elan</span>
          </div>

          <form className="search-big explore2-search" onSubmit={(e) => e.preventDefault()} role="search">
            <Search size={18} />
            <input value={p.q} onChange={(e) => set('q', e.target.value)} placeholder={deptLabel ? `${deptLabel} bölməsində axtar...` : 'Bütün elanlarda axtar...'} aria-label="Axtarış" />
            {p.q && (
              <button type="button" className="icon-btn icon-btn-sm" onClick={() => set('q', '')} aria-label="Təmizlə">
                <X size={16} />
              </button>
            )}
          </form>

          <div className="explore2-filters">
            <button className="btn btn-ghost btn-sm explore2-filter-btn" onClick={() => setSheet(true)}>
              <SlidersHorizontal size={15} /> Kateqoriyalar
            </button>
            <Dropdown label="Satış növü" allLabel="Hamısı" value={p.mode} onChange={(v) => set('mode', v)} options={Object.entries(MODE_LABELS).map(([value, label]) => ({ value, label }))} />
            <Dropdown label="Qiymət" allLabel="İstənilən qiymət" value={p.price} onChange={(v) => set('price', v)} options={PRICES} />
            <Dropdown label="Ərazi" allLabel="Bütün Bakı" value={p.district} onChange={(v) => set('district', v)} options={DISTRICTS.map((d) => ({ value: d, label: d }))} />
            <div className="filter-sort-wrap">
              <span>Sırala:</span>
              <Dropdown label="Sırala" align="right" value={p.sort} onChange={(v) => set('sort', v === 'new' ? '' : v)} options={SORTS} />
            </div>
          </div>

          {active.length > 0 && (
            <div className="active-chips">
              {active.map((a) => (
                <button key={a.k} onClick={() => set(a.k, '')}>
                  {a.label} <X size={13} />
                </button>
              ))}
              <button className="active-clear" onClick={() => setMany({ mode: '', price: '', district: '', q: '' })}>
                Hamısını təmizlə
              </button>
            </div>
          )}
        </header>

        {results.length > 0 ? (
          <div className="explore2-grid">
            {results.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty explore2-empty">
            <h3>Bu seçimə uyğun elan yoxdur</h3>
            <p>Bir filteri çıxar və ya başqa bölməyə bax.</p>
            <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>
              Bütün elanlara qayıt
            </button>
          </div>
        )}

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
      </div>

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <div className="sheet explore2-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h3>Kateqoriyalar</h3>
              <button className="icon-btn" onClick={() => setSheet(false)} aria-label="Bağla">
                <X size={20} />
              </button>
            </div>
            <div className="sheet-body">
              <Sidebar p={p} setMany={setMany} counts={counts} onDone={() => setSheet(false)} />
            </div>
            <div className="sheet-foot">
              <button className="btn btn-primary" onClick={() => setSheet(false)}>
                {results.length} elanı göstər
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
