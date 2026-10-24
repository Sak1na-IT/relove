import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronLeft, ChevronRight, Repeat, Tag, Gift, Heart, Leaf, ShieldCheck, Users, Gem,
} from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import Leaves from '../components/Leaves'
import { HOME_CATEGORIES, CURATED } from '../data'
import { CollectionCover } from './Collections'
import { useApp } from '../store'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2400&q=80'

const HERO_FEATURES = [
  { icon: Tag, label: 'Sat.' },
  { icon: Repeat, label: 'Dəyiş.' },
  { icon: Gift, label: 'Paylaş.' },
  { icon: Heart, label: 'Yenidən sev.' },
]

const VALUES = [
  { icon: Leaf, title: 'Davamlı seçim', text: 'İkinci əl seçmək daha təmiz bir gələcək deməkdir.' },
  { icon: ShieldCheck, title: 'Təhlükəsiz alış-veriş', text: 'Təsdiqlənmiş profillər və platformadaxili mesajlar.' },
  { icon: Users, title: 'Güclü icma', text: 'Dəyiş, paylaş, yeni dostlar qazan.' },
  { icon: Gem, title: 'Hər əşya dəyər qazanır', text: 'Unudulmuş əşyalar yeni sahibində yaşayır.' },
]

function Hero() {
  return (
    <section className="hero4">
      <div className="hero4-media">
        <Img src={HERO_IMAGE} alt="Yaşıl kreslo və isti işıqlı qonaq otağı" />
      </div>
      <div className="hero4-shade" />
      <div className="container hero4-inner">
        <div className="hero4-copy">
          <h1 className="hero4-title">
            Yaxşı əşyaların
            <br />
            hekayəsi bitmir.
          </h1>
          <p className="hero4-text">
            İstifadə etmədiyin əşyalara yeni sahib tap. Sevdiyin parçaları kəşf et, dəyiş və əşyaların həyatını davam
            etdir.
          </p>
          <div className="hero4-ctas">
            <Link to="/ikinci-el" className="btn btn-primary btn-lg">
              Kəşfə başla
            </Link>
            <Link to="/paylas" className="btn btn-ghost btn-lg">
              Əşya paylaş
            </Link>
            <Link to="/deyis" className="hero4-more">
              Necə işləyir?
            </Link>
          </div>
          <ul className="hero4-features">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span>
                  <Icon size={13} strokeWidth={1.8} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <p className="hero4-note" aria-hidden="true">
          Daha yaxşı bir gələcək üçün, birlikdə.
        </p>
      </div>
    </section>
  )
}

function Rail({ children }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="rail2">
      <button className="rail2-btn rail2-prev" onClick={() => scroll(-1)} aria-label="Geri">
        <ChevronLeft size={20} />
      </button>
      <div className="rail2-track" ref={ref}>
        {children}
      </div>
      <button className="rail2-btn rail2-next" onClick={() => scroll(1)} aria-label="İrəli">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export default function Home() {
  const { listings, getItem } = useApp()
  const count = (cats) => listings.filter((l) => cats.includes(l.category) && !l.modes.includes('free')).length
  const swapA = getItem('l1')
  const swapB = getItem('l4')

  return (
    <>
      <Hero />

      {/* CATEGORIES */}
      <section className="container block">
        <div className="block-head">
          <h2 className="h2">Kateqoriyalar</h2>
          <Link to="/ikinci-el" className="link-arrow">
            Bütün kateqoriyalar <ArrowRight size={15} />
          </Link>
        </div>
        <div className="cat-cards">
          {HOME_CATEGORIES.map((c) => (
            <Link key={c.id} to={`/ikinci-el?cat=${c.id}`} className="cat-card">
              <div className="cat-card-media">
                <Img src={c.photo} alt={c.label} />
              </div>
              <strong>{c.label}</strong>
              <small>{count(c.cats)} elan</small>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="container block-sm">
        <ul className="values">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="values-icon">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* DISCOVER */}
      <section className="container block">
        <div className="block-head">
          <h2 className="h2">İndi kəşf edilənlər</h2>
          <Link to="/ikinci-el" className="link-arrow">
            Bütün elanlar <ArrowRight size={15} />
          </Link>
        </div>
        <Rail>
          {listings.filter((l) => !l.modes.includes('free')).slice(0, 12).map((item) => (
            <div className="rail2-item" key={item.id}>
              <ProductCard item={item} />
            </div>
          ))}
        </Rail>
      </section>

      {/* SWAP */}
      <section className="container block">
        <div className="swap4">
          <Leaves className="swap4-leaves" />
          <div className="swap4-copy">
            <h2>
              Dəyiş-düyüş et,
              <br />
              yeni hekayələr başlasın!
            </h2>
            <p>Bəlkə də axtardığın əşya sənin evində artıq kiminsə gözlədiyi şeydir.</p>
            <Link to="/deyis" className="btn btn-light">
              Dəyiş-düyüş təklif et
            </Link>
          </div>
          {swapA && swapB && (
            <div className="swap4-visual" aria-hidden="true">
              <div className="swap4-photo swap4-photo-a">
                <Img src={swapA.images[0]} alt="" />
              </div>
              <span className="swap4-icon">
                <Repeat size={24} strokeWidth={1.6} />
              </span>
              <div className="swap4-photo swap4-photo-b">
                <Img src={swapB.images[0]} alt="" />
              </div>
              <p className="swap4-note">İki əşya, bir yeni başlanğıc.</p>
            </div>
          )}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="container block block-last">
        <div className="block-head">
          <h2 className="h2">Sizin üçün seçdiyimiz kolleksiyalar</h2>
          <Link to="/kolleksiyalar" className="link-arrow">
            Bütün kolleksiyalar <ArrowRight size={15} />
          </Link>
        </div>
        <div className="col-grid">
          {CURATED.slice(0, 6).map((c) => {
            const items = listings.filter(c.match)
            return (
              <Link key={c.id} to={`/kolleksiyalar/${c.id}`} className="col-card">
                <div className="col-card-media">
                  <CollectionCover items={items} />
                </div>
                <strong>{c.title}</strong>
                <small>{items.length} məhsul</small>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
