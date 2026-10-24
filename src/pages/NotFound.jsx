import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container empty empty-page">
      <p className="eyebrow">404</p>
      <h1 className="display display-md">Bu səhifə <em>başqa sahibə keçib</em></h1>
      <p>Axtardığın səhifə tapılmadı.</p>
      <Link to="/" className="btn btn-primary">Ana səhifəyə qayıt</Link>
    </div>
  )
}
