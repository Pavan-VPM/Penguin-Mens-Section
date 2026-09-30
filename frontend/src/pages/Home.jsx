import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1ps0HdAx9ANRgkAI528SZuWNXqJ1WKlkHgpfYv2ybbogGSlvqSLviao-pPVvWvntNgt4clC3ZQhMQIMFLNn_yQ59lbpIKnLB_AYCQqkq9ojMmahSUtbSMwG8H-60x_Lu2FeCmwkOtbCE-FILoiZ7CBr6FaRHRM1oDOLigIDAVVCI14XVvM4wCnVUSqzxvhyHyfTadWCC0SkD4BjDQlxUHqLLgMszYK8LthVcUcm1CJex1S2t2GP57'

const PRODUCTS = [
  { id: 1, name: 'Structured Wool Overshirt', category: 'Shirts', color: 'Charcoal Melange', price: '₹14,500', badge: 'Drop 01', badgeColor: 'var(--primary)', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va' },
  { id: 2, name: 'Heavyweight Boxy Tee', category: 'Tees', color: 'Chalk White', price: '₹4,990', badge: 'Organic', badgeColor: 'var(--secondary)', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEg9HtS0jCzYVX0DNa-H01P07DEd3yPNgAGhR7l8uhurLYtOmmkzrWBT-fzc9gCXaU9VuLEaE7zzyWMh59UyiGYFM7gPlBxgZcVe6SJXIuDYleaWLtY2go9B0wDdGTc2ubG_j3tC9-6Q6dg6j6aaweB2iDSlt8Dp0Q5bHXK1YWSkFPa4a9ewDrgjcTvIBfBULm9Tzb2N4ps4HytEYk3FEgY9IyiyksGJUIWB1EsPMVZOGHdXrKzZeA' },
  { id: 3, name: 'Relaxed Pleated Trouser', category: 'Tailoring', color: 'Slate Grey', price: '₹11,500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl' },
  { id: 4, name: 'Technical Bomber Jacket', category: 'Jackets', color: 'Washed Black', price: '₹18,900', badge: 'Limited', badgeColor: 'var(--primary)', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF' },
  { id: 5, name: 'Raw Selvedge Denim', category: 'Jeans', color: 'Deep Indigo', price: '₹14,900', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_' },
  { id: 6, name: 'Monolith Lug Derby', category: 'Footwear', color: 'Matte Black', price: '₹21,500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm' },
]

const CATEGORIES = ['All', 'Jackets', 'Shirts', 'Tees', 'Tailoring', 'Jeans', 'Footwear']

export default function HomePage() {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist, addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  const displayProducts = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Ticker */}
      <div style={{
        background: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--ticker-border)'
      }}>
        <div className="content-container" style={{
          paddingTop: 8,
          paddingBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-container)' }} />
            <span className="text-label-caps text-on-surface-variant">FW25 Drop 01 Available Worldwide</span>
          </div>
          <span className="text-label-caps text-secondary" style={{ opacity: 0.7 }}>Archive Curated</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        width: '100%',
        maxHeight: 640,
        overflow: 'hidden',
        background: 'var(--surface-container-low)'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          minHeight: 460,
          maxHeight: 640
        }}>
          <img
            src={HERO_IMG}
            alt="Penguins FW25"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top 20%', filter: 'brightness(0.9) contrast(1.05)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-gradient-v)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-gradient-h)' }} />
          
          <div className="content-container" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--glass-dark)', backdropFilter: 'blur(12px)', padding: '5px 12px', borderRadius: 999, alignSelf: 'flex-start' }}>
              <span className="animate-ping" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-container)' }} />
              <span className="text-label-caps text-primary">Drop 01 // Autumn Winter 2025</span>
            </div>
            
            <h1 className="text-headline-xl-mobile text-on-surface" style={{ textTransform: 'uppercase', marginTop: 4, maxWidth: 640, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}>
              New Season Drop
            </h1>
            
            <p className="text-body-md text-on-surface-variant" style={{ maxWidth: 440, fontSize: 'clamp(13px, 1.5vw, 16px)' }}>
              Minimalist silhouettes engineered for modern architectural movement. Double-faced wool, tech poplin, and structured forms.
            </p>
            
            <div style={{ display: 'flex', gap: 12, paddingTop: 10, maxWidth: 420 }}>
              <button
                onClick={() => navigate('/winter-drop')}
                className="btn-primary"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 8,
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 24px var(--glow-primary)'
                }}
              >
                <span>Explore Collection</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/collection/shirts')}
                style={{
                  height: 48,
                  padding: '0 20px',
                  borderRadius: 8,
                  background: 'var(--glass-dark)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--card-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--on-surface)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                <span>View Lookbook</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="content-container" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Category Tabs */}
        <div style={{
          background: 'var(--category-bar-bg)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 64,
          zIndex: 30,
          padding: '12px 0',
          margin: '0 -1rem',
          borderBottom: '1px solid var(--ticker-border)'
        }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 1rem' }} className="no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-label-caps"
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s',
                  background: activeCategory === cat ? 'var(--primary-container)' : 'var(--surface-container)',
                  color: activeCategory === cat ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
                  boxShadow: activeCategory === cat ? 'var(--card-hover-shadow)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* New Arrivals Header */}
        <div style={{ padding: '2rem 0 1rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h2 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              New Arrivals
            </h2>
            <span className="text-label-caps text-primary">({displayProducts.length} {displayProducts.length === 1 ? 'Piece' : 'Pieces'})</span>
          </div>
          <button
            onClick={() => navigate('/collection/shirts')}
            className="text-label-caps text-on-surface-variant"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
          >
            <span>View All Pieces</span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_outward</span>
          </button>
        </div>

        {/* Product Grid - Responsive (2 on mobile, 3-4 on desktop) */}
        <div className="product-grid-responsive" style={{ paddingBottom: '2.5rem' }}>
          {displayProducts.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--surface-container-low)',
                borderRadius: 12,
                overflow: 'hidden',
                padding: 10,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid var(--card-border)'
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
              <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-container)' }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease-out' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                {p.badge && (
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="text-label-caps product-badge-label" style={{ background: 'var(--product-card-badge-bg)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 4, color: p.badgeColor, border: '1px solid var(--card-border)' }}>
                      {p.badge}
                    </span>
                  </div>
                )}
                <button
                  aria-label="Favourite"
                  onClick={e => { e.stopPropagation(); toggleWishlist(p.id) }}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--glass-wishlist-btn)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isWishlisted(p.id) ? 'var(--primary-container)' : 'var(--on-surface)'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: isWishlisted(p.id) ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
                <button
                  aria-label="Add to cart"
                  onClick={e => { e.stopPropagation(); addToCart(p, 'M') }}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--primary-container)',
                    color: 'var(--on-primary-fixed)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    transition: 'transform 0.15s'
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                </button>
              </div>
              <div style={{ padding: '12px 6px 6px', minWidth: 0 }}>
                <p className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>{p.color}</p>
                <h3 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>{p.name}</h3>
                <p className="text-title-sm text-primary" style={{ marginTop: 6, fontWeight: 700 }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Statement - Desktop Multi-Pillar & Mobile Card */}
        <div style={{
          marginBottom: '3rem',
          padding: '2rem',
          background: 'var(--surface-container-lowest)',
          borderRadius: 16,
          border: '1px solid var(--brand-card-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="text-label-caps text-primary">Atelier Manifesto</span>
              <span className="text-label-caps text-on-surface-variant">Est. 2025</span>
            </div>
            
            <p className="text-headline-md text-on-surface" style={{ lineHeight: 1.4, maxWidth: 840, fontSize: 'clamp(18px, 2.5vw, 24px)' }}>
              Minimal silhouettes. Maximum intent. Modern menswear designed with architectural geometry and executed with Portuguese precision craftsmanship.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 12 }}>
              {[
                { title: 'Japanese Poplin', desc: 'High-density weave resistant to wind and moisture while breathing naturally.' },
                { title: 'Modular Architecture', desc: 'Cut with calculated proportions allowing seamless layering across all seasonal drops.' },
                { title: 'Carbon Neutral Courier', desc: 'Direct atelier dispatch with guaranteed 24-hour tracked DHL Express delivery.' },
              ].map(f => (
                <div key={f.title} style={{ padding: '14px', background: 'var(--surface-container-low)', borderRadius: 10, border: '1px solid var(--feature-tile-border)' }}>
                  <h4 className="text-title-sm text-on-surface" style={{ fontSize: 13, fontWeight: 700 }}>{f.title}</h4>
                  <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 4, lineHeight: 1.4, fontSize: 12 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
