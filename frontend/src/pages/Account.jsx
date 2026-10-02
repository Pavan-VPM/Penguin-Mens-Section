import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getOrders } from '../services/api'

const MOCK_ORDERS = [
  {
    id: 'PGN-2025-9821',
    date: '12 Feb 2025',
    status: 'In Transit',
    courier: 'BlueDart Express',
    tracking: 'BLU-8492019482',
    total: '₹3,298',
    items: [
      { name: 'Structured Poplin Overshirt', size: 'M', qty: 1, price: '₹1,999' },
      { name: 'Heavyweight Boxy Organic Tee', size: 'M', qty: 1, price: '₹1,299' }
    ]
  },
  {
    id: 'PGN-2024-3109',
    date: '18 Dec 2024',
    status: 'Delivered',
    courier: 'Delhivery',
    tracking: 'DLV-1982739103',
    total: '₹3,499',
    items: [
      { name: 'Technical Matte Bomber Jacket', size: 'L', qty: 1, price: '₹3,499' }
    ]
  }
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { wishlist, cartCount } = useCart()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState(MOCK_ORDERS)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getOrders()
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map(o => ({
            id: o.orderNumber || o._id,
            date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: o.orderStatus || 'Processing',
            courier: o.courier || 'Express Courier',
            tracking: o.trackingNumber || 'EXP-98234710',
            total: `₹${(o.totalAmount || 0).toLocaleString('en-IN')}`,
            items: o.items?.map(i => ({ name: i.name, size: i.size, qty: i.quantity || 1, price: `₹${(i.price || 1999).toLocaleString('en-IN')}` })) || []
          }))
          setOrders(formatted)
        }
      } catch (err) {
        console.warn('Using fallback customer orders')
      }
    }
    loadData()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container" style={{ maxWidth: 960 }}>
        {/* User Card */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 900
            }}>
              RS
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>Rohan Sharma</h2>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>rohan.sharma@gmail.com • +91 98765 43210</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '8px 16px', backgroundColor: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{orders.length}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</div>
            </div>
            <div 
              onClick={() => navigate('/wishlist')}
              style={{ textAlign: 'center', padding: '8px 16px', backgroundColor: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-light)', cursor: 'pointer' }}
              title="View Wishlist"
            >
              <div style={{ fontSize: 16, fontWeight: 900 }}>{wishlist.length}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wishlist</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-light)', paddingBottom: 12, marginBottom: 24 }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: activeTab === 'orders' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--text-inverse)' : 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              backgroundColor: activeTab === 'addresses' ? 'var(--brand-primary)' : 'transparent',
              color: activeTab === 'addresses' ? 'var(--text-inverse)' : 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Saved Addresses
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 900 }}>Order {order.id}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>Placed on {order.date}</span>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: order.status === 'Delivered' ? 'var(--brand-green-bg)' : 'var(--brand-gold-bg)',
                    color: order.status === 'Delivered' ? 'var(--brand-green)' : 'var(--brand-gold)'
                  }}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <div>
                        <strong>{item.name}</strong> • Size: {item.size} • Qty: {item.qty}
                      </div>
                      <span style={{ fontWeight: 700 }}>{item.price}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 12, fontSize: 13 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Courier: {order.courier} • AWB: {order.tracking}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900 }}>
                    Total: {order.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Addresses Tab Content */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--brand-accent)', padding: 20, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, color: 'var(--brand-accent)', textTransform: 'uppercase' }}>DEFAULT</span>
              <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>Home</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Rohan Sharma<br />
                Flat 402, Skyline Residency, Bandra West<br />
                Mumbai, Maharashtra - 400050<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
