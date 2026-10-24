import { Link } from 'react-router-dom'

// Relove simvolu: yumşaq dairə içində "r" hərfi və onu qucaqlayan yarpaq —
// əşyanın bir əldən digərinə, sevgi ilə keçməsi.
export function LogoMark({ size = 34, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="logo-mark">
      <circle cx="24" cy="24" r="24" fill={light ? 'var(--ivory)' : 'var(--forest)'} />
      <path
        d="M17 33V20.5M17 24.5c1.6-3.6 4.4-5.4 8.2-5.4"
        fill="none"
        stroke={light ? 'var(--forest)' : 'var(--ivory)'}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M27.5 31.5c-.4-5.6 3-9.4 8.8-10.1.6 5.8-3 9.8-8.8 10.1Z" fill="var(--lime)" />
      <path d="M28.6 30.6c1.6-2.5 3.5-4.4 5.9-6" fill="none" stroke="var(--forest)" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

export function Wordmark({ className = '', light = false }) {
  return (
    <span className={`wordmark ${light ? 'wordmark-light' : ''} ${className}`}>
      <LogoMark light={light} />
      <span className="wordmark-text">
        re<em>love</em>
      </span>
    </span>
  )
}

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Relove ana səhifə">
      <Wordmark />
    </Link>
  )
}
