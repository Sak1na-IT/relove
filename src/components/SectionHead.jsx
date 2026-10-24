import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function SectionHead({ eyebrow, title, text, to, linkLabel = 'Hamısına bax' }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {text && <p className="section-text">{text}</p>}
      </div>
      {to && (
        <Link to={to} className="link-arrow">
          {linkLabel} <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  )
}
