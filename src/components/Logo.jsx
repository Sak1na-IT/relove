import { Link } from 'react-router-dom'

// RELØVE — "Ø" sıfır tullantıya, əşyaların yenidən dövriyyəyə qayıtmasına işarədir.
export function Wordmark({ className = '', light = false }) {
  return (
    <span className={`wordmark ${light ? 'wordmark-light' : ''} ${className}`} aria-label="Relove">
      REL<span className="wordmark-o">Ø</span>VE
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
