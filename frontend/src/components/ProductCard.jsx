import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const SIZES_LIST = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist, addToCart } = useCart()

  const id = product._id || product.id
  const name = product.name || 'Tailored Garment'
  const category = product.category || 'Menswear'
  const color = product.color || 'Nocturne Black'
  
  // Numerical price handling
  const rawPrice = typeof product.price === 'number' 
    ? product.price 
    : parseFloat(String(product.price).replace(/[^\d.]/g, '')) || 1999
  const formattedPrice = `₹${rawPrice.toLocaleString('en-IN')}`
  
  // Original MRP calculation (default ~40-50% higher for discount strike effect like Snitch / Souled Store)
  const originalPrice = product.originalPrice || Math.round(rawPrice * 1.65)
  const mainImg = product.images?.[0] || product.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'

  // Exclude any discount/percentage OFF badges for a minimal luxury look
  const badge = product.badge && !product.badge.includes('OFF') && !product.badge.includes('%') ? product.badge : null
  const rating = product.rating || '4.8'
  const reviewsCount = product.reviewsCount || 148

  const isFav = isWishlisted(id)

  const handleCardClick = (e) => {
    navigate(`/product/${id}`)
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    toggleWishlist(id)
  }

  const handleQuickAdd = (e, size) => {
    e.stopPropagation()
    addToCart({
      id,
      name,
      price: rawPrice,
      color,
      badge,
      img: mainImg
    }, size)
  }

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Media Wrap */}
      <div className="product-media-wrap">
        <img 
          src={mainImg} 
          alt={name} 
          className="product-img-main" 
          loading="lazy" 
        />

        {/* Badge Tag */}
        {badge && (
          <span className={`card-badge-tag ${badge.includes('OFF') ? 'tag-hot' : 'tag-new'}`}>
            {badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          className={`card-wishlist-btn ${isFav ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <span 
            className="material-symbols-outlined" 
            style={{ 
              fontSize: 20, 
              fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" 
            }}
          >
            favorite
          </span>
        </button>

        {/* Quick Size Select Bar on Desktop Hover */}
        <div className="card-quick-size-bar">
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
            Size:
          </span>
          {SIZES_LIST.map(sz => (
            <button
              key={sz}
              className="quick-size-btn"
              onClick={(e) => handleQuickAdd(e, sz)}
              title={`Quick Add Size ${sz}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Info Wrap */}
      <div className="product-info-wrap">
        <div className="product-brand-subtitle">{category}</div>
        <h3 className="product-title-text" title={name}>{name}</h3>
        <div className="product-price-row">
          <span className="price-current">{formattedPrice}</span>
        </div>
      </div>
    </div>
  )
}
