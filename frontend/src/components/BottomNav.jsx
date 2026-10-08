import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, wishlist } = useCart()

  const NAV_ITEMS = [
    { id: 'home', icon: 'home', label: 'Home', path: '/' },
    { id: 'shop', icon: 'grid_view', label: 'Shop', path: '/collection' },
    { id: 'new', icon: 'auto_awesome', label: 'New Arrivals', path: '/new-arrivals' },
    { id: 'wishlist', icon: 'favorite', label: 'Wishlist', path: '/wishlist', count: wishlist.length },
    { id: 'bag', icon: 'shopping_bag', label: 'Bag', path: '/cart', count: cartCount },
  ]

  const getIsActive = (item) => {
    if (item.id === 'home') {
      return location.pathname === '/'
    }
    if (item.id === 'new') {
      return location.pathname === '/new-arrivals' || location.search.includes('newest')
    }
    if (item.id === 'shop') {
      return (
        (location.pathname === '/collection' || location.pathname.startsWith('/collection/')) &&
        !location.search.includes('newest') &&
        location.pathname !== '/new-arrivals'
      )
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <nav className="dynamic-island-dock" aria-label="Bottom Navigation">
      <div className="dynamic-island-capsule">
        {NAV_ITEMS.map((item) => {
          const isActive = getIsActive(item)
          return (
            <button
              key={item.id}
              className={`dynamic-island-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              title={item.label}
            >
              <div className="dynamic-island-icon-wrap">
                <span
                  className="material-symbols-outlined dynamic-island-icon"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {item.icon}
                </span>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`dynamic-island-badge ${isActive ? 'active-badge' : ''}`}>
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

