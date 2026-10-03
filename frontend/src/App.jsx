import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import HomePage from './pages/Home'
import CollectionPage from './pages/Collection'
import ProductDetailPage from './pages/ProductDetail'
import CartPage from './pages/Cart'
import CheckoutPage from './pages/Checkout'
import WishlistPage from './pages/Wishlist'
import AccountPage from './pages/Account'
import SearchPage from './pages/Search'
import AdminPage from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isCheckout = location.pathname === '/checkout'
  const isAdmin = location.pathname === '/admin'

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="app-shell" style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        overflowX: 'hidden'
      }}>
        {/* Full responsive luxury container */}
        <div className="app-inner-shell" style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Global Header */}
          <Header />

          {/* Main Route Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/winter-drop" element={<Navigate to="/collection" replace />} />
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/collection/:category" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Minimal Luxury Footer */}
          {!isCheckout && !isAdmin && <Footer />}

          {/* Bottom Navigation (automatically hidden on desktop via CSS) */}
          {!isCheckout && !isAdmin && <BottomNav />}
        </div>
      </div>
    </CartProvider>
  )
}
