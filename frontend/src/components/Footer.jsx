import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import brandLogoLight from '../assets/logo-light.png'

export default function Footer() {
  const navigate = useNavigate()
  const brandLogo = brandLogoLight

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="app-footer">
      <div className="content-container">
        {/* Main Grid: Brand & Newsletter + Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
          paddingBottom: 40,
          borderBottom: '1px solid var(--border-light)'
        }}>
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1', maxWidth: 300 }}>
            <img
              src={brandLogo}
              alt="PENGUIN"
              style={{ height: 42, width: 'auto', objectFit: 'contain', marginBottom: 12 }}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Contemporary menswear crafted with modern silhouettes and precision tailoring.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Shop Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              <li><button onClick={() => navigate('/collection')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>New Arrivals</button></li>
              <li><button onClick={() => navigate('/collection/shirts')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Luxe Shirts</button></li>
              <li><button onClick={() => navigate('/collection/tees')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Oversized T-Shirts</button></li>
              <li><button onClick={() => navigate('/collection/jackets')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Jackets & Outerwear</button></li>
              <li><button onClick={() => navigate('/collection/formals')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Formalwear & Suits</button></li>
              <li><button onClick={() => navigate('/collection')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>All Collections</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              <li><button onClick={() => navigate('/track')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Track Your Order</button></li>
              <li><button onClick={() => navigate('/account')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Returns & Exchanges</button></li>
              <li><button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Shipping Policy</button></li>
              <li><button onClick={() => navigate('/wishlist')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Wishlist</button></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div style={{ maxWidth: 320 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Join The Penguin Club
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Get instant updates on secret flash drops and receive <strong>₹200 OFF</strong> on your first order.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    height: 42,
                    padding: '0 14px',
                    borderRadius: 4,
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-solid-primary"
                  style={{ height: 42, padding: '0 16px', fontSize: 12 }}
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <div style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700, marginTop: 4 }}>
                  🎉 Welcome! Use Code <strong>FIRST100</strong> at checkout!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingTop: 24,
          fontSize: 12,
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} PENGUIN MENSWEAR. All rights reserved. Crafted with precision in India.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>100% SECURE CHECKOUT</span>
            <span>• UPI • VISA • MASTERCARD • RUPAY • COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
