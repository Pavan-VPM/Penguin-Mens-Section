import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/api'

const DEFAULT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR9S4fgMwiQA96pWo4DRRnR4yoqrORLPBRtU1exX8jFx4Mf2lu4FZb0To4JX24dcoEh-GbRf-FaR0s39tPIiS-Wq0OsNB6EjKqSxhQGXr6jGjGplvjbLYbTqyJxLhFFwdTcx8VHcX7jpv4b6tEmXM8HrtLl5wfKDkseOPqLDMKvkLxq7qflNN9MqLaF67Kxj_tJ08uRdK6jSUxDaYDhtHlAB-7Gx5TOqStb4NoD1G01OK9YFRlnEY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDw6PlIfD7vb_n4u5I_wD4HhFdTcV-UVOCENxio76QfVtj4TtfRRyePIpQIcJigP4x9Wc7TemI-nMXXz6Pt7XngwmTtRuBYdxnhGmoGboojO1aB4qDaF8UBDAqL-EKhubCIg19kp_1Kvw65x8WO4Rzftn8xvR5e0BIIwaGyqj97L00TABLrHE0n7YezXGVCKzCQSEdTRZNm10F1GUVNiBmvJvBz3q8wCtZpserBa9hHWrT6REccVN_4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8K4W-FWh7vCYR_mvxb8wOL-rNOr0a633cUAMpF8eh5QxC614cWcQEpiQSaRejQNnri7CgeDLbrRuYzbZuDbNAM_sJtIPV15Y8BBOKF-Y3EpQ3gHW36ynSnnFZGlzqccRALL8zRwe9P9L2eHAGDs8fdhRUsDXLjGzeIHvXqO8jaB4ybpyYPRq6Vvqc4d92tse7zqKIIhYfdKoqJ3fJc7Qrp8vmN9_ETZ30v2PzbUq4rVOVpYAGd_nk',
]

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const DEFAULT_COLOR_NAMES = ['Nocturne Black', 'Deep Charcoal', 'Slate White', 'Graphite']

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToCart, isWishlisted, toggleWishlist } = useCart()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState(0)
  const [openSection, setOpenSection] = useState('desc')
  const [added, setAdded] = useState(false)
  const [productData, setProductData] = useState({
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    price: 11900,
    badge: 'DROP 01',
    images: DEFAULT_IMAGES,
    sizes: DEFAULT_SIZES,
    colors: DEFAULT_COLOR_NAMES,
    fabricDetails: '100% Japanese High-Density Organic Cotton Poplin (180 GSM). Double-stitched seams with matte black hardware.',
    careInstructions: 'Dry clean only or delicate machine wash at 30°C inside-out. Do not tumble dry. Cool iron on reverse.',
    description: 'Precision tailored overshirt featuring an exaggerated camp collar, concealed placket, and side split vents.',
  })

  useEffect(() => {
    async function loadProduct() {
      if (!id) return
      try {
        const res = await getProductById(id)
        if (res?.data) {
          const p = res.data
          setProductData({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Shirts',
            price: typeof p.price === 'number' ? p.price : Number(String(p.price).replace(/[^\d.]/g, '')) || 11900,
            badge: p.badge || 'DROP 01',
            images: p.images && p.images.length > 0 ? p.images : DEFAULT_IMAGES,
            sizes: p.sizes?.map(s => s.size) || DEFAULT_SIZES,
            colors: p.colorVariants?.map(c => c.name) || (p.color ? [p.color] : DEFAULT_COLOR_NAMES),
            fabricDetails: p.fabricDetails || '100% Japanese High-Density Organic Cotton Poplin (180 GSM).',
            careInstructions: p.careInstructions || 'Dry clean only or delicate machine wash at 30°C.',
            description: p.description || 'Precision tailored overshirt featuring an exaggerated camp collar.',
          })
          if (p.sizes && p.sizes.length > 0) {
            setSelectedSize(p.sizes[0].size)
          }
        }
      } catch (err) {
        console.warn('Using fallback product detail')
      }
    }
    loadProduct()
  }, [id])

  const IMAGES = productData.images
  const SIZES = productData.sizes
  const COLOR_NAMES = productData.colors

  const nextImage = () => setActiveImg(prev => (prev + 1) % IMAGES.length)
  const prevImage = () => setActiveImg(prev => (prev - 1 + IMAGES.length) % IMAGES.length)

  const product = {
    id: productData.id,
    name: productData.name,
    color: COLOR_NAMES[selectedColor] || 'Nocturne Black',
    price: productData.price,
    badge: productData.badge,
    img: IMAGES[0]
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      <div className="content-container">
        {/* Breadcrumbs for desktop */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: 8, padding: '1.25rem 0 0.5rem', color: 'var(--on-surface-variant)', fontSize: 12 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/collection/shirts')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Shirts & Tops</button>
          <span>/</span>
          <span style={{ color: 'var(--on-surface)' }}>Structured Poplin Overshirt</span>
        </div>

        <div className="pdp-container">
          {/* Left Column: Interactive Sideways Image Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Main Image Slider Stage */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              maxHeight: 'min(72vh, 600px)',
              borderRadius: 16,
              overflow: 'hidden',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--brand-card-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)'
            }}>
              {/* Sideways Sliding Track */}
              <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                transform: `translateX(-${activeImg * 100}%)`,
                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
              }}>
                {IMAGES.map((src, idx) => (
                  <div key={idx} style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative' }}>
                    <img
                      src={src}
                      alt={`Product view ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                ))}
              </div>

              {/* Left Sideways Sliding Arrow */}
              <button
                type="button"
                aria-label="Previous Image"
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--glass-dark-heavy)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary-container)'
                  e.currentTarget.style.color = 'var(--on-primary-fixed)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--glass-dark-heavy)'
                  e.currentTarget.style.color = 'var(--on-surface)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 26 }}>chevron_left</span>
              </button>

              {/* Right Sideways Sliding Arrow */}
              <button
                type="button"
                aria-label="Next Image"
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--glass-dark-heavy)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--on-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary-container)'
                  e.currentTarget.style.color = 'var(--on-primary-fixed)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--glass-dark-heavy)'
                  e.currentTarget.style.color = 'var(--on-surface)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 26 }}>chevron_right</span>
              </button>

              {/* Drop Badge */}
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'var(--product-card-badge-bg)',
                backdropFilter: 'blur(12px)',
                padding: '5px 12px',
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid var(--card-border)',
                zIndex: 5
              }}>
                <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-container)' }} />
                <span className="text-label-caps text-primary" style={{ fontSize: 10, letterSpacing: '0.12em' }}>DROP 01 // FW25</span>
              </div>

              {/* Photo Counter Pill */}
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'var(--product-card-badge-bg)',
                backdropFilter: 'blur(12px)',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--on-surface-variant)',
                border: '1px solid var(--card-border)',
                zIndex: 5
              }}>
                0{activeImg + 1} / 0{IMAGES.length}
              </div>

              {/* Slide Indicators */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                pointerEvents: 'none',
                zIndex: 5
              }}>
                {IMAGES.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 4,
                      borderRadius: 999,
                      background: i === activeImg ? 'var(--primary-container)' : 'var(--outline)',
                      width: i === activeImg ? 24 : 8,
                      transition: 'all 0.3s ease',
                      boxShadow: i === activeImg ? '0 0 10px var(--glow-primary)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Row */}
            <div style={{ display: 'flex', gap: 10 }}>
              {IMAGES.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Select photo ${idx + 1}`}
                  onClick={() => setActiveImg(idx)}
                  style={{
                    width: 74,
                    height: 90,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: idx === activeImg ? '2px solid var(--primary-container)' : '1px solid var(--card-border)',
                    opacity: idx === activeImg ? 1 : 0.55,
                    cursor: 'pointer',
                    padding: 0,
                    background: 'var(--surface-container-low)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    boxShadow: idx === activeImg ? '0 0 14px var(--glow-primary)' : 'none'
                  }}
                >
                  <img src={src} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Specs & Sticky Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '0.5rem 0 2rem',
            position: 'sticky',
            top: 88
          }}>
            {/* Header / Titles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-label-caps text-primary" style={{ letterSpacing: '0.12em' }}>
                  PENGUINS ATELIER // ARCHIVE NOIR
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary-container)', fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-label-md text-on-surface">4.9</span>
                  <span className="text-body-sm text-on-surface-variant">(84 reviews)</span>
                </div>
              </div>
              <h1 className="text-headline-xl-mobile text-on-surface" style={{ lineHeight: 1.15, fontSize: 'clamp(26px, 3vw, 36px)' }}>
                Structured Poplin Overshirt
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingTop: 4, flexWrap: 'wrap' }}>
                <span className="text-headline-lg text-on-surface" style={{ fontWeight: 800 }}>₹11,900</span>
                <span className="text-body-sm text-on-surface-variant" style={{ background: 'var(--surface-container-high)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid var(--card-border)', fontSize: 11, fontWeight: 600 }}>
                  Complimentary Express Shipping
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="text-label-caps text-on-surface-variant">Colorway</span>
                <span className="text-label-caps text-on-surface">{COLOR_NAMES[selectedColor]}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {COLOR_NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setSelectedColor(i)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: selectedColor === i ? '1px solid var(--primary-container)' : '1px solid var(--card-border)',
                      background: selectedColor === i ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                      color: selectedColor === i ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 0.15s'
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="text-label-caps text-on-surface-variant">Select Size</span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--primary-container)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => alert('Sizing Guide: Regular boxy atelier cut. Fits true to size for an architectural drape.')}
                >
                  Size Guide & Fit
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      height: 44,
                      borderRadius: 8,
                      border: selectedSize === s ? '1px solid var(--primary-container)' : '1px solid var(--card-border)',
                      background: selectedSize === s ? 'var(--primary-container)' : 'var(--surface-container)',
                      color: selectedSize === s ? 'var(--on-primary-fixed)' : 'var(--on-surface)',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: selectedSize === s ? '0 0 12px var(--glow-primary)' : 'none'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Add to Bag & Wishlist Action Bar */}
            <div className="desktop-only" style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  background: added ? 'var(--glow-primary)' : 'var(--primary-container)',
                  color: added ? 'var(--primary-container)' : 'var(--on-primary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow: '0 0 24px var(--glow-primary)',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{added ? 'check' : 'shopping_bag'}</span>
                <span>{added ? 'Added to Atelier Bag' : `Add to Bag — ₹11,900`}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  border: '1px solid var(--card-border)',
                  background: 'var(--surface-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isWishlisted(product.id) ? 'var(--primary-container)' : 'var(--on-surface)',
                  flexShrink: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isWishlisted(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
            </div>

            {/* Accordion Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
              {[
                {
                  key: 'desc', label: 'Architectural Details', content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--on-surface-variant)', fontSize: 13, lineHeight: 1.5 }}>
                      <p>Engineered with Japanese technical micro-poplin featuring clean sharp lines, hidden placket closures, and relaxed architectural drop shoulders.</p>
                      <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <li>180 GSM high-density cotton-poly technical blend</li>
                        <li>Bonded French seams with laser-cut hemline</li>
                        <li>Matte vulcanized hardware in Nocturne Black</li>
                      </ul>
                    </div>
                  )
                },
                {
                  key: 'care', label: 'Fabric & Atelier Care', content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--on-surface-variant)', fontSize: 13, lineHeight: 1.5 }}>
                      <p>Machine wash cold on gentle cycle at 30°C. Reshape while damp and hang dry. Low heat steam iron if needed.</p>
                    </div>
                  )
                },
                {
                  key: 'delivery', label: 'Fulfillment & Returns', content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>local_shipping</span>
                        <div>
                          <p className="text-body-md text-on-surface" style={{ fontWeight: 600, fontSize: 13 }}>DHL Express 2-3 Business Days</p>
                          <p className="text-body-sm text-on-surface-variant">Complimentary carbon-neutral shipping on orders over ₹9,999.</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>sync</span>
                        <div>
                          <p className="text-body-md text-on-surface" style={{ fontWeight: 600, fontSize: 13 }}>30-Day Returns</p>
                          <p className="text-body-sm text-on-surface-variant">Complimentary return service worldwide within 30 days of receipt.</p>
                        </div>
                      </div>
                    </div>
                  )
                },
              ].map(({ key, label, content }) => (
                <div key={key} style={{ borderRadius: 12, background: 'var(--surface-container)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                  <button
                    onClick={() => setOpenSection(openSection === key ? null : key)}
                    style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', textAlign: 'left' }}
                  >
                    <span className="text-title-sm" style={{ fontSize: 14 }}>{label}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: openSection === key ? 'var(--primary)' : 'var(--on-surface-variant)', transform: openSection === key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>expand_more</span>
                  </button>
                  {openSection === key && (
                    <div style={{ padding: '0 16px 16px' }}>{content}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile ATC Bar (Hidden on desktop) */}
      <div className="hide-on-desktop-bar" style={{
        position: 'fixed',
        bottom: 64,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'var(--glass-dark-nav)',
        backdropFilter: 'blur(20px)',
        padding: '12px 1rem',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
        borderTop: '1px solid var(--brand-card-border)'
      }}>
        <div style={{ display: 'flex', gap: 12, maxWidth: 500, margin: '0 auto' }}>
          <button
            onClick={() => toggleWishlist(product.id)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              border: '1px solid var(--card-border)',
              background: 'var(--surface-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isWishlisted(product.id) ? 'var(--primary-container)' : 'var(--on-surface)',
              flexShrink: 0
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: isWishlisted(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: added ? 'var(--glow-primary)' : 'var(--primary-container)',
              color: added ? 'var(--primary-container)' : 'var(--on-primary-fixed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 0 24px var(--glow-primary)',
              transition: 'all 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{added ? 'check' : 'shopping_bag'}</span>
            <span>{added ? 'Added to Bag' : `Add to Bag — ₹11,900`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
