import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Brauzerin standart <select>-i əvəzinə premium açılan menyu
export default function Dropdown({ label, value, options, onChange, align = 'left', allLabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (v) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div className={`dd ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className={`dd-btn ${value && allLabel ? 'is-set' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="dd-label">{current && (value || !allLabel) ? current.label : label}</span>
        <ChevronDown size={15} strokeWidth={2} className="dd-chev" />
      </button>
      {open && (
        <ul className={`dd-menu dd-${align}`} role="listbox" aria-label={label}>
          {allLabel && (
            <li>
              <button type="button" className={!value ? 'is-on' : ''} onClick={() => pick('')}>
                {allLabel}
                {!value && <Check size={15} />}
              </button>
            </li>
          )}
          {options.map((o) => (
            <li key={o.value}>
              <button type="button" className={o.value === value ? 'is-on' : ''} onClick={() => pick(o.value)} role="option" aria-selected={o.value === value}>
                {o.label}
                {o.value === value && <Check size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
