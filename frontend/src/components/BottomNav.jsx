import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'category', label: 'Shop', path: '/collection/shirts' },
  { icon: 'ac_unit', label: 'Drop', path: '/winter-drop' },
  { icon: 'favorite', label: 'Wishlist', path: '/wishlist' },
  { icon: 'person', label: 'Account', path: '/account' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 4px',
                color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                transition: 'color 0.15s',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transition: 'all 0.15s',
                }}
              >
                {item.icon}
              </span>
              <span className="text-label-caps" style={{ fontSize: 10, letterSpacing: '0.06em' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
