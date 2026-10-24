import { useState } from 'react'
import { ImageOff } from 'lucide-react'

// Şəkil yüklənməsə zərif bir fon göstərir; yüklənəndə yumşaq görünür.
export default function Img({ src, alt = '', className = '', ...rest }) {
  const [state, setState] = useState('loading')

  if (!src || state === 'error') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <ImageOff size={22} strokeWidth={1.5} />
        <span>{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`img ${state === 'loaded' ? 'is-loaded' : ''} ${className}`}
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
      {...rest}
    />
  )
}
