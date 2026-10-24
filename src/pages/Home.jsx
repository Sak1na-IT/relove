import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Repeat, Gift, ShieldCheck, MessageCircle, Star } from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import CategoryIcon from '../components/CategoryIcon'
import Leaves from '../components/Leaves'
import { CATEGORIES, HERO_SLIDES, HOME_COLLECTIONS, img } from '../data'
import { useApp } from '../store'

function Hero() {
  const [i, setI] = useState(0)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_SLIDES.length), 6500)
    return () => clearInterval(t)
  }, [])

  const slide = HERO_SLIDES[i]

  return (
    <section className="container">
      <div className="hero">
        {HERO_SLIDES.map((s, n) => (
          <div key={s.image} className={`hero-slide ${n === i ? 'is-on' : ''}`} aria-hidden={n !== i}>
            <Img src={s.image} alt="" />
          </div>
        ))}
        <div className="hero-shade" />
        <div className="hero-content" key={i}>
          <h1 className="hero-title">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="hero-text">{slide.text}</p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault()
              navigate(`/kesf${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
            }}
            role="search"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nə axtarırsan?" aria-label="Axtarış" />
            <button type="submit" aria-label="Axtar">
              <Search size={18} />
            </button>
          </form>
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((s, n) => (
            <button key={s.image} className={n === i ? 'is-on' : ''} onClick={() => setI(n)} aria-label={`Slayd ${n + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { listings } = useApp()
  const popular = listings.slice(0, 6)
  const fresh = listings.slice(6, 12)
  const freeItems = listings.filter((l) => l.modes.includes('free')).slice(0, 4)

  return (
    <>
      <Hero />

      {/* CATEGORIES */}
      <section className="container">
        <div className="cat-row">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/kesf?cat=${c.id}`} className="cat-item">
              <span className="cat-circle">
                <CategoryIcon name={c.icon} />
              </span>
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
          <Leaves className="swap-banner-leaves" />
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

      {/* TRUST */}
      <section className="container block">
        <div className="trust">
          <div className="trust-item">
            <ShieldCheck size={22} strokeWidth={1.5} />
            <div>
              <h3>Təsdiqlənmiş profillər</h3>
              <p>Əlaqə məlumatları yoxlanılmış istifadəçilər xüsusi nişan alır.</p>
            </div>
          </div>
          <div className="trust-item">
            <Star size={22} strokeWidth={1.5} />
            <div>
              <h3>Real rəylər</h3>
              <p>Rəyi yalnız əməliyyatı tamamlayan istifadəçi yaza bilər.</p>
            </div>
          </div>
          <div className="trust-item">
            <MessageCircle size={22} strokeWidth={1.5} />
            <div>
              <h3>Məxfi ünsiyyət</h3>
              <p>Nömrən və ünvanın sən istəməyincə heç kimə görünmür.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
