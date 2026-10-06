import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

function useCountdown(targetTimestamp) {
  const [time, setTime] = useState({ days: 2, hours: 14, mins: 38, secs: 45 })

  useEffect(() => {
    const update = () => {
      const diff = targetTimestamp - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetTimestamp])

  return time
}

const FALLBACK_DROP_PRODUCTS = [
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
  },
  {
    id: 7,
    name: 'Brushed Mohair Knit Sweater',
    category: 'Jackets',
    color: 'Olive Moss',
    price: 2999,
    originalPrice: 4999,
    badge: 'WINTER',
    rating: '4.9',
    reviewsCount: 142,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcGdhD4ZhQZ3oH5KMNUpJBqde0mkUzM9j4twJPVO21A63Ua1y4VTDOAOACkYyw_jInAlG-EqHBlCnvAcZo6fVekY73Jbek2y9iO1xA9d1Vog4RgiGAGlrr3blonbPBzgPxsZgaIue--6RcwEZXAhdeyqlM33Rs08jPqiftAcBYM-82jrlxXWv5bPyPXoopwRUVdXinW98_SB412MGmNP3RGAYsEK9PM2h6uGbXLYmayNsYHY_RgGje',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMcWjy3fc8ms2v322i4KsHjjqsF8Aq-MkauMwU7eFgN9eltVE2jd-ie_damkN6PrGmoYwQdT9lHTQfL4lmA9vYBjLiY0J3Ub8LLGwmH4qgRkmOvtfEEX2gL5u-zYEgSpC8HjBWjxRekLABxWoGfPOffgV_u4MrrkdczbPqI8OfLAPNdKlfkqJGo65U2u-qO4SG_rHV_UnwvLyTbsVvNlZLbIgF2RyYYidVi36LVb5GfFM0ZTnuDJjN'
    ]
  },
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    originalPrice: 3499,
    badge: 'DROP 01',
    rating: '4.9',
    reviewsCount: 312,
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'
    ]
  },
  {
    id: 6,
    name: 'Monolith Lug Sole Derby',
    category: 'Footwear',
    color: 'Matte Black',
    price: 3999,
    originalPrice: 6499,
    badge: 'LIMITED',
    rating: '4.9',
    reviewsCount: 78,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1gnBz655IdvVc1kO3NYSAvFEtlpZ66Wu9-iyodD2SqX8lAO6XchzyrZ6KdjTiv0hZALzdKDErN0So9P4trw3X16PBFg2lpzRVlsEf0TafladgrnZ_xB_UuzBhHsVWH_-KgjTxZSKXjyWxQngmueCK6uMeTKdEkPCee_IAJqqJfgXD1SN9RUmxjJPavdVubh2wgZ3Ihsbe-IN8KyomS25QkT6EyJR0tIgYVwSPiDlNOZNJNbK2MfJ'
    ]
  }
]

export default function WinterDropPage() {
  const navigate = useNavigate()
  const countdown = useCountdown(Date.now() + 2 * 86400000 + 14 * 3600000 + 38 * 60000)
  const [dropProducts, setDropProducts] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getProducts()
        if (res?.data) {
          const formatted = res.data.map(p => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category || 'Jackets',
            color: p.color || 'Nocturne Black',
            price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d.]/g, '')) || 1999,
            originalPrice: p.originalPrice || Math.round((typeof p.price === 'number' ? p.price : 1999) * 1.65),
            badge: p.badge || 'DROP 01',
            rating: p.rating || '4.9',
            reviewsCount: 140,
            images: p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : []),
          }))
          setDropProducts(formatted)
        } else {
          setDropProducts([])
        }
      } catch (err) {
        console.warn('Could not load drop catalog')
        setDropProducts([])
      }
    }
    loadData()
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 36, paddingBottom: 80 }}>
      {/* ─── Hero Drop Showcase ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: 460,
        backgroundColor: '#0a0a0c',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <img
          src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1920&auto=format&fit=crop"
          alt="Winter Drop Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0c 0%, transparent 60%)' }} />

        <div className="content-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'var(--brand-accent)', color: '#ffffff', padding: '4px 14px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.1em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ffffff' }} />
            EXCLUSIVE CAPSULE LAUNCH
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            WINTER DROP 01 // ARCHITECTURAL FORMS
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', maxWidth: 540, lineHeight: 1.5 }}>
            Heavyweight structured wool, water-repellent tech poplin, and insulated outerwear engineered for extreme comfort.
          </p>

          {/* Countdown Clock */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: '10px 16px', minWidth: 64 }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{pad(countdown.days)}</div>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Days</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: '10px 16px', minWidth: 64 }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{pad(countdown.hours)}</div>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Hours</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: '10px 16px', minWidth: 64 }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{pad(countdown.mins)}</div>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Mins</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 8, padding: '10px 16px', minWidth: 64 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--brand-accent)' }}>{pad(countdown.secs)}</div>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Drop Products Grid ─────────────────────────────────────────────── */}
      <section className="content-container">
        <div className="section-header-wrap">
          <span className="section-tag-pill">LIMITED INVENTORY</span>
          <h2 className="section-main-title">CAPSULE PIECES</h2>
          <p className="section-sub-desc">Only 100 units crafted per design. Once sold out, archived permanently.</p>
        </div>

        <div className="product-grid-home">
          {dropProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  )
}
