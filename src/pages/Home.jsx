import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronLeft, ChevronRight, Repeat, Tag, Gift, Heart, Leaf, ShieldCheck, Users, Gem,
} from 'lucide-react'
import Img from '../components/Img'
import ProductCard from '../components/ProductCard'
import Leaves from '../components/Leaves'
import { CURATED, WARDROBE, isFashion } from '../data'
import { CollectionCover } from './Collections'
import { useApp } from '../store'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=80'

const HERO_FEATURES = [
  { icon: Tag, label: 'Sat.' },
  { icon: Repeat, label: 'Dəyiş.' },
  { icon: Gift, label: 'Paylaş.' },
  { icon: Heart, label: 'Yenidən geyin.' },
]

const VALUES = [
  { icon: Leaf, title: 'Davamlı moda', text: 'Hər ikinci əl parça bir az daha az tekstil tullantısı deməkdir.' },
  { icon: ShieldCheck, title: 'Təhlükəsiz alış-veriş', text: 'Təsdiqlənmiş profillər və platformadaxili mesajlar.' },
  { icon: Users, title: 'Güclü icma', text: 'Dəyiş, paylaş, yeni dostlar qazan.' },
  { icon: Gem, title: 'Hər parça dəyər qazanır', text: 'Şkafda unudulmuş paltar yeni sahibində yenidən geyinilir.' },
]

function Hero() {
  return (
    <section className="hero4">
      <div className="hero4-media">
        <Img src={HERO_IMAGE} alt="Asılqanda düzülmüş geyimlər" />
      </div>
      <div className="hero4-shade" />
      <div className="container hero4-inner">
        <div className="hero4-copy">
          <h1 className="hero4-title">
            Qarderobuna
            <br />
            ikinci nəfəs ver.
          </h1>
          <p className="hero4-text">
            Geyinmədiyin paltarı, ayaqqabını və çantanı sat, dəyiş və ya pulsuz ver. Başqasının şkafında unudulmuş
            parça isə sənin yeni sevimlin ola bilər.
          </p>
          <div className="hero4-ctas">
            <Link to="/ikinci-el?dept=qadin" className="btn btn-primary btn-lg">
              Geyimlərə bax
            </Link>
            <Link to="/paylas?mode=sale" className="btn btn-ghost btn-lg">
              Paltar sat
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
          Az al. Daha çox geyin.
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

function Wardrobe({ listings }) {
  const count = (to) => {
    const q = new URLSearchParams(to.split('?')[1])
    return listings.filter((l) => {
      if (!l.modes.includes('sale')) return false
      if (q.get('sub') && l.sub !== q.get('sub')) return false
      if (q.get('cat') && l.category !== q.get('cat')) return false
      if (q.get('q') && !l.title.toLowerCase().includes(q.get('q'))) return false
      return true
    }).length
  }
  return (
    <section className="container block">
      <div className="block-head wardrobe-head">
        <div>
          <h2 className="h2">Şkafa göz at</h2>
        </div>
        <div className="wardrobe-depts">
          <Link to="/ikinci-el?dept=qadin">Qadın</Link>
          <Link to="/ikinci-el?dept=kisi">Kişi</Link>
          <Link to="/ikinci-el?dept=usaq">Uşaq</Link>
        </div>
      </div>
      <div className="wardrobe">
        {WARDROBE.map((w) => (
          <Link key={w.label} to={w.to} className="wardrobe-tile">
            <span className="wardrobe-photo">
              <Img src={w.photo} alt={w.label} />
            </span>
            <strong>{w.label}</strong>
            <small>{count(w.to)} elan</small>
          </Link>
        ))}
      </div>
    </section>
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
  const swapA = getItem('l18')
  const swapB = getItem('l2')
  const sale = listings.filter((l) => l.modes.includes('sale'))
  const fashion = sale.filter(isFashion)
  const others = sale.filter((l) => !isFashion(l))
  const popular = [...fashion].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6)
  const free = listings.filter((l) => l.modes.includes('free'))
  const repairs = [...free.filter(isFashion), ...free.filter((l) => !isFashion(l))].slice(0, 3)

  return (
    <>
      <Hero />

      {/* ŞKAFA GÖZ AT */}
      <Wardrobe listings={listings} />

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
        <SectionHead title="Yeni gələn geyimlər" to="/ikinci-el" label="Bütün elanlar" />
        <Rail>
          {fashion.slice(0, 12).map((item) => (
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
              Paltarını dəyiş,
              <br />
              qarderobun təzələnsin!
            </h2>
            <p>Geyinmədiyin parçanı ver, əvəzində ölçünə uyğun yenisini al — pul xərcləmədən.</p>
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
              <p className="swap4-note">İki parça, bir yeni stil.</p>
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
              Sökülmüş tikiş, düşmüş düymə, yeyilmiş daban. Atma — paylaş. Dərzi və ya usta əli dəyən parça yenidən
              geyiniləcək.
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

      {/* ŞKAFDAN KƏNAR */}
      {others.length > 0 && (
        <section className="container block">
          <SectionHead title="Şkafdan kənar" to="/ikinci-el?dept=ev" label="Ev, texnika və hobbi" />
          <Rail>
            {others.slice(0, 12).map((item) => (
              <div className="rail2-item rail2-item-sm" key={item.id}>
                <ProductCard item={item} onlyModes={['sale']} />
              </div>
            ))}
          </Rail>
        </section>
      )}

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
