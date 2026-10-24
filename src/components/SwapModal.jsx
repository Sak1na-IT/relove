import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowLeftRight, Check, Plus } from 'lucide-react'
import Img from './Img'
import { formatPrice } from '../data'
import { useApp } from '../store'

export default function SwapModal({ target, onClose }) {
  const { myItems, sendOffer } = useApp()
  const options = myItems.filter((m) => m.modes.includes('swap'))
  const [picked, setPicked] = useState(options[0]?.id)
  const [cash, setCash] = useState(0)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const mine = options.find((o) => o.id === picked)
  const diff = mine ? target.price - mine.price : 0

  // -1..1 arası balans: 0 = tam bərabər
  const balance = useMemo(() => {
    if (!mine) return 0
    const myTotal = mine.price + Number(cash || 0)
    const max = Math.max(myTotal, target.price, 1)
    return Math.max(-1, Math.min(1, (myTotal - target.price) / max))
  }, [mine, cash, target.price])

  const label =
    Math.abs(balance) < 0.12 ? 'Bərabər dəyərli təklif' : balance < 0 ? 'Sənin təklifin bir az aşağıdır' : 'Sənin təklifin daha dəyərlidir'

  const submit = () => {
    sendOffer({ targetId: target.id, myItemId: mine.id, cash: Number(cash || 0), note })
    setSent(true)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Dəyiş təklifi">
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Bağla">
          <X size={20} />
        </button>

        {sent ? (
          <div className="modal-success">
            <span className="success-icon">
              <Check size={28} />
            </span>
            <h3 className="h2">Təklifin göndərildi</h3>
            <p>Satıcı təklifini qəbul etsə, bildiriş alacaqsan. Dəyiş-düyüş yalnız hər iki tərəf təsdiqləyəndən sonra tamamlanır.</p>
            <div className="modal-actions">
              <Link to="/deyis" className="btn btn-primary">Təkliflərimə bax</Link>
              <button className="btn btn-ghost" onClick={onClose}>Bağla</button>
            </div>
          </div>
        ) : options.length === 0 ? (
          <div className="modal-success">
            <h3 className="h2">Dəyişmək üçün əşyan yoxdur</h3>
            <p>Əvvəlcə bir əşya paylaş və “Dəyiş-düyüş” seçimini aktivləşdir.</p>
            <Link to="/paylas" className="btn btn-primary"><Plus size={16} /> Əşya paylaş</Link>
          </div>
        ) : (
          <>
            <p className="eyebrow">Dəyiş təklifi</p>
            <h3 className="h2">Nəyi təklif edirsən?</h3>

            <div className="swap-pair">
              <div className="swap-pair-item">
                {mine && <Img src={mine.images[0]} alt={mine.title} />}
                <small>Sənin</small>
                <strong>{mine?.title}</strong>
              </div>
              <span className="swap-pair-arrow"><ArrowLeftRight size={18} /></span>
              <div className="swap-pair-item">
                <Img src={target.images[0]} alt={target.title} />
                <small>Onun</small>
                <strong>{target.title}</strong>
              </div>
            </div>

            <div className="pick-list">
              {options.map((o) => (
                <button key={o.id} className={`pick ${picked === o.id ? 'is-on' : ''}`} onClick={() => setPicked(o.id)}>
                  <Img src={o.images[0]} alt={o.title} />
                  <span>
                    <strong>{o.title}</strong>
                    <small>{formatPrice(o.price)}</small>
                  </span>
                  {picked === o.id && <Check size={16} className="pick-check" />}
                </button>
              ))}
            </div>

            <div className="balance">
              <div className="balance-head">
                <span>Dəyər balansı</span>
                <strong>{label}</strong>
              </div>
              <div className="balance-bar">
                <span className="balance-mid" />
                <span className="balance-knob" style={{ left: `${50 + balance * 50}%` }} />
              </div>
              <div className="balance-legend">
                <span>Onun əşyası</span>
                <span>Sənin təklifin</span>
              </div>
            </div>

            {diff > 0 && (
              <label className="field">
                <span>Fərqi ödəmək istəyirsən? (istəyə bağlı, ₼)</span>
                <input
                  type="number"
                  min="0"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  placeholder={`Məsələn: ${diff}`}
                />
                <small className="hint">Qiymət fərqi təxminən {formatPrice(diff)}</small>
              </label>
            )}

            <label className="field">
              <span>Qısa mesaj</span>
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Salam! Əşyamla dəyişməyə maraqlı olarsınız?" />
            </label>

            <button className="btn btn-primary btn-block btn-lg" onClick={submit} disabled={!mine}>
              Təklifi göndər
            </button>
          </>
        )}
      </div>
    </div>
  )
}
