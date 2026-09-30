import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems: items, updateQty, removeItem, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(true)

  const discount = promoApplied && items.length > 0 ? 2500 : 0
  const taxable = Math.max(0, subtotal - discount)
  const tax = taxable * 0.12
  const total = items.length > 0 ? taxable + tax : 0

  if (items.length === 0) {
    return (
      <div className="content-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 36 }}>shopping_bag</span>
        </div>
        <h2 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', marginBottom: 8 }}>Your Bag is Empty</h2>
        <p className="text-body-sm text-on-surface-variant" style={{ maxWidth: 320, marginBottom: 24 }}>Explore modern outerwear, essential tops, and winter drop capsules.</p>
        <button
          onClick={() => navigate('/collection/shirts')}
          className="btn-primary"
          style={{ padding: '12px 32px', borderRadius: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}
        >
          Explore Collection
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 140 }}>
      <div className="content-container">
        {/* Title & Collection Hierarchy */}
        <div style={{ padding: '1.25rem 0 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="text-label-caps text-primary" style={{ letterSpacing: '0.12em' }}>FW25 Archive</span>
            <span className="text-label-caps text-primary-container" style={{ padding: '2px 10px', borderRadius: 999, background: 'var(--surface-container-high)', fontWeight: 700, fontSize: 10 }}>
              {items.length} {items.length === 1 ? 'Garment' : 'Garments'}
            </span>
          </div>
          <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            Atelier Bag
          </h1>
        </div>

        {/* Desktop 2-Column Split / Mobile Stack */}
        <div className="desktop-split-2col">
          {/* Left Column: Items & Shipping */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Shipping Banner */}
            <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '1rem', border: '1px solid var(--ticker-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-container)' }}>bolt</span>
                  <span className="text-label-md text-on-surface">Complimentary Express Courier</span>
                </div>
                <span className="text-label-caps text-primary-container" style={{ fontWeight: 700 }}>Unlocked</span>
              </div>
              <p className="text-body-sm text-on-surface-variant" style={{ marginBottom: 10 }}>Carbon-neutral courier dispatched within 24 hours on all orders over ₹9,999.</p>
              <div style={{ width: '100%', height: 6, background: 'var(--surface-container-highest)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', background: 'var(--primary-container)', borderRadius: 999 }} />
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <article key={`${item.id}-${item.size}`} style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1.25rem', position: 'relative', border: '1px solid var(--card-border)' }}>
                  <div style={{ width: 100, height: 130, borderRadius: 8, overflow: 'hidden', background: 'var(--surface-container-high)', flexShrink: 0, position: 'relative' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className="text-label-caps" style={{ position: 'absolute', top: 6, left: 6, padding: '2px 6px', borderRadius: 4, background: 'var(--product-card-badge-bg)', color: 'var(--primary)', border: '1px solid var(--card-border)', fontSize: 9, backdropFilter: 'blur(8px)' }}>{item.badge}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <h2 className="text-title-sm text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h2>
                        <button onClick={() => removeItem(item.id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', padding: 4, flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <span className="text-label-caps text-on-surface-variant" style={{ background: 'var(--surface-container)', padding: '2px 8px', borderRadius: 4 }}>{item.color}</span>
                        <span className="text-label-caps text-on-surface-variant" style={{ background: 'var(--surface-container)', padding: '2px 8px', borderRadius: 4 }}>Size {item.size}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, background: 'var(--surface-container)', padding: 2 }}>
                        <button onClick={() => updateQty(item.id, -1, item.size)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                        </button>
                        <span className="text-label-md text-on-surface" style={{ width: 28, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1, item.size)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                        </button>
                      </div>
                      <span className="text-headline-md text-on-surface" style={{ fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Atelier Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
              {[
                { icon: 'verified', title: 'Authentic Goods', desc: 'Direct atelier provenance verification' },
                { icon: 'sync', title: 'Complimentary Returns', desc: '30 days worldwide doorstep pickup' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ background: 'var(--surface-container)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12, border: '1px solid var(--card-border)' }}>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <h3 className="text-label-caps text-on-surface">{title}</h3>
                    <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 11, marginTop: 2, lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky on Desktop) */}
          <div style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Promo Code Input */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1rem', border: '1px solid var(--ticker-border)' }}>
              <span className="text-label-caps text-on-surface-variant" style={{ display: 'block', marginBottom: 8 }}>Privilege Code</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="ARCHIVE25"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ flex: 1, height: 42, background: 'var(--surface-container)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '0 12px', color: 'var(--on-surface)', fontSize: 12, outline: 'none' }}
                />
                <button
                  onClick={() => setPromoApplied(true)}
                  style={{ height: 42, padding: '0 16px', borderRadius: 8, background: 'var(--surface-bright)', color: 'var(--on-surface)', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--primary-container)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                  <span className="text-label-caps" style={{ fontSize: 10 }}>VIP ATELIER ACCESS APPLIED (-₹2,500)</span>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--ticker-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 className="text-label-caps text-on-surface-variant" style={{ letterSpacing: '0.1em' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body-sm text-on-surface-variant">Subtotal</span>
                <span className="text-label-md text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-container)' }}>
                  <span className="text-body-sm">VIP Atelier Privilege</span>
                  <span className="text-label-md">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body-sm text-on-surface-variant">Estimated GST & Duties (12%)</span>
                <span className="text-label-md text-on-surface">₹{Math.round(tax).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body-sm text-on-surface-variant">Shipping</span>
                <span className="text-label-md text-primary">COMPLIMENTARY</span>
              </div>
              <div style={{ height: 1, background: 'var(--surface-container-highest)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span className="text-headline-md text-on-surface" style={{ fontWeight: 700 }}>Total</span>
                  <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 11 }}>INR inclusive of GST</p>
                </div>
                <span className="text-headline-lg text-primary-container" style={{ fontWeight: 800 }}>₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>

              {/* Desktop Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="desktop-only"
                style={{
                  width: '100%',
                  height: 52,
                  marginTop: 12,
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-fixed)',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow: 'var(--card-hover-shadow)',
                  transition: 'opacity 0.15s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
                <span>Proceed to Checkout</span>
              </button>
            </div>

            {/* Klarna / Installment Pill */}
            <div style={{ background: 'var(--surface-container)', borderRadius: 8, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-container)' }}>payments</span>
              <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 12, lineHeight: 1.4 }}>
                Or 3 interest-free installments of <strong style={{ color: 'var(--on-surface)' }}>₹{Math.round(total / 3).toLocaleString('en-IN')}</strong> with <strong style={{ color: 'var(--on-surface)' }}>Simpl / UPI</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar (Hidden on desktop) */}
      <div className="hide-on-desktop-bar" style={{
        position: 'fixed',
        bottom: 64,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'var(--glass-dark-nav)',
        backdropFilter: 'blur(20px)',
        padding: '12px 1rem',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
        borderTop: '1px solid var(--brand-card-border)'
      }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', height: 52, background: 'var(--primary-container)', color: 'var(--on-primary-fixed)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', boxShadow: '0 0 16px var(--glow-primary)', transition: 'all 0.15s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
              <span className="text-title-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proceed to Checkout</span>
            </div>
            <span className="text-headline-md">₹{Math.round(total).toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
