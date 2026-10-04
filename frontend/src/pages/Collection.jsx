import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Shirts', 'Tees', 'Jackets', 'Formals', 'Tailoring', 'Jeans', 'Footwear', 'Accessories']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Customer Rating', value: 'rating' },
]

const FALLBACK_COLLECTION = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 1999,
    originalPrice: 3499,
    badge: 'NEW',
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
    badge: 'TAILORED',
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
  },
  {
    id: 5,
    name: 'Raw Selvedge Straight-Leg Denim',
    category: 'Jeans',
    color: 'Deep Indigo',
    price: 2799,
    originalPrice: 4599,
    badge: 'SELVEDGE',
    rating: '4.8',
    reviewsCount: 167,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl'
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
  },
  {
    id: 7,
    name: 'Structured Oxford Button Down',
    category: 'Shirts',
    color: 'Slate White',
    price: 1899,
    originalPrice: 3299,
    badge: 'ESSENTIAL',
    rating: '4.8',
    reviewsCount: 219,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR9S4fgMwiQA96pWo4DRRnR4yoqrORLPBRtU1exX8jFx4Mf2lu4FZb0To4JX24dcoEh-GbRf-FaR0s39tPIiS-Wq0OsNB6EjKqSxhQGXr6jGjGplvjbLYbTqyJxLhFFwdTcx8VHcX7jpv4b6tEmXM8HrtLl5wfKDkseOPqLDMKvkLxq7qflNN9MqLaF67Kxj_tJ08uRdK6jSUxDaYDhtHlAB-7Gx5TOqStb4NoD1G01OK9YFRlnEY',
      'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY'
    ]
  },
  {
    id: 8,
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
  }
]

export default function CollectionPage() {
  const navigate = useNavigate()
  const { category: urlCategory } = useParams()
  const [searchParams] = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [products, setProducts] = useState(FALLBACK_COLLECTION)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Sync category from route parameter (e.g., /collection/shirts, /collection/jackets, /collection/formals)
  useEffect(() => {
    const rawCat = urlCategory || searchParams.get('category')
    if (rawCat) {
      const found = CATEGORIES.find(c => c.toLowerCase() === rawCat.toLowerCase())
      if (found) {
        setSelectedCategory(found)
      } else if (rawCat.toLowerCase().includes('shirt')) {
        setSelectedCategory('Shirts')
      } else if (rawCat.toLowerCase().includes('tee')) {
        setSelectedCategory('Tees')
      } else if (rawCat.toLowerCase().includes('jacket')) {
        setSelectedCategory('Jackets')
      } else if (rawCat.toLowerCase().includes('formal')) {
        setSelectedCategory('Formals')
      }
    } else {
      setSelectedCategory('All')
    }
  }, [urlCategory, searchParams])

  useEffect(() => {
    async function loadProducts() {
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
        console.warn('Using fallback collection')
      }
    }
    loadProducts()
  }, [])

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let list = [...products]

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    }

    return list
  }, [products, selectedCategory, sortBy])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 60 }}>
      {/* ─── Breadcrumb & Banner Header ────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', padding: '24px 0' }}>
        <div className="content-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Home</button>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Men's Collection</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {selectedCategory === 'All' ? "All Men's Apparel" : `${selectedCategory} Collection`}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Explore {filteredAndSorted.length} premium silhouettes designed for contemporary fit and effortless luxury.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sticky Filter & Sort Controls ─────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top: 'var(--header-height-desktop)',
        zIndex: 30,
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-light)',
        padding: '12px 0'
      }}>
        <div className="content-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Category Chips Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: selectedCategory === cat ? '1px solid var(--brand-primary)' : '1px solid var(--border-light)',
                  backgroundColor: selectedCategory === cat ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? 'var(--text-inverse)' : 'var(--text-primary)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }} className="desktop-only">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: 12,
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Main Products Grid ────────────────────────────────────────────── */}
      <div className="content-container" style={{ marginTop: 24 }}>
        {filteredAndSorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)' }}>search_off</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 12 }}>No Garments Found</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Try clearing active filters to see our full catalog.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedSize('All'); }}
              className="btn-solid-primary"
              style={{ marginTop: 16, height: 40, fontSize: 12 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid-home">
            {filteredAndSorted.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
