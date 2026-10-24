import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, User, UserRound, Baby, Sofa, Smartphone, Bike, BookOpen, Sparkles, LayoutGrid } from 'lucide-react'
import { DEPARTMENTS } from '../data'
import { useApp } from '../store'

const ICONS = { User, UserRound, Baby, Sofa, Smartphone, Bike, BookOpen }
const SHOW = 4

function Group({ dept, group, onNavigate }) {
  const [more, setMore] = useState(false)
  const items = more ? group.items : group.items.slice(0, SHOW)
  return (
    <div className="mega-group">
      <Link to={`/kesf?dept=${dept.id}&cat=${group.cat}`} className="mega-group-title" onClick={onNavigate}>
        {group.title} <ChevronRight size={15} />
      </Link>
      <ul>
        {items.map((it) => (
          <li key={it}>
            <Link to={`/kesf?dept=${dept.id}&sub=${encodeURIComponent(it)}`} onClick={onNavigate}>
              {it}
            </Link>
          </li>
        ))}
      </ul>
      {group.items.length > SHOW && (
        <button type="button" className="mega-more" onClick={() => setMore((m) => !m)}>
          {more ? 'Daha az göstər' : 'Daha çox göstər'}
        </button>
      )}
    </div>
  )
}

export default function MegaMenu({ onNavigate }) {
  const [active, setActive] = useState(DEPARTMENTS[0].id)
  const { listings } = useApp()
  const dept = DEPARTMENTS.find((d) => d.id === active)
  const count = listings.filter((l) => l.dept === dept.id && !l.modes.includes('free')).length

  return (
    <div className="mega" role="menu">
      <div className="container mega-inner">
        <ul className="mega-depts">
          {DEPARTMENTS.map((d) => {
            const Icon = ICONS[d.icon] || LayoutGrid
            return (
              <li key={d.id}>
                <button
                  type="button"
                  className={d.id === active ? 'is-on' : ''}
                  onMouseEnter={() => setActive(d.id)}
                  onFocus={() => setActive(d.id)}
                  onClick={() => setActive(d.id)}
                >
                  <Icon size={19} strokeWidth={1.6} />
                  <span>{d.label}</span>
                  <ChevronRight size={15} className="mega-chev" />
                </button>
              </li>
            )
          })}
          <li className="mega-all">
            <Link to="/kesf" onClick={onNavigate}>
              <LayoutGrid size={19} strokeWidth={1.6} />
              <span>Bütün elanlar</span>
            </Link>
          </li>
        </ul>

        <div className="mega-panel" key={dept.id}>
          <div className="mega-panel-head">
            <Link to={`/kesf?dept=${dept.id}`} onClick={onNavigate}>
              {dept.label}
            </Link>
            <span>{count} elan</span>
            <Link to={`/kesf?dept=${dept.id}`} className="mega-see-all" onClick={onNavigate}>
              Hamısına bax
            </Link>
          </div>
          <div className="mega-groups">
            {dept.groups.map((g) => (
              <Group key={g.title} dept={dept} group={g} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <Link to="/ikinci-sans" className="mega-promo" onClick={onNavigate}>
          <Sparkles size={20} strokeWidth={1.6} />
          <strong>İkinci şans</strong>
          <p>Qüsurlu, amma atılmağa qıyılmayan əşyalar. Düzəlt və yenidən istifadə et.</p>
          <span>Bölməyə keç</span>
        </Link>
      </div>
    </div>
  )
}
