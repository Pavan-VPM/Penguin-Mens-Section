import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProducts, getSiteConfig } from '../services/api'
import ProductCard from '../components/ProductCard'

// High-definition fashion hero banners inspired by Snitch & Souled Store
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'NEW FW25 CAPSULE // DROP 01',
    title: 'THE STREETWEAR & LINEN EDIT',
    subtitle: 'Relaxed silhouettes, heavyweight French terry, and crisp Japanese poplin tailored for modern everyday movement.',
    cta: 'SHOP COLLECTION',
    link: '/collection/shirts',
    img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 2,
    tag: 'NEW ARRIVALS 2025',
    title: 'VARSITY & STRUCTURED KNITWEAR',
    subtitle: 'Oversized varsity pullovers, textured cable knits, and relaxed layered silhouettes crafted for all-season comfort.',
    cta: 'EXPLORE NEW ARRIVALS',
    link: '/collection',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 3,
    tag: 'DAILY ESSENTIALS',
    title: 'LUXE OVERSIZED & SHIRTS',
    subtitle: 'High-density organic cotton tees, relaxed camp collars, and pleated trousers crafted with meticulous atelier precision.',
    cta: 'DISCOVER BESTSELLERS',
    link: '/collection/shirts',
    img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1920&auto=format&fit=crop'
  }
]

// Interactive Bento Categories (Represent / Fear of God Style)
const BENTO_CATEGORIES = [
  {
    id: 'bento-1',
    title: 'Luxe Linen & Poplin Shirts',
    subtitle: '100% Pure European linen and crisp Japanese poplin tailored with modern camp & resort collars.',
    tag: 'SIGNATURE ATELIER',
    spanClass: 'bento-span-6',
    path: '/collection/shirts',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&auto=format&fit=crop&q=80',
    badge: 'POPULAR EDIT',
  },
  {
    id: 'bento-3',
    title: 'Structured Outerwear',
    subtitle: 'Technical bombers, wool overshirts and varsity knits.',
    tag: 'OUTERWEAR',
    spanClass: 'bento-span-6',
    path: '/collection/jackets',
    img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW SEASON',
  },
  {
    id: 'bento-4',
    title: 'Pleated Pants & Cargos',
    subtitle: 'Ergonomic pleated trousers & versatile stretch utility chinos.',
    tag: 'TAILORING',
    spanClass: 'bento-span-6',
    path: '/collection/tailoring',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    badge: 'TAILORED FIT',
  },
  {
    id: 'bento-5',
    title: 'Atelier Suiting & Blazers',
    subtitle: 'Contemporary bespoke formalwear crafted for modern occasions.',
    tag: 'FORMALWEAR',
    spanClass: 'bento-span-6',
    path: '/collection/formals',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    badge: 'BESPOKE',
  },
  {
    id: 'bento-6',
    title: 'Relaxed Raw & Vintage Denim',
    subtitle: '14 oz selvedge cotton and loose-fit streetwear denim washes.',
    tag: 'DENIM CAPSULE',
    spanClass: 'bento-span-6',
    path: '/collection/jeans',
    img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    badge: '14 OZ SELVEDGE',
  },
  {
    id: 'bento-7',
    title: 'Monolith Footwear & Derbies',
    subtitle: 'Lug-sole chunky derbies, minimalist trainers and leather footwear.',
    tag: 'MONOLITH FOOTWEAR',
    spanClass: 'bento-span-6',
    path: '/collection/footwear',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
    badge: 'LUG SOLE',
  },
]

// Minimal Clean Mobile Categories (Snitch Style)
const MOBILE_CATEGORIES = [
  { id: 'shirts',      title: 'SHIRTS',      path: '/collection/shirts',    img: '/categories/shirts.png' },
  { id: 'trousers',    title: 'TROUSERS',    path: '/collection/tailoring', img: '/categories/trousers.png' },
  { id: 'tshirts',     title: 'T-SHIRTS',    path: '/collection/tees',      img: '/categories/tshirts.png' },
  { id: 'jeans',       title: 'JEANS',       path: '/collection/jeans',     img: '/categories/jeans.png' },
  { id: 'cargos',      title: 'CARGOS',      path: '/collection/tailoring', img: '/categories/cargos.png' },
  { id: 'polos',       title: 'POLOS',       path: '/collection/shirts',    img: '/categories/polos.png' },
  { id: 'outerwear',   title: 'OUTERWEAR',   path: '/collection/jackets',   img: '/categories/outerwear.png' },
  { id: 'plussize',    title: 'PLUS SIZE',   path: '/collection',           img: '/categories/plussize.png' },
  { id: 'accessories', title: 'ACCESSORIES', path: '/collection',           img: '/categories/accessories.png' },
]

const CATALOG_TABS = ['All', 'Shirts', 'Tees', 'Jeans', 'Jackets', 'Tailoring', 'Formals']

export default function HomePage() {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist } = useCart()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('All')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const newArrivalsTrackRef = useRef(null)

  // Scroll New Arrivals carousel horizontally
  const scrollNewArrivals = (direction) => {
    if (newArrivalsTrackRef.current) {
      const scrollAmount = newArrivalsTrackRef.current.clientWidth * 0.75
      newArrivalsTrackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  // Load products from backend API
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true)
      try {
        const res = await getProducts()
        if (res?.data) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category,
            color: p.color,
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: p.originalPrice,
            badge: p.badge,
            isFeatured: p.isFeatured,
            isWinterDrop: p.isWinterDrop,
            rating: p.rating || '4.8',
            reviewsCount: p.reviewsCount || 120,
            images: p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : [])
          }))
          setProducts(formatted)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.warn('Could not load products on Home page')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const newArrivals = products.filter(p => p.badge?.toLowerCase().includes('new') || p.badge?.toLowerCase().includes('drop') || p.isFeatured)
  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : products.slice(0, 8)

  // Filter products for the bottom catalog section
  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.category && p.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="homepage-container" style={{ display: 'flex', flexDirection: 'column', gap: 36, paddingBottom: 64 }}>
      {/* ─── 1. HERO CAROUSEL ─────────────────────────────────────────────── */}
      <section className="hero-slider-section">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide
          return (
            <div
              key={slide.id}
              className={`hero-slide-item ${isActive ? 'active' : ''}`}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="hero-slide-bg-img"
              />
              <div className="hero-slide-overlay" />

              <div className="hero-slide-content">


                <h1 className="hero-title-main">
                  {slide.title}
                </h1>

                <div className="hero-cta-row">
                  <button
                    onClick={() => navigate(slide.link)}
                    className="hero-cta-btn"
                  >
                    <span>{slide.cta}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Carousel Nav Arrows */}
        <button
          className="slider-arrow-btn prev desktop-only"
          onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous Slide"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          className="slider-arrow-btn next desktop-only"
          onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>

        {/* Dots */}
        <div className="slider-dots-container">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`slider-dot-btn ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ─── 2. NEW ARRIVALS (Horizontal Slider) ──────── */}
      {displayNewArrivals.length > 0 && (
        <section className="content-container new-arrivals-section-wrap">
          <h2 className="new-arrivals-heading-title">NEW ARRIVALS</h2>

          <div className="new-arrivals-slider-wrapper">
            {/* Left Arrow Button */}
            <button
              className="new-arrivals-slider-nav-btn prev-btn"
              onClick={() => scrollNewArrivals('left')}
              aria-label="Previous New Arrivals"
              title="Scroll Left"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_left</span>
            </button>

            {/* Product Cards Track */}
            <div className="new-arrivals-track no-scrollbar" ref={newArrivalsTrackRef}>
              {displayNewArrivals.map((item) => (
                <div
                  key={item.id}
                  className="new-arrivals-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="new-arrivals-media-container">
                    <img src={item.images?.[0] || item.img || ''} alt={item.name} className="new-arrivals-img" loading="lazy" />
                    {item.badge && (
                      <span className="new-arrivals-badge-tag">
                        {item.badge}
                      </span>
                    )}
                    <button
                      className={`new-arrivals-wish-btn ${isWishlisted(item.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(item.id)
                      }}
                      aria-label="Wishlist"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 18,
                          fontVariationSettings: isWishlisted(item.id) ? "'FILL' 1" : "'FILL' 0",
                          color: isWishlisted(item.id) ? 'var(--brand-accent)' : 'inherit'
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="new-arrivals-details">
                    <h3 className="new-arrivals-title">{item.name}</h3>
                    <p className="new-arrivals-subtitle">{item.category || 'Atelier Garment'}</p>
                    <div className="new-arrivals-price-row">
                      <span className="new-arrivals-price-main">₹ {item.price ? Number(item.price).toLocaleString('en-IN') : '1,999'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              className="new-arrivals-slider-nav-btn next-btn"
              onClick={() => scrollNewArrivals('right')}
              aria-label="Next New Arrivals"
              title="Scroll Right"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_right</span>
            </button>
          </div>
        </section>
      )}

      {/* ─── 3. CATEGORIES: DESKTOP BENTO & MOBILE CLEAN MINIMAL GRID ─ */}
      <section className="content-container bento-glass-section desktop-only">
        <div className="bento-header-center">
          <h2 className="new-arrivals-heading-title">
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="bento-grid-modern">
          {BENTO_CATEGORIES.map((item) => (
            <div
              key={item.id}
              className={`bento-card-glass ${item.spanClass}`}
              onClick={() => navigate(item.path)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="bento-card-bg-img"
                loading="lazy"
              />
              <div className="bento-glass-overlay" />

              {item.badge && (
                <span className="bento-top-badge">
                  {item.badge}
                </span>
              )}

              {item.count && (
                <span className="bento-count-badge">
                  {item.count}
                </span>
              )}

              <div className="bento-card-content">
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {item.tag}
                </span>
                <h3 className="bento-category-title">{item.title}</h3>
                {item.subtitle && (
                  <p className="bento-category-subtitle">{item.subtitle}</p>
                )}
                <div className="bento-explore-cta">
                  <span className="bento-explore-cta-pill">
                    Explore Collection
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3b. MINIMAL CLEAN CATEGORIES GRID (Mobile View) ────────────── */}
      <section className="mobile-category-clean-section mobile-only">
        <div className="mobile-category-header">
          <div className="mobile-category-pretitle">SHOP BY</div>
          <h2 className="mobile-category-main-title">CATEGORY</h2>
          <div className="mobile-category-accent-bar" />
        </div>

        <div className="mobile-category-grid">
          {MOBILE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="mobile-category-cell"
              onClick={() => navigate('/collection')}
            >
              <div className="mobile-category-cell-top">
                <span className="mobile-category-cell-title">{cat.title}</span>
              </div>
              <div className="mobile-category-cell-img-wrap">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="mobile-category-cell-img"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-category-footer">
          <button
            className="mobile-category-shop-all-btn"
            onClick={() => navigate('/collection')}
          >
            SHOP ALL
          </button>
        </div>
      </section>

      {/* ─── 5. PRODUCT CATALOG & TABS ─────────────────────────────────────── */}
      <section className="content-container">
        <h2 className="new-arrivals-heading-title" style={{ margin: '28px 0 20px' }}>
          BESTSELLERS
        </h2>

        {/* Filter Category Tabs — minimal, no scroll */}
        <div className="catalog-filter-tabs">
          {CATALOG_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`catalog-filter-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-light)',
            margin: '20px 0'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)' }}>inventory_2</span>
            <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', marginTop: 12 }}>Catalog is Empty</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, maxWidth: 360, margin: '6px auto 16px' }}>
              No items in this category yet. Add fresh collections from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="product-grid-home">
            {filteredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button
              onClick={() => navigate('/collection')}
              className="btn-outline"
              style={{ padding: '0 36px', height: 46 }}
            >
              <span>Explore Entire Catalog ({products.length} Items)</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
