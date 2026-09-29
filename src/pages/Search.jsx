import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const SEARCH_CATALOG = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: '₹11,900',
    badge: 'Drop 01',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY'
  },
  {
    id: 2,
    name: 'Heavyweight Boxy Tee',
    category: 'Tees',
    color: 'Chalk White',
    price: '₹4,990',
    badge: 'Organic',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEg9HtS0jCzYVX0DNa-H01P07DEd3yPNgAGhR7l8uhurLYtOmmkzrWBT-fzc9gCXaU9VuLEaE7zzyWMh59UyiGYFM7gPlBxgZcVe6SJXIuDYleaWLtY2go9B0wDdGTc2ubG_j3tC9-6Q6dg6j6aaweB2iDSlt8Dp0Q5bHXK1YWSkFPa4a9ewDrgjcTvIBfBULm9Tzb2N4ps4HytEYk3FEgY9IyiyksGJUIWB1EsPMVZOGHdXrKzZeA'
  },
  {
    id: 3,
    name: 'Relaxed Pleated Trouser',
    category: 'Tailoring',
    color: 'Slate Grey',
    price: '₹11,500',
    badge: 'Tailored',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl'
  },
  {
    id: 4,
    name: 'Technical Bomber Jacket',
    category: 'Jackets',
    color: 'Washed Black',
    price: '₹18,900',
    badge: 'Limited',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF'
  },
  {
    id: 5,
    name: 'Raw Selvedge Denim',
    category: 'Jeans',
    color: 'Deep Indigo',
    price: '₹14,900',
    badge: 'Selvedge',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_'
  },
  {
    id: 6,
    name: 'Monolith Lug Derby',
    category: 'Footwear',
    color: 'Matte Black',
    price: '₹21,500',
    badge: 'Handcrafted',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm'
  }
]

const POPULAR_SEARCHES = ['Poplin Overshirt', 'Wool Outerwear', 'Lug Derby', 'Black Jacket', 'Drop 01']

export default function SearchPage() {
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist } = useCart()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return SEARCH_CATALOG
    const q = query.toLowerCase()
    return SEARCH_CATALOG.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.color.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '3rem' }}>
      <div className="content-container" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search Input Bar */}
        <div style={{ position: 'relative', marginTop: 16, maxWidth: 720 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search garments, drops, silhouettes, materials..."
            autoFocus
            style={{
              width: '100%',
              height: 54,
              borderRadius: 12,
              background: 'var(--surface-container)',
              border: '1px solid rgba(187,201,207,0.15)',
              color: 'var(--on-surface)',
              padding: '0 46px 0 50px',
              fontSize: 15,
              outline: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary-container)'}
            onBlur={e => e.target.style.borderColor = 'rgba(187,201,207,0.15)'}
          />
          <span
            className="material-symbols-outlined"
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 24,
              color: 'var(--on-surface-variant)',
              pointerEvents: 'none'
            }}
          >
            search
          </span>
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--on-surface-variant)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          )}
        </div>

        {/* Trending Chips */}
        <div>
          <span className="text-label-caps text-on-surface-variant" style={{ display: 'block', marginBottom: 8, fontSize: 10 }}>
            Trending Searches
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {POPULAR_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: query === term ? 'var(--primary-container)' : 'var(--surface-container-high)',
                  color: query === term ? 'var(--on-primary-fixed)' : 'var(--on-surface)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 className="text-title-sm text-on-surface" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {query.trim() ? `Search Results for "${query}"` : 'Curated Atelier Pieces'}
            </h2>
            <span className="text-label-caps text-primary">({filtered.length})</span>
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-container)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Product Results Grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: 'var(--surface-container-low)',
            borderRadius: 14,
            border: '1px dashed var(--outline-variant)'
          }}>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 44, marginBottom: 10 }}>search_off</span>
            <p className="text-title-sm text-on-surface">No pieces matched "{query}"</p>
            <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 4 }}>Try searching for generic terms like "Overshirt", "Jacket", or "Black".</p>
          </div>
        ) : (
          <div className="product-grid-responsive">
            {filtered.map(p => (
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
                  border: '1px solid rgba(187,201,207,0.05)',
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
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-container)' }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    aria-label="Wishlist"
                    onClick={e => {
                      e.stopPropagation()
                      toggleWishlist(p.id)
                    }}
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
                    <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: isWishlisted(p.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>

                <div style={{ padding: '10px 4px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>{p.category} // {p.color}</span>
                  <h3 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                  <span className="text-title-sm text-primary" style={{ fontWeight: 700 }}>{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
