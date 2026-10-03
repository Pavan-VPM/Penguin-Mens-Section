import React, { useState, useEffect, useRef } from 'react'
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

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToCart, isWishlisted, toggleWishlist } = useCart()
  const imgStackRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const [selectedSize, setSelectedSize] = useState('M')
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)

  const [product, setProduct] = useState({
    id: id || 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    images: DEFAULT_IMAGES,
    description: 'A contemporary relaxed overshirt crafted from 100% Japanese high-density organic cotton poplin. Features an exaggerated camp collar, concealed matte buttons, and side split vents.',
    fabricCare: '100% High-Density Organic Cotton (180 GSM). Cold machine wash delicate, iron on low reverse.',
    deliveryInfo: 'Dispatched within 24 hours. 7-Day Doorstep Returns & Exchanges.'
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, allRes] = await Promise.all([getProductById(id), getProducts()])
        if (pRes?.data) {
          const p = pRes.data
          const rawP = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999
          setProduct({
            id: p._id || p.id, name: p.name,
            category: p.category || 'Shirts', color: p.color || 'Nocturne Black',
            price: rawP,
            images: p.images && p.images.length > 0 ? p.images : DEFAULT_IMAGES,
            description: p.description || 'Precision tailored garment.',
            fabricCare: p.fabricDetails || '100% High-Density Organic Cotton. Cold machine wash.',
            deliveryInfo: 'Dispatched within 24 hours. 7-Day Doorstep Returns & Exchanges.'
          })
        }
        if (allRes?.data && allRes.data.length > 0) {
          setRelatedProducts(
            allRes.data.filter(item => String(item._id || item.id) !== String(id)).slice(0, 4)
              .map(item => ({
                id: item._id || item.id, name: item.name,
                category: item.category || 'Shirts', color: item.color || 'Nocturne Black',
                price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 1999,
                images: item.images || [item.img]
              }))
          )
        }
      } catch (err) { console.warn('Using fallback PDP data') }
    }
    loadData()
    window.scrollTo(0, 0)
  }, [id])

  // Desktop: IntersectionObserver for dot sync
  useEffect(() => {
    if (isMobile) return
    const container = imgStackRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveIdx(parseInt(e.target.dataset.idx)) }),
      { root: container, threshold: 0.5 }
    )
    container.querySelectorAll('.pdp-img-slide').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [product.images, isMobile])

  // Desktop: auto-scroll
  useEffect(() => {
    if (isMobile) return
    const container = imgStackRef.current
    if (!container || product.images.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % product.images.length
        container.scrollTo({ top: next * container.clientHeight, behavior: 'smooth' })
        return next
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [product.images, isMobile])

  const isFav = isWishlisted(product.id)
  const handleAddToCart = () =>
    addToCart({ id: product.id, name: product.name, price: product.price, color: product.color, img: product.images[0] }, selectedSize)
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout') }

  // Mobile: prev/next arrow nav
  const goPrev = () => setActiveIdx(p => (p - 1 + product.images.length) % product.images.length)
  const goNext = () => setActiveIdx(p => (p + 1) % product.images.length)

  /* ─── MOBILE LAYOUT ─────────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 80 }}>

        {/* Image Viewer */}
        <div style={{ position: 'relative', width: '100%', height: '62vw', minHeight: 300, backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
          <img
            src={product.images[activeIdx]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }}
          />

          {/* Prev / Next Arrows */}
          {product.images.length > 1 && (
            <>
              <button onClick={goPrev} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
              </button>
              <button onClick={goNext} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
              </button>
            </>
          )}

          {/* Wishlist */}
          <button onClick={() => toggleWishlist(product.id)} style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.88)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>

          {/* Dot indicators */}
          {product.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
              {product.images.map((_, idx) => (
                <div key={idx} onClick={() => setActiveIdx(idx)} style={{
                  width: idx === activeIdx ? 16 : 6, height: 6, borderRadius: 999,
                  backgroundColor: idx === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 0' }}>
          <h1 style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
            *MRP Inclusive of all taxes
          </div>

          {/* Color label + image thumbnails */}
          {product.images.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Selected Color · <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.color}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      width: 64, height: 80, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
                      border: activeIdx === idx ? '2px solid var(--text-primary)' : '1.5px solid var(--border-light)'
                    }}
                  >
                    <img src={img} alt={`Color ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Select Size</span>
              <button onClick={() => setIsSizeGuideOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                Size Guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
              {SIZES.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    minWidth: 52, height: 40, flexShrink: 0, borderRadius: 2,
                    border: selectedSize === sz ? '1.5px solid var(--text-primary)' : '1px solid var(--border-light)',
                    backgroundColor: selectedSize === sz ? 'var(--text-primary)' : 'transparent',
                    color: selectedSize === sz ? 'var(--text-inverse)' : 'var(--text-primary)',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Accordions */}
          <div style={{ borderTop: '1px solid var(--border-light)' }}>
            {[
              { key: 'details', label: 'Product Details', content: product.description },
              { key: 'care', label: 'Fabric & Care', content: product.fabricCare },
            ].map(acc => (
              <div key={acc.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)}
                  style={{
                    width: '100%', padding: '13px 0', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', background: 'none', border: 'none', fontSize: 12, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', color: 'var(--text-primary)'
                  }}
                >
                  <span>{acc.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
                    {openAccordion === acc.key ? 'remove' : 'add'}
                  </span>
                </button>
                {openAccordion === acc.key && (
                  <div style={{ paddingBottom: 12, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {acc.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky ADD button */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-light)',
          padding: '10px 16px', display: 'flex', gap: 10
        }}>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1, height: 48, backgroundColor: 'var(--text-primary)', color: 'var(--text-inverse)',
              border: 'none', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer'
            }}
          >
            ADD +
          </button>
          <button
            onClick={handleBuyNow}
            style={{
              flex: 1, height: 48, backgroundColor: 'transparent', color: 'var(--text-primary)',
              border: '1px solid var(--border-light)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Buy Now
          </button>
        </div>

        <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      </div>
    )
  }

  /* ─── DESKTOP LAYOUT ────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 80 }}>

      {/* Breadcrumbs */}
      <div className="content-container" style={{ padding: '14px 0 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/collection')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{product.category}</button>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>

        {/* LEFT: Auto-scrolling image stack */}
        <div ref={imgStackRef} style={{ height: '90vh', overflowY: 'scroll', scrollSnapType: 'y mandatory', position: 'sticky', top: 0, scrollbarWidth: 'none' }} className="no-scrollbar">
          {product.images.map((img, idx) => (
            <div key={idx} data-idx={idx} className="pdp-img-slide" style={{ height: '90vh', scrollSnapAlign: 'start', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
              <img src={img} alt={`${product.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {idx === 0 && (
                <button onClick={() => toggleWishlist(product.id)} style={{
                  position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.88)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
              )}
            </div>
          ))}
          {product.images.length > 1 && (
            <div style={{ position: 'sticky', bottom: 20, display: 'flex', justifyContent: 'center', gap: 6, marginTop: -28 }}>
              {product.images.map((_, idx) => (
                <div key={idx} style={{ width: idx === activeIdx ? 18 : 6, height: 6, borderRadius: 999, backgroundColor: idx === activeIdx ? 'var(--text-primary)' : 'rgba(0,0,0,0.18)', transition: 'all 0.3s ease' }} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div style={{ padding: 'clamp(24px, 4vw, 48px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>{product.category}</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 300, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.25, margin: 0 }}>{product.name}</h1>
          </div>
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Inclusive of all taxes · Free shipping</div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>Size — {selectedSize}</span>
              <button onClick={() => setIsSizeGuideOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>Size Guide</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SIZES.map(sz => (
                <button key={sz} onClick={() => setSelectedSize(sz)} style={{
                  minWidth: 48, height: 40, borderRadius: 2,
                  border: selectedSize === sz ? '1.5px solid var(--text-primary)' : '1px solid var(--border-light)',
                  backgroundColor: selectedSize === sz ? 'var(--text-primary)' : 'transparent',
                  color: selectedSize === sz ? 'var(--text-inverse)' : 'var(--text-primary)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease'
                }}>{sz}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleAddToCart} style={{ width: '100%', height: 48, backgroundColor: 'var(--text-primary)', color: 'var(--text-inverse)', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Add to Bag</button>
            <button onClick={handleBuyNow} style={{ width: '100%', height: 48, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-light)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Buy Now</button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-light)' }}>
            {[
              { key: 'details', label: 'Product Details', content: product.description },
              { key: 'care', label: 'Fabric & Care', content: product.fabricCare },
            ].map(acc => (
              <div key={acc.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)} style={{ width: '100%', padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <span>{acc.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>{openAccordion === acc.key ? 'remove' : 'add'}</span>
                </button>
                {openAccordion === acc.key && <div style={{ paddingBottom: 14, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{acc.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="content-container" style={{ marginTop: 60 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', margin: '0 0 24px' }}>You Might Also Like</h2>
          <div className="product-grid-home">{relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      )}

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  )
}

