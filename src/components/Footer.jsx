import { Link } from 'react-router-dom'
import { Wordmark } from './Logo'
import Leaves from './Leaves'

export default function Footer() {
  return (
    <footer className="footer">
      <Leaves className="footer-leaves" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Wordmark className="wordmark-light" />
            <p className="footer-claim">Əşyaların ikinci həyatı</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Haqqımızda</h4>
              <Link to="/">Relove nədir?</Link>
              <Link to="/deyis">Dəyiş-düyüş necə işləyir?</Link>
              <Link to="/paylas">Elan yerləşdir</Link>
            </div>
            <div>
              <h4>Kəşf et</h4>
              <Link to="/kesf?mode=sale">Satış</Link>
              <Link to="/kesf?mode=swap">Dəyiş-düyüş</Link>
              <Link to="/kesf?mode=free">Pulsuz paylaşım</Link>
            </div>
            <div>
              <h4>Kömək</h4>
              <span>Təhlükəsiz görüş qaydaları</span>
              <span>Şikayət et</span>
              <span>Məxfilik siyasəti</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Relove · Bakı</span>
          <span>Sat. Dəyiş. Paylaş. Yenidən sev.</span>
        </div>
      </div>
    </footer>
  )
}
