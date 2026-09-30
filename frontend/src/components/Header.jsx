import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import brandLogoDark from '../assets/logo 2.png'
import brandLogoLight from '../assets/logo-light.png'

export default function Header({ cartCount: propCartCount }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const brandLogo = theme === 'light' ? brandLogoLight : brandLogoDark
  let contextCount = 0
  let wishlistCount = 0
  try {
    const { cartCount, wishlist } = useCart()
    contextCount = cartCount
    wishlistCount = wishlist.length
  } catch (e) {}
  const count = propCartCount !== undefined ? propCartCount : contextCount

  const NAV_LINKS = [
    { label: 'Drop 01', path: '/winter-drop' },
    { label: 'Collection', path: '/collection/shirts' },
    { label: 'Wishlist', path: '/wishlist' },
  ]

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Left: Minimal Brand Logo */}
        <button
          onClick={() => navigate('/')}
          aria-label="Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <img
            src={brandLogo}
            alt="Penguin Men's Section"
            className="brand-logo-img"
          />
        </button>

        {/* Center: Minimalist Desktop Navigation */}
        <nav className="desktop-only" style={{ alignItems: 'center', gap: 36 }}>
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.path
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 0',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                  borderBottom: isActive ? '2px solid var(--primary-container)' : '2px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Right: Minimal Icon Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Search Icon */}
          <button
            aria-label="Search"
            onClick={() => navigate('/search')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: location.pathname === '/search' ? 'var(--primary-container)' : 'var(--on-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
          </button>

          {/* Desktop Wishlist Icon */}
          <button
            aria-label="Wishlist"
            onClick={() => navigate('/wishlist')}
            className="desktop-only"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: location.pathname === '/wishlist' ? 'var(--primary-container)' : 'var(--on-surface)',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'color 0.15s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: location.pathname === '/wishlist' ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--primary-container)'
              }} />
            )}
          </button>

          {/* Shopping Bag Icon with Minimal Badge */}
          <button
            aria-label="Shopping Cart"
            onClick={() => navigate('/cart')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: location.pathname === '/cart' ? 'var(--primary-container)' : 'var(--on-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'color 0.15s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              shopping_bag
            </span>
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: 5,
                right: 5,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 999,
                background: 'var(--primary-container)',
                color: 'var(--on-primary-fixed)',
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}>
                {count}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className={`theme-toggle${theme === 'light' ? ' theme-toggle--light' : ''}`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="theme-toggle__track">
              {/* Moon icon (dark side) */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: theme === 'dark' ? 'var(--primary-container)' : 'var(--on-surface-variant)', opacity: theme === 'dark' ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              {/* Sun icon (light side) */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: theme === 'light' ? 'var(--primary-container)' : 'var(--on-surface-variant)', opacity: theme === 'light' ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <div className="theme-toggle__thumb" />
          </button>

          {/* Account Icon */}
          <button
            aria-label="Account"
            onClick={() => navigate('/account')}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: location.pathname === '/account' ? 'var(--primary-container)' : 'var(--surface-container-high)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: 4,
              color: location.pathname === '/account' ? 'var(--on-primary-fixed)' : 'var(--on-surface)',
              transition: 'all 0.15s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
          </button>
        </div>
      </div>
    </header>
  )
}
