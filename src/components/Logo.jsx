import { Link } from 'react-router-dom'

// Relove simvolu: dairə iki yarıya bölünüb — bir sahibdən digərinə keçən əşya.
// Yarılar arasındakı S-xətti "dövr"ü, kiçik nar nöqtəsi isə sevgini göstərir.
export function LogoMark({ size = 32, light = false }) {
  const base = light ? 'var(--ivory)' : 'var(--forest)'
  const soft = light ? 'rgba(244, 245, 242, 0.35)' : 'var(--lime-2)'
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
      <path d="M20 2a18 18 0 0 0 0 36a9 9 0 0 0 0-18a9 9 0 0 1 0-18Z" fill={base} />
      <path d="M20 2a18 18 0 0 1 0 36a9 9 0 0 0 0-18a9 9 0 0 1 0-18Z" fill={soft} />
      <circle cx="20" cy="29" r="3" fill="var(--pom)" />
    </svg>
  )
}

export function Wordmark({ className = '', light = false }) {
  return (
    <span className={`wordmark ${light ? 'wordmark-light' : ''} ${className}`}>
      <LogoMark light={light} />
      <span className="wordmark-text">relove</span>
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
