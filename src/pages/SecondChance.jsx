import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Recycle, HandHeart, Plus, Scissors, Hammer, Cpu, Search, X } from 'lucide-react'
import Img from '../components/Img'
import Dropdown from '../components/Dropdown'
import { REPAIR_LEVELS, CATEGORIES, formatPrice, likesOf } from '../data'
import { useApp } from '../store'

const LEVEL_ICON = { 'Kiçik təmir': Scissors, 'Ciddi təmir': Hammer, 'Hissələr üçün': Cpu }

function RepairCard({ item }) {
  const { favorites, toggleFavorite } = useApp()
  const fav = favorites.includes(item.id)
  const Icon = LEVEL_ICON[item.repair] || Wrench
  return (
    <article className="sc-card">
      <Link to={`/elan/${item.id}`} className="sc-card-media">
        <Img src={item.images[0]} alt={item.title} />
        <span className={`sc-level sc-level-${REPAIR_LEVELS.indexOf(item.repair)}`}>
          <Icon size={13} /> {item.repair}
        </span>
      </Link>
      <div className="sc-card-body">
        <Link to={`/elan/${item.id}`}>
          <h3>{item.title}</h3>
        </Link>
        <p className="sc-defect">{item.defect}</p>
        <div className="sc-card-foot">
          <span className={`sc-price ${item.price === 0 ? 'is-free' : ''}`}>
            {item.price === 0 ? 'Pulsuz' : `Simvolik ${formatPrice(item.price)}`}
          </span>
          <span className="sc-meta">{item.district}</span>
          <button
            className={`sc-save ${fav ? 'is-on' : ''}`}
            onClick={() => toggleFavorite(item.id)}
            aria-label={fav ? 'Seçilmişlərdən çıxar' : 'Seçilmişlərə əlavə et'}
          >
            {fav ? 'Saxlanıldı' : 'Saxla'} · {likesOf(item.id) + (fav ? 1 : 0)}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function SecondChance() {
  const { allItems } = useApp()
  const [level, setLevel] = useState('')
  const [price, setPrice] = useState('')
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')

  const all = allItems.filter((l) => l.modes.includes('free'))
  const items = useMemo(
    () =>
      all.filter(
        (l) =>
          (!q || `${l.title} ${l.defect}`.toLowerCase().includes(q.toLowerCase())) &&
          (!level || l.repair === level) &&
          (!cat || l.category === cat) &&
          (!price || (price === 'free' ? l.price === 0 : l.price > 0)),
      ),
    [all, level, cat, price, q],
  )
  const cats = CATEGORIES.filter((c) => all.some((l) => l.category === c.id))

  return (
    <div className="sc-page">
      <section className="sc-hero">
        <div className="container sc-hero-inner">
          <div>
            <h1 className="sc-title">İkinci şans</h1>
            <p className="sc-lead">
              Sökülmüş şərf, laxlayan stul, bir tərəfi işləməyən qulaqlıq. Atmaq əvəzinə burada paylaş — kimsə onu
              dəyərləndirəcək, düzəldəcək və yenidən istifadə edəcək.
            </p>
            <div className="sc-hero-ctas">
              <Link to="/paylas?mode=free" className="btn btn-light">
                <Plus size={16} /> Qüsurlu əşya paylaş
              </Link>
              <a href="#sc-list" className="sc-hero-link">Əşyalara bax</a>
            </div>
          </div>
          <ul className="sc-steps">
            <li>
              <Recycle size={22} strokeWidth={1.5} />
              <div>
                <strong>Atma, paylaş</strong>
                <p>Qüsurunu dürüst yaz və şəklini çək.</p>
              </div>
            </li>
            <li>
              <Wrench size={22} strokeWidth={1.5} />
              <div>
                <strong>Biri düzəldir</strong>
                <p>Dərzi, usta və ya əl işi sevən biri götürür.</p>
              </div>
            </li>
            <li>
              <HandHeart size={22} strokeWidth={1.5} />
              <div>
                <strong>Əşya yaşamağa davam edir</strong>
                <p>Pulsuz və ya simvolik qiymətə.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <div className="container" id="sc-list">
        <form className="search-big swap3-search" onSubmit={(e) => e.preventDefault()} role="search">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İkinci şans əşyalarında axtar — məs. stul, şərf..." aria-label="Axtarış" />
          {q && (
            <button type="button" className="icon-btn icon-btn-sm" onClick={() => setQ('')} aria-label="Təmizlə">
              <X size={16} />
            </button>
          )}
        </form>
        <div className="filter-bar">
          <div className="filter-group">
            <Dropdown label="Təmir səviyyəsi" allLabel="Hamısı" value={level} onChange={setLevel} options={REPAIR_LEVELS.map((r) => ({ value: r, label: r }))} />
            <Dropdown label="Qiymət" allLabel="Hamısı" value={price} onChange={setPrice} options={[{ value: 'free', label: 'Pulsuz' }, { value: 'symbolic', label: 'Simvolik qiymət' }]} />
            <Dropdown label="Kateqoriya" allLabel="Bütün kateqoriyalar" value={cat} onChange={setCat} options={cats.map((c) => ({ value: c.id, label: c.label }))} />
          </div>
          <span className="explore-count">{items.length} əşya</span>
        </div>

        {items.length > 0 ? (
          <div className="sc-grid">
            {items.map((item) => (
              <RepairCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Bu filterlərə uyğun əşya yoxdur</h3>
            <p>Filterləri dəyiş və ya öz qüsurlu əşyanı paylaş.</p>
          </div>
        )}

        <div className="results-end">
          <div>
            <h3>Evində atmağa qıymadığın bir şey var?</h3>
            <p>Qüsurunu dürüst yaz — düzəldə bilən biri mütləq tapılacaq.</p>
          </div>
          <div className="results-end-actions">
            <Link to="/paylas?mode=free" className="btn btn-primary">Qüsurlu əşya paylaş</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
