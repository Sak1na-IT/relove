import { useState } from 'react'
import CategoryIcon from './CategoryIcon'

// Kateqoriya üçün real məhsul fotosu olan dairə.
// Foto yüklənməsə, zərif xətli ikon göstərilir.
export default function CategoryThumb({ category, small = false }) {
  const [state, setState] = useState('loading')

  return (
    <span className={`cat-circle ${small ? 'cat-circle-sm' : ''}`}>
      {state !== 'error' && category.photo && (
        <img
          src={category.photo}
          alt=""
          loading="lazy"
          className={state === 'loaded' ? 'is-loaded' : ''}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      )}
      {state !== 'loaded' && (
        <span className="cat-circle-icon">
          <CategoryIcon name={category.icon} size={small ? 20 : 24} />
        </span>
      )}
    </span>
  )
}
