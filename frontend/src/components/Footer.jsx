import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import brandLogoDark from '../assets/logo 2.png'
import brandLogoLight from '../assets/logo-light.png'

export default function Footer() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const brandLogo = theme === 'light' ? brandLogoLight : brandLogoDark
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer style={{
      background: 'var(--surface-container-lowest)',
      borderTop: '1px solid var(--ticker-border)',
      marginTop: 'auto',
      padding: '4rem 0 2rem',
      width: '100%'
    }}>
      <div className="content-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Top Section: Brand & Newsletter */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Brand Philosophy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <img
              src={brandLogo}
              alt="Penguin Men's Section"
              style={{ height: 42, width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }}
            />
            <p className="text-body-sm text-on-surface-variant" style={{ maxWidth: 380, lineHeight: 1.6, fontSize: 13 }}>
              Engineered architectural menswear designed for modern movement. Clean geometric lines, Japanese technical textiles, and timeless European tailoring.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary-container)', fontSize: 12, fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
              <span>Atelier Verified Provenance // Porto & Tokyo</span>
            </div>
          </div>

          {/* Newsletter / Private Access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="text-label-caps text-primary" style={{ letterSpacing: '0.12em' }}>Private Atelier Access</span>
            <h3 className="text-headline-sm text-on-surface" style={{ fontSize: 18, textTransform: 'uppercase' }}>
              Subscribe to Future Drops
            </h3>
            <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 12, lineHeight: 1.5 }}>
              Receive priority notifications for limited capsule releases, private atelier previews, and architectural archive additions.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  height: 44,
                  background: 'var(--surface-container)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 8,
                  padding: '0 14px',
                  color: 'var(--on-surface)',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  height: 44,
                  padding: '0 20px',
                  borderRadius: 8,
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-fixed)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 16px var(--glow-primary)'
                }}
              >
                Join
              </button>
            </form>
            {subscribed && (
              <span className="text-label-caps text-primary" style={{ fontSize: 11, marginTop: 4 }}>
                ✓ You have been granted private access to FW25 Drop 02.
              </span>
            )}
          </div>
        </div>

        {/* Middle Section: Organized Directory Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2rem',
          borderTop: '1px solid var(--ticker-border)',
          paddingTop: '2.5rem'
        }}>
          {/* Column 1: Collections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="text-label-caps text-on-surface" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>Collection</span>
            {[
              { label: 'Drop 01 // FW25', path: '/winter-drop' },
              { label: 'Shirts & Overshirts', path: '/collection/shirts' },
              { label: 'Technical Outerwear', path: '/collection/shirts' },
              { label: 'Relaxed Tailoring', path: '/collection/shirts' },
              { label: 'Curated Wishlist', path: '/wishlist' }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', textAlign: 'left', fontSize: 13, padding: 0, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-container)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Column 2: Client Concierge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="text-label-caps text-on-surface" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>Client Service</span>
            {[
              'Express Courier & Customs',
              'Doorstep Return Policy',
              'Atelier Fit & Sizing Guide',
              'Track Your Garment',
              'VIP Concierge Contact'
            ].map(item => (
              <span
                key={item}
                style={{ color: 'var(--on-surface-variant)', fontSize: 13, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--on-surface)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                onClick={() => navigate('/account')}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Column 3: Atelier Provenance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="text-label-caps text-on-surface" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>Atelier Provenance</span>
            {[
              'Japanese Tech Textiles',
              'Double-Faced Wool Philosophy',
              'Carbon Neutral Courier',
              'Care & Longevity Manual',
              'Archive Tier Membership'
            ].map(item => (
              <span
                key={item}
                style={{ color: 'var(--on-surface-variant)', fontSize: 13, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--on-surface)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                onClick={() => navigate('/collection/shirts')}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Column 4: Store Region */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="text-label-caps text-on-surface" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>Store Region</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-container)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', width: 'fit-content' }}>
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 18 }}>language</span>
              <span className="text-label-md text-on-surface" style={{ fontSize: 12, fontWeight: 600 }}>India // INR (₹)</span>
            </div>
            <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>
              All prices include import duties & domestic GST. Guaranteed 24h dispatch via DHL Express.
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          borderTop: '1px solid var(--ticker-border)',
          paddingTop: '1.5rem',
          fontSize: 11,
          color: 'var(--outline)'
        }}>
          <span>© 2026 PENGUIN MEN'S SECTION. ALL RIGHTS RESERVED.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Terms of Atelier</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Legal Notice</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Sustainability</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
