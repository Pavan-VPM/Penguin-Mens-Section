import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { getCustomerOrders, saveCustomerAddress, deleteCustomerAddress } from '../services/api';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'Kerala',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Haryana',
  'Punjab',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Bihar',
  'Goa',
  'Assam',
  'Odisha',
  'Uttarakhand',
  'Himachal Pradesh',
  'Other',
];

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useCart();
  const { customer, isLoggedIn, loading, logout, fetchProfile } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    isDefault: false,
  });

  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const justSignedUp = location.state?.justSignedUp;

  // Sync default user data into address form
  useEffect(() => {
    if (customer && !editingAddressId) {
      setNewAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.name || '',
        phone: prev.phone || customer.phone || '',
      }));
    }
  }, [customer, editingAddressId]);

  useEffect(() => {
    if (isLoggedIn) {
      setLoadingOrders(true);
      getCustomerOrders()
        .then((res) => {
          if (res?.success && res.data) {
            setOrders(res.data);
          }
        })
        .catch(() => console.warn('Could not load orders'))
        .finally(() => setLoadingOrders(false));
    }
  }, [isLoggedIn]);

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setNewAddress({
      label: 'Home',
      fullName: customer?.name || '',
      phone: customer?.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
      isDefault: !customer?.addresses?.length,
    });
    setAddressMsg('');
    setSuccessMsg('');
    setShowAddAddress(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setNewAddress({
      label: addr.label || 'Home',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || 'Karnataka',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault || false,
    });
    setAddressMsg('');
    setSuccessMsg('');
    setShowAddAddress(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        ...(editingAddressId ? { id: editingAddressId } : {}),
        ...newAddress,
      };

      const res = await saveCustomerAddress(payload);
      if (res?.success) {
        setShowAddAddress(false);
        setEditingAddressId(null);
        setSuccessMsg(res.message || 'Address saved successfully.');
        await fetchProfile();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setAddressMsg(res?.message || 'Failed to save address');
      }
    } catch (err) {
      setAddressMsg(err.response?.data?.message || 'Failed to save address. Please check all fields.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to remove this saved address?')) return;
    setDeletingId(addrId);
    try {
      const res = await deleteCustomerAddress(addrId);
      if (res?.success) {
        await fetchProfile();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete address.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    setOrders([]);
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid var(--border-light)',
          borderTopColor: 'var(--brand-accent)',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  // Not logged in gate
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px 80px' }}>
        <div style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--brand-accent-bg, rgba(212, 163, 115, 0.15))',
            color: 'var(--brand-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>person</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
            Penguin Account
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
            Sign in to track orders, manage saved shipping destinations, and view your curated wishlist.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              to="/login"
              className="btn-solid-accent"
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="btn-outline"
              style={{
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = customer.name
    ? customer.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PG';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '24px 0 80px' }}>
      <div className="content-container" style={{ maxWidth: 960 }}>
        {justSignedUp && (
          <div style={{
            padding: '14px 20px',
            backgroundColor: 'var(--brand-green-bg, rgba(34, 197, 94, 0.15))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 6,
            color: 'var(--brand-green, #22c55e)',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>✨ Welcome to Penguin Atelier! Your account is active.</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>A verification email has been sent.</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'var(--brand-green-bg, rgba(34, 197, 94, 0.15))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 6,
            color: 'var(--brand-green, #22c55e)',
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* User Profile Card */}
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
          marginBottom: 24,
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
              fontWeight: 900,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                  {customer.name}
                </h2>
                {customer.emailVerified ? (
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 999,
                    backgroundColor: 'var(--brand-green-bg)',
                    color: 'var(--brand-green)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}>
                    Verified
                  </span>
                ) : (
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 999,
                    backgroundColor: 'var(--brand-gold-bg)',
                    color: 'var(--brand-gold)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}>
                    Unverified
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                {customer.email} {customer.phone ? `• ${customer.phone}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <button
              onClick={handleLogout}
              className="btn-outline"
              style={{
                height: 38,
                padding: '0 14px',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                marginLeft: 8,
              }}
            >
              Sign Out
            </button>
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
              cursor: 'pointer',
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
              cursor: 'pointer',
            }}
          >
            Saved Addresses ({customer.addresses?.length || 0})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--text-muted)', marginBottom: 12 }}>shopping_bag</span>
                <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', marginBottom: 6 }}>No Orders Placed Yet</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 20px' }}>
                  Explore the FW25 curated drop and experience precision craftsmanship.
                </p>
                <button onClick={() => navigate('/collection')} className="btn-solid-accent" style={{ height: 42, padding: '0 24px', fontSize: 12, fontWeight: 800 }}>
                  Explore Collection
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 900 }}>Order #{order.id}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>Placed on {order.date}</span>
                      </div>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor: order.status === 'Delivered' || order.status === 'paid' ? 'var(--brand-green-bg)' : 'var(--brand-gold-bg)',
                        color: order.status === 'Delivered' || order.status === 'paid' ? 'var(--brand-green)' : 'var(--brand-gold)',
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <div>
                            <strong>{item.name}</strong> • Size: {item.size} • Qty: {item.qty}
                          </div>
                          <span style={{ fontWeight: 700 }}>{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 12, fontSize: 13, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Courier: BlueDart Express • AWB: {order.tracking}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900 }}>
                        Total: {order.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Shipping Destinations</h3>
              <button
                onClick={showAddAddress ? () => setShowAddAddress(false) : handleOpenAddAddress}
                className={showAddAddress ? 'btn-outline' : 'btn-solid-primary'}
                style={{ height: 36, padding: '0 16px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}
              >
                {showAddAddress ? 'Cancel' : '+ Add Address'}
              </button>
            </div>

            {showAddAddress && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                border: '1px solid var(--border-light)',
                marginBottom: 24,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>
                  {editingAddressId ? 'Edit Shipping Destination' : 'New Destination'}
                </h4>

                {addressMsg && (
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 4,
                    color: '#ef4444',
                    fontSize: 12,
                    marginBottom: 16,
                  }}>
                    {addressMsg}
                  </div>
                )}

                <form onSubmit={handleSaveAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Recipient's Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Address Label
                    </label>
                    <input
                      type="text"
                      placeholder="Home / Atelier / Office"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Street Address / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Flat / House No., Building, Street Name"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City / Town"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      State *
                    </label>
                    <select
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 10px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 4, border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: 18 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, marginTop: 10 }}>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="btn-solid-accent"
                      style={{ height: 44, padding: '0 28px', fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}
                    >
                      {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="btn-outline"
                      style={{ height: 44, padding: '0 20px', fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {customer.addresses?.length === 0 && !showAddAddress ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)', marginBottom: 8 }}>location_on</span>
                <h4 style={{ fontSize: 15, fontWeight: 900, textTransform: 'uppercase', marginBottom: 6 }}>No Saved Addresses</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Add an address to expedite your checkout experience.</p>
                <button
                  onClick={handleOpenAddAddress}
                  className="btn-solid-accent"
                  style={{ height: 42, padding: '0 24px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {customer.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: addr.isDefault ? '1.5px solid var(--brand-accent)' : '1px solid var(--border-light)',
                      padding: 20,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                          {addr.label || 'Home'}
                        </h4>
                        {addr.isDefault && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-accent)', textTransform: 'uppercase', padding: '2px 8px', backgroundColor: 'var(--brand-gold-bg)', borderRadius: 3 }}>
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 14px' }}>
                        <strong>{addr.fullName}</strong><br />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {addr.line1} {addr.line2 ? `, ${addr.line2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pincode}<br />
                          Phone: {addr.phone}
                        </span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-primary)',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        disabled={deletingId === addr.id}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginLeft: 'auto',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        {deletingId === addr.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
