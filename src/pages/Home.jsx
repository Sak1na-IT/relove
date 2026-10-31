import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronLeft, ChevronRight, Repeat, Tag, Gift, Heart, Leaf, ShieldCheck, Users, Gem,
} from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import Leaves from '../components/Leaves'
import { CURATED, isFashion } from '../data'
import { CollectionCover } from './Collections'
import { useApp } from '../store'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=80'

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
        <Img src={HERO_IMAGE} alt="Taxta asılqanlarda düzülmüş geyimlər" />
      </div>
      <div className="hero4-shade" />
      <div className="container hero4-inner">
        <div className="hero4-copy">
          <h1 className="hero4-title">
            Əşyalara
            <br />
            ikinci həyat ver.
          </h1>
          <div className="hero4-ctas">
            <Link to="/ikinci-el" className="btn btn-primary btn-lg">
              Kəşfə başla
            </Link>
            <Link to="/paylasdiqlarim" className="btn btn-ghost btn-lg">
              Əşya paylaş
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

function SectionHead({ title, text, to, label }) {
  return (
    <div className="block-head">
      <div>
        <h2 className="h2">{title}</h2>
        {text && <p className="block-sub">{text}</p>}
      </div>
      {to && (
        <Link to={to} className="link-arrow">
          {label} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { listings, getItem } = useApp()
  const swapA = getItem('l1')
  const swapB = getItem('l4')
  // Relove-da əvvəlcə geyim görünür: paltar, ayaqqabı, çanta, aksesuar
  const fashionFirst = (arr) => [...arr.filter(isFashion), ...arr.filter((l) => !isFashion(l))]
  const sale = fashionFirst(listings.filter((l) => l.modes.includes('sale')))
  const popular = fashionFirst([...listings].sort((a, b) => (b.likes || 0) - (a.likes || 0))).slice(0, 6)
  const repairs = listings.filter((l) => l.modes.includes('free')).slice(0, 3)

  return (
    <>
      <Hero />

      {/* ƏN ÇOX BƏYƏNİLƏNLƏR */}
      <section className="container block">
        <SectionHead
          title="Ən çox bəyənilənlər"
          to="/ikinci-el?sort=likes"
          label="Hamısına bax"
        />
        <div className="likes-row">
          {popular.map((item, i) => (
            <Link key={item.id} to={`/elan/${item.id}`} className="likes-card">
              <span className="likes-photo">
                <Img src={item.images[0]} alt={item.title} />
                <span className="likes-count">
                  <Heart size={12} fill="currentColor" /> {item.likes || 0}
                </span>
              </span>
              <span className="likes-body">
                <span className="likes-rank">{String(i + 1).padStart(2, '0')}</span>
                <span className="likes-text">
                  <strong>{item.title}</strong>
                  <small>{item.price ? `${item.price} AZN` : 'Pulsuz'} · {item.district}</small>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* İKİNCİ ƏL */}
      <section className="container block">
        <SectionHead title="İkinci əl" to="/ikinci-el" label="Bütün satış elanları" />
        <Rail>
          {sale.slice(0, 12).map((item) => (
            <div className="rail2-item" key={item.id}>
              <ProductCard item={item} onlyModes={['sale']} />
            </div>
          ))}
        </Rail>
      </section>

      {/* DƏYİŞ-DÜYÜŞ */}
      <section className="container block">
        <div className="swap4">
          <Leaves className="swap4-leaves" />
          <div className="swap4-copy">
            <h2>
              Dəyiş-düyüş et,
              <br />
              yeni hekayələr başlasın!
            </h2>
            <p>Əşyanı ver, əvəzində ehtiyacın olanı al — pul xərcləmədən.</p>
            <Link to="/deyis" className="btn btn-light">
              Dəyiş elanlarına bax
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

      {/* İKİNCİ ŞANS */}
      <section className="container block">
        <div className="sc-teaser">
          <div className="sc-teaser-copy">
            <h2 className="h2">İkinci şans</h2>
            <p>
              Sökülmüş şərf, laxlayan stul, bir tərəfi işləməyən qulaqlıq. Atma — paylaş. Kimsə onu düzəldib yenidən
              istifadə edəcək.
            </p>
            <div className="sc-teaser-ctas">
              <Link to="/ikinci-sans" className="btn btn-primary">İkinci şans əşyalarına bax</Link>
              <Link to="/paylas?mode=free" className="link-arrow">Qüsurlu əşya paylaş</Link>
            </div>
          </div>
          <div className="sc-teaser-items">
            {repairs.map((it) => (
              <Link key={it.id} to={`/elan/${it.id}`} className="sc-teaser-item">
                <span className="sc-teaser-photo"><Img src={it.images[0]} alt={it.title} /></span>
                <strong>{it.title}</strong>
                <small>{it.repair} · {it.price ? `${it.price} AZN` : 'Pulsuz'}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KOLLEKSİYALAR */}
      <section className="container block">
        <SectionHead title="Kolleksiyalar" to="/kolleksiyalar" label="Bütün kolleksiyalar" />
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

      {/* DƏYƏRLƏR */}
      <section className="container block block-last">
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
    </>
  )
}
