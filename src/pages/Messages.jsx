import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, ArrowLeft, ShieldCheck } from 'lucide-react'
import Img from '../components/Img'
import { USERS, formatPrice } from '../data'
import { useApp } from '../store'

export default function Messages() {
  const { conversations, sendMessage, getItem } = useApp()
  const [activeId, setActiveId] = useState(conversations[0]?.id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [text, setText] = useState('')
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

  return (
    <div className="container messages">
      <aside className={`convo-list ${mobileOpen ? 'is-hidden-sm' : ''}`}>
        <h1 className="display display-sm">Mesajlar</h1>
        {conversations.map((c) => {
          const u = USERS[c.with]
          const it = getItem(c.listing)
          const last = c.messages[c.messages.length - 1]
          return (
            <button
              key={c.id}
              className={`convo ${c.id === activeId ? 'is-on' : ''}`}
              onClick={() => {
                setActiveId(c.id)
                setMobileOpen(true)
              }}
            >
              <Img src={u.avatar} alt={u.name} className="convo-avatar" />
              <div className="convo-text">
                <strong>{u.name}</strong>
                <small>{it?.title}</small>
                <p>{last?.text}</p>
              </div>
              {c.unread > 0 && <span className="dot-count is-lime static">{c.unread}</span>}
            </button>
          )
        })}
      </aside>

      {active && (
        <section className={`chat ${mobileOpen ? '' : 'is-hidden-sm'}`}>
          {(() => {
            const u = USERS[active.with]
            const it = getItem(active.listing)
            return (
              <>
                <header className="chat-head">
                  <button className="icon-btn show-sm" onClick={() => setMobileOpen(false)} aria-label="Geri">
                    <ArrowLeft size={18} />
                  </button>
                  <Img src={u.avatar} alt={u.name} className="convo-avatar" />
                  <div>
                    <strong>{u.name}</strong>
                    <small>{u.district}</small>
                  </div>
                </header>
                {it && (
                  <Link to={`/elan/${it.id}`} className="chat-item">
                    <Img src={it.images[0]} alt={it.title} />
                    <div>
                      <strong>{it.title}</strong>
                      <small>{formatPrice(it.price)}</small>
                    </div>
                  </Link>
                )}
                <div className="chat-body">
                  <p className="chat-safety">
                    <ShieldCheck size={14} /> Görüşləri gündüz və ictimai yerlərdə təyin edin. Öncədən ödəniş etməyin.
                  </p>
                  {active.messages.map((m, i) => (
                    <div key={i} className={`bubble ${m.from === 'me' ? 'is-me' : ''}`}>
                      <p>{m.text}</p>
                      <small>{m.time}</small>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <form className="chat-input" onSubmit={submit}>
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Mesaj yaz…" aria-label="Mesaj" />
                  <button className="btn btn-primary btn-icon" type="submit" aria-label="Göndər" disabled={!text.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            )
          })()}
        </section>
      )}
    </div>
  )
}
