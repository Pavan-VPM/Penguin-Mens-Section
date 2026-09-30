import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Structured Poplin Overshirt',
    color: 'Nocturne Black',
    price: '₹11,900',
    badge: 'Drop 01',
    badgeColor: 'var(--primary)',
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY'
  },
  {
    id: 2,
    name: 'Heavyweight Boxy Tee',
    color: 'Chalk White',
    price: '₹4,990',
    badge: 'Organic',
    badgeColor: 'var(--secondary)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEg9HtS0jCzYVX0DNa-H01P07DEd3yPNgAGhR7l8uhurLYtOmmkzrWBT-fzc9gCXaU9VuLEaE7zzyWMh59UyiGYFM7gPlBxgZcVe6SJXIuDYleaWLtY2go9B0wDdGTc2ubG_j3tC9-6Q6dg6j6aaweB2iDSlt8Dp0Q5bHXK1YWSkFPa4a9ewDrgjcTvIBfBULm9Tzb2N4ps4HytEYk3FEgY9IyiyksGJUIWB1EsPMVZOGHdXrKzZeA'
  },
  {
    id: 3,
    name: 'Relaxed Pleated Trouser',
    color: 'Slate Grey',
    price: '₹11,500',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oHKiDX7F1_YMYpKNYZoqlYF7sztvwDwydf5RcZxaf8C0CBQ6LPehQgqfUztS3CLuwQdgnTjbqiEZqLuiKunTxErcqb_wBugBzAYMpHteO9D-6M4Y51v_Qzu2CrcnhU9eciK73peSMNY4rvWqBZ1bWbZcXEUpFMy1v_eT2bOyR8OjuDhDSm7ysVzAzVD7wGTDhOA8wgWIHB3zb8OkLfYqEEhr_vSUj7Cg54RqZLtMgOdouZC6DQfl'
  },
  {
    id: 4,
    name: 'Technical Bomber Jacket',
    color: 'Washed Black',
    price: '₹18,900',
    badge: 'Limited',
    badgeColor: 'var(--primary)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF'
  },
  {
    id: 5,
    name: 'Raw Selvedge Denim',
    color: 'Deep Indigo',
    price: '₹14,900',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCflsrCJ4FMCSj_Kh2vIJ-49HTAOaEooBZXQidjqdRp-IdnUIHjg7Ea_dYD6NFC-5j8K1IQhs5ttiG2eqr6KZyXdZMQV5ZJeT4nN9ffxnJRBOd5m8m_HKGBg93ekINiMZ41mD9BmA_2Q969d9lPzvS8AXLfmUNwLQ0-fdjkML2j8M1s0X9nViJMrJbF7j7gtGm6AS8mSweO3EahcwxPFt2RiaCu7UHrqbaa5ZVhBQKg35U7CDlVkwl_'
  },
  {
    id: 6,
    name: 'Monolith Lug Derby',
    color: 'Matte Black',
    price: '₹21,500',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm'
  }
]

export default function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, addToCart } = useCart()

  const wishlistedItems = ALL_PRODUCTS.filter(p => wishlist.includes(p.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '3rem' }}>
      <div className="content-container">
        {/* Header */}
        <div style={{ padding: '1.5rem 0 1rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="text-label-caps text-primary">CURATED ARCHIVE</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>Saved Items</h1>
            <span className="text-label-caps text-primary-container" style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--surface-container-high)', whiteSpace: 'nowrap' }}>
              ({wishlistedItems.length.toString().padStart(2, '0')})
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Your private selection of architectural silhouettes and future drops.</p>
        </div>

        {wishlistedItems.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 1rem',
            textAlign: 'center',
            background: 'var(--surface-container-low)',
            borderRadius: 16,
            border: '1px dashed var(--outline-variant)'
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'var(--surface-container-highest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 32 }}>favorite_border</span>
            </div>
            <h3 className="text-headline-sm text-on-surface" style={{ marginBottom: 6 }}>Your Wishlist is Empty</h3>
            <p className="text-body-sm text-on-surface-variant" style={{ maxWidth: 300, marginBottom: 20 }}>
              Save your favorite outerwear, tailoring, and drops to track sizing and limited stock.
            </p>
            <button
              onClick={() => navigate('/collection/shirts')}
              className="btn-primary"
              style={{ padding: '10px 28px', borderRadius: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="product-grid-responsive">
            {wishlistedItems.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--surface-container-low)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  padding: 10,
                  position: 'relative',
                  border: '1px solid var(--card-border)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = 'var(--card-hover-shadow)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', background: 'var(--surface-container)', cursor: 'pointer' }}
                  onClick={() => navigate('/product/structured-poplin-overshirt')}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
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
                      background: 'var(--glass-dark-heavy)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-container)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </button>
                </div>

                <div style={{ padding: '12px 4px 4px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <p className="text-label-caps text-on-surface-variant">{p.color}</p>
                    <h3 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{p.name}</h3>
                    <p className="text-title-sm text-primary" style={{ marginTop: 2, fontWeight: 700 }}>{p.price}</p>
                  </div>

                  <button
                    onClick={() => addToCart(p, 'M')}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      background: 'var(--surface-bright)',
                      color: 'var(--on-surface)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--primary-container)'
                      e.currentTarget.style.color = 'var(--on-primary-fixed)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--surface-bright)'
                      e.currentTarget.style.color = 'var(--on-surface)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shopping_bag</span>
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
