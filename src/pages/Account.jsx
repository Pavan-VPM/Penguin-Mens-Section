import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const PAST_ORDERS = [
  {
    id: 'PGN-FW25-8842',
    date: '28 Sep 2026',
    status: 'In Transit',
    courier: 'DHL Express',
    tracking: 'DHL-8492019482',
    total: '₹33,400',
    items: [
      { name: 'Structured Poplin Overshirt', size: 'M', qty: 1 },
      { name: 'Monolith Lug Derby', size: '42 EU', qty: 1 }
    ]
  },
  {
    id: 'PGN-FW24-3109',
    date: '14 Nov 2025',
    status: 'Delivered',
    courier: 'DHL Express',
    tracking: 'DHL-1982739103',
    total: '₹18,900',
    items: [
      { name: 'Technical Bomber Jacket', size: 'L', qty: 1 }
    ]
  }
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { cartCount, wishlist } = useCart()
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '3rem' }}>
      <div className="content-container" style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Profile Card */}
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: 16,
          padding: '1.5rem',
          marginTop: 12,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(187,201,207,0.08)'
        }}>
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,210,255,0.15), transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-container), var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--on-primary-fixed)',
              fontWeight: 800,
              fontSize: 22,
              boxShadow: '0 4px 20px rgba(0,210,255,0.3)'
            }}>
              LV
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 className="text-headline-md text-on-surface" style={{ lineHeight: 1.2 }}>Lucas Vance</h1>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>verified</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">lucas.vance@studio.arch</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <span className="text-label-caps" style={{
                  background: 'rgba(0,210,255,0.12)',
                  color: 'var(--primary-container)',
                  padding: '3px 10px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  ATELIER NOIR // TIER 02
                </span>
              </div>
            </div>
          </div>

          {/* Member Tier Progress */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--surface-container-high)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="text-label-caps text-on-surface-variant">Archive Tier Progression</span>
              <span className="text-label-caps text-primary">2,450 / 3,000 PTS</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'var(--surface-container-highest)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', background: 'var(--primary-container)', borderRadius: 999 }} />
            </div>
            <p className="text-body-sm text-on-surface-variant" style={{ fontSize: 11, marginTop: 8 }}>
              550 points until Tier 03 unlocked (Includes exclusive Atelier early-access & free bespoke alterations).
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Active Orders', val: '1', icon: 'package_2', action: () => setActiveTab('orders') },
            { label: 'Saved Items', val: wishlist.length.toString(), icon: 'favorite', action: () => navigate('/wishlist') },
            { label: 'Bag Items', val: cartCount.toString(), icon: 'shopping_bag', action: () => navigate('/cart') },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={stat.action}
              style={{
                background: 'var(--surface-container)',
                borderRadius: 12,
                padding: '16px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                border: '1px solid rgba(187,201,207,0.06)',
                cursor: 'pointer',
                color: 'var(--on-surface)',
                transition: 'background 0.15s'
              }}
            >
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 24 }}>{stat.icon}</span>
              <span className="text-headline-md" style={{ fontWeight: 800 }}>{stat.val}</span>
              <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>{stat.label}</span>
            </button>
          ))}
        </div>

        {/* Navigation Segment Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface-container-low)', padding: 4, borderRadius: 10 }}>
          {['orders', 'addresses', 'concierge'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: activeTab === tab ? 'var(--surface-bright)' : 'transparent',
                color: activeTab === tab ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                transition: 'all 0.15s'
              }}
            >
              {tab === 'orders' ? 'Orders' : tab === 'addresses' ? 'Addresses' : 'Concierge'}
            </button>
          ))}
        </div>

        {/* Tab: Orders */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PAST_ORDERS.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'var(--surface-container)',
                  borderRadius: 12,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: '1px solid rgba(187,201,207,0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-title-sm text-on-surface" style={{ fontWeight: 700 }}>{order.id}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: order.status === 'In Transit' ? 'rgba(0,210,255,0.15)' : 'var(--surface-container-high)',
                    color: order.status === 'In Transit' ? 'var(--primary-container)' : 'var(--on-surface-variant)'
                  }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--on-surface-variant)' }}>
                  <span>Ordered: {order.date}</span>
                  <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>Total: {order.total}</span>
                </div>

                <div style={{ background: 'var(--surface-container-low)', borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {order.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span className="text-on-surface">{it.name} ({it.size})</span>
                      <span className="text-on-surface-variant">×{it.qty}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                  <span className="text-body-sm text-on-surface-variant" style={{ fontSize: 12 }}>
                    {order.courier}: {order.tracking}
                  </span>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--primary-container)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onClick={() => alert(`Tracking package ${order.tracking} with ${order.courier}`)}
                  >
                    <span>Track Package</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Addresses */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(187,201,207,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="text-label-caps text-primary">Default Delivery</span>
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 20 }}>check_circle</span>
              </div>
              <p className="text-title-sm text-on-surface" style={{ fontWeight: 600 }}>Lucas Vance</p>
              <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 4, lineHeight: 1.5 }}>
                Apartment 14B, 452 West Broadway<br />
                SoHo, New York, NY 10012<br />
                United States
              </p>
            </div>

            <button
              style={{
                padding: '14px',
                borderRadius: 8,
                background: 'transparent',
                border: '1px dashed var(--outline-variant)',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
              onClick={() => alert('Address modal opened')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Add New Address
            </button>
          </div>
        )}

        {/* Tab: Concierge */}
        {activeTab === 'concierge' && (
          <div style={{ background: 'var(--surface-container)', borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid rgba(187,201,207,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,210,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 24 }}>support_agent</span>
              </div>
              <div>
                <h3 className="text-title-sm text-on-surface">Private Atelier Concierge</h3>
                <p className="text-body-sm text-on-surface-variant">Available 24/7 for Tier 02 Members</p>
              </div>
            </div>
            <p className="text-body-sm text-on-surface-variant" style={{ lineHeight: 1.5 }}>
              Connect directly with your personal wardrobe consultant for sizing recommendations, tailoring alterations, or reserved allocation for Drop 02.
            </p>
            <button
              className="btn-primary"
              style={{ width: '100%', height: 46, borderRadius: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}
              onClick={() => alert('Connecting to Private Concierge via Live Chat...')}
            >
              Start Concierge Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
