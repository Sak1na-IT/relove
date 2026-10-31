import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ImagePlus, X, Star, Tag, Repeat, Gift, Check, ArrowLeft, ArrowRight, Handshake, Truck, MapPin } from 'lucide-react'
import Img from '../components/Img'
import ModeBadge from '../components/ModeBadge'
import { CATEGORIES, CONDITIONS, DISTRICTS, REPAIR_LEVELS, formatPrice } from '../data'
import { useApp } from '../store'

const STEPS = ['Şəkillər', 'Məlumat', 'Qiymət və şərtlər', 'Təhvil', 'Önbaxış']

const MODE_CARDS = [
  { id: 'sale', icon: Tag, title: 'İkinci əl', text: 'Əşyamı satmaq istəyirəm' },
  { id: 'swap', icon: Repeat, title: 'Dəyiş-düyüş', text: 'Başqa əşya ilə dəyişmək istəyirəm' },
  { id: 'free', icon: Gift, title: 'İkinci şans', text: 'Qüsurludur, atmaq əvəzinə düzəldə bilən birinə vermək istəyirəm' },
]

export default function Share() {
  const navigate = useNavigate()
  const { addListing, notify, profile } = useApp()
  const [search] = useSearchParams()
  const lockedMode = ['sale', 'swap', 'free'].includes(search.get('mode')) ? search.get('mode') : ''
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState([])
  const [form, setForm] = useState({
    title: '', category: '', condition: '', description: '', story: '', price: '',
    modes: [lockedMode || 'sale'], wantsText: '', district: profile.district, delivery: profile.delivery,
    defect: '', repair: '',
  })

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleIn = (k, v) =>
    setForm((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }))

  const toggleMode = (id) => setForm((f) => ({ ...f, modes: [id] }))

  // Şəkillər cihazdan seçilir: brauzerdə kiçildilib sıxılır (ən uzun tərəf 1280px, JPEG)
  const [photoError, setPhotoError] = useState('')
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [dragging, setDragging] = useState(false)

  const compress = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const im = new Image()
      im.onload = () => {
        const max = 1280
        const scale = Math.min(1, max / Math.max(im.width, im.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(im.width * scale)
        canvas.height = Math.round(im.height * scale)
        canvas.getContext('2d').drawImage(im, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        let q = 0.82
        let out = canvas.toDataURL('image/jpeg', q)
        while (out.length > 850_000 && q > 0.4) {
          q -= 0.1
          out = canvas.toDataURL('image/jpeg', q)
        }
        resolve(out)
      }
      im.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Şəkil oxunmadı'))
      }
      im.src = url
    })

  const addFiles = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'))
    if (!files.length) return setPhotoError('Yalnız şəkil faylı seçə bilərsən')
    const room = 8 - photos.length
    if (room <= 0) return setPhotoError('Ən çoxu 8 şəkil')
    setPhotoError(files.length > room ? `Yalnız ilk ${room} şəkil əlavə olundu (ən çoxu 8)` : '')
    setLoadingPhotos(true)
    try {
      const done = []
      for (const f of files.slice(0, room)) done.push(await compress(f))
      setPhotos((p) => [...p, ...done.filter((d) => !p.includes(d))].slice(0, 8))
    } catch (err) {
      setPhotoError(err.message)
    } finally {
      setLoadingPhotos(false)
    }
  }

  const makeCover = (i) => setPhotos((p) => [p[i], ...p.filter((_, j) => j !== i)])
  const removePhoto = (i) => setPhotos((p) => p.filter((_, j) => j !== i))

  const isFree = form.modes.includes('free')
  const valid = [
    photos.length > 0,
    form.title.trim() && form.category && form.condition,
    form.modes.length > 0 &&
      (isFree ? form.defect.trim() && form.repair : Number(form.price) > 0) &&
      (!form.modes.includes('swap') || form.wantsText.trim()),
    form.district && form.delivery.length > 0,
    true,
  ]

  const preview = {
    id: 'preview',
    title: form.title || 'Əşyanın adı',
    category: form.category || 'diger',
    price: isFree ? Number(form.price) || 0 : Number(form.price) || 0,
    condition: isFree ? 'Təmir tələb edir' : form.condition || 'Yaxşı',
    defect: isFree ? form.defect.trim() : undefined,
    repair: isFree ? form.repair : undefined,
    district: form.district,
    modes: form.modes,
    seller: 'preview',
    posted: 'İndicə',
    aspect: 'tall',
    images: photos,
    description: form.description || 'Açıqlama əlavə edilməyib.',
    story: form.story.trim() || undefined,
    wants: form.modes.includes('swap') ? [form.category].filter(Boolean) : [],
    wantsText: form.wantsText.split(',').map((s) => s.trim()).filter(Boolean),
    delivery: form.delivery,
  }

  const [publishing, setPublishing] = useState(false)
  const publish = async () => {
    setPublishing(true)
    try {
      const { id, seller, posted, ...body } = preview
      await addListing({ ...body, price: Math.round(body.price), aspect: 'tall' })
      notify('Elanın dərc edildi — Paylaşdıqlarım bölməsində idarə edə bilərsən')
      navigate('/paylasdiqlarim')
    } catch (err) {
      notify(err.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="container share">
      <div className="share-head">
        <p className="eyebrow">{{ sale: 'İkinci əl · satış elanı', swap: 'Dəyiş-düyüş elanı', free: 'İkinci şans elanı' }[lockedMode] || 'Yeni elan'}</p>
        <h1 className="display display-md">
          {['Şəklini çək və ya seç', 'Əşyan haqqında danış', { sale: 'Qiyməti yaz', swap: 'Nə ilə dəyişmək istəyirsən?', free: 'Qüsurunu dürüst yaz' }[lockedMode] || 'Hansı bölməyə paylaşırsan?', 'Məkan və təhvil', 'Belə görünəcək'][step]}
        </h1>
        <div className="stepper" aria-label="Addımlar">
          {STEPS.map((s, i) => (
            <button
              key={s}
              className={`step ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
            >
              <span>{i < step ? <Check size={13} /> : i + 1}</span>
              <em>{s}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="share-body">
        {step === 0 && (
          <div className="fade-in">
            <label
              className={`upload-drop ${dragging ? 'is-drag' : ''} ${photos.length >= 8 ? 'is-full' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                addFiles(e.dataTransfer.files)
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={photos.length >= 8 || loadingPhotos}
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <span className="upload-icon"><ImagePlus size={26} strokeWidth={1.5} /></span>
              <strong>{loadingPhotos ? 'Şəkillər hazırlanır…' : photos.length ? 'Daha şəkil əlavə et' : 'Şəkilləri seç'}</strong>
              <small>Kompüterdən və ya telefondan seç, ya da bura sürüklə · {photos.length}/8</small>
            </label>
            {photoError && <p className="link-add-error">{photoError}</p>}
            <p className="hint">Gündüz işığında, sadə fonda çək. İlk şəkil elanın əsas şəkli olacaq — ulduzla dəyişə bilərsən.</p>
            {photos.length > 0 && (
              <div className="photo-grid">
                {photos.map((src, i) => (
                  <div key={i + src.slice(-24)} className={`photo ${i === 0 ? 'is-cover' : ''}`}>
                    <img src={src} alt={`Şəkil ${i + 1}`} />
                    {i === 0 ? (
                      <span className="photo-cover">Əsas şəkil</span>
                    ) : (
                      <button className="photo-star" onClick={() => makeCover(i)} aria-label="Əsas et">
                        <Star size={14} />
                      </button>
                    )}
                    <button className="photo-remove" onClick={() => removePhoto(i)} aria-label="Sil">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="form-grid fade-in">
            <label className="field span-2">
              <span>Əşyanın adı</span>
              <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Məsələn: Vintage dəri gödəkçə" maxLength={60} />
            </label>
            <div className="field span-2">
              <span>Kateqoriya</span>
              <div className="chip-wrap">
                {CATEGORIES.map((c) => (
                  <button key={c.id} type="button" className={`chip ${form.category === c.id ? 'is-on' : ''}`} onClick={() => update('category', c.id)}>
                    {c.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="field span-2">
              <span>Vəziyyəti</span>
              <div className="chip-wrap">
                {CONDITIONS.map((c) => (
                  <button key={c} type="button" className={`chip ${form.condition === c ? 'is-on' : ''}`} onClick={() => update('condition', c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <label className="field span-2">
              <span>Qısa açıqlama</span>
              <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Ölçü, rəng, qüsurlar, nə ilə birlikdə verilir…" />
            </label>
            <label className="field span-2">
              <span>Əşyanın hekayəsi <small>(istəyə bağlı)</small></span>
              <textarea rows={2} value={form.story} onChange={(e) => update('story', e.target.value)} placeholder="Bu əşya sənin üçün nə ifadə edirdi?" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            {!lockedMode && (
            <div className="mode-cards">
              {MODE_CARDS.map(({ id, icon: Icon, title, text }) => (
                <button key={id} className={`mode-card mode-${id} ${form.modes.includes(id) ? 'is-on' : ''}`} onClick={() => toggleMode(id)}>
                  <span className="mode-icon"><Icon size={22} /></span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                  <span className="mode-check"><Check size={14} /></span>
                </button>
              ))}
            </div>
            )}

            <div className="form-grid">
              {isFree && (
                <>
                  <label className="field span-2">
                    <span>Qüsuru nədir?</span>
                    <textarea rows={2} value={form.defect} onChange={(e) => update('defect', e.target.value)} placeholder="Məsələn: kənarı 5 sm sökülüb, qalan hissəsi salamatdır" />
                  </label>
                  <div className="field span-2">
                    <span>Təmir səviyyəsi</span>
                    <div className="chip-wrap">
                      {REPAIR_LEVELS.map((r) => (
                        <button key={r} type="button" className={`chip ${form.repair === r ? 'is-on' : ''}`} onClick={() => update('repair', r)}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="field">
                    <span>Simvolik qiymət (AZN, istəyə bağlı)</span>
                    <input type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Boş qalsa — pulsuz" />
                  </label>
                </>
              )}
              {!isFree && (
                <label className="field">
                  <span>{form.modes.includes('swap') ? 'Təxmini dəyəri (AZN)' : 'Qiymət (AZN)'}</span>
                  <input type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Məsələn: 45" />
                </label>
              )}
              {form.modes.includes('swap') && (
                <label className="field">
                  <span>Nə ilə dəyişərsən?</span>
                  <input value={form.wantsText} onChange={(e) => update('wantsText', e.target.value)} placeholder="Qulaqlıq, planşet, təklifə açığam" />
                </label>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <div className="field">
              <span>Ərazi (Bakı)</span>
              <div className="chip-wrap">
                {DISTRICTS.map((d) => (
                  <button key={d} type="button" className={`chip ${form.district === d ? 'is-on' : ''}`} onClick={() => update('district', d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span>Təhvil üsulu</span>
              <div className="option-rows">
                <button className={`option-row ${form.delivery.includes('meet') ? 'is-on' : ''}`} onClick={() => toggleIn('delivery', 'meet')}>
                  <Handshake size={20} />
                  <div><strong>Şəxsi görüş</strong><small>Razılaşdığınız ictimai yerdə görüşün</small></div>
                  <span className="check-box"><Check size={13} /></span>
                </button>
                <button className={`option-row ${form.delivery.includes('courier') ? 'is-on' : ''}`} onClick={() => toggleIn('delivery', 'courier')}>
                  <Truck size={20} />
                  <div><strong>Kuryerlə göndərə bilərəm</strong><small>Çatdırılmanı alıcı ilə özün razılaşdırırsan</small></div>
                  <span className="check-box"><Check size={13} /></span>
                </button>
              </div>
            </div>
            <p className="hint">Dəqiq ünvanın heç kimə göstərilmir — yalnız ərazi görünür.</p>
          </div>
        )}

        {step === 4 && (
          <div className="preview fade-in">
            <div className="preview-card">
              <div className="preview-media">
                <Img src={photos[0]} alt={preview.title} />
                <div className="card-badges">{preview.modes.map((m) => <ModeBadge key={m} mode={m} />)}</div>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <h3 className="card-title">{preview.title}</h3>
                  <span className={`card-price ${preview.price === 0 ? 'is-free' : ''}`}>{formatPrice(preview.price)}</span>
                </div>
                <div className="card-meta">
                  <span>{preview.condition}</span>
                  <span className="dot" />
                  <span className="with-icon"><MapPin size={12} /> {preview.district}</span>
                </div>
              </div>
            </div>
            <div className="preview-text">
              <h3 className="h2">Hər şey hazırdır</h3>
              <p>Elanın kəşf lentində belə görünəcək. Dərc etdikdən sonra istədiyin vaxt redaktə edə bilərsən.</p>
              <ul className="check-list">
                <li><Check size={15} /> {photos.length} şəkil</li>
                <li><Check size={15} /> {CATEGORIES.find((c) => c.id === preview.category)?.label}</li>
                <li><Check size={15} /> {preview.modes.map((m) => ({ sale: 'Satış', swap: 'Dəyiş-düyüş', free: 'İkinci şans' })[m]).join(' + ')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="share-foot">
        <button className="btn btn-ghost" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}>
          <ArrowLeft size={16} /> {step === 0 ? 'Ləğv et' : 'Geri'}
        </button>
        {step < 4 ? (
          <button className="btn btn-primary" disabled={!valid[step]} onClick={() => setStep(step + 1)}>
            Davam et <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn btn-lime btn-lg" onClick={publish} disabled={publishing}>
            Elanı dərc et <Check size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
