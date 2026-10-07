import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'

import QuickCartDrawer from './QuickCartDrawer'
import brandLogoDark from '../assets/logo-dark.png'

const MAIN_NAV_LINKS = [
  { label: 'New Arrivals', path: '/collection', badge: 'NEW' },
  { label: 'Shirts', path: '/collection/shirts' },
  { label: 'T-Shirts & Tops', path: '/collection/tees' },
  { label: 'Jackets & Outerwear', path: '/collection/jackets' },
  { label: 'Formalwear & Suits', path: '/collection/formals' },
  { label: 'All Products', path: '/collection' },
  { label: 'Wishlist', path: '/wishlist' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, wishlist } = useCart()
  const { customer, isLoggedIn } = useCustomerAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const brandLogo = brandLogoDark

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    } else {
      navigate('/search')
    }
  }

  return (
    <>

      {/* Main Sticky Header */}
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-main-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>

            {/* Left: Menu Toggle */}
            <div className="header-left-group">
              <button
                className="header-icon-btn"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                title="Open Menu"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="brand-logo-wrap" onClick={() => navigate('/')} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={brandLogo}
                alt="PENGUIN Menswear"
                style={{ height: 44, width: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* Right: Search, Wishlist, Cart, Profile */}
            <div className="header-actions" style={{ justifyContent: 'flex-end' }}>

              {/* Search Icon */}
              <button
                className="header-icon-btn"
                onClick={() => navigate('/search')}
                aria-label="Search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>search</span>
              </button>

              {/* Wishlist Icon (Desktop only) */}
              <button
                className="header-icon-btn desktop-only"
                onClick={() => navigate('/wishlist')}
                aria-label="Wishlist"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    fontVariationSettings: wishlist.length > 0 ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  favorite
                </span>
                {wishlist.length > 0 && (
                  <span className="badge-count">{wishlist.length}</span>
                )}
              </button>

              {/* Shopping Bag Icon with Quick Drawer (Desktop only) */}
              <button
                className="header-icon-btn desktop-only"
                onClick={() => setIsCartDrawerOpen(true)}
                aria-label="Open Shopping Bag"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>shopping_bag</span>
                {cartCount > 0 && (
                  <span className="badge-count">{cartCount}</span>
                )}
              </button>

              {/* Profile — right corner */}
              <button
                className="header-icon-btn"
                onClick={() => navigate(isLoggedIn ? '/account' : '/login')}
                aria-label="Account"
                title={isLoggedIn ? `Account (${customer?.name})` : 'Log In'}
                style={{ position: 'relative' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: isLoggedIn ? 'var(--brand-accent)' : 'inherit' }}>person</span>
                {isLoggedIn && (
                  <span style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-accent)',
                  }} />
                )}
              </button>

            </div>
          </div>
        </div>
      </header>


      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="drawer-panel-left">
            {/* Drawer Header */}
            <div style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <img
                src={brandLogo}
                alt="PENGUIN"
                style={{ height: 32, width: 'auto', objectFit: 'contain' }}
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
              <div style={{ padding: '0 20px 12px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Categories
              </div>
              {MAIN_NAV_LINKS.map(link => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="nav-pill-badge">{link.badge}</span>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>chevron_right</span>
                  )}
                </button>
              ))}

              <div style={{ padding: '24px 20px 12px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Account & Help
              </div>
              <button
                onClick={() => navigate('/account')}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'none',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
                <span>My Profile & Orders</span>
              </button>
            </div>

            {/* Mobile Footer Note */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              ⚡ Free Express Delivery on orders above ₹1,999
            </div>
          </div>
        </>
      )}

      {/* Slide-out Quick Cart Drawer */}
      <QuickCartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />
    </>
  )
}
