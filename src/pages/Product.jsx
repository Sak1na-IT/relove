import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Heart, MapPin, Star, BadgeCheck, Zap, Repeat, MessageCircle, Gift, Handshake, Truck, Share2, Flag, Quote,
} from 'lucide-react'
import Img from '../components/Img'
import ModeBadge from '../components/ModeBadge'
import ProductCard from '../components/ProductCard'
import SwapModal from '../components/SwapModal'
import ContactCard from '../components/ContactCard'
import { USERS, catById, formatPrice } from '../data'
import { useApp } from '../store'
import NotFound from './NotFound'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getItem, listings, favorites, toggleFavorite, startConversation, notify } = useApp()
  const item = getItem(id)
  const [active, setActive] = useState(0)
  const [swapOpen, setSwapOpen] = useState(false)

  if (!item) return <NotFound />

  const seller = USERS[item.seller]
  const isMine = item.seller === 'me'
  const fav = favorites.includes(item.id)
  const more = listings.filter((l) => l.seller === item.seller && l.id !== item.id).slice(0, 4)
  const similar = listings.filter((l) => l.category === item.category && l.id !== item.id).slice(0, 4)

  const contact = (text) => {
    startConversation(item.seller, item.id, text)
    notify('Mesaj göndərildi')
    navigate('/mesajlar')
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

          <div className="pd-details">
            {item.modes.includes('swap') && item.wantsText.length > 0 && (
              <div className="wants">
                <h4>Bunlarla dəyişməyə hazırdır</h4>
                <div className="chip-wrap">
                  {item.wantsText.map((w) => <span key={w} className="chip chip-static">{w}</span>)}
                </div>
              </div>
            )}

            <div className="pd-desc">
              <h3>Təsvir</h3>
              <p className="product-desc">{item.description}</p>
            </div>

            {item.story && (
              <blockquote className="story">
                <Quote size={18} />
                <p>{item.story}</p>
                <cite>— əşyanın hekayəsi</cite>
              </blockquote>
            )}

            <Link to={isMine ? '/profil' : '#'} className="seller" onClick={(e) => !isMine && e.preventDefault()}>
              {seller.avatar ? (
                <Img src={seller.avatar} alt={seller.name} className="seller-avatar" />
              ) : (
                <span className="seller-avatar avatar-initials">{seller.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              )}
              <div className="seller-info">
                <strong>
                  {seller.name} {seller.verified && <BadgeCheck size={16} className="verified" />}
                </strong>
                <span className="with-icon">
                  <Star size={13} fill="currentColor" /> {seller.rating} · {seller.reviews} rəy · {seller.district}
                </span>
                {seller.fastReply && (
                  <span className="with-icon fast"><Zap size={13} /> Sürətli cavab verir</span>
                )}
              </div>
            </Link>

            <button className="report" onClick={() => notify('Şikayətin qəbul edildi. Komandamız yoxlayacaq.')}>
              <Flag size={14} /> Elandan şikayət et
            </button>
          </div>
        </div>

        <div className="product-info">
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

            {!isMine && <ContactCard seller={seller} item={item} />}

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
