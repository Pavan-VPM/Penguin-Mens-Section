import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FREE_SHIPPING_LIMIT = 1999

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQty, removeItem, subtotal, cartCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('PENGUIN100')
  const [couponError, setCouponError] = useState('')

  const couponDiscount = appliedCoupon ? (appliedCoupon === 'PENGUIN500' ? 500 : 100) : 0
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_LIMIT) * 100))
  const remainingForFree = Math.max(0, FREE_SHIPPING_LIMIT - subtotal)
  const finalTotal = Math.max(0, subtotal - couponDiscount)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()
    if (code === 'PENGUIN500' || code === 'FIRST100' || code === 'PENGUIN100') {
      setAppliedCoupon(code)
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code. Try PENGUIN500 or FIRST100.')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '80px 16px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)' }}>shopping_bag</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>Your Bag is Empty</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, marginTop: 6, marginBottom: 24 }}>
          Looks like you haven't added any garments to your bag yet. Explore our latest drops and bestsellers.
        </p>
        <button
          onClick={() => navigate('/collection/shirts')}
          className="btn-solid-primary"
          style={{ height: 48, padding: '0 32px', fontSize: 13 }}
        >
          Explore Collection
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 60px' }}>
      <div className="content-container">
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase' }}>
            Shopping Bag ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
          </h1>
          <button 
            onClick={() => navigate('/collection/shirts')}
            style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            + Add More Items
          </button>
        </div>

        {/* 2-Col Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 32
        }}>
          <div className="cart-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start'
          }}>
            {/* Left Column: Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Free Delivery Bar */}
              <div style={{
                padding: '14px 18px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  {remainingForFree > 0 ? (
                    <span>Add <strong>₹{remainingForFree.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Express Delivery</strong></span>
                  ) : (
                    <span style={{ color: 'var(--brand-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                      You've unlocked FREE Express Delivery!
                    </span>
                  )}
                  <span style={{ fontWeight: 800 }}>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--border-light)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent >= 100 ? 'var(--brand-green)' : 'var(--brand-accent)', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cartItems.map(item => (
                  <div
                    key={`${item.id}-${item.size}`}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: 16,
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ width: 90, height: 114, borderRadius: 4, overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', flexShrink: 0 }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase' }}>{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            title="Remove"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12 }}>
                          <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>Size: {item.size}</span>
                          <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-secondary)' }}>{item.color}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 4 }}>
                          <button
                            onClick={() => updateQty(item.id, -1, item.size)}
                            style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>remove</span>
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 800, width: 24, textAlign: 'center' }}>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1, item.size)}
                            style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                          </button>
                        </div>

                        <span style={{ fontSize: 16, fontWeight: 900 }}>
                          ₹{((item.price || 1999) * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>Order Summary</h3>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    height: 42,
                    padding: '0 12px',
                    borderRadius: 4,
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    textTransform: 'uppercase',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    height: 42,
                    padding: '0 16px',
                    backgroundColor: 'var(--brand-primary)',
                    color: 'var(--text-inverse)',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <div style={{ fontSize: 11, color: 'var(--brand-accent)' }}>{couponError}</div>
              )}
              {appliedCoupon && (
                <div style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>✓ Coupon {appliedCoupon} Applied</span>
                  <button onClick={() => setAppliedCoupon(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, textDecoration: 'underline', cursor: 'pointer' }}>Remove</button>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-light)', paddingTop: 16, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-green)' }}>
                    <span>Coupon Discount</span>
                    <span style={{ fontWeight: 700 }}>-₹{couponDiscount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Charges</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-green)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 12, fontSize: 16, fontWeight: 900 }}>
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-solid-accent"
                style={{ width: '100%', height: 50, fontSize: 14, fontWeight: 900, marginTop: 8 }}
              >
                PROCEED TO CHECKOUT • ₹{finalTotal.toLocaleString('en-IN')}
              </button>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span>
                <span>100% Safe & Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
