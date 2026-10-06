import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const DEFAULT_IMAGES = [
  'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const DEFAULT_SUGGESTIONS = [];

// Color name to hex helper
const COLOR_HEX_MAP = {
  'nocturne black': '#111111',
  'jet black': '#0A0A0A',
  'black': '#111111',
  'washed black': '#222222',
  'onyx black': '#141414',
  'charcoal black': '#252525',
  'charcoal grey': '#4A4A4A',
  'slate grey': '#708090',
  'stone grey': '#9E9E9E',
  'chalk white': '#F5F5F0',
  'ivory white': '#F5F0E8',
  'pure white': '#FFFFFF',
  'crisp white': '#FAFAFA',
  'off white': '#F0EDE5',
  'ecru': '#EDE0C4',
  'ecru sand': '#D4C5A9',
  'stone beige': '#C8B89A',
  'classic blue': '#5B7FA6',
  'sky blue': '#A8C4D4',
  'navy blue': '#1A2040',
  'navy plaid': '#1A2744',
  'navy': '#1A2040',
  'cobalt blue': '#1A4FAA',
  'light denim': '#8FA8C8',
  'dark denim': '#2D4062',
  'deep indigo': '#1C2951',
  'camel tan': '#C8A97A',
  'khaki tan': '#C4AA7A',
  'tobacco brown': '#795548',
  'chocolate brown': '#5D3A1A',
  'army green': '#4A5A3A',
  'olive moss': '#5A6B4A',
  'olive khaki': '#6B7A3D',
  'bottle green': '#1A4A2A',
  'dusty rose': '#C4A0A0',
  'burgundy': '#6A1A2A',
}

function resolveHex(colorName) {
  if (!colorName) return '#111111'
  const lower = colorName.toLowerCase().trim()
  if (COLOR_HEX_MAP[lower]) return COLOR_HEX_MAP[lower]
  for (const [k, v] of Object.entries(COLOR_HEX_MAP)) {
    if (lower.includes(k) || k.includes(lower)) return v
  }
  return '#333333'
}

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { id, slug } = useParams()
  const currentKey = slug || id || '1'
  const { addToCart, isWishlisted, toggleWishlist } = useCart()

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState('details')
  const [relatedProducts, setRelatedProducts] = useState(DEFAULT_SUGGESTIONS)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  const [product, setProduct] = useState({
    id: currentKey,
    slug: typeof currentKey === 'string' ? currentKey : `item-${currentKey}`,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    colors: ['Nocturne Black', 'Chalk White'],
    colorVariants: [
      { name: 'Nocturne Black', hex: '#111111' },
      { name: 'Chalk White', hex: '#F5F5F0' }
    ],
    price: 1999,
    originalPrice: 3499,
    stock: 8,
    stockStatus: 'In Stock',
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
      setLoading(true)
      try {
        const [pRes, allRes] = await Promise.all([
          getProductById(currentKey),
          getProducts()
        ])

        const p = pRes?.product || pRes?.data
        if (p) {
          const rawP = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999
          const pColor = p.color || (p.colorVariants?.[0]?.name) || (p.colors?.[0]) || 'Nocturne Black'
          
          // Parse color variants from colorVariants or colors array
          let variants = []
          if (Array.isArray(p.colorVariants) && p.colorVariants.length > 0) {
            variants = p.colorVariants.map(cv => ({
              name: cv.name || pColor,
              hex: cv.hex || resolveHex(cv.name || pColor)
            }))
          } else if (Array.isArray(p.colors) && p.colors.length > 0) {
            variants = p.colors.map(c => ({
              name: c,
              hex: resolveHex(c)
            }))
          } else {
            variants = [
              { name: pColor, hex: resolveHex(pColor) }
            ]
          }

          // Ensure images array has at least 1 image and fallback images if needed
          let imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.img ? [p.img] : DEFAULT_IMAGES)
          if (imgs.length === 1 && DEFAULT_IMAGES.length > 1) {
            // Provide companion angle shots
            imgs = [imgs[0], ...DEFAULT_IMAGES.slice(1)]
          }

          setProduct({
            id: p._id || p.id,
            slug: p.slug || currentKey,
            name: p.name,
            category: p.category || 'Shirts',
            color: pColor,
            colors: variants.map(v => v.name),
            colorVariants: variants,
            price: rawP,
            originalPrice: p.originalPrice || Math.round(rawP * 1.65),
            stock: typeof p.stock === 'number' ? p.stock : 8,
            stockStatus: p.stockStatus || (p.stock <= 0 ? 'Sold Out' : 'In Stock'),
            images: imgs,
            description: p.description || 'Precision tailored garment engineered for modern movement.',
            fabricCare: p.fabricDetails || '100% High-Density Organic Cotton. Cold machine wash.',
            deliveryInfo: 'Dispatched within 24 hours. Complimentary 7-day doorstep exchanges & returns.'
          })
          setSelectedColor(pColor)
          setActiveIdx(0)
        }

        // Related items
        if (pRes?.related && pRes.related.length > 0) {
          const formattedRelated = pRes.related.map(item => ({
            id: item._id || item.id,
            slug: item.slug,
            name: item.name,
            category: item.category || 'Menswear',
            color: item.color || 'Nocturne Black',
            price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: item.originalPrice,
            badge: item.badge,
            images: item.images && item.images.length > 0 ? item.images : [item.img || DEFAULT_IMAGES[0]]
          }))
          setRelatedProducts(formattedRelated)
        } else if (allRes?.data && allRes.data.length > 0) {
          const fetchedFiltered = allRes.data
            .filter(item => String(item._id || item.id) !== String(currentKey) && String(item.slug) !== String(currentKey))
            .map(item => ({
              id: item._id || item.id,
              slug: item.slug,
              name: item.name,
              category: item.category || 'Menswear',
              color: item.color || 'Nocturne Black',
              price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 1999,
              originalPrice: item.originalPrice,
              badge: item.badge,
              images: item.images && item.images.length > 0 ? item.images : [item.img || DEFAULT_IMAGES[0]]
            }))
          
          if (fetchedFiltered.length > 0) {
            setRelatedProducts(fetchedFiltered.slice(0, 4))
          }
        }
      } catch (err) {
        console.warn('Using fallback PDP data')
        setRelatedProducts(DEFAULT_SUGGESTIONS.filter(item => String(item.id) !== String(currentKey)))
      } finally {
        setLoading(false)
      }
    }
    loadData()
    window.scrollTo(0, 0)
  }, [currentKey])

  const isFav = isWishlisted(product.id)
  const isOutOfStock = product.stockStatus === 'Sold Out' || product.stock === 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addToCart(
      {
        id: product.id,
        _id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        color: selectedColor || product.color,
        images: product.images,
        img: product.images[activeIdx] || product.images[0]
      },
      selectedSize,
      selectedColor || product.color,
      1
    )
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    handleAddToCart()
    navigate('/checkout')
  }

  // Mobile navigation
  const goPrev = () => setActiveIdx(p => (p - 1 + product.images.length) % product.images.length)
  const goNext = () => setActiveIdx(p => (p + 1) % product.images.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 80 }}>
      {/* ─── Breadcrumb Navigation ─────────────────────────────────────────── */}
      <div className="content-container" style={{ padding: '16px 0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/collection')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>{product.category}</button>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* ─── Main Gallery + Info Grid ───────────────────────────────────────── */}
      <div className="content-container" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr',
        gap: isMobile ? 24 : 48,
        alignItems: 'start',
        marginTop: 12
      }}>
        
        {/* ─── LEFT: Interactive Image Gallery with Thumbnails & Zoom ───────── */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row-reverse', gap: 16, position: isMobile ? 'relative' : 'sticky', top: isMobile ? 0 : 'calc(var(--header-height-desktop) + 16px)' }}>
          
          {/* Main Display Stage */}
          <div style={{
            position: 'relative',
            flex: 1,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            aspectRatio: '4/5',
            maxHeight: isMobile ? '70vh' : '76vh',
            cursor: 'zoom-in'
          }}
          onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={product.images[activeIdx] || product.images[0]}
              alt={`${product.name} view ${activeIdx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease, opacity 0.25s ease'
              }}
            />

            {/* Photo Counter Pill */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 14,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.04em'
            }}>
              {activeIdx + 1} / {product.images.length}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}
              title={isFav ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0", color: isFav ? 'var(--brand-accent)' : 'inherit' }}>
                favorite
              </span>
            </button>

            {/* Click to Zoom Hint Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: 11,
              padding: '4px 8px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              pointerEvents: 'none'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>zoom_in</span>
              <span>Click to Zoom</span>
            </div>

            {/* Mobile Swipe / Arrow Controls */}
            {isMobile && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                </button>
              </>
            )}
          </div>

          {/* Vertical / Horizontal Thumbnail Strip */}
          {product.images.length > 1 && (
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              gap: 10,
              overflowX: isMobile ? 'auto' : 'hidden',
              overflowY: isMobile ? 'hidden' : 'auto',
              maxHeight: isMobile ? 'none' : '76vh',
              width: isMobile ? '100%' : 76,
              flexShrink: 0
            }}
            className="no-scrollbar"
            >
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => !isMobile && setActiveIdx(idx)}
                  style={{
                    width: isMobile ? 64 : 72,
                    height: isMobile ? 80 : 92,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: activeIdx === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-light)',
                    padding: 0,
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    opacity: activeIdx === idx ? 1 : 0.65,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  title={`View Angle ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Product Details & Purchase Form ───────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Category & Title */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>
              {product.category}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2, margin: 0 }}>
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 15, textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700 }}>
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              *Inclusive of all taxes
            </span>
          </div>

          {/* ─── Color Swatches Section ────────────────────────────────────── */}
          <div style={{ padding: '14px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                Selected Color: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor || product.color}</strong>
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {product.colorVariants.length} {product.colorVariants.length === 1 ? 'Colorway' : 'Colorways'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {product.colorVariants.map(cv => {
                const isSelected = selectedColor.toLowerCase() === cv.name.toLowerCase()
                return (
                  <button
                    key={cv.name}
                    onClick={() => setSelectedColor(cv.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: isSelected ? '1.5px solid var(--text-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--bg-card)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                    }}
                    title={`Select ${cv.name}`}
                  >
                    <span style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: cv.hex || resolveHex(cv.name),
                      border: '1px solid rgba(0,0,0,0.15)',
                      display: 'inline-block'
                    }} />
                    <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, color: 'var(--text-primary)' }}>
                      {cv.name}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--brand-green)' }}>check</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ─── Size Selector ────────────────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                Select Size: <strong style={{ color: 'var(--text-primary)' }}>{selectedSize}</strong>
              </span>
              <button onClick={() => setIsSizeGuideOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                Size Guide & Measurements
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES).map(item => {
                const sz = typeof item === 'string' ? item : (item.size || item.name || 'M');
                const isOutOfStock = typeof item === 'object' && item.stock !== undefined && item.stock <= 0;
                return (
                  <button
                    key={sz}
                    onClick={() => {
                      if (!isOutOfStock) {
                        setSelectedSize(sz);
                        setSizeError(false);
                      }
                    }}
                    disabled={isOutOfStock}
                    style={{
                      minWidth: 54,
                      height: 44,
                      borderRadius: 2,
                      border: selectedSize === sz ? '1.5px solid var(--text-primary)' : '1px solid var(--border-light)',
                      backgroundColor: selectedSize === sz ? 'var(--text-primary)' : 'transparent',
                      color: selectedSize === sz ? 'var(--text-inverse)' : (isOutOfStock ? 'var(--text-muted)' : 'var(--text-primary)'),
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      opacity: isOutOfStock ? 0.4 : 1,
                      textDecoration: isOutOfStock ? 'line-through' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                    title={isOutOfStock ? `${sz} - Out of Stock` : `Select Size ${sz}`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand-accent)', marginTop: 8, fontSize: 12, fontWeight: 700 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>warning</span>
                <span>Please select a size to proceed to checkout</span>
              </div>
            )}
          </div>

          {/* Stock Urgency Indicator */}
          {product.stock > 0 && product.stock <= 5 && (
            <div style={{ padding: '8px 14px', backgroundColor: 'rgba(217, 83, 79, 0.1)', color: '#d9534f', fontSize: 12, fontWeight: 700, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_fire_department</span>
              <span>Atelier Alert: Only {product.stock} pieces remaining in stock!</span>
            </div>
          )}

          {/* ─── Desktop CTAs ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                width: '100%', height: 50, backgroundColor: isOutOfStock ? 'var(--border-light)' : 'var(--text-primary)',
                color: 'var(--text-inverse)', border: 'none', fontSize: 13, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'SOLD OUT' : 'ADD TO BAG'}
            </button>
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                style={{
                  width: '100%', height: 50, backgroundColor: 'transparent', color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                BUY NOW • EXPRESS CHECKOUT
              </button>
            )}
          </div>

          {/* ─── Accordions ────────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
            {[
              { key: 'details', label: 'Product Details & Silhouette', content: product.description },
              { key: 'care', label: 'Fabric Composition & Atelier Care', content: product.fabricCare },
              { key: 'delivery', label: 'Complimentary Delivery & 7-Day Returns', content: product.deliveryInfo },
            ].map(acc => (
              <div key={acc.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)}
                  style={{
                    width: '100%', padding: '14px 0', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', background: 'none', border: 'none', fontSize: 12, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', color: 'var(--text-primary)'
                  }}
                >
                  <span>{acc.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
                    {openAccordion === acc.key ? 'remove' : 'add'}
                  </span>
                </button>
                {openAccordion === acc.key && (
                  <div style={{ paddingBottom: 14, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {acc.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky Bottom Action Bar ───────────────────────────────── */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-light)',
          padding: '10px 16px', display: 'flex', gap: 10, boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
        }}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              flex: 1, height: 48, backgroundColor: isOutOfStock ? 'var(--border-light)' : 'var(--text-primary)',
              color: 'var(--text-inverse)', border: 'none', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {isOutOfStock ? 'SOLD OUT' : 'ADD TO BAG +'}
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1, height: 48, backgroundColor: 'transparent', color: 'var(--text-primary)',
                border: '1px solid var(--border-light)', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}
            >
              BUY NOW
            </button>
          )}
        </div>
      )}

      {/* ─── "Complete the Look" / Recommended Pairings Grid ───────────────── */}
      {relatedProducts.length > 0 && (
        <div className="content-container" style={{ marginTop: 60 }}>
          <section className="pdp-suggestions-section">
            <div className="pdp-suggestions-header">
              <span className="pdp-suggestions-subtitle">CURATED ATELIER PAIRINGS</span>
              <h2 className="pdp-suggestions-title">COMPLETE THE LOOK</h2>
              <div className="pdp-suggestions-divider" />
            </div>
            <div className="pdp-suggestions-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ─── Lightbox Modal ────────────────────────────────────────────────── */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            cursor: 'zoom-out'
          }}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>close</span>
          </button>
          <img
            src={product.images[activeIdx]}
            alt={product.name}
            style={{
              maxWidth: '92vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  )
}

