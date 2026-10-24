import Img from './Img'

// Profil şəkli; yoxdursa adın baş hərfləri
export default function Avatar({ user, className = '' }) {
  if (user?.avatar) return <Img src={user.avatar} alt={user.name} className={className} />
  const initials = (user?.name || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className={`${className} avatar-initials`} aria-label={user?.name}>
      {initials}
    </span>
  )
}
