import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { initiatePhonePeCheckout } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { customer, isLoggedIn } = useCustomerAuth();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });

  useEffect(() => {
    if (customer) {
      const defaultAddr = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || defaultAddr?.phone || '',
        address: defaultAddr?.line1 ? `${defaultAddr.line1}${defaultAddr.line2 ? `, ${defaultAddr.line2}` : ''}` : '',
        city: defaultAddr?.city || '',
        state: defaultAddr?.state || 'Karnataka',
        pincode: defaultAddr?.pincode || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'Karnataka',
        pincode: '',
      });
    }
  }, [customer]);

  const [paymentMethod, setPaymentMethod] = useState('phonepe'); // 'phonepe' | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shippingFee = subtotal >= 1999 ? 0 : 99;
  const discount = subtotal > 1500 ? 100 : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.pincode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          color: item.color || 'Nocturne Black',
          size: item.size || 'M',
          price: item.price,
          quantity: item.qty || 1,
        })),
        paymentMethod: paymentMethod === 'cod' ? 'cod' : 'phonepe',
      };

      const res = await initiatePhonePeCheckout(payload);

      if (res?.isCod) {
        // Cash on delivery success
        clearCart();
        navigate(`/order/status?txn=${res.orderNumber || res.orderId}`);
        return;
      }

      if (res?.redirectUrl) {
        // Redirect to PhonePe payment page
        window.location.href = res.redirectUrl;
      } else {
        setError(res?.message || 'Could not initiate payment. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed. Please check details or select COD.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '80px 16px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>Your Bag is Empty</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Select items from our collection before proceeding to checkout.</p>
        <button onClick={() => navigate('/collection')} className="btn-solid-accent" style={{ height: 46, padding: '0 28px', fontSize: 13, fontWeight: 800 }}>
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: 16, marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Secure Checkout
          </h1>
          {!isLoggedIn && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                Log In for faster checkout
              </button>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 6,
            color: '#ef4444',
            fontSize: 13,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 36,
          alignItems: 'start',
        }}>
          {/* Left Column: Shipping Address & Payment Gateway Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* 1. Delivery Address Card */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--brand-accent)' }}>location_on</span>
                <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>1. Delivery Address</h3>
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
                    placeholder="House/Apartment number, street name"
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
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
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

            {/* 2. Payment Gateway Mode */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--brand-accent)' }}>shield</span>
                <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>2. Select Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* PhonePe Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px',
                  backgroundColor: paymentMethod === 'phonepe' ? 'var(--bg-card)' : 'transparent',
                  border: paymentMethod === 'phonepe' ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="phonepe"
                    checked={paymentMethod === 'phonepe'}
                    onChange={() => setPaymentMethod('phonepe')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 900 }}>PhonePe Payment Gateway</span>
                      <span style={{ fontSize: 10, padding: '2px 6px', backgroundColor: 'var(--brand-green-bg)', color: 'var(--brand-green)', borderRadius: 3, fontWeight: 800 }}>FAST & SECURE</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Pay via UPI (GPay, PhonePe, Paytm), Credit / Debit Cards, NetBanking
                    </div>
                  </div>
                </label>

                {/* Cash On Delivery Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px',
                  backgroundColor: paymentMethod === 'cod' ? 'var(--bg-card)' : 'transparent',
                  border: paymentMethod === 'cod' ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900 }}>Cash On Delivery (COD)</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Pay with cash or QR code upon doorstep courier delivery</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Checkout CTA */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 24, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Bag Summary ({cartItems.length} Items)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto' }} className="no-scrollbar">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: 44, height: 56, borderRadius: 4, objectFit: 'cover' }} />
                  <div style={{ flex: 1, fontSize: 12 }}>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Size {item.size} • Qty {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>₹{((item.price || 1999) * (item.qty || 1)).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-light)', paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-green)' }}>
                  <span>Complimentary Atelier Voucher</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--brand-green)' }}>FREE</strong> : `₹${shippingFee}`}</span>
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
              style={{
                width: '100%',
                height: 52,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting
                ? paymentMethod === 'phonepe' ? 'Redirecting to PhonePe...' : 'Placing Order...'
                : paymentMethod === 'phonepe'
                  ? `Pay with PhonePe • ₹${finalTotal.toLocaleString('en-IN')}`
                  : `Confirm Order • ₹${finalTotal.toLocaleString('en-IN')}`}
            </button>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
              🔒 256-Bit Encrypted Secure Checkout
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
