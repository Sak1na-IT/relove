import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Heart, MapPin, Star, BadgeCheck, Zap, Repeat, MessageCircle, Gift, Handshake, Truck, Share2, Flag,
} from 'lucide-react'
import Img from '../components/Img'
import Avatar from '../components/Avatar'
import CollectButton from '../components/CollectButton'
import ModeBadge from '../components/ModeBadge'
import ProductCard from '../components/ProductCard'
import SwapModal from '../components/SwapModal'
import ContactCard from '../components/ContactCard'
import { catById, formatPrice } from '../data'
import { useApp } from '../store'
import NotFound from './NotFound'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getItem, listings, favorites, toggleFavorite, startConversation, notify, users, me, ensureUsers } = useApp()
  const item = getItem(id)
  const [active, setActive] = useState(0)
  const infoRef = useRef(null)

  // Sağ sütun siçan təkəri ilə sürüşmür: təkər həmişə səhifəni sürüşdürür.
  // Sütunun içi yalnız öz zolağı dartılanda tərpənir.
  useEffect(() => {
    const el = infoRef.current
    if (!el) return
    const onWheel = (e) => {
      if (window.matchMedia('(max-width: 900px)').matches) return
      e.preventDefault()
      window.scrollBy({ top: e.deltaY, left: 0 })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [id])
  const [swapOpen, setSwapOpen] = useState(false)

  useEffect(() => {
    if (item?.seller) ensureUsers([item.seller])
  }, [item?.seller, ensureUsers])

  if (!item) return <NotFound />

  // Satıcının profili hələ gəlməyibsə, qısa əvəzedici
  const seller = users[item.seller] || { id: item.seller, name: 'Satıcı', district: item.district, rating: null, reviews: 0 }
  const isMine = item.seller === me?.id
  const fav = favorites.includes(item.id)
  const more = listings.filter((l) => l.seller === item.seller && l.id !== item.id).slice(0, 4)
  const similar = listings.filter((l) => l.category === item.category && l.id !== item.id).slice(0, 4)

  const contact = async (text) => {
    const convId = await startConversation(item.seller, item.id, text)
    if (!convId) return
    notify('Mesaj göndərildi')
    navigate(`/mesajlar?c=${convId}`)
  }

  const primary = item.modes.includes('free')
    ? { label: 'Əşyanı götürmək istəyirəm', icon: Gift, action: () => contact(`Salam! "${item.title}" hələ də mövcuddur? Götürmək istərdim.`) }
    : item.modes.includes('sale')
      ? { label: 'Almaq istəyirəm', icon: MessageCircle, action: () => contact(`Salam! "${item.title}" almaq istəyirəm. Nə vaxt görüşə bilərik?`) }
      : { label: 'Dəyiş təklif et', icon: Repeat, action: () => setSwapOpen(true) }

  const showSwapSecondary = item.modes.includes('swap') && primary.label !== 'Dəyiş təklif et'

  return (
    <div className="container product">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Geri
      </button>

      <div className="product-grid">
        <div className="product-left">
        <div className={`gallery ${item.images.length > 1 ? '' : 'is-single'}`}>
          <div className="gallery-main">
            <Img key={item.images[active]} src={item.images[active]} alt={item.title} />
            <div className="gallery-actions">
              <button className={`fav-btn static ${fav ? 'is-on' : ''}`} onClick={() => toggleFavorite(item.id)} aria-label="Seçilmişlər">
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
              </button>
              <button
                className="fav-btn static"
                aria-label="Paylaş"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  notify('Link kopyalandı')
                }}
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
          {item.images.length > 1 && (
            <div className="thumbs">
              {item.images.map((src, i) => (
                <button key={src} className={`thumb ${i === active ? 'is-on' : ''}`} onClick={() => setActive(i)} aria-label={`Şəkil ${i + 1}`}>
                  <Img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        </div>

        <div className="product-info" ref={infoRef}>
          <div className="product-sticky">
            <p className="crumbs">
              <Link to="/ikinci-el">Kəşf et</Link> / <Link to={`/ikinci-el?cat=${item.category}`}>{catById(item.category)?.short}</Link>
            </p>
            <h1 className="product-title">{item.title}</h1>
            <div className="product-badges">
              {item.modes.map((m) => <ModeBadge key={m} mode={m} full />)}
            </div>
            <p className={`product-price ${item.price === 0 ? 'is-free' : ''}`}>{formatPrice(item.price)}</p>

            <dl className="specs">
              <div><dt>Vəziyyət</dt><dd>{item.condition}</dd></div>
              <div><dt>Ərazi</dt><dd><MapPin size={14} /> {item.district}</dd></div>
              <div><dt>Paylaşılıb</dt><dd>{item.posted}</dd></div>
              <div>
                <dt>Təhvil</dt>
                <dd>
                  {item.delivery.includes('meet') && <span className="with-icon"><Handshake size={14} /> Görüş</span>}
                  {item.delivery.includes('courier') && <span className="with-icon"><Truck size={14} /> Kuryer</span>}
                </dd>
              </div>
            </dl>

            {item.defect && (
              <div className="defect-box">
                <strong>İkinci şans · {item.repair}</strong>
                <p>{item.defect}</p>
              </div>
            )}

            {!isMine ? (
              <div className="product-ctas">
                <button className="btn btn-primary btn-lg btn-block" onClick={primary.action}>
                  <primary.icon size={18} /> {primary.label}
                </button>
                {showSwapSecondary && (
                  <button className="btn btn-lime btn-lg btn-block" onClick={() => setSwapOpen(true)}>
                    <Repeat size={18} /> Dəyiş təklif et
                  </button>
                )}
              </div>
            ) : (
              <div className="note-box">Bu sənin elanındır. Gələn təkliflər “Dəyiş-düyüş → Təkliflərim” bölməsində görünür.</div>
            )}

            <CollectButton item={item} variant="link" />

            {!isMine && <ContactCard seller={seller} item={item} />}

            <section className="pd-card" aria-label="Elan haqqında">
              <div className="pd-sec">
                <span className="pd-label">Elan haqqında</span>
                <p className="pd-desc-text">{item.description}</p>
              </div>

              {item.story && (
                <figure className="pd-story">
                  <blockquote>{item.story}</blockquote>
                  <figcaption>Əşyanın hekayəsi</figcaption>
                </figure>
              )}

              {item.modes.includes('swap') && item.wantsText.length > 0 && (
                <div className="pd-sec pd-row">
                  <span className="pd-label">Əvəzində istəyir</span>
                  <div className="pd-wants">
                    {item.wantsText.map((w) => <span key={w}>{w}</span>)}
                  </div>
                </div>
              )}

              <div className="pd-seller">
                <Link to={isMine ? '/profil' : '#'} className="pd-seller-main" onClick={(e) => !isMine && e.preventDefault()}>
                  <Avatar user={seller} className="seller-avatar" />
                  <span className="pd-seller-text">
                    <strong>
                      {seller.name} {seller.verified && <BadgeCheck size={15} className="verified" />}
                    </strong>
                    <small>
                      <Star size={12} fill="currentColor" /> {seller.rating ?? 'Yeni'} · {seller.reviews} rəy · {seller.district}
                      {seller.fastReply && <em><Zap size={12} /> Sürətli cavab verir</em>}
                    </small>
                  </span>
                </Link>
                <button className="pd-report" onClick={() => notify('Şikayətin qəbul edildi. Komandamız yoxlayacaq.')}>
                  <Flag size={13} /> Şikayət et
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="section section-tight">
          <h2 className="h2">Satıcının digər elanları</h2>
          <div className="grid-4">{more.map((l) => <ProductCard key={l.id} item={l} />)}</div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="section section-tight">
          <h2 className="h2">Bənzər tapıntılar</h2>
          <div className="grid-4">{similar.map((l) => <ProductCard key={l.id} item={l} />)}</div>
        </section>
      )}

      {swapOpen && <SwapModal target={item} onClose={() => setSwapOpen(false)} />}
    </div>
  )
}
