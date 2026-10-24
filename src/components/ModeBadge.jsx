import { Tag, Repeat, Gift } from 'lucide-react'
import { MODES } from '../data'

const ICONS = { sale: Tag, swap: Repeat, free: Gift }

export default function ModeBadge({ mode, full = false }) {
  const Icon = ICONS[mode]
  const m = MODES[mode]
  return (
    <span className={`badge badge-${m.tone}`}>
      <Icon size={12} strokeWidth={2.2} />
      {full ? m.label : m.short}
    </span>
  )
}
