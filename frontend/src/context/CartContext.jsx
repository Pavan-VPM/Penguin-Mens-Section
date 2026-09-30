import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const INITIAL_CART = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    color: 'NOCTURNE BLACK',
    size: 'M',
    price: 11900,
    badge: 'DROP 04',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
    qty: 1
  },
  {
    id: 2,
    name: 'Monolith Lug Derby',
    color: 'MATTE BLACK',
    size: '42 EU / 9 US',
    price: 21500,
    badge: 'CORE',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1gnBz655IdvVc1kO3NYSAvFEtlpZ66Wu9-iyodD2SqX8lAO6XchzyrZ6KdjTiv0hZALzdKDErN0So9P4trw3X16PBFg2lpzRVlsEf0TafladgrnZ_xB_UuzBhHsVWH_-KgjTxZSKXjyWxQngmueCK6uMeTKdEkPCee_IAJqqJfgXD1SN9RUmxjJPavdVubh2wgZ3Ihsbe-IN8KyomS25QkT6EyJR0tIgYVwSPiDlNOZNJNbK2MfJ',
    qty: 1
  }
]

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('penguin_cart_v2')
      return saved ? JSON.parse(saved) : INITIAL_CART
    } catch {
      return INITIAL_CART
    }
  })

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('penguin_wishlist')
      return saved ? JSON.parse(saved) : [1, 4]
    } catch {
      return [1, 4]
    }
  })

  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('penguin_cart_v2', JSON.stringify(cartItems))
    } catch (e) {
      console.error(e)
    }
  }, [cartItems])

  useEffect(() => {
    try {
      localStorage.setItem('penguin_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.error(e)
    }
  }, [wishlist])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2200)
  }

  const addToCart = (product, size = 'M') => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i)
      }
      let parsedPrice = product.price
      if (typeof parsedPrice === 'string') {
        parsedPrice = parseFloat(parsedPrice.replace(/[₹$,]/g, ''))
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        color: product.color || 'Nocturne Black',
        size: size,
        price: parsedPrice,
        badge: product.badge || 'FW25',
        img: product.img,
        qty: 1
      }]
    })
    showToast(`Added "${product.name}" to Bag`)
  }

  const updateQty = (id, delta, size) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id && (!size || i.size === size)) {
        const newQty = i.qty + delta
        return newQty > 0 ? { ...i, qty: newQty } : null
      }
      return i
    }).filter(Boolean))
  }

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && (!size || i.size === size))))
    showToast('Item removed from Bag')
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId]
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist')
      return next
    })
  }

  const isWishlisted = (productId) => wishlist.includes(productId)

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      cartCount,
      subtotal,
      wishlist,
      toggleWishlist,
      isWishlisted,
      showToast
    }}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 84,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'var(--inverse-surface)',
          color: 'var(--inverse-on-surface)',
          padding: '10px 20px',
          borderRadius: 999,
          boxShadow: 'var(--card-hover-shadow)',
          border: '1px solid var(--card-border)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary-container)' }}>check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
