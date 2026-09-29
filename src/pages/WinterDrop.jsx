import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const HERO_BG = "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBqMfest0YG8OFoCNADoIuzQNXFvjHQz2qD4iHKt4M2NL1THc1d1j4Ve6CQKqxTspCVBdi-1mJl8CllfgjnfMMuVL904tsYa3couHqcPC7O6BReTg750LSGbffD4s-TQ0baAn9dlIUyrj5ugjKut3LsWVR-SpcWyQuXldc1P4Ux3Z9XADwIXLlYW0aQihiPmiYZiMNNP5mzYei0bFl-2WuwK_hp1f32TqRjnTgZBFtAfXkEQ0q-Pj6')"

const PRODUCTS = [
  {
    id: 1, name: 'Structured Poplin Overshirt', price: '₹11,900', stock: 'Only 4 left',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
    sizes: ['S', 'M', 'L'], soldOut: ['XL'],
  },
  {
    id: 2, name: 'Cocoon Tech Overcoat', price: '₹29,900', stock: 'Low Stock',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMcWjy3fc8ms2v322i4KsHjjqsF8Aq-MkauMwU7eFgN9eltVE2jd-ie_damkN6PrGmoYwQdT9lHTQfL4lmA9vYBjLiY0J3Ub8LLGwmH4qgRkmOvtfEEX2gL5u-zYEgSpC8HjBWjxRekLABxWoGfPOffgV_u4MrrkdczbPqI8OfLAPNdKlfkqJGo65U2u-qO4SG_rHV_UnwvLyTbsVvNlZLbIgF2RyYYidVi36LVb5GfFM0ZTnuDJjN',
    sizes: ['46', '48', '50', '52'], soldOut: [],
  },
  {
    id: 3, name: 'Brushed Mohair Knit', price: '₹15,500', stock: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcGdhD4ZhQZ3oH5KMNUpJBqde0mkUzM9j4twJPVO21A63Ua1y4VTDOAOACkYyw_jInAlG-EqHBlCnvAcZo6fVekY73Jbek2y9iO1xA9d1Vog4RgiGAGlrr3blonbPBzgPxsZgaIue--6RcwEZXAhdeyqlM33Rs08jPqiftAcBYM-82jrlxXWv5bPyPXoopwRUVdXinW98_SB412MGmNP3RGAYsEK9PM2h6uGbXLYmayNsYHY_RgGje',
    sizes: ['XS', 'S', 'M', 'L'], soldOut: ['XS'],
  },
  {
    id: 4, name: 'Monolith Lug Derby', price: '₹21,500', stock: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1gnBz655IdvVc1kO3NYSAvFEtlpZ66Wu9-iyodD2SqX8lAO6XchzyrZ6KdjTiv0hZALzdKDErN0So9P4trw3X16PBFg2lpzRVlsEf0TafladgrnZ_xB_UuzBhHsVWH_-KgjTxZSKXjyWxQngmueCK6uMeTKdEkPCee_IAJqqJfgXD1SN9RUmxjJPavdVubh2wgZ3Ihsbe-IN8KyomS25QkT6EyJR0tIgYVwSPiDlNOZNJNbK2MfJ',
    sizes: ['40', '41', '42', '43', '44'], soldOut: ['40'],
  },
]

function useCountdown(targetDate) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    const update = () => {
      const diff = targetDate - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return time
}

export default function WinterDropPage() {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist, addToCart } = useCart()
  const target = useRef(Date.now() + 2 * 86400000 + 14 * 3600000 + 38 * 60000).current
  const countdown = useCountdown(target)
  const [selectedSizes, setSelectedSizes] = useState({})

  const pad = n => String(n).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: 'var(--on-surface)' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: 520,
        maxHeight: 680,
        overflow: 'hidden',
        background: 'var(--surface-container-lowest)'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: HERO_BG, backgroundSize: 'cover', backgroundPosition: 'center 20%', transform: 'scale(1.02)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface) 0%, rgba(18,19,22,0.4) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: '0 0 auto', height: 96, background: 'linear-gradient(to bottom, rgba(18,19,22,0.8), transparent)' }} />

        <div className="content-container" style={{
          position: 'relative',
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '3rem',
          gap: 12
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(31,31,35,0.85)', backdropFilter: 'blur(12px)', padding: '5px 12px', borderRadius: 999, alignSelf: 'flex-start' }}>
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-container)' }} />
            <span className="text-label-caps text-primary">FW25 ARCHIVE // LIMITED EDITION</span>
          </div>
          
          <h1 className="text-headline-xl-mobile text-on-surface" style={{ textTransform: 'uppercase', fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1 }}>
            WINTER DROP 01
          </h1>
          
          <p className="text-body-sm text-on-surface-variant" style={{ maxWidth: 440, fontSize: 14 }}>
            Architectural Outerwear & Cold-Weather Tailoring engineered for severe elements. Hand-cut and serialized in Porto.
          </p>

          {/* Countdown Grid */}
          <div style={{ display: 'flex', gap: 10, maxWidth: 360, marginTop: 4 }}>
            {[['Days', pad(countdown.days)], ['Hours', pad(countdown.hours)], ['Mins', pad(countdown.mins)], ['Secs', pad(countdown.secs)]].map(([label, val], i) => (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', borderRadius: 8, background: 'rgba(41,42,45,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-headline-md text-on-surface" style={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: i === 3 ? 'var(--primary-container)' : 'var(--on-surface)', fontWeight: 700 }}>{val}</span>
                <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 9, marginTop: 4 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('capsule')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
              style={{
                height: 48,
                padding: '0 28px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                gap: 8,
                boxShadow: '0 0 24px rgba(0,210,255,0.3)'
              }}
            >
              <span>Explore The Capsule</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_downward</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>lock_open</span>
              <span className="text-label-caps text-on-surface-variant">Early Atelier Access · Members First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Strip */}
      <section style={{ padding: '2.5rem 0', background: 'var(--surface)', borderBottom: '1px solid rgba(187,201,207,0.06)' }}>
        <div className="content-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="text-label-caps text-primary">ATELIER MANIFESTO</span>
              <div style={{ flex: 1, height: 1, background: 'var(--surface-container-highest)' }} />
            </div>
            <p className="text-headline-md text-on-surface" style={{ lineHeight: 1.4, maxWidth: 900, fontSize: 'clamp(18px, 2vw, 22px)' }}>
              Sculptural warmth engineered for severe elements. Heavyweight double-faced wool, weather-resistant Japanese technical poplin, and modular ergonomic silhouettes.
            </p>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingTop: 6 }} className="no-scrollbar">
              {[['verified', 'Made in Portugal'], ['eco', '100% Traceable Wool'], ['layers', 'Modular System'], ['shield', 'Storm Resistant Japanese Poplin']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'var(--surface-container)', flexShrink: 0 }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>{icon}</span>
                  <span className="text-label-md text-secondary">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capsule Grid */}
      <section id="capsule" style={{ padding: '2.5rem 0 4rem', background: 'var(--surface)' }}>
        <div className="content-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span className="text-label-caps text-primary" style={{ display: 'block', marginBottom: 4 }}>WINTER DROP CAPSULE</span>
              <h2 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase' }}>HERO PIECES</h2>
            </div>
            <span className="text-label-caps text-on-surface-variant">04 Garments Available</span>
          </div>

          <div className="product-grid-responsive">
            {PRODUCTS.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 12,
                  background: 'var(--surface-container)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(187,201,207,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={() => navigate('/product/structured-poplin-overshirt')}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: 'var(--surface-container-high)', overflow: 'hidden' }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <button
                    aria-label="Wishlist"
                    onClick={e => { e.stopPropagation(); toggleWishlist(p.id) }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(18,19,22,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isWishlisted(p.id) ? 'var(--primary-container)' : 'var(--on-surface)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: isWishlisted(p.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                  {p.stock && (
                    <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '2px 8px', borderRadius: 4, background: p.stock.includes('Low') ? 'var(--error-container)' : 'rgba(52,53,56,0.9)', backdropFilter: 'blur(4px)' }}>
                      <span className="text-label-caps" style={{ fontSize: 10, color: p.stock.includes('Low') ? 'var(--on-error-container)' : '#7bd0ff' }}>{p.stock}</span>
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <h3 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                    <span className="text-body-sm text-on-surface-variant" style={{ display: 'block', marginTop: 2, fontWeight: 600 }}>{p.price}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.sizes.slice(0, 4).map(s => (
                      <button
                        key={s}
                        onClick={e => { e.stopPropagation(); setSelectedSizes(prev => ({ ...prev, [p.id]: s })) }}
                        style={{
                          width: 30, height: 30, borderRadius: 4, border: 'none', cursor: p.soldOut.includes(s) ? 'not-allowed' : 'pointer',
                          background: selectedSizes[p.id] === s ? 'var(--on-surface)' : p.soldOut.includes(s) ? 'var(--surface-container-low)' : 'var(--surface-bright)',
                          color: selectedSizes[p.id] === s ? 'var(--surface)' : p.soldOut.includes(s) ? 'var(--outline-variant)' : 'var(--on-surface)',
                          fontSize: 11, fontWeight: 600,
                          textDecoration: p.soldOut.includes(s) ? 'line-through' : 'none',
                          opacity: p.soldOut.includes(s) ? 0.4 : 1,
                        }}
                      >{s}</button>
                    ))}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const chosenSize = selectedSizes[p.id] || p.sizes[0]
                      addToCart(p, chosenSize)
                    }}
                    style={{ width: '100%', height: 38, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--surface-bright)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-container)'; e.currentTarget.style.color = 'var(--on-primary-fixed)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-bright)'; e.currentTarget.style.color = 'var(--on-surface)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shopping_bag</span>
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
