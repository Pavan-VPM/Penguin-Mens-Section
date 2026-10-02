import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    tag: 'WINTER CAPSULE 2025',
    title: 'ARCHITECTURAL OUTERWEAR',
    subtitle: 'Double-faced wool overshirts, technical bomber jackets, and cold-weather essentials engineered for urban climates.',
    cta: 'EXPLORE WINTER DROP',
    link: '/winter-drop',
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

// Story categories (Snitch-style circular category navigation)
const STORY_CATEGORIES = [
  { name: 'Oversized', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop', category: 'Tees' },
  { name: 'Luxe Shirts', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&auto=format&fit=crop', category: 'Shirts' },
  { name: 'Cargos & Pants', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&auto=format&fit=crop', category: 'Tailoring' },
  { name: 'Winter Drop', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=300&auto=format&fit=crop', category: 'Jackets' },
  { name: 'Footwear', img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300&auto=format&fit=crop', category: 'Footwear' },
  { name: 'Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop', category: 'Jackets' },
  { name: 'Denim', img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=300&auto=format&fit=crop', category: 'Jeans' },
  { name: 'Best Sellers', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&auto=format&fit=crop', category: 'All' },
]

// 10 clean, open-source product images from Unsplash — curated for menswear
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Oversized Premium Tee',
    category: 'Tees',
    color: 'Chalk White',
    price: 1199,
    originalPrice: 1999,
    badge: 'BESTSELLER',
    rating: '4.9',
    reviewsCount: 514,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 2,
    name: 'Linen Camp Collar Shirt',
    category: 'Shirts',
    color: 'Ivory White',
    price: 1799,
    originalPrice: 3299,
    badge: '45% OFF',
    rating: '4.8',
    reviewsCount: 387,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 3,
    name: 'Slim Raw Denim Jeans',
    category: 'Jeans',
    color: 'Deep Indigo',
    price: 2299,
    originalPrice: 3999,
    badge: '42% OFF',
    rating: '4.7',
    reviewsCount: 296,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 4,
    name: 'Technical Bomber Jacket',
    category: 'Jackets',
    color: 'Matte Olive',
    price: 3499,
    originalPrice: 5999,
    badge: 'DROP 01',
    rating: '5.0',
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 5,
    name: 'Tailored Slim Chino Pants',
    category: 'Tailoring',
    color: 'Slate Grey',
    price: 1999,
    originalPrice: 3499,
    badge: '43% OFF',
    rating: '4.8',
    reviewsCount: 241,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 6,
    name: 'Structured Formal Blazer',
    category: 'Formals',
    color: 'Charcoal Black',
    price: 4999,
    originalPrice: 8499,
    badge: '41% OFF',
    rating: '4.9',
    reviewsCount: 178,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 7,
    name: 'Heavyweight Graphic Tee',
    category: 'Tees',
    color: 'Washed Black',
    price: 999,
    originalPrice: 1799,
    badge: 'NEW',
    rating: '4.7',
    reviewsCount: 632,
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 8,
    name: 'Cargo Wide-Leg Pants',
    category: 'Tailoring',
    color: 'Military Khaki',
    price: 2499,
    originalPrice: 4199,
    badge: '40% OFF',
    rating: '4.8',
    reviewsCount: 203,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 9,
    name: 'Double-Breasted Wool Overcoat',
    category: 'Jackets',
    color: 'Camel Tan',
    price: 5999,
    originalPrice: 9999,
    badge: 'LIMITED',
    rating: '5.0',
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 10,
    name: 'Oxford Button-Down Shirt',
    category: 'Shirts',
    color: 'Sky Blue',
    price: 1599,
    originalPrice: 2799,
    badge: '43% OFF',
    rating: '4.8',
    reviewsCount: 319,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    ]
  },
]

const CATALOG_TABS = ['All', 'Shirts', 'Tees', 'Jeans', 'Jackets', 'Tailoring', 'Formals']

export default function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('All')
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [siteConfig, setSiteConfig] = useState({
    showWinterDrop: true,
    winterDropTitle: 'WINTER DROP 01',
    winterDropSubtitle: 'Limited capsule — Structured outerwear, heavyweight knitwear & tech bombers. Only 100 units per style.',
    winterDropCta: 'Shop Winter Drop',
    winterDropImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
  })

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  // Load products from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await getProducts()
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Shirts',
            color: p.color || 'Nocturne Black',
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: p.originalPrice || Math.round((typeof p.price === 'number' ? p.price : 1999) * 1.65),
            badge: p.badge || 'NEW',
            rating: p.rating || '4.9',
            reviewsCount: p.reviewsCount || 128,
            images: p.images && p.images.length > 0 ? p.images : [p.img],
          }))
          setProducts(formatted)
        }
      } catch (err) {
        console.warn('Using rich fallback catalog')
      }
    }
    loadData()
  }, [])

  // Load site config (Winter Drop toggle etc.)
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await getSiteConfig()
        if (res?.data) {
          setSiteConfig(prev => ({ ...prev, ...res.data }))
        }
      } catch (err) {
        // Use defaults
      }
    }
    loadConfig()
  }, [])

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 40, paddingBottom: 60 }}>
      {/* ─── 1. HERO CAROUSEL BANNER ────────────────────────────────────────── */}
      <section className="hero-slider-section">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide
          return (
            <div
              key={slide.id}
              className="hero-slide-item"
              style={{
                display: isActive ? 'flex' : 'none',
                animation: isActive ? 'fadeIn 0.5s ease' : 'none'
              }}
            >
              <img src={slide.img} alt={slide.title} className="hero-slide-img" />
              <div className="hero-overlay-gradient" />

              <div className="content-container">
                <div className="hero-content-box">
                  <div className="hero-drop-tag">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--brand-accent)' }} />
                    {slide.tag}
                  </div>
                  <h1 className="hero-headline">{slide.title}</h1>
                  <p className="hero-subheadline">{slide.subtitle}</p>
                  <button
                    onClick={() => navigate(slide.link)}
                    className="hero-cta-btn"
                  >
                    <span>{slide.cta}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
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

      {/* ─── 2. CATEGORY STORIES (Snitch Style Round Avatars) ───────────────── */}
      <section className="content-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Shop By Category
          </h2>
          <button
            onClick={() => navigate('/collection')}
            style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            View All →
          </button>
        </div>

        <div className="category-stories-wrapper no-scrollbar">
          {STORY_CATEGORIES.map(story => (
            <div
              key={story.name}
              className="story-circle-item"
              onClick={() => {
                if (story.category === 'All') navigate('/collection')
                else if (story.name === 'Winter Drop') navigate('/winter-drop')
                else navigate(`/collection/${story.category.toLowerCase()}`)
              }}
            >
              <div className="story-avatar-ring">
                <img src={story.img} alt={story.name} className="story-avatar-img" />
              </div>
              <span className="story-label-text">{story.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. WINTER DROP PROMO BANNER (Admin-controlled toggle) ─────────── */}
      {siteConfig.showWinterDrop && (
        <section className="content-container">
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            minHeight: 160,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0a0a0c',
            boxShadow: 'var(--shadow-md)',
          }}>
            {siteConfig.winterDropImage && (
              <img
                src={siteConfig.winterDropImage}
                alt="Winter Drop"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)' }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '24px 28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--brand-accent)', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', marginBottom: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#fff' }} />
                  LIMITED CAPSULE
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 6px' }}>
                  {siteConfig.winterDropTitle || 'WINTER DROP 01'}
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', maxWidth: 460, lineHeight: 1.5, margin: 0 }}>
                  {siteConfig.winterDropSubtitle || 'Limited capsule — Only 100 units per style.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/winter-drop')}
                className="btn-solid-accent"
                style={{ height: 44, padding: '0 24px', fontSize: 12, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {siteConfig.winterDropCta || 'Shop Drop'}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. SIGNATURE BENTO COLLECTIONS (Snitch Showcase Style) ─────────── */}
      <section className="content-container">
        <div className="section-header-wrap">
          <span className="section-tag-pill">CURATED COLLECTIONS</span>
          <h2 className="section-main-title">EXPLORE THE EDITS</h2>
          <p className="section-sub-desc">Handcrafted wardrobe capsules designed for comfort, luxury drape, and streetwear presence.</p>
        </div>

        <div className="bento-collection-grid">
          {/* Main Large Bento Tile */}
          <div
            className="bento-card-tile"
            onClick={() => navigate('/collection/shirts')}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt="Luxe Linen & Poplin"
              className="bento-tile-img"
            />
            <div className="bento-tile-overlay" />
            <div className="bento-tile-content">
              <span className="bento-tile-tag">SIGNATURE ATELIER</span>
              <h3 className="bento-tile-title">Luxe Linen & Poplin Shirts</h3>
              <p style={{ fontSize: 13, opacity: 0.9 }}>Ultra-breathable Japanese poplin crafted for tropical versatility.</p>
            </div>
          </div>

          {/* Compact Bento Tile 1 */}
          <div
            className="bento-card-tile"
            onClick={() => navigate('/winter-drop')}
          >
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
              alt="Winter Outerwear"
              className="bento-tile-img"
            />
            <div className="bento-tile-overlay" />
            <div className="bento-tile-content">
              <span className="bento-tile-tag">WINTER 2025</span>
              <h3 className="bento-tile-title">Structured Outerwear</h3>
            </div>
          </div>

          {/* Compact Bento Tile 2 */}
          <div
            className="bento-card-tile"
            onClick={() => navigate('/collection/shirts')}
          >
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
              alt="Oversized Heavyweight"
              className="bento-tile-img"
            />
            <div className="bento-tile-overlay" />
            <div className="bento-tile-content">
              <span className="bento-tile-tag">STREETWEAR</span>
              <h3 className="bento-tile-title">Heavyweight Boxy Tees</h3>
            </div>
          </div>

          {/* Compact Bento Tile 3 */}
          <div
            className="bento-card-tile"
            onClick={() => navigate('/collection/shirts')}
          >
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop"
              alt="Pleated Trousers"
              className="bento-tile-img"
            />
            <div className="bento-tile-overlay" />
            <div className="bento-tile-content">
              <span className="bento-tile-tag">TAILORING</span>
              <h3 className="bento-tile-title">Pleated & Cargo Trousers</h3>
            </div>
          </div>

          {/* Compact Bento Tile 4 */}
          <div
            className="bento-card-tile"
            onClick={() => navigate('/collection/shirts')}
          >
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop"
              alt="Monolith Derbies"
              className="bento-tile-img"
            />
            <div className="bento-tile-overlay" />
            <div className="bento-tile-content">
              <span className="bento-tile-tag">FOOTWEAR</span>
              <h3 className="bento-tile-title">Lug-Sole Monolith Footwear</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. PRODUCT CATALOG & TABS (Bestsellers & New Arrivals) ─────────── */}
      <section className="content-container">
        <div className="section-header-wrap">
          <span className="section-tag-pill">TRENDING NOW</span>
          <h2 className="section-main-title">BESTSELLERS & FRESH DROPS</h2>
          <p className="section-sub-desc">Discover the season's most sought-after garments, loved by over 50,000+ men across India.</p>
        </div>

        {/* Filter Category Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, overflowX: 'auto', paddingBottom: 16 }} className="no-scrollbar">
          {CATALOG_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: activeTab === tab ? '1.5px solid var(--brand-primary)' : '1px solid var(--border-light)',
                backgroundColor: activeTab === tab ? 'var(--brand-primary)' : 'var(--bg-card)',
                color: activeTab === tab ? 'var(--text-inverse)' : 'var(--text-primary)',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid — responsive: 2 col mobile / 4 col desktop */}
        <div className="product-grid-home">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* View All Button */}
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
      </section>

      {/* ─── 6. EDITORIAL CAMPAIGN SECTION ─────────────────────────────────── */}
      <section className="content-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ position: 'relative', minHeight: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial Campaign"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            <span className="section-tag-pill">THE PENGUIN PHILOSOPHY</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2 }}>
              REDEFINE YOUR EVERYDAY SILHOUETTE
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We reject fleeting trends in favor of timeless structural forms. Each Penguin garment is engineered using high-density organic textiles, reinforced stress seams, and thoughtful ergonomic proportions.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => navigate('/winter-drop')}
                className="btn-solid-accent"
                style={{ height: 44, fontSize: 12 }}
              >
                Shop Drop 01
              </button>
              <button
                onClick={() => navigate('/collection/shirts')}
                className="btn-outline"
                style={{ height: 44, fontSize: 12 }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
