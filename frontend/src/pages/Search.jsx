import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

const POPULAR_SEARCHES = ['Poplin Shirts', 'Oversized Tees', 'Bomber Jackets', 'Pleated Trousers', 'Mohair Knit', 'Cargo Pants']

const FALLBACK_SEARCH_ITEMS = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    originalPrice: 3499,
    badge: '43% OFF',
    rating: '4.9',
    reviewsCount: 312,
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'
    ]
  },
  {
    id: 2,
    name: 'Heavyweight Boxy Organic Tee',
    category: 'Tees',
    color: 'Chalk White',
    price: 1299,
    originalPrice: 2299,
    badge: 'BESTSELLER',
    rating: '4.8',
    reviewsCount: 428,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEg9HtS0jCzYVX0DNa-H01P07DEd3yPNgAGhR7l8uhurLYtOmmkzrWBT-fzc9gCXaU9VuLEaE7zzyWMh59UyiGYFM7gPlBxgZcVe6SJXIuDYleaWLtY2go9B0wDdGTc2ubG_j3tC9-6Q6dg6j6aaweB2iDSlt8Dp0Q5bHXK1YWSkFPa4a9ewDrgjcTvIBfBULm9Tzb2N4ps4HytEYk3FEgY9IyiyksGJUIWB1EsPMVZOGHdXrKzZeA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDw6PlIfD7vb_n4u5I_wD4HhFdTcV-UVOCENxio76QfVtj4TtfRRyePIpQIcJigP4x9Wc7TemI-nMXXz6Pt7XngwmTtRuBYdxnhGmoGboojO1aB4qDaF8UBDAqL-EKhubCIg19kp_1Kvw65x8WO4Rzftn8xvR5e0BIIwaGyqj97L00TABLrHE0n7YezXGVCKzCQSEdTRZNm10F1GUVNiBmvJvBz3q8wCtZpserBa9hHWrT6REccVN_4'
    ]
  },
  {
    id: 3,
    name: 'Relaxed Pleated Wide-Leg Trouser',
    category: 'Tailoring',
    color: 'Slate Grey',
    price: 2499,
    originalPrice: 4299,
    badge: '42% OFF',
    rating: '4.9',
    reviewsCount: 184,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_'
    ]
  },
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
  }
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [allProducts, setAllProducts] = useState(FALLBACK_SEARCH_ITEMS)

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
            reviewsCount: p.reviewsCount || 120,
            images: p.images && p.images.length > 0 ? p.images : [p.img],
          }))
          setAllProducts(formatted)
        }
      } catch (err) {
        console.warn('Using fallback search catalog')
      }
    }
    loadData()
  }, [])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return allProducts
    const q = query.toLowerCase()
    return allProducts.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.color && item.color.toLowerCase().includes(q))
    )
  }, [query, allProducts])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container">
        {/* Search Input Box */}
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto 24px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 16, top: 14, fontSize: 22, color: 'var(--text-muted)' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search shirts, jackets, oversized tees, trousers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              height: 50,
              padding: '0 44px 0 50px',
              borderRadius: 999,
              border: '1.5px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: 14,
                top: 14,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          )}
        </div>

        {/* Popular Searches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Popular:
          </span>
          {POPULAR_SEARCHES.map(term => (
            <button
              key={term}
              onClick={() => setQuery(term.replace(' Shirts', '').replace(' Tees', ''))}
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-light)', paddingBottom: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>
            {query ? `Search Results for "${query}"` : 'All Menswear Catalog'}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filteredResults.length} Garments
          </span>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)' }}>search_off</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 12 }}>No matches found for "{query}"</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Check your spelling or search for broader categories like "Shirts" or "Jackets".</p>
          </div>
        ) : (
          <div className="product-grid-home">
            {filteredResults.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
