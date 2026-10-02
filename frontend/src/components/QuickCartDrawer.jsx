import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FREE_SHIPPING_THRESHOLD = 1999

export default function QuickCartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { cartItems, updateQty, removeItem, subtotal, cartCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('PENGUIN100')

  if (!isOpen) return null

  const couponDiscount = appliedCoupon ? 100 : 0
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const finalTotal = Math.max(0, subtotal - couponDiscount)

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (couponCode.toUpperCase() === 'PENGUIN500' || couponCode.toUpperCase() === 'FIRST100') {
      setAppliedCoupon(couponCode.toUpperCase())
      setCouponCode('')
    }
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      
      <div className="drawer-panel-right">
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--brand-accent)' }}>
              shopping_bag
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Your Bag ({cartCount})
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
            {remainingForFree > 0 ? (
              <span>Add <strong style={{ color: 'var(--brand-accent)' }}>₹{remainingForFree.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong></span>
            ) : (
              <span style={{ color: 'var(--brand-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                You unlocked FREE Express Delivery!
              </span>
            )}
            <span style={{ fontWeight: 800, fontSize: 11 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: 'var(--border-light)', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent >= 100 ? 'var(--brand-green)' : 'var(--brand-accent)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }} className="no-scrollbar">
          {cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 0', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--text-muted)' }}>shopping_cart</span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 240 }}>Explore trending shirts, oversized tees, and winter outerwear.</p>
              <button
                onClick={() => { onClose(); navigate('/collection/shirts'); }}
                className="btn-solid-primary"
                style={{ height: 42, fontSize: 12, marginTop: 8 }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={`${item.id}-${item.size}-${index}`}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: 12,
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  position: 'relative'
                }}
              >
                {/* Product Thumbnail */}
                <div style={{ width: 72, height: 92, borderRadius: 4, overflow: 'hidden', backgroundColor: 'var(--bg-card)', flexShrink: 0 }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                        title="Remove"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-light)' }}>
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 4, backgroundColor: 'var(--bg-card)' }}>
                      <button 
                        onClick={() => updateQty(item.id, -1, item.size)}
                        style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>remove</span>
                      </button>
                      <span style={{ fontSize: 12, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1, item.size)}
                        style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                      </button>
                    </div>

                    <span style={{ fontSize: 14, fontWeight: 800 }}>
                      ₹{((item.price || 1999) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer (Summary & CTAs) */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            {/* Promo Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '8px 12px', backgroundColor: 'var(--brand-green-bg)', borderRadius: 6, color: 'var(--brand-green)', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_offer</span>
                <span>Code PENGUIN100 Applied</span>
              </div>
              <span>-₹100</span>
            </div>

            {/* Price Line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Total</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>₹{finalTotal.toLocaleString('en-IN')}</div>
              </div>
              <button 
                onClick={() => { onClose(); navigate('/cart'); }}
                style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontSize: 12, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
              >
                View Full Bag
              </button>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="btn-solid-accent"
              style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 900 }}
            >
              PROCEED TO CHECKOUT • ₹{finalTotal.toLocaleString('en-IN')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
