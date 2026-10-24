import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Send, ArrowLeft, ShieldCheck, Search, ArrowUpRight } from 'lucide-react'
import Img from '../components/Img'
import Avatar from '../components/Avatar'
import { formatPrice } from '../data'
import { useApp } from '../store'

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek']
const isToday = (d) => d.toDateString() === new Date().toDateString()
// Bu gün → "14:05", əvvəlki günlər → "23 okt"
function clock(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return isToday(d) ? d.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }) : `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function Messages() {
  const { conversations, messages, openConversation, sendMessage, users } = useApp()
  const [params] = useSearchParams()
  const [activeId, setActiveId] = useState(params.get('c') || conversations[0]?.id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [text, setText] = useState('')
  const [q, setQ] = useState('')
  const endRef = useRef(null)
  const active = conversations.find((c) => c.id === activeId)
  const thread = (active && messages[active.id]) || []

  // Söhbət seçiləndə mesajlarını serverdən yüklə (oxunmuş sayılır)
  useEffect(() => {
    if (activeId) openConversation(activeId)
  }, [activeId, openConversation])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [thread.length, activeId])

  const userOf = (c) => users[c.with] || c.withUser || { name: '—' }
  const itemOf = (c) => c.listingItem

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim() || !active) return
    sendMessage(active.id, text.trim())
    setText('')
  }

  const shown = conversations.filter((c) => {
    if (!q) return true
    const hay = `${userOf(c).name} ${itemOf(c)?.title || ''}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  const u = active ? userOf(active) : null
  const it = active ? itemOf(active) : null

  return (
    <div className="msg2-page">
      <div className="msg2">
        <aside className={`msg2-list ${mobileOpen ? 'is-hidden-sm' : ''}`}>
          <div className="msg2-list-head">
            <h1>Mesajlar</h1>
            <span>{conversations.length} söhbət</span>
          </div>
          <div className="msg2-search">
            <Search size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ad və ya əşya axtar" aria-label="Söhbət axtar" />
          </div>
          <ul>
            {shown.map((c) => {
              const cu = userOf(c)
              const ci = itemOf(c)
              const last = c.lastMessage
              return (
                <li key={c.id}>
                  <button
                    className={`msg2-row ${c.id === activeId ? 'is-on' : ''} ${c.unread > 0 ? 'is-unread' : ''}`}
                    onClick={() => {
                      setActiveId(c.id)
                      setMobileOpen(true)
                    }}
                  >
                    <Avatar user={cu} className="msg2-avatar" />
                    <span className="msg2-row-text">
                      <span className="msg2-row-top">
                        <strong>{cu.name}</strong>
                        <time>{clock(last?.createdAt)}</time>
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
              <Avatar user={u} className="msg2-avatar" />
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
              {thread.map((m, i) => {
                const day = new Date(m.createdAt).toDateString()
                const newDay = i === 0 || day !== new Date(thread[i - 1].createdAt).toDateString()
                return (
                  <div key={m.id || i} className="msg2-group">
                    {newDay && (
                      <div className="msg2-day">
                        <span>{isToday(new Date(m.createdAt)) ? 'Bu gün' : new Date(m.createdAt).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long' })}</span>
                      </div>
                    )}
                    <div className={`msg2-bubble ${m.from === 'me' ? 'is-me' : ''}`}>
                      <p>{m.text}</p>
                      <time>{clock(m.createdAt)}</time>
                    </div>
                  </div>
                )
              })}
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
