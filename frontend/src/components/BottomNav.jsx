import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, wishlist } = useCart()

  const NAV_ITEMS = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'grid_view', label: 'Shop', path: '/collection' },
    { icon: 'auto_awesome', label: 'New', path: '/collection', badge: 'NEW' },
    { icon: 'favorite', label: 'Wishlist', path: '/wishlist', count: wishlist.length },
    { icon: 'shopping_bag', label: 'Bag', path: '/cart', count: cartCount },
  ]

  return (
    <nav className="mobile-bottom-dock">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
        return (
          <button
            key={item.label}
            className={`dock-item-btn ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  color: isActive ? 'var(--brand-accent)' : 'inherit',
                  transition: 'transform 0.15s ease'
                }}
              >
                {item.icon}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 999,
                    backgroundColor: 'var(--brand-accent)',
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1
                  }}
                >
                  {item.count}
                </span>
              )}
            </div>
            <span className="dock-item-label" style={{ color: isActive ? 'var(--brand-accent)' : 'inherit' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
