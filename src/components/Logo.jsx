import { Link } from 'react-router-dom'

// "O" hərfinin içində yarpaq — Relove-un simvolu
export function LeafO({ className = '' }) {
  return (
    <svg viewBox="0 0 40 48" className={`leaf-o ${className}`} aria-hidden="true">
      <ellipse cx="20" cy="24" rx="16.5" ry="21.5" fill="none" stroke="currentColor" strokeWidth="4.2" />
      <path d="M20 37 C 11 30, 11 17, 22 10 C 29 19, 28 31, 20 37 Z" fill="var(--leaf, currentColor)" opacity="0.9" />
      <path d="M20 37 C 21 28, 22 20, 22 12" fill="none" stroke="var(--leaf-vein, var(--ivory))" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      REL<LeafO />VE
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
