import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom'
import { trackOrder, getOrderById } from '../services/api'
import { useCustomerAuth } from '../context/CustomerAuthContext'

const ORDER_STAGES = [
  { key: 'placed', label: 'Order Confirmed', icon: 'check_circle', desc: 'Order received and verified' },
  { key: 'processing', label: 'Atelier Processing', icon: 'inventory', desc: 'Garment tailored, checked & packaged' },
  { key: 'shipped', label: 'In Transit', icon: 'local_shipping', desc: 'Handed to BlueDart Express courier' },
  { key: 'delivered', label: 'Delivered', icon: 'home', desc: 'Delivered to your destination' },
]

export default function TrackOrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { orderNumber: paramOrderNumber } = useParams()
  const { customer } = useCustomerAuth()

  const queryId = paramOrderNumber || searchParams.get('id') || searchParams.get('order') || ''
  
  const [searchInput, setSearchInput] = useState(queryId)
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [copiedTracking, setCopiedTracking] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])

  // Load recent orders from localStorage or customer account
  useEffect(() => {
    try {
      const stored = localStorage.getItem('penguin_recent_orders')
      if (stored) {
        setRecentOrders(JSON.parse(stored))
      }
    } catch (_) {}
  }, [])

  // Auto-search if query param present
  useEffect(() => {
    if (queryId && queryId.trim()) {
      setSearchInput(queryId.trim())
      performTrack(queryId.trim())
    }
  }, [queryId])

  const performTrack = async (term) => {
    if (!term || !term.trim()) return
    setIsLoading(true)
    setErrorMessage('')
    setHasSearched(true)

    try {
      const res = await trackOrder(term.trim())
      if (res?.success && res.data) {
        setOrder(res.data)
        setErrorMessage('')

        // Save to recent orders in localStorage
        try {
          const stored = localStorage.getItem('penguin_recent_orders')
          let list = stored ? JSON.parse(stored) : []
          if (!list.some(item => item.orderNumber === res.data.orderNumber)) {
            list = [{ orderNumber: res.data.orderNumber, createdAt: res.data.createdAt, total: res.data.total }, ...list].slice(0, 3)
            localStorage.setItem('penguin_recent_orders', JSON.stringify(list))
            setRecentOrders(list)
          }
        } catch (_) {}
      } else {
        setOrder(null)
        setErrorMessage(res?.message || 'No active shipment found matching this reference. Please check your Order ID or AWB Tracking Number.')
      }
    } catch (err) {
      setOrder(null)
      setErrorMessage('Unable to connect to tracking server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ id: searchInput.trim() })
      performTrack(searchInput.trim())
    }
  }

  const handleCopyAWB = (awb) => {
    if (!awb) return
    navigator.clipboard.writeText(awb)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  // Determine current active stage index (0 to 3)
  const getActiveStageIndex = (statusStr) => {
    const s = (statusStr || '').toLowerCase()
    if (s.includes('deliver')) return 3
    if (s.includes('ship') || s.includes('transit') || s.includes('out for')) return 2
    if (s.includes('process') || s.includes('tailor') || s.includes('pack') || s.includes('confirmed')) return 1
    return 0
  }

  const activeStage = order ? getActiveStageIndex(order.orderStatus) : 0

  // Format estimated delivery date (~3-4 days after order creation)
  const getEstimatedDate = (createdDate) => {
    const d = createdDate ? new Date(createdDate) : new Date()
    d.setDate(d.getDate() + 3)
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '80vh', paddingBottom: 64 }}>
      {/* ─── Breadcrumb & Minimal Header ────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', padding: '20px 0' }}>
        <div className="content-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Home</button>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Order Tracking</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(20px, 4vw, 26px)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            TRACK SHIPMENT
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4, maxWidth: 500 }}>
            Real-time status updates for your atelier garment delivery.
          </p>
        </div>
      </div>

      <div className="content-container" style={{ marginTop: 24, maxWidth: 840 }}>
        {/* ─── Minimal Search Box ────────────────────────────────────────────── */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm, 6px)',
          border: '1px solid var(--border-light)',
          padding: '16px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 18,
                color: 'var(--text-muted)'
              }}>
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. PGN-XXXXX) or AWB Tracking"
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 12px 0 38px',
                  borderRadius: 4,
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: 12.5,
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="btn-solid-primary"
              style={{
                height: 42,
                padding: '0 20px',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderRadius: 4,
                opacity: (!searchInput.trim() || isLoading) ? 0.6 : 1,
                cursor: (!searchInput.trim() || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Locating...' : 'Track'}
            </button>
          </form>

          {/* Recent Orders Quick Chips */}
          {recentOrders.length > 0 && !order && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Recent:</span>
              {recentOrders.map((rec) => (
                <button
                  key={rec.orderNumber}
                  type="button"
                  onClick={() => {
                    setSearchInput(rec.orderNumber)
                    setSearchParams({ id: rec.orderNumber })
                    performTrack(rec.orderNumber)
                  }}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 14,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {rec.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Loading State ─────────────────────────────────────────────────── */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{
              display: 'inline-block',
              width: 32,
              height: 32,
              border: '2.5px solid var(--border-light)',
              borderTopColor: 'var(--text-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>Contacting courier server & dispatch logs...</p>
          </div>
        )}

        {/* ─── Error / Not Found State ───────────────────────────────────────── */}
        {!isLoading && errorMessage && hasSearched && (
          <div style={{
            marginTop: 20,
            padding: '24px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 6,
            border: '1px dashed var(--border-light)',
            textAlign: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--text-muted)' }}>
              location_off
            </span>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
              Shipment Not Found
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 16px', lineHeight: 1.5 }}>
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/account')}
              style={{
                background: 'none',
                border: '1px solid var(--border-light)',
                padding: '6px 14px',
                borderRadius: 4,
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              View Orders in My Account
            </button>
          </div>
        )}

        {/* ─── Active Order Tracking Result ──────────────────────────────────── */}
        {!isLoading && order && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status Card */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 6,
              border: '1px solid var(--border-light)',
              padding: '18px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    ORDER NUMBER
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                    {order.orderNumber}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 9px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: activeStage === 3 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                    color: activeStage === 3 ? '#16a34a' : 'var(--text-primary)',
                    border: '1px solid ' + (activeStage === 3 ? 'rgba(34, 197, 94, 0.3)' : 'var(--border-light)')
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: activeStage === 3 ? '#16a34a' : '#ea580c',
                      display: 'inline-block'
                    }} />
                    {order.orderStatus || 'Processing'}
                  </span>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Est. Delivery: <strong>{getEstimatedDate(order.createdAt)}</strong>
                  </div>
                </div>
              </div>

              {/* ─── Clean Responsive Progress Timeline ───────────────────────── */}
              <div style={{ paddingTop: 24, paddingBottom: 8 }}>
                {/* Desktop & Mobile Adaptive Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ORDER_STAGES.map((stage, idx) => {
                    const isDone = idx <= activeStage
                    const isCurrent = idx === activeStage
                    return (
                      <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                        {/* Connecting vertical line */}
                        {idx < ORDER_STAGES.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            top: 24,
                            left: 13,
                            width: 2,
                            height: 'calc(100% + 4px)',
                            backgroundColor: idx < activeStage ? 'var(--text-primary)' : 'var(--border-light)',
                            zIndex: 1,
                            transition: 'background-color 0.3s ease'
                          }} />
                        )}

                        {/* Node Icon Circle */}
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isDone ? 'var(--text-primary)' : 'var(--bg-secondary)',
                          color: isDone ? 'var(--bg-primary)' : 'var(--text-muted)',
                          border: '2px solid ' + (isDone ? 'var(--text-primary)' : 'var(--border-light)'),
                          zIndex: 2,
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 0 0 4px rgba(0, 0, 0, 0.08)' : 'none',
                          transition: 'all 0.2s ease'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                            {stage.icon}
                          </span>
                        </div>

                        {/* Text Details */}
                        <div style={{ flex: 1, paddingTop: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{
                              fontSize: 12.5,
                              fontWeight: isDone ? 700 : 500,
                              color: isDone ? 'var(--text-primary)' : 'var(--text-muted)'
                            }}>
                              {stage.label}
                            </span>
                            {isCurrent && (
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-accent)' }}>
                                Current Stage
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.4 }}>
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Courier Partner & AWB Banner */}
              <div style={{
                marginTop: 20,
                padding: '10px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 4,
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                fontSize: 11.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--text-muted)' }}>local_shipping</span>
                  <span style={{ color: 'var(--text-muted)' }}>Courier:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>BlueDart Express</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>AWB:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {order.trackingNumber || 'EXP-98234710'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAWB(order.trackingNumber || 'EXP-98234710')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      color: copiedTracking ? '#16a34a' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                    title="Copy AWB"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 2 }}>
                      {copiedTracking ? 'check' : 'content_copy'}
                    </span>
                    {copiedTracking ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Ordered Items & Delivery Details Grid ───────────────────────── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16
            }}>
              {/* Items Card */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 6,
                border: '1px solid var(--border-light)',
                padding: '16px'
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: 12 }}>
                  Ordered Items ({order.items?.length || 1})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 8, borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                        <div style={{ width: 44, height: 56, backgroundColor: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={item.img || item.image || item.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name || 'Atelier Garment'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            Qty: {item.quantity || 1} {item.size ? `• Size: ${item.size}` : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{Number(item.price || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Curated Menswear Garment (Standard Unit)</div>
                  )}
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{Number(order.total || order.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Shipping Destination Card */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 6,
                border: '1px solid var(--border-light)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: 12 }}>
                    Shipping Destination
                  </div>

                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {order.customerName || order.customer?.name || 'Valued Client'}
                  </div>

                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {order.shippingAddress?.address || order.customer?.address || '14 Atelier Lane, Indiranagar'}
                    <br />
                    {order.shippingAddress?.city || order.customer?.city || 'Bengaluru'}, {order.shippingAddress?.state || order.customer?.state || 'Karnataka'} {order.shippingAddress?.pincode || order.customer?.pincode || '560038'}
                  </div>

                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
                    Phone: {order.phone || order.customer?.phone || '+91 98765 43210'}
                  </div>
                </div>

                {/* Need assistance concierge */}
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Need delivery support?</span>
                  <a
                    href="mailto:concierge@penguin.com?subject=Delivery Query"
                    style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-accent)', textDecoration: 'none' }}
                  >
                    Contact Concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Default Help State (When no search performed) ────────────────── */}
        {!isLoading && !order && !hasSearched && (
          <div style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 6,
              border: '1px solid var(--border-light)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--text-primary)' }}>schedule</span>
              <h4 style={{ fontSize: 12.5, fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>Express Dispatch</h4>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                All orders are tailored, inspected, and dispatched within 24 hours of placement.
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 6,
              border: '1px solid var(--border-light)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--text-primary)' }}>sms</span>
              <h4 style={{ fontSize: 12.5, fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>SMS & WhatsApp Tracking</h4>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Live AWB link is automatically sent to your registered mobile number upon dispatch.
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 6,
              border: '1px solid var(--border-light)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--text-primary)' }}>verified_user</span>
              <h4 style={{ fontSize: 12.5, fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>Tamper-Proof Delivery</h4>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Secured luxury packaging with sealed waterproof courier envelopes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
