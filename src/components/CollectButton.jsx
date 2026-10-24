import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { FolderPlus, Check, Plus, X, Lock } from 'lucide-react'
import Img from './Img'
import { useApp } from '../store'

// Əşyanı istifadəçinin öz kolleksiyalarına əlavə etmək üçün düymə + pəncərə
export default function CollectButton({ item, variant = 'icon' }) {
  const [open, setOpen] = useState(false)
  const { userCollections, requireAuth } = useApp()
  const inAny = userCollections.some((c) => c.items.includes(item.id))

  return (
    <>
      {variant === 'icon' ? (
        <button
          className={`card-collect ${inAny ? 'is-on' : ''}`}
          onClick={() => requireAuth() && setOpen(true)}
          aria-label="Kolleksiyaya əlavə et"
          title="Kolleksiyaya əlavə et"
        >
          {inAny ? <Check size={15} strokeWidth={2.2} /> : <FolderPlus size={15} strokeWidth={1.8} />}
        </button>
      ) : (
        <button className={`collect-link ${inAny ? 'is-on' : ''}`} onClick={() => requireAuth() && setOpen(true)}>
          {inAny ? <Check size={16} /> : <FolderPlus size={16} strokeWidth={1.8} />}
          {inAny ? 'Kolleksiyandadır' : 'Kolleksiyaya əlavə et'}
        </button>
      )}
      {open && <CollectModal item={item} onClose={() => setOpen(false)} />}
    </>
  )
}

function CollectModal({ item, onClose }) {
  const { userCollections, addCollection, toggleInCollection, listings, getItem, notify } = useApp()
  const [name, setName] = useState('')

  const coverOf = (c) => {
    const first = c.items.map((id) => getItem?.(id) || listings.find((l) => l.id === id)).find(Boolean)
    return first?.images[0]
  }

  const create = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const title = name.trim()
    addCollection({ title, text: '', items: [item.id], isPublic: true }).then((c) => c && notify(`“${title}” yaradıldı və əşya əlavə olundu`))
    setName('')
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal cm" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Kolleksiyaya əlavə et">
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Bağla">
          <X size={20} />
        </button>

        <div className="cm-item">
          <Img src={item.images[0]} alt="" className="cm-thumb" />
          <span>
            <small>Kolleksiyaya əlavə et</small>
            <strong>{item.title}</strong>
          </span>
        </div>

        {userCollections.length > 0 ? (
          <ul className="cm-list">
            {userCollections.map((c) => {
              const on = c.items.includes(item.id)
              const cover = coverOf(c)
              return (
                <li key={c.id}>
                  <button className={`cm-row ${on ? 'is-on' : ''}`} onClick={() => toggleInCollection(c.id, item.id)} aria-pressed={on}>
                    <span className="cm-cover">{cover ? <Img src={cover} alt="" /> : null}</span>
                    <span className="cm-row-text">
                      <strong>{c.title}</strong>
                      <small>
                        {c.items.length} əşya{!c.isPublic && <> · <Lock size={11} /> gizli</>}
                      </small>
                    </span>
                    <span className="cm-check">{on && <Check size={14} strokeWidth={3} />}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="cm-empty">Hələ kolleksiyan yoxdur. Aşağıda ad yaz — bu əşya ilə ilk kolleksiyan yaransın.</p>
        )}

        <form className="cm-new" onSubmit={create}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Yeni kolleksiyanın adı" maxLength={40} aria-label="Yeni kolleksiyanın adı" />
          <button className="btn btn-ghost btn-sm" type="submit" disabled={!name.trim()}>
            <Plus size={15} /> Yarat
          </button>
        </form>

        <div className="cm-foot">
          <Link to="/kolleksiyalar" onClick={onClose}>Kolleksiyalarıma bax</Link>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Hazırdır</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
