import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const hideFooter = location.pathname.startsWith('/mesajlar') || location.pathname.startsWith('/paylas')

  return (
    <div className="app">
      <Navbar />
      <main className="page" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/kesf" element={<Explore />} />
          <Route path="/elan/:id" element={<Product />} />
          <Route path="/deyis" element={<Swap />} />
          <Route path="/paylas" element={<Share />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/secilmisler" element={<Favorites />} />
          <Route path="/ikinci-sans" element={<SecondChance />} />
          <Route path="/kolleksiyalar" element={<Collections />} />
          <Route path="/kolleksiyalar/:id" element={<CollectionDetail />} />
          <Route path="/mesajlar" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <MobileNav />
      <Toast />
    </div>
  )
}
