import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'

const STEPS = ['01 Address', '02 Delivery', '03 Payment']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems: items, subtotal, clearCart } = useCart()
  const [activeStep] = useState(2) // Payment step active
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('#PGN-FW25-8842')
  const [bagOpen, setBagOpen] = useState(true)

  const discount = items.length > 0 ? 2500 : 0
  const taxable = Math.max(0, subtotal - discount)
  const tax = taxable * 0.12
  const total = items.length > 0 ? taxable + tax : 0

  const handleConfirmOrder = async () => {
    try {
      const orderPayload = {
        customer: {
          name: 'Alexandre Mercer',
          email: 'alex.mercer@atelier.com',
          phone: '+91 98201 92834',
          address: 'Penthouse 4B, Cuffe Parade',
          city: 'Mumbai',
          postalCode: '400005',
          country: 'India',
        },
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          color: i.color || 'Nocturne Black',
          size: i.size || 'M',
          price: typeof i.price === 'number' ? i.price : Number(String(i.price).replace(/[^\d.]/g, '')) || 9900,
          quantity: i.qty || 1,
          image: i.img,
        })),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        totalAmount: total,
        paymentMethod: paymentMethod,
      }

      const res = await createOrder(orderPayload)
      if (res?.data?.orderNumber) {
        setConfirmedOrderNumber(`#${res.data.orderNumber}`)
      }
    } catch (e) {
      console.warn('Using local order confirmation')
    }

    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="content-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--glow-primary)', border: '2px solid var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 32px var(--glow-primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary-container)' }}>check</span>
        </div>
        <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', marginBottom: 8 }}>Order Confirmed</h1>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: 24, maxWidth: 360, lineHeight: 1.5 }}>
          Your bespoke atelier package is being prepared in our Porto facility. DHL Express tracking will arrive via email shortly.
        </p>
        <span className="text-label-caps text-primary" style={{ background: 'var(--surface-container)', padding: '6px 16px', borderRadius: 999, marginBottom: 24, letterSpacing: '0.1em' }}>
          {confirmedOrderNumber}
        </span>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
          style={{ padding: '14px 36px', borderRadius: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: 140 }}>
      <div className="content-container">
        {/* Step Progress Bar */}
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', margin: '1rem 0 1.5rem', position: 'relative', border: '1px solid var(--ticker-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: 24, right: 24, top: 16, height: 2, background: 'var(--surface-variant)', zIndex: 0 }} />
            <div style={{ position: 'absolute', left: 24, right: 24, top: 16, height: 2, background: 'var(--primary-container)', zIndex: 0, boxShadow: '0 0 8px var(--glow-primary)' }} />
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i === activeStep ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === activeStep ? '0 0 16px var(--glow-primary)' : i < activeStep ? '0 0 12px var(--glow-primary)' : 'none',
                  color: i === activeStep ? 'var(--on-primary-fixed)' : 'var(--primary-container)',
                }}>
                  {i < activeStep
                    ? <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                    : <span className="text-label-md" style={{ fontWeight: 700 }}>0{i+1}</span>
                  }
                </div>
                <span className="text-label-caps" style={{ color: i === activeStep ? 'var(--primary)' : 'var(--on-surface-variant)', fontWeight: i === activeStep ? 700 : 600, fontSize: i === activeStep ? 11 : 10 }}>
                  {step.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Desktop Split / Mobile Stack */}
        <div className="desktop-split-2col">
          {/* Left Column: Address, Courier, Payment Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Delivery Address */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--ticker-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="text-label-caps" style={{ background: 'var(--surface-container-highest)', padding: '3px 10px', borderRadius: 999, color: 'var(--primary)' }}>Default Shipping</span>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-container)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'var(--primary)', fontSize: 11 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                  <span className="text-label-caps">Change</span>
                </button>
              </div>
              <h2 className="text-headline-md text-on-surface">Lucas Vance</h2>
              <p className="text-body-md text-on-surface-variant" style={{ marginTop: 4, lineHeight: 1.5 }}>
                Apartment 14B, 452 West Broadway<br />
                SoHo, New York, NY 10012, United States
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--outline)' }}>call</span>
                <span className="text-body-sm">+1 (555) 234-8901</span>
                <span>•</span>
                <span className="text-body-sm">lucas.vance@studio.arch</span>
              </div>
            </div>

            {/* Courier */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--ticker-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary-container)' }}>bolt</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="text-label-md text-on-surface" style={{ fontWeight: 600 }}>Express Carbon Courier</span>
                    <span className="text-label-caps text-primary" style={{ background: 'var(--surface-container-highest)', padding: '2px 6px', borderRadius: 4, fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 11 }}>eco</span> Neutral
                    </span>
                  </div>
                  <span className="text-body-sm text-on-surface-variant">Guaranteed delivery within 24h via DHL Express</span>
                </div>
              </div>
              <span className="text-label-caps text-primary-container" style={{ fontWeight: 700 }}>FREE</span>
            </div>

            {/* Payment Methods */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Method</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--on-surface-variant)' }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>verified_user</span>
                  <span className="text-label-caps" style={{ fontSize: 10 }}>256-Bit SSL</span>
                </div>
              </div>

              {[
                { key: 'upi', icon: 'qr_code_scanner', label: 'UPI / Instant Pay', sub: 'Google Pay, PhonePe, Paytm & CRED', badge: 'Fastest' },
                { key: 'card', icon: 'credit_card', label: 'Credit / Debit Card', sub: 'Ending in •••• 8842 (Lucas Vance)' },
                { key: 'klarna', icon: 'payments', label: 'Split in 3 (Simpl / Zest)', sub: `3 interest-free installments of ₹${Math.round(total / 3).toLocaleString('en-IN')}` },
              ].map(m => (
                <div
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key)}
                  style={{
                    background: paymentMethod === m.key ? 'var(--surface-container)' : 'var(--surface-container-low)',
                    borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer',
                    border: paymentMethod === m.key ? '1px solid var(--primary-container)' : '1px solid var(--ticker-border)',
                    boxShadow: paymentMethod === m.key ? '0 0 16px var(--glow-primary)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === m.key ? 'var(--primary-container)' : 'var(--on-surface-variant)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{m.icon}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="text-label-md text-on-surface" style={{ fontWeight: 600 }}>{m.label}</span>
                          {m.badge && <span className="text-label-caps text-primary" style={{ background: 'var(--glow-primary)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{m.badge}</span>}
                        </div>
                        <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 2 }}>{m.sub}</p>
                      </div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: paymentMethod === m.key ? '6px solid var(--primary-container)' : '2px solid var(--outline-variant)',
                      background: paymentMethod === m.key ? 'var(--on-primary-fixed)' : 'transparent',
                      flexShrink: 0
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Review & Financial Summary (Sticky on Desktop) */}
          <div style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Bag Summary Card */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--ticker-border)' }}>
              <button onClick={() => setBagOpen(!bagOpen)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', marginBottom: bagOpen ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="text-headline-md" style={{ textTransform: 'uppercase' }}>Bag Summary</span>
                  <span className="text-label-caps text-on-surface-variant" style={{ background: 'var(--surface-container-high)', padding: '2px 8px', borderRadius: 999 }}>{items.length} {items.length === 1 ? 'Garment' : 'Garments'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}>
                  <span className="text-label-caps">View</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, transform: bagOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>expand_more</span>
                </div>
              </button>
              {bagOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 12, background: 'var(--surface-container)', borderRadius: 8, padding: 10 }}>
                      <img src={item.img} alt={item.name} style={{ width: 56, height: 68, objectFit: 'cover', borderRadius: 6, background: 'var(--surface-container-highest)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 className="text-label-md text-on-surface" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                        <p className="text-body-sm text-on-surface-variant">{item.color} • Size {item.size}</p>
                        <span className="text-label-caps text-on-surface" style={{ fontWeight: 700, display: 'block', marginTop: 4 }}>₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : item.price}</span>
                      </div>
                      <span className="text-label-caps text-on-surface-variant" style={{ background: 'var(--surface-container-high)', padding: '4px 8px', borderRadius: 6, fontSize: 11, alignSelf: 'flex-start', flexShrink: 0 }}>Qty {item.qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 12, padding: '1.25rem', border: '1px solid var(--ticker-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Financial Summary</h3>
                <span className="text-label-caps text-on-surface-variant">INR NET</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { l: `Subtotal (${items.length} items)`, v: `₹${subtotal.toLocaleString('en-IN')}`, vc: 'var(--on-surface)' },
                  { l: 'VIP Atelier Privilege', v: discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0', vc: 'var(--primary-container)' },
                  { l: 'Express Carbon Delivery', v: 'FREE', vc: 'var(--primary-container)' },
                  { l: 'Estimated GST & Duties (12%)', v: `₹${Math.round(tax).toLocaleString('en-IN')}`, vc: 'var(--on-surface)' },
                ].map(({ l, v, vc }) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-body-md text-on-surface-variant">{l}</span>
                    <span className="text-label-md" style={{ color: vc, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: 'var(--surface-container-highest)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span className="text-headline-md text-on-surface" style={{ fontWeight: 700 }}>Total Amount</span>
                    <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 11 }}>All local GST and duties included</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="text-headline-lg text-primary-container" style={{ fontWeight: 800 }}>₹{Math.round(total).toLocaleString('en-IN')}</span>
                    <span className="text-label-caps text-on-surface" style={{ fontSize: 10, display: 'block' }}>INR Net</span>
                  </div>
                </div>
              </div>

              {/* Desktop Confirm Button */}
              <button
                onClick={handleConfirmOrder}
                className="desktop-only"
                style={{
                  width: '100%',
                  height: 52,
                  marginTop: 16,
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-fixed)',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  boxShadow: '0 0 24px var(--glow-primary)',
                  transition: 'opacity 0.15s'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
                <span>Confirm & Pay — ₹{Math.round(total).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Confirm Bar (Hidden on desktop) */}
      <div className="hide-on-desktop-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'var(--glass-dark-nav)',
        backdropFilter: 'blur(20px)',
        padding: '1rem',
        boxShadow: 'var(--card-hover-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderTop: '1px solid var(--brand-card-border)'
      }}>
        <div style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}>
          <button
            onClick={handleConfirmOrder}
            style={{ width: '100%', height: 50, background: 'var(--primary-container)', color: 'var(--on-primary-fixed)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 0 20px var(--glow-primary)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span>
              <span>Confirm & Pay</span>
            </div>
            <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
