import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, ArrowLeft, ShieldCheck, Search, ArrowUpRight } from 'lucide-react'
import Img from '../components/Img'
import { USERS, formatPrice } from '../data'
import { useApp } from '../store'

export default function Messages() {
  const { conversations, sendMessage, getItem } = useApp()
  const [activeId, setActiveId] = useState(conversations[0]?.id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [text, setText] = useState('')
  const [q, setQ] = useState('')
  const endRef = useRef(null)
  const active = conversations.find((c) => c.id === activeId)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [active?.messages.length, activeId])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim() || !active) return
    sendMessage(active.id, text.trim())
    setText('')
  }

  const shown = conversations.filter((c) => {
    if (!q) return true
    const hay = `${USERS[c.with].name} ${getItem(c.listing)?.title || ''}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  const u = active ? USERS[active.with] : null
  const it = active ? getItem(active.listing) : null

  return (
    <div className="container section-page msg2-page">
      <header className="section-page-head">
        <div>
          <h1 className="page-title">Mesajlar</h1>
        </div>
      </header>

      <div className="msg2">
        <aside className={`msg2-list ${mobileOpen ? 'is-hidden-sm' : ''}`}>
          <div className="msg2-search">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ad və ya əşya axtar" aria-label="Söhbət axtar" />
          </div>
          <ul>
            {shown.map((c) => {
              const cu = USERS[c.with]
              const ci = getItem(c.listing)
              const last = c.messages[c.messages.length - 1]
              return (
                <li key={c.id}>
                  <button
                    className={`msg2-row ${c.id === activeId ? 'is-on' : ''} ${c.unread > 0 ? 'is-unread' : ''}`}
                    onClick={() => {
                      setActiveId(c.id)
                      setMobileOpen(true)
                    }}
                  >
                    <Img src={cu.avatar} alt={cu.name} className="msg2-avatar" />
                    <span className="msg2-row-text">
                      <span className="msg2-row-top">
                        <strong>{cu.name}</strong>
                        <time>{last?.time}</time>
                      </span>
                      <em>{ci?.title}</em>
                      <span className="msg2-row-last">
                        <span>{last?.from === 'me' ? `Sən: ${last.text}` : last?.text}</span>
                        {c.unread > 0 && <b>{c.unread}</b>}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
            {shown.length === 0 && <li className="msg2-none">Uyğun söhbət tapılmadı</li>}
          </ul>
        </aside>

        {active && (
          <section className={`msg2-chat ${mobileOpen ? '' : 'is-hidden-sm'}`}>
            <header className="msg2-head">
              <button className="icon-btn show-sm" onClick={() => setMobileOpen(false)} aria-label="Geri">
                <ArrowLeft size={18} />
              </button>
              <Img src={u.avatar} alt={u.name} className="msg2-avatar" />
              <div className="msg2-who">
                <strong>{u.name}</strong>
                <small>{u.district}</small>
              </div>
              {it && (
                <Link to={`/elan/${it.id}`} className="msg2-item">
                  <Img src={it.images[0]} alt="" className="msg2-thumb" />
                  <span>
                    <strong>{it.title}</strong>
                    <small>{formatPrice(it.price)}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </header>

            <div className="msg2-body">
              <div className="msg2-day"><span>Bu gün</span></div>
              {active.messages.map((m, i) => (
                <div key={i} className={`msg2-bubble ${m.from === 'me' ? 'is-me' : ''}`}>
                  <p>{m.text}</p>
                  <time>{m.time}</time>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form className="msg2-input" onSubmit={submit}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Mesaj yaz…" aria-label="Mesaj" />
              <button className="msg2-send" type="submit" aria-label="Göndər" disabled={!text.trim()}>
                <Send size={17} />
              </button>
            </form>
            <p className="msg2-safety">
              <ShieldCheck size={13} /> Görüşü gündüz, ictimai yerdə təyin et. Əşyanı görmədən ödəniş etmə.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
