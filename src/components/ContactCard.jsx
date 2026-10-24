import { useState } from 'react'
import { MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store'

// Satıcı ilə əlaqə — satış, dəyiş-düyüş və İkinci şans elanlarında eyni işləyir
export default function ContactCard({ seller, item }) {
  const [shown, setShown] = useState(false)
  const { startConversation, notify } = useApp()
  const navigate = useNavigate()
  const masked = seller.phone ? seller.phone.replace(/(\d{2} \d{3}) (\d{2}) (\d{2})$/, '$1 •• ••') : ''
  const digits = seller.phone ? seller.phone.replace(/\D/g, '') : ''

  const message = async () => {
    const convId = await startConversation(seller.id, item.id, `Salam! "${item.title}" elanı ilə bağlı yazıram.`)
    if (!convId) return
    notify('Söhbət açıldı')
    navigate(`/mesajlar?c=${convId}`)
  }

  return (
    <div className="contact">
      <p className="contact-title">{seller.name.split(' ')[0]} ilə əlaqə</p>
      <div className="contact-actions">
        <button className="contact-btn contact-btn-main" onClick={message}>
          <MessageCircle size={17} strokeWidth={1.7} /> Mesaj yaz
        </button>
        {seller.phone &&
          (shown ? (
            <a className="contact-btn" href={`tel:+${digits}`}>
              <Phone size={16} strokeWidth={1.7} /> {seller.phone}
            </a>
          ) : (
            <button className="contact-btn" onClick={() => setShown(true)}>
              <Phone size={16} strokeWidth={1.7} /> {masked} <span className="contact-reveal">Göstər</span>
            </button>
          ))}
        {seller.whatsapp && digits && (
          <a className="contact-btn" href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
            </svg>
            WhatsApp
          </a>
        )}
      </div>
      <p className="contact-safe">
        <ShieldCheck size={14} /> Ödənişi əşyanı görüb yoxladıqdan sonra et. Görüşü ictimai yerdə təyin edin.
      </p>
    </div>
  )
}
