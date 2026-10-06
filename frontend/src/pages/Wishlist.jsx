import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    originalPrice: 3499,
    badge: 'NEW',
    rating: '4.9',
    reviewsCount: 312,
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'
    ]
  },
  {
    id: 4,
    name: 'Technical Matte Bomber Jacket',
    category: 'Jackets',
    color: 'Washed Black',
    price: 3499,
    originalPrice: 5999,
    badge: 'DROP 01',
    rating: '5.0',
    reviewsCount: 96,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMcWjy3fc8ms2v322i4KsHjjqsF8Aq-MkauMwU7eFgN9eltVE2jd-ie_damkN6PrGmoYwQdT9lHTQfL4lmA9vYBjLiY0J3Ub8LLGwmH4qgRkmOvtfEEX2gL5u-zYEgSpC8HjBWjxRekLABxWoGfPOffgV_u4MrrkdczbPqI8OfLAPNdKlfkqJGo65U2u-qO4SG_rHV_UnwvLyTbsVvNlZLbIgF2RyYYidVi36LVb5GfFM0ZTnuDJjN'
    ]
  }
]

export default function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist, setWishlist, cleanWishlist, clearWishlist, addToCart } = useCart()
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getProducts()
        if (res?.data) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Shirts',
            color: p.color || 'Nocturne Black',
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: p.originalPrice || Math.round((typeof p.price === 'number' ? p.price : 1999) * 1.65),
            badge: p.badge || 'NEW',
            rating: p.rating || '4.9',
            reviewsCount: p.reviewsCount || 120,
            images: p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : []),
          }))
          setAllProducts(formatted)
          cleanWishlist(formatted)
        } else {
          setAllProducts([])
        }
      } catch (err) {
        console.warn('Could not load wishlist catalog')
        setAllProducts([])
      }
    }
    loadData()
  }, [])

  // Auto-prune stale IDs that do not exist in the loaded product catalog
  useEffect(() => {
    if (allProducts.length > 0 && wishlist.length > 0) {
      const validSet = new Set(
        allProducts
          .flatMap(p => [p.id, p._id, p.slug])
          .filter(Boolean)
          .map(String)
      )
      const validWishlist = wishlist.filter(id => id && validSet.has(String(id)))
      if (validWishlist.length !== wishlist.length) {
        setWishlist(validWishlist)
      }
    }
  }, [allProducts, wishlist, setWishlist])

  const wishlistedItems = allProducts.filter(p =>
    wishlist.some(wId =>
      String(wId) === String(p.id) ||
      String(wId) === String(p._id) ||
      String(wId) === String(p.slug)
    )
  )

  const handleMoveAllToBag = () => {
    wishlistedItems.forEach(item => {
      addToCart({
        id: item.id || item._id,
        name: item.name,
        price: item.price,
        color: item.color,
        badge: item.badge,
        img: item.images?.[0] || item.img || ''
      }, 'M')
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 16, marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>
              My Wishlist ({wishlistedItems.length} {wishlistedItems.length === 1 ? 'Item' : 'Items'})
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Your saved collection of architectural menswear and streetwear drops.
            </p>
          </div>

          {wishlistedItems.length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={clearWishlist}
                className="btn-outline"
                style={{ height: 42, fontSize: 12, padding: '0 16px' }}
              >
                Clear All
              </button>
              <button
                onClick={handleMoveAllToBag}
                className="btn-solid-primary"
                style={{ height: 42, fontSize: 12, padding: '0 20px' }}
              >
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {wishlistedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--text-muted)' }}>favorite_border</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase' }}>Your Wishlist is Empty</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, margin: '6px auto 20px' }}>
              Explore our fresh FW25 arrivals and save your favorite garments here.
            </p>
            <button
              onClick={() => navigate('/collection/shirts')}
              className="btn-solid-primary"
              style={{ height: 44, padding: '0 28px', fontSize: 12 }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="product-grid-home">
            {wishlistedItems.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
