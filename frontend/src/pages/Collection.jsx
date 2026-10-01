import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProducts } from '../services/api'

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Structured Poplin Overshirt', color: 'Nocturne Black', price: '₹11,900', sizes: ['S','M','L'], img: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY' },
  { id: 2, name: 'Structured Oxford Shirt', color: 'Slate White', price: '₹9,900', sizes: ['S','M','L','XL'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR9S4fgMwiQA96pWo4DRRnR4yoqrORLPBRtU1exX8jFx4Mf2lu4FZb0To4JX24dcoEh-GbRf-FaR0s39tPIiS-Wq0OsNB6EjKqSxhQGXr6jGjGplvjbLYbTqyJxLhFFwdTcx8VHcX7jpv4b6tEmXM8HrtLl5wfKDkseOPqLDMKvkLxq7qflNN9MqLaF67Kxj_tJ08uRdK6jSUxDaYDhtHlAB-7Gx5TOqStb4NoD1G01OK9YFRlnEY' },
  { id: 3, name: 'Matte Tech Shirt', color: 'Deep Charcoal', price: '₹10,500', badge: 'New', sizes: ['S','M','L'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw6PlIfD7vb_n4u5I_wD4HhFdTcV-UVOCENxio76QfVtj4TtfRRyePIpQIcJigP4x9Wc7TemI-nMXXz6Pt7XngwmTtRuBYdxnhGmoGboojO1aB4qDaF8UBDAqL-EKhubCIg19kp_1Kvw65x8WO4Rzftn8xvR5e0BIIwaGyqj97L00TABLrHE0n7YezXGVCKzCQSEdTRZNm10F1GUVNiBmvJvBz3q8wCtZpserBa9hHWrT6REccVN_4' },
  { id: 4, name: 'Brushed Cotton Overshirt', color: 'Moss Green', price: '₹12,900', sizes: ['M','L','XL'], img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8K4W-FWh7vCYR_mvxb8wOL-rNOr0a633cUAMpF8eh5QxC614cWcQEpiQSaRejQNnri7CgeDLbrRuYzbZuDbNAM_sJtIPV15Y8BBOKF-Y3EpQ3gHW36ynSnnFZGlzqccRALL8zRwe9P9L2eHAGDs8fdhRUsDXLjGzeIHvXqO8jaB4ybpyYPRq6Vvqc4d92tse7zqKIIhYfdKoqJ3fJc7Qrp8vmN9_ETZ30v2PzbUq4rVOVpYAGd_nk' },
]

const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated']

export default function CollectionPage() {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist, addToCart } = useCart()
  const [sort, setSort] = useState('Newest')
  const [showFilter, setShowFilter] = useState(false)
  const [collectionProducts, setCollectionProducts] = useState(FALLBACK_PRODUCTS)

  useEffect(() => {
    async function loadCollection() {
      try {
        const res = await getProducts({ category: 'Shirts' })
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            color: p.color || 'Nocturne Black',
            price: typeof p.price === 'number' ? `₹${p.price.toLocaleString('en-IN')}` : p.price,
            badge: p.badge || '',
            sizes: p.sizes?.map(s => s.size) || ['S', 'M', 'L'],
            img: p.images?.[0] || p.img,
          }))
          setCollectionProducts(formatted)
        }
      } catch (e) {
        console.warn('Using fallback collection data')
      }
    }
    loadCollection()
  }, [])

  const sortedProducts = [...collectionProducts].sort((a, b) => {
    const priceA = parseFloat(String(a.price).replace(/[^\d]/g, '')) || 0
    const priceB = parseFloat(String(b.price).replace(/[^\d]/g, '')) || 0
    if (sort === 'Price: Low to High') return priceA - priceB
    if (sort === 'Price: High to Low') return priceB - priceA
    return String(a.id).localeCompare(String(b.id))
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '3rem' }}>
      <div className="content-container">
        {/* Header */}
        <div style={{ padding: '1.5rem 0 1rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="text-label-caps text-primary">PENGUINS COLLECTION</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>Shirts & Overgarments</h1>
            <span className="text-body-sm text-on-surface-variant">{collectionProducts.length} curated garments</span>
          </div>
        </div>

        {/* Filter / Sort Bar */}
        <div style={{ display: 'flex', gap: 8, paddingBottom: 24, overflowX: 'auto' }} className="no-scrollbar">
          <button
            onClick={() => setShowFilter(!showFilter)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, border: '1px solid var(--outline-variant)', background: 'var(--surface-container)', color: 'var(--on-surface)', cursor: 'pointer', flexShrink: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
            Filter
          </button>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className="text-label-caps"
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: sort === opt ? 'var(--primary-container)' : 'var(--surface-container)',
                color: sort === opt ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
                transition: 'all 0.15s',
              }}
            >{opt}</button>
          ))}
        </div>

        {/* Product Grid - Responsive */}
        <div className="product-grid-responsive">
          {sortedProducts.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 12,
                background: 'var(--surface-container-low)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--card-border)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => navigate('/product/structured-poplin-overshirt')}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--card-hover-shadow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: 'var(--surface-container)', overflow: 'hidden' }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                {p.badge && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--primary-container)', padding: '2px 8px', borderRadius: 4 }}>
                    <span className="text-label-caps" style={{ color: 'var(--on-primary-fixed)', fontSize: 10 }}>{p.badge}</span>
                  </div>
                )}
                <button
                  aria-label="Wishlist"
                  onClick={e => { e.stopPropagation(); toggleWishlist(p.id) }}
                  style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-wishlist-btn)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWishlisted(p.id) ? 'var(--primary-container)' : 'var(--on-surface)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: isWishlisted(p.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); addToCart(p, 'M') }}
                  style={{ position: 'absolute', bottom: 10, right: 10, width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-container)', color: 'var(--on-primary-fixed)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                </button>
              </div>
              <div style={{ padding: '12px' }}>
                <p className="text-label-caps text-on-surface-variant">{p.color}</p>
                <h3 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span className="text-title-sm text-primary" style={{ fontWeight: 700 }}>{p.price}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.sizes.slice(0, 3).map(s => (
                      <span key={s} className="text-label-caps" style={{ background: 'var(--surface-container-high)', padding: '3px 6px', borderRadius: 4, fontSize: 9, color: 'var(--on-surface-variant)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
