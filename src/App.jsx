import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Product from './pages/Product'
import Swap from './pages/Swap'
import Share from './pages/Share'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import SecondChance from './pages/SecondChance'
import Collections, { CollectionDetail } from './pages/Collections'
import MyListings from './pages/MyListings'
import Auth from './pages/Auth'
import { useApp } from './store'

// Giriş tələb edən səhifələr: girməyibsə giriş səhifəsinə
function Private({ children }) {
  const { me } = useApp()
  const location = useLocation()
  if (!me) return <Navigate to={`/giris?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return children
}

// Server cavab verməyəndə və ya ilk yükləmədə
function Boot() {
  const { ready, loadError, retry } = useApp()
  if (ready) return null
  return (
    <div className="boot">
      {loadError ? (
        <div className="boot-card">
          <h2>Serverə qoşulmaq olmadı</h2>
          <p>{loadError}</p>
          <p className="boot-hint">Terminalda <code>npm run server</code> işlədiyindən əmin ol.</p>
          <button className="btn btn-primary" onClick={retry}>Yenidən yoxla</button>
        </div>
      ) : (
        <div className="boot-spinner" aria-label="Yüklənir" />
      )}
    </div>
  )
}

function KesfRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/ikinci-el${search}`} replace />
}

export default function App() {
  const location = useLocation()
  const { ready } = useApp()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const hideFooter = location.pathname.startsWith('/mesajlar') || location.pathname.startsWith('/paylas')

  return (
    <div className="app">
      <Navbar />
      <main className="page" key={location.pathname}>
        {!ready ? <Boot /> : (
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/kesf" element={<KesfRedirect />} />
          <Route path="/ikinci-el" element={<Explore />} />
          <Route path="/elan/:id" element={<Product />} />
          <Route path="/deyis" element={<Swap />} />
          <Route path="/paylas" element={<Private><Share /></Private>} />
          <Route path="/profil" element={<Private><Profile /></Private>} />
          <Route path="/paylasdiqlarim" element={<Private><MyListings /></Private>} />
          <Route path="/secilmisler" element={<Private><Favorites /></Private>} />
          <Route path="/ikinci-sans" element={<SecondChance />} />
          <Route path="/kolleksiyalar" element={<Collections />} />
          <Route path="/kolleksiyalar/:id" element={<CollectionDetail />} />
          <Route path="/mesajlar" element={<Private><Messages /></Private>} />
          <Route path="/giris" element={<Auth mode="login" />} />
          <Route path="/qeydiyyat" element={<Auth mode="register" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        )}
      </main>
      {!hideFooter && <Footer />}
      <MobileNav />
      <Toast />
    </div>
  )
}
