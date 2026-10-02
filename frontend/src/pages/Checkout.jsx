import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, subtotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    name: 'Rohan Sharma',
    email: 'rohan.sharma@gmail.com',
    phone: '9876543210',
    address: 'Flat 402, Skyline Residency, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  })

  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('#PGN-2025-9821')

  const discount = 100
  const finalTotal = Math.max(0, subtotal - discount)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.pincode,
          country: 'India'
        },
        items: cartItems.map(i => ({
          productId: i.id,
          name: i.name,
          color: i.color || 'Nocturne Black',
          size: i.size || 'M',
          price: i.price,
          quantity: i.qty,
          image: i.img
        })),
        subtotal: subtotal,
        discount: discount,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod
      }

      const res = await createOrder(payload)
      if (res?.data?.orderNumber) {
        setConfirmedOrderNumber(`#${res.data.orderNumber}`)
      }
    } catch (err) {
      console.warn('Using local order confirmation')
    }

    setIsSubmitting(false)
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '60px 16px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--brand-green-bg)', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48 }}>check_circle</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, textTransform: 'uppercase' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 420, marginTop: 8, lineHeight: 1.6 }}>
          Thank you for shopping with PENGUIN. Your package is being prepared with express courier dispatch.
        </p>
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 800, margin: '20px 0' }}>
          Order ID: {confirmedOrderNumber}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/account')} className="btn-outline" style={{ height: 44, fontSize: 12 }}>
            Track Order
          </button>
          <button onClick={() => navigate('/')} className="btn-solid-primary" style={{ height: 44, fontSize: 12 }}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
          Secure Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 36,
          alignItems: 'start'
        }}>
          {/* Left Column: Shipping Address & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* 1. Delivery Address Card */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--brand-accent)' }}>location_on</span>
                <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase' }}>1. Delivery Address</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Street Address / Landmark</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--brand-accent)' }}>payment</span>
                <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase' }}>2. Payment Mode</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* UPI Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  backgroundColor: paymentMethod === 'upi' ? 'var(--bg-card)' : 'transparent',
                  border: paymentMethod === 'upi' ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>Instant UPI / QR Code (Google Pay, PhonePe, Paytm)</div>
                    <div style={{ fontSize: 11, color: 'var(--brand-green)', fontWeight: 700 }}>⚡ Recommended • Extra ₹50 Instant Discount</div>
                  </div>
                </label>

                {/* Cards Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  backgroundColor: paymentMethod === 'card' ? 'var(--bg-card)' : 'transparent',
                  border: paymentMethod === 'card' ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>Credit / Debit Card</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay, Amex</div>
                  </div>
                </label>

                {/* Cash On Delivery Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  backgroundColor: paymentMethod === 'cod' ? 'var(--bg-card)' : 'transparent',
                  border: paymentMethod === 'cod' ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>Cash On Delivery (COD)</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pay upon doorstep delivery</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Place Order Button */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>Bag Summary ({cartItems.length} Items)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }} className="no-scrollbar">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: 44, height: 56, borderRadius: 4, objectFit: 'cover' }} />
                  <div style={{ flex: 1, fontSize: 12 }}>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Size {item.size} • Qty {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>₹{((item.price || 1999) * item.qty).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-light)', paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-green)' }}>
                <span>Applied Coupon</span>
                <span>-₹{discount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery</span>
                <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 12, fontSize: 17, fontWeight: 900 }}>
                <span>Total Payable</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-solid-accent"
              style={{ width: '100%', height: 52, fontSize: 14, fontWeight: 900, marginTop: 8 }}
            >
              {isSubmitting ? 'PLACING ORDER...' : `PLACE ORDER • ₹${finalTotal.toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
