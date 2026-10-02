import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductById, getProducts } from '../services/api'
import SizeGuideModal from '../components/SizeGuideModal'
import ProductCard from '../components/ProductCard'

const DEFAULT_IMAGES = [
  'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR9S4fgMwiQA96pWo4DRRnR4yoqrORLPBRtU1exX8jFx4Mf2lu4FZb0To4JX24dcoEh-GbRf-FaR0s39tPIiS-Wq0OsNB6EjKqSxhQGXr6jGjGplvjbLYbTqyJxLhFFwdTcx8VHcX7jpv4b6tEmXM8HrtLl5wfKDkseOPqLDMKvkLxq7qflNN9MqLaF67Kxj_tJ08uRdK6jSUxDaYDhtHlAB-7Gx5TOqStb4NoD1G01OK9YFRlnEY'
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToCart, isWishlisted, toggleWishlist } = useCart()

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [pincode, setPincode] = useState('')
  const [pincodeChecked, setPincodeChecked] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState(null)
  const [openAccordion, setOpenAccordion] = useState('details')
  const [relatedProducts, setRelatedProducts] = useState([])

  const [product, setProduct] = useState({
    id: id || 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    originalPrice: 3499,
    badge: '43% OFF',
    rating: '4.9',
    reviewsCount: 312,
    images: DEFAULT_IMAGES,
    description: 'A contemporary relaxed overshirt crafted from 100% Japanese high-density organic cotton poplin. Features an exaggerated camp collar, concealed matte buttons, and side split vents.',
    fabricCare: '100% High-Density Organic Cotton (180 GSM). Cold machine wash delicate, iron on low reverse.',
    deliveryInfo: 'Dispatched within 24 hours. Estimated delivery 2-4 business days across India.'
  })

  // Load product from API
  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, allRes] = await Promise.all([
          getProductById(id),
          getProducts()
        ])

        if (pRes?.data) {
          const p = pRes.data
          const rawP = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999
          setProduct({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Shirts',
            color: p.color || 'Nocturne Black',
            price: rawP,
            originalPrice: p.originalPrice || Math.round(rawP * 1.65),
            badge: p.badge || 'NEW',
            rating: p.rating || '4.9',
            reviewsCount: p.reviewsCount || 148,
            images: p.images && p.images.length > 0 ? p.images : DEFAULT_IMAGES,
            description: p.description || 'Precision tailored garment featuring architectural silhouettes and breathable cotton.',
            fabricCare: p.fabricDetails || '100% High-Density Organic Cotton. Cold machine wash.',
            deliveryInfo: 'Dispatched within 24 hours. 7-Day Doorstep Returns & Exchanges.'
          })
        }

        if (allRes?.data && allRes.data.length > 0) {
          const formatted = allRes.data
            .filter(item => String(item._id || item.id) !== String(id))
            .slice(0, 4)
            .map(item => ({
              id: item._id || item.id,
              name: item.name,
              category: item.category || 'Shirts',
              color: item.color || 'Nocturne Black',
              price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 1999,
              originalPrice: item.originalPrice || Math.round(1999 * 1.65),
              badge: item.badge || 'POPULAR',
              rating: item.rating || '4.8',
              reviewsCount: 120,
              images: item.images || [item.img]
            }))
          setRelatedProducts(formatted)
        }
      } catch (err) {
        console.warn('Using fallback PDP data')
      }
    }
    loadData()
    window.scrollTo(0, 0)
  }, [id])

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const isFav = isWishlisted(product.id)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: product.color,
      badge: product.badge,
      img: product.images[0]
    }, selectedSize)
  }

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: product.color,
      badge: product.badge,
      img: product.images[0]
    }, selectedSize)
    navigate('/checkout')
  }

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCoupon(code)
    setTimeout(() => setCopiedCoupon(null), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 80 }}>
      {/* ─── Breadcrumbs ───────────────────────────────────────────────────── */}
      <div className="content-container" style={{ padding: '16px 0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/collection/shirts')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{product.category}</button>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{product.name}</span>
        </div>
      </div>

      {/* ─── Main 2-Column Split PDP ───────────────────────────────────────── */}
      <div className="content-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 32,
          marginTop: 8
        }}>
          <div className="pdp-layout-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'start'
          }}>
            {/* Left Column: Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Main Image Display */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)'
              }}>
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isFav ? 'var(--brand-accent)' : '#111111'
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 22,
                      fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0"
                    }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }} className="no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      style={{
                        width: 74,
                        height: 96,
                        borderRadius: 'var(--radius-xs)',
                        overflow: 'hidden',
                        border: activeImageIdx === idx ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                        padding: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                        backgroundColor: 'var(--bg-secondary)'
                      }}
                    >
                      <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Title & Brand */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  PENGUIN • {product.category}
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, textTransform: 'uppercase' }}>
                  {product.name}
                </h1>

                {/* Rating Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b', fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span>{product.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>({product.reviewsCount} Reviews)</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700 }}>• In Stock</span>
                </div>
              </div>

              {/* Pricing */}
              <div style={{ padding: '16px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-accent)', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                    {discountPercent}% OFF
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Inclusive of all taxes. Free express shipping on this order.
                </div>
              </div>

              {/* Color Swatch */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
                  Color: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{product.color}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#1a1a1a',
                    border: '2px solid var(--brand-accent)',
                    padding: 2,
                    cursor: 'pointer'
                  }} />
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#e5e5e5',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }} />
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                    Select Size
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>straighten</span>
                    Size Guide
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {SIZES.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        minWidth: 54,
                        height: 44,
                        borderRadius: 'var(--radius-xs)',
                        border: selectedSize === sz ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                        backgroundColor: selectedSize === sz ? 'var(--brand-primary)' : 'var(--bg-card)',
                        color: selectedSize === sz ? 'var(--text-inverse)' : 'var(--text-primary)',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>local_fire_department</span>
                  Hurry! Only 3 units remaining in Size {selectedSize}
                </div>
              </div>

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-solid-primary"
                  style={{ flex: 1, height: 50, fontSize: 13, fontWeight: 900 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_bag</span>
                  <span>ADD TO BAG</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-solid-accent"
                  style={{ flex: 1, height: 50, fontSize: 13, fontWeight: 900 }}
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Pincode Estimator */}
              <div style={{
                padding: 16,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                  Delivery & COD Availability
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-Digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    style={{
                      flex: 1,
                      height: 40,
                      padding: '0 12px',
                      borderRadius: 4,
                      border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => { if (pincode.length === 6) setPincodeChecked(true); }}
                    style={{
                      height: 40,
                      padding: '0 18px',
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Check
                  </button>
                </div>
                {pincodeChecked && (
                  <div style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
                    Express Delivery by <strong>Thursday</strong> • Cash On Delivery Available
                  </div>
                )}
              </div>

              {/* Coupons & Promo Offers */}
              <div style={{
                padding: 16,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-accent)' }}>
                  Active Offers & Coupons
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '10px 12px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>PENGUIN500</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Get ₹500 OFF on orders over ₹2,499</div>
                  </div>
                  <button
                    onClick={() => handleCopyCoupon('PENGUIN500')}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                  >
                    {copiedCoupon === 'PENGUIN500' ? 'COPIED!' : 'COPY CODE'}
                  </button>
                </div>
              </div>

              {/* Accordions */}
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
                {/* Details */}
                <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                    style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <span>Product Specifications</span>
                    <span className="material-symbols-outlined">{openAccordion === 'details' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openAccordion === 'details' && (
                    <div style={{ paddingBottom: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {product.description}
                    </div>
                  )}
                </div>

                {/* Fabric & Care */}
                <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                    style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <span>Fabric & Wash Care</span>
                    <span className="material-symbols-outlined">{openAccordion === 'care' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openAccordion === 'care' && (
                    <div style={{ paddingBottom: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {product.fabricCare}
                    </div>
                  )}
                </div>

                {/* Returns & Exchanges */}
                <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                    style={{ width: '100%', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <span>7 Days Easy Return & Exchange</span>
                    <span className="material-symbols-outlined">{openAccordion === 'returns' ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openAccordion === 'returns' && (
                    <div style={{ paddingBottom: 16, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {product.deliveryInfo} We offer free doorstep reverse pickup and immediate exchange or refund to original payment source.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── You Might Also Like ────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div className="content-container" style={{ marginTop: 60 }}>
          <div className="section-header-wrap">
            <span className="section-tag-pill">COMPLETE THE LOOK</span>
            <h2 className="section-main-title">YOU MIGHT ALSO LIKE</h2>
          </div>
          <div className="product-grid-home">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  )
}
