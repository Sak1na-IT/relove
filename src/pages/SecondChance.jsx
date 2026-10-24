import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Plus, Scissors, Hammer, Cpu } from 'lucide-react'
import Img from '../components/Img'
import CategoryBrowser, { DISTRICT_FILTER } from '../components/CategoryBrowser'
import { REPAIR_LEVELS, formatPrice, likesOf } from '../data'
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

const LEVEL_FILTER = {
  key: 'level',
  label: 'Təmir səviyyəsi',
  allLabel: 'Hamısı',
  options: REPAIR_LEVELS.map((r) => ({ value: r, label: r })),
  test: (l, v) => l.repair === v,
}

const COST_FILTER = {
  key: 'cost',
  label: 'Qiymət',
  allLabel: 'Hamısı',
  options: [
    { value: 'free', label: 'Pulsuz' },
    { value: 'symbolic', label: 'Simvolik qiymət' },
  ],
  test: (l, v) => (v === 'free' ? l.price === 0 : l.price > 0),
}

export default function SecondChance() {
  const { allItems } = useApp()
  const all = useMemo(() => allItems.filter((l) => l.modes.includes('free')), [allItems])

  return (
    <div className="sc-page">
      <section className="container sc2-hero">
        <div className="sc2-top">
          <div>
            <h1 className="page-title">İkinci şans</h1>
            <p className="sc2-lead">
              Qüsurlu, amma hələ dəyəri olan əşyalar üçün. Sən atmırsan — onu düzəldə bilən biri pulsuz və ya simvolik
              qiymətə götürür.
            </p>
          </div>
          <Link to="/paylas?mode=free" className="btn btn-primary">
            <Plus size={16} /> Qüsurlu əşya paylaş
          </Link>
        </div>

        <ol className="sc2-steps">
          <li>
            <span className="sc2-num">I</span>
            <div>
              <strong>Qüsurunu açıq yaz</strong>
              <p>Nəyin sınıq və ya cırıq olduğunu dəqiq qeyd et — götürən nəyə hazır olduğunu bilsin.</p>
            </div>
          </li>
          <li>
            <span className="sc2-num">II</span>
            <div>
              <strong>Bacaran biri götürür</strong>
              <p>Dərzilər, təmirçilər və əl işi sevənlər burada düzəldiləcək əşya axtarır.</p>
            </div>
          </li>
          <li>
            <span className="sc2-num">III</span>
            <div>
              <strong>Əşya zibilliyə yox, evə gedir</strong>
              <p>Pulsuz və ya 5–10 AZN simvolik qiymətə yeni sahibinə keçir.</p>
            </div>
          </li>
        </ol>
      </section>

      <div className="container" id="sc-list">
        <CategoryBrowser
          pool={all}
          renderItem={(item) => <RepairCard key={item.id} item={item} />}
          gridClass="sc-grid"
          unit="əşya"
          allTitle="Bütün əşyalar"
          searchPlaceholder="İkinci şans əşyalarında axtar — məs. stul, şərf..."
          filters={[LEVEL_FILTER, COST_FILTER, DISTRICT_FILTER]}
        />

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
