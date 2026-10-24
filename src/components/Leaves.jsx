// İncə xətli yarpaq budağı — dekorativ illüstrasiya
export default function Leaves({ className = '' }) {
  const leaf = (x, y, r, s = 1) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 14 -10, 40 -8, 58 0 C 40 8, 14 10, 0 0 Z" />
      <path d="M2 0 L 54 0" />
    </g>
  )
  return (
    <svg viewBox="0 0 260 300" className={`leaves ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M40 300 C 70 230, 110 160, 200 40" />
      {leaf(58, 260, -40)}
      {leaf(70, 236, -110, 0.9)}
      {leaf(92, 196, -35, 1.05)}
      {leaf(104, 172, -115, 0.95)}
      {leaf(128, 134, -30, 1)}
      {leaf(140, 112, -120, 0.85)}
      {leaf(162, 86, -28, 0.9)}
      {leaf(176, 64, -118, 0.75)}
      {leaf(198, 42, -50, 0.7)}
    </svg>
  )
}
