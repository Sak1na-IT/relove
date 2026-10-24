import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Repeat, Gift, ShieldCheck, MessageCircle, MapPin, BadgeCheck, Heart } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import CategoryThumb from '../components/CategoryThumb'
import { CATEGORIES, HOME_COLLECTIONS, USERS, formatPrice, img } from '../data'
import { useApp } from '../store'

const QUICK_SEARCHES = ['Palto', 'Kreslo', 'Kitablar', 'Velosiped', 'Qulaqlıq']

const SAFETY = [
  { icon: ShieldCheck, title: 'Təsdiqlənmiş profillər', text: 'Telefon nömrəsi yoxlanılmış istifadəçilər xüsusi nişan alır.' },
  { icon: MessageCircle, title: 'Nömrən gizli qalır', text: 'Bütün danışıqlar Relove mesajlarında aparılır.' },
  { icon: MapPin, title: 'Təhlükəsiz görüş', text: 'Gündüz və ictimai yerlərdə görüşməyi tövsiyə edirik.' },
]

function Passport({ item, back }) {
  const seller = USERS[item.seller]
  return (
    <div className="passport-wrap">
      {back && (
        <div className="passport-back" aria-hidden="true">
          <Img src={back.images[0]} alt="" />
        </div>
      )}
      <Link to={`/elan/${item.id}`} className="passport">
        <div className="passport-photo">
          <Img src={item.images[0]} alt={item.title} />
          <span className="passport-tag">Əşya pasportu</span>
        </div>
        <div className="passport-body">
          <div className="passport-head">
            <strong>{item.title}</strong>
            <span>{formatPrice(item.price)}</span>
          </div>
          <ol className="passport-steps">
            <li style={{ '--d': '0.5s' }}>
              <span className="passport-dot"><BadgeCheck size={14} /></span>
              <div>
                <b>{seller.name}</b>
                <small>Təsdiqlənmiş satıcı, {seller.district}</small>
              </div>
            </li>
            <li style={{ '--d': '0.9s' }}>
              <span className="passport-dot"><ShieldCheck size={14} /></span>
              <div>
                <b>Elan yoxlanılıb</b>
                <small>Real fotolar, vəziyyəti: {item.condition.toLowerCase()}</small>
              </div>
            </li>
            <li style={{ '--d': '1.3s' }} className="is-next">
              <span className="passport-dot"><Heart size={13} fill="currentColor" /></span>
              <div>
                <b>Növbəti sahibi: sən</b>
                <small>Mesaj yaz, görüşü birlikdə seçin</small>
              </div>
            </li>
          </ol>
        </div>
      </Link>
    </div>
  )
}

function Hero({ item, back }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const go = (term) => navigate(`/kesf${term.trim() ? `?q=${encodeURIComponent(term.trim())}` : ''}`)

  return (
    <section className="container hero3">
      <div className="hero3-copy">
        <h1 className="hero3-title">Əşyaların ikinci həyatı.</h1>
        <p className="hero3-text">
          Bakıda ikinci əl əşyaları rahat sat, dəyiş və ya hədiyyə et. Hər profil yoxlanılır, hər danışıq platformada qalır.
        </p>
        <form
          className="hero3-search"
          onSubmit={(e) => {
            e.preventDefault()
            go(q)
          }}
          role="search"
        >
          <Search size={19} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nə axtarırsan?" aria-label="Axtarış" />
          <button type="submit" className="btn btn-primary">Axtar</button>
        </form>
        <div className="hero3-quick">
          <span>Tez-tez axtarılanlar:</span>
          {QUICK_SEARCHES.map((t) => (
            <button key={t} onClick={() => go(t)}>{t}</button>
          ))}
        </div>
      </div>
      <Passport item={item} back={back} />
    </section>
  )
}

export default function Home() {
  const { listings } = useApp()
  const popular = listings.slice(0, 6)
  const fresh = listings.slice(6, 12)
  const freeItems = listings.filter((l) => l.modes.includes('free')).slice(0, 4)
  const story = listings.find((l) => l.id === 'l5') || listings.find((l) => l.story)
  const heroItem = listings.find((l) => l.id === 'l2') || listings[0]
  const heroBack = listings.find((l) => l.id === 'l15')

  return (
    <>
      <Hero item={heroItem} back={heroBack} />

      {/* SAFETY */}
      <section className="container">
        <ul className="safety">
          {SAFETY.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="safety-icon"><Icon size={20} strokeWidth={1.6} /></span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CATEGORIES */}
      <section className="container">
        <div className="cat-row">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/kesf?cat=${c.id}`} className="cat-item">
              <CategoryThumb category={c} />
              <span className="cat-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="container block">
        <div className="block-head">
          <h2 className="h2">Populyar elanlar</h2>
          <Link to="/kesf" className="link-arrow">
            Hamısına bax <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid-6">
          {popular.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* SWAP BANNER */}
      <section className="container block">
        <div className="swap-banner">
          <div className="swap-banner-copy">
            <h2>
              Dəyiş-düyüş et,
              <br />
              yeni hekayələr başlasın!
            </h2>
            <p>Pul xərcləmədən, əşyanı əşya ilə dəyiş. Hər iki tərəf razılaşmadan heç nə tamamlanmır.</p>
            <Link to="/deyis" className="btn btn-light">
              Dəyiş-düyüş bölməsi <ArrowRight size={16} />
            </Link>
          </div>
          <div className="swap-banner-media">
            <Img src={img('1489987707025-afc232f7ea0f', 1200)} alt="Dəyiş-düyüş" />
            <span className="swap-banner-icon">
              <Repeat size={26} strokeWidth={1.6} />
            </span>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="container block">
        <div className="block-head">
          <h2 className="h2">Sizin üçün seçdiyimiz kolleksiyalar</h2>
          <Link to="/kesf" className="link-arrow">
            Hamısına bax <ArrowRight size={15} />
          </Link>
        </div>
        <div className="collections-strip">
          {HOME_COLLECTIONS.map((c) => (
            <Link key={c.title} to={c.to} className="col-card">
              <div className="col-card-media">
                <Img src={c.image} alt={c.title} />
              </div>
              <span>{c.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* EDITORIAL STORY */}
      {story && (
        <section className="container block">
          <div className="story-block">
            <div className="story-media">
              <Link to={`/elan/${story.id}`} className="story-media-main">
                <Img src={story.images[1] || story.images[0]} alt={story.title} />
              </Link>
              <div className="story-media-small">
                <Img src={story.images[0]} alt="" />
              </div>
            </div>
            <div className="story-copy">
              <p className="eyebrow">Bu həftənin hekayəsi</p>
              <h2 className="h2">
                Hər əşyanın bir keçmişi var. Sənin evində isə gələcəyi.
              </h2>
              <blockquote className="story-quote">“{story.story}”</blockquote>
              <div className="story-author">
                <Img src={USERS[story.seller].avatar} alt={USERS[story.seller].name} />
                <div>
                  <strong>{USERS[story.seller].name}</strong>
                  {story.title} · {story.district}
                </div>
              </div>
              <Link to={`/elan/${story.id}`} className="btn btn-primary">
                Əşyaya bax <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* NEW */}
      <section className="container block">
        <div className="block-head">
          <h2 className="h2">Yeni əlavə olunanlar</h2>
          <Link to="/kesf" className="link-arrow">
            Hamısına bax <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid-6">
          {fresh.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* FREE */}
      {freeItems.length > 0 && (
        <section className="container block">
          <div className="free-banner">
            <div className="free-banner-copy">
              <span className="free-banner-icon">
                <Gift size={22} strokeWidth={1.6} />
              </span>
              <h2 className="h2">Pulsuz paylaşım</h2>
              <p>Bəzi əşyalar sadəcə yaxşı əllərə düşmək istəyir. Hədiyyə edilən əşyalara bax.</p>
              <Link to="/kesf?mode=free" className="link-arrow">
                Hədiyyələrə bax <ArrowRight size={15} />
              </Link>
            </div>
            <div className="free-banner-items">
              {freeItems.map((item) => (
                <Link key={item.id} to={`/elan/${item.id}`} className="free-thumb">
                  <Img src={item.images[0]} alt={item.title} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  )
}
