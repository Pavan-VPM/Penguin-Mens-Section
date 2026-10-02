import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedInitialProducts,
  getSiteConfig,
  updateSiteConfig,
  getOrders,
  updateOrderStatus,
  adminLogin,
  adminLogout,
  isLocalAdminAuthenticated,
  uploadProductImage,
} from '../services/api';

const CATEGORIES = ['Jackets', 'Shirts', 'Tees', 'Tailoring', 'Jeans', 'Footwear', 'Knitwear', 'Accessories', 'Outerwear'];

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'config' | 'orders' | 'inventory'

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteConfig, setSiteConfig] = useState({
    marqueeText: '',
    archiveText: '',
    heroHeadline: '',
    heroSubheadline: '',
    heroImage: '',
    heroDropTag: '',
    showWinterDrop: true,
    winterDropTitle: 'WINTER DROP 01',
    winterDropSubtitle: 'Limited capsule — Structured outerwear, heavyweight knitwear & tech bombers. Only 100 units per style.',
    winterDropCta: 'Shop Winter Drop',
    winterDropImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: 'success' });

  // Product Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Shirts',
    color: 'Nocturne Black',
    price: 11900,
    originalPrice: '',
    badge: 'Drop 01',
    badgeColor: 'var(--primary)',
    images: [''],
    sizes: [
      { size: 'S', stock: 5, isSoldOut: false },
      { size: 'M', stock: 10, isSoldOut: false },
      { size: 'L', stock: 8, isSoldOut: false },
      { size: 'XL', stock: 0, isSoldOut: true },
    ],
    colorVariants: [
      { name: 'Nocturne Black', hex: '#111111' },
      { name: 'Charcoal', hex: '#2B2B2B' },
    ],
    isWinterDrop: false,
    isFeatured: true,
    inStock: true,
    stockStatus: 'In Stock',
    fabricDetails: '100% Japanese High-Density Organic Cotton Poplin (180 GSM).',
    careInstructions: 'Dry clean only or delicate machine wash at 30°C.',
    description: 'Precision tailored minimalist garment designed with architectural proportions.',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Check Auth on Mount
  useEffect(() => {
    if (isLocalAdminAuthenticated()) {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, cfgRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getSiteConfig(),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (orderRes?.data) setOrders(orderRes.data);
      if (cfgRes?.data) setSiteConfig(cfgRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await adminLogin({ pin: pinInput, password: pinInput });
      if (res?.success) {
        setIsAuthenticated(true);
        loadAllAdminData();
      } else {
        setAuthError(res?.message || 'Invalid passcode');
      }
    } catch (err) {
      setAuthError('Authentication error. Try PIN: 8842 or admin123');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  const showToast = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: 'success' }), 4000);
  };

  // Open Modal for New Product
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Shirts',
      color: 'Nocturne Black',
      price: 11900,
      originalPrice: '',
      badge: 'Drop 01',
      badgeColor: 'var(--primary)',
      images: [''],
      sizes: [
        { size: 'S', stock: 5, isSoldOut: false },
        { size: 'M', stock: 10, isSoldOut: false },
        { size: 'L', stock: 8, isSoldOut: false },
        { size: 'XL', stock: 0, isSoldOut: true },
      ],
      colorVariants: [
        { name: 'Nocturne Black', hex: '#111111' },
      ],
      isWinterDrop: false,
      isFeatured: true,
      inStock: true,
      stockStatus: 'In Stock',
      fabricDetails: '100% Japanese High-Density Organic Cotton Poplin (180 GSM).',
      careInstructions: 'Dry clean only or delicate machine wash at 30°C.',
      description: 'Precision tailored minimalist garment designed with architectural proportions.',
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Shirts',
      color: prod.color || 'Nocturne Black',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || '',
      badge: prod.badge || '',
      badgeColor: prod.badgeColor || 'var(--primary)',
      images: prod.images && prod.images.length > 0 ? prod.images : [''],
      sizes: prod.sizes && prod.sizes.length > 0 ? prod.sizes : [
        { size: 'S', stock: 5, isSoldOut: false },
        { size: 'M', stock: 10, isSoldOut: false },
        { size: 'L', stock: 8, isSoldOut: false },
      ],
      colorVariants: prod.colorVariants && prod.colorVariants.length > 0 ? prod.colorVariants : [
        { name: prod.color || 'Nocturne Black', hex: '#111111' },
      ],
      isWinterDrop: !!prod.isWinterDrop,
      isFeatured: prod.isFeatured !== false,
      inStock: prod.inStock !== false,
      stockStatus: prod.stockStatus || 'In Stock',
      fabricDetails: prod.fabricDetails || '',
      careInstructions: prod.careInstructions || '',
      description: prod.description || '',
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty images
      const cleanImages = productForm.images.filter(img => img && img.trim() !== '');
      const payload = {
        ...productForm,
        images: cleanImages.length > 0 ? cleanImages : ['https://lh3.googleusercontent.com/aida-public/AB6AXuB1bs-UKDZDm7hd3cHOIWB8fIAlq8YlxvU1hgjx3MmUyxGAk7KBbZ6UV-uGdR1LaVtONjR7nlEoRPDqOpo0yQQdSUtY0L3Z-dO_PVYHPpTRoqtx0jaTGEbef0-ESiFB8pB8rZYzvIdTC3r7BsbtKahxYIfR_3sd4CL8O-iVT_B3Rb9WxVSF_sUquSiW0fN9ja1NjMwXvFYHZEd8Ivn2RK_ue1E9b7PxXAEWslU7VJkTRjU99pzLh7Va'],
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      };

      if (editingProduct && (editingProduct._id || editingProduct.id)) {
        const id = editingProduct._id || editingProduct.id;
        await updateProduct(id, payload);
        showToast(`Garment "${payload.name}" updated successfully`);
      } else {
        await createProduct(payload);
        showToast(`Garment "${payload.name}" added to catalog`);
      }

      setIsModalOpen(false);
      await loadAllAdminData();
    } catch (err) {
      console.error('Error saving product:', err);
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) return;
    try {
      await deleteProduct(id);
      showToast(`Removed "${name}" from catalog`);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      showToast('Error removing product', 'error');
    }
  };

  // Seed Initial Catalog
  const handleSeedCatalog = async () => {
    if (!window.confirm('Reset catalog to the curated FW25 menswear collection?')) return;
    setLoading(true);
    try {
      const res = await seedInitialProducts();
      showToast(res?.message || 'Curated catalog restored');
      await loadAllAdminData();
    } catch (err) {
      showToast('Seeding catalog failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Site Configuration
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Always persist locally so changes survive without a backend
      localStorage.setItem('penguin_site_config', JSON.stringify(siteConfig));
      await updateSiteConfig(siteConfig);
      showToast('Live website banners and drop settings updated!');
    } catch (err) {
      // Still save locally even if API fails
      localStorage.setItem('penguin_site_config', JSON.stringify(siteConfig));
      showToast('Settings saved locally (backend unavailable)');
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const handleUpdateOrder = async (orderId, newStatus, tracking, courier) => {
    try {
      await updateOrderStatus(orderId, {
        orderStatus: newStatus,
        trackingNumber: tracking,
        courier: courier,
      });
      showToast(`Order #${orderId.slice(-6)} updated to "${newStatus}"`);
      await loadAllAdminData();
    } catch (err) {
      showToast('Error updating order', 'error');
    }
  };

  // Handle Image File Upload
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      if (res?.url) {
        const updatedImgs = [...productForm.images];
        updatedImgs[index] = res.url;
        setProductForm(prev => ({ ...prev, images: updatedImgs }));
        showToast('Image uploaded successfully');
      }
    } catch (err) {
      showToast('Upload error. You can also paste an image URL directly.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // ==================== AUTHENTICATION SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--surface)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          textAlign: 'center',
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--glow-primary)',
            border: '2px solid var(--primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--primary-container)' }}>
              admin_panel_settings
            </span>
          </div>

          <div>
            <h2 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
              Atelier Owner Access
            </h2>
            <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 6 }}>
              Enter master PIN or admin password to manage products, banners, drops, and orders.
            </p>
          </div>

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 12,
              textAlign: 'left',
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="password"
              placeholder="Enter Master PIN (e.g. 8842)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                color: 'var(--on-surface)',
                fontSize: 16,
                letterSpacing: '0.2em',
                textAlign: 'center',
                outline: 'none',
              }}
            />

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary"
              style={{
                padding: '14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              {authLoading ? 'Verifying...' : 'Unlock Atelier Dashboard'}
            </button>
          </form>

          <div style={{
            background: 'var(--surface-container)',
            padding: '10px',
            borderRadius: 8,
            fontSize: 11,
            color: 'var(--on-surface-variant)',
          }}>
            <span>💡 Quick Test Passcodes: </span>
            <code style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}>8842</code> or{' '}
            <code style={{ color: 'var(--primary-container)', fontWeight: 'bold' }}>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered').length;
  const lowStockProducts = products.filter(p =>
    p.sizes?.some(s => s.stock > 0 && s.stock <= 3) || p.stockStatus?.toLowerCase().includes('low')
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {statusMsg.text && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          background: statusMsg.type === 'error' ? '#dc2626' : 'var(--primary-container)',
          color: statusMsg.type === 'error' ? '#fff' : 'var(--on-primary-fixed)',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {statusMsg.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="content-container" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '1.5rem 1rem' }}>
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--outline-variant)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="text-label-caps text-primary">PENGUIN ATELIER CONTROL</span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
              }}>
                LIVE CMS
              </span>
            </div>
            <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', margin: '4px 0 0' }}>
              Store Management Portal
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--outline-variant)',
                background: 'var(--surface-container)',
                color: 'var(--on-surface)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
              View Live Store
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Analytics Summary Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          margin: '1.5rem 0',
        }}>
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid var(--outline-variant)',
          }}>
            <span className="text-label-caps text-on-surface-variant">Active Products</span>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--on-surface)', marginTop: 4 }}>
              {products.length}
            </div>
            <span style={{ fontSize: 11, color: 'var(--primary-container)' }}>Garments in catalog</span>
          </div>

          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid var(--outline-variant)',
          }}>
            <span className="text-label-caps text-on-surface-variant">Active Orders</span>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa', marginTop: 4 }}>
              {activeOrdersCount}
            </div>
            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Processing or In Transit</span>
          </div>

          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid var(--outline-variant)',
          }}>
            <span className="text-label-caps text-on-surface-variant">Gross Sales Volume</span>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#34d399', marginTop: 4 }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>From {orders.length} orders</span>
          </div>

          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 12,
            padding: '1.25rem',
            border: '1px solid var(--outline-variant)',
          }}>
            <span className="text-label-caps text-on-surface-variant">Low Stock Alerts</span>
            <div style={{ fontSize: 28, fontWeight: 900, color: lowStockProducts > 0 ? '#fbbf24' : '#34d399', marginTop: 4 }}>
              {lowStockProducts}
            </div>
            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Sizes requiring restock</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid var(--outline-variant)',
          paddingBottom: 8,
          marginBottom: 20,
          overflowX: 'auto',
        }} className="no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'products' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'products' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>checkroom</span>
            Garments ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'config' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'config' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>campaign</span>
            Hero & Drops
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'orders' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_shipping</span>
            Orders ({orders.length})
          </button>
        </div>

        {/* ==================== TAB 1: PRODUCTS MANAGER ==================== */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
                  Garments Catalog
                </h3>
                <p className="text-body-sm text-on-surface-variant" style={{ margin: '2px 0 0' }}>
                  Add, edit, or toggle items across Home, Winter Drop, and Category Collections.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSeedCatalog}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--outline-variant)',
                    background: 'var(--surface-container)',
                    color: 'var(--on-surface-variant)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Restore Curated FW25
                </button>

                <button
                  onClick={handleOpenNewProduct}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                  Add New Garment
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div style={{
              background: 'var(--surface-container-low)',
              borderRadius: 12,
              border: '1px solid var(--outline-variant)',
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
                      <th style={{ padding: '12px 16px' }}>Garment</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Price</th>
                      <th style={{ padding: '12px 16px' }}>Badge / Drop</th>
                      <th style={{ padding: '12px 16px' }}>Sizes Available</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => {
                      const prodId = prod._id || prod.id;
                      const mainImg = prod.images?.[0] || prod.img;
                      return (
                        <tr key={prodId} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img
                                src={mainImg}
                                alt={prod.name}
                                style={{ width: 44, height: 54, borderRadius: 6, objectFit: 'cover', background: '#000' }}
                              />
                              <div>
                                <span style={{ fontWeight: 700, color: 'var(--on-surface)', display: 'block' }}>{prod.name}</span>
                                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>{prod.color}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>{prod.category}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--on-surface)' }}>
                            ₹{Number(prod.price).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {prod.badge ? (
                              <span style={{
                                background: 'var(--surface-container)',
                                border: '1px solid var(--outline-variant)',
                                color: 'var(--primary-container)',
                                padding: '3px 8px',
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                              }}>
                                {prod.badge}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>—</span>
                            )}
                            {prod.isWinterDrop && (
                              <span style={{
                                background: 'rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                                padding: '3px 8px',
                                borderRadius: 999,
                                fontSize: 10,
                                fontWeight: 700,
                                marginLeft: 4,
                              }}>
                                Winter
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {prod.sizes?.map(s => (
                                <span
                                  key={s.size}
                                  style={{
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: s.isSoldOut || s.stock === 0 ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-container)',
                                    color: s.isSoldOut || s.stock === 0 ? '#f87171' : 'var(--on-surface)',
                                  }}
                                >
                                  {s.size}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              color: prod.inStock !== false ? '#34d399' : '#f87171',
                              fontSize: 12,
                              fontWeight: 600,
                            }}>
                              {prod.inStock !== false ? '● In Stock' : '○ Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <button
                                onClick={() => handleEditProduct(prod)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: 'var(--surface-container)',
                                  border: '1px solid var(--outline-variant)',
                                  color: 'var(--on-surface)',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prodId, prod.name)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: HERO & DROPS CONFIG ==================== */}
        {activeTab === 'config' && (
          <div style={{
            background: 'var(--surface-container-low)',
            borderRadius: 16,
            padding: '2rem',
            border: '1px solid var(--outline-variant)',
            maxWidth: 800,
          }}>
            <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: '0 0 4px' }}>
              Live Storefront & Drop Customizer
            </h3>
            <p className="text-body-sm text-on-surface-variant" style={{ margin: '0 0 24px' }}>
              Changes made here update the homepage hero section, announcement ticker, and winter countdown banner immediately.
            </p>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                  Top Marquee Announcement Ticker
                </label>
                <input
                  type="text"
                  value={siteConfig.marqueeText || ''}
                  onChange={(e) => setSiteConfig({ ...siteConfig, marqueeText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                    Hero Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroDropTag || ''}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroDropTag: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroHeadline || ''}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroHeadline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                  Hero Subheadline Description
                </label>
                <textarea
                  rows={3}
                  value={siteConfig.heroSubheadline || ''}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroSubheadline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    resize: 'none',
                  }}
                />
              </div>

              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                  Hero Banner Image URL
                </label>
                <input
                  type="text"
                  value={siteConfig.heroImage || ''}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroImage: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                  }}
                />
                {siteConfig.heroImage && (
                  <div style={{ marginTop: 10, width: '100%', height: 160, borderRadius: 8, overflow: 'hidden' }}>
                    <img src={siteConfig.heroImage} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* ─── Winter Drop Section Control ─────────────────────── */}
              <div style={{
                marginTop: 8,
                padding: '20px',
                borderRadius: 12,
                border: '1px solid var(--outline-variant)',
                background: siteConfig.showWinterDrop
                  ? 'linear-gradient(135deg, rgba(0,120,200,0.07) 0%, rgba(0,80,160,0.04) 100%)'
                  : 'var(--surface-container-lowest)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div className="text-label-caps text-on-surface" style={{ marginBottom: 2 }}>
                      ❄️ Winter Drop Section
                    </div>
                    <div className="text-body-sm text-on-surface-variant">
                      {siteConfig.showWinterDrop ? 'Currently VISIBLE on homepage' : 'Currently HIDDEN from homepage'}
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setSiteConfig({ ...siteConfig, showWinterDrop: !siteConfig.showWinterDrop })}
                    style={{
                      position: 'relative',
                      width: 52,
                      height: 28,
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.25s ease',
                      background: siteConfig.showWinterDrop ? 'var(--primary, #1d6fc4)' : 'var(--outline-variant, #ccc)',
                      flexShrink: 0,
                    }}
                    aria-label="Toggle Winter Drop visibility"
                  >
                    <span style={{
                      position: 'absolute',
                      top: 3,
                      left: siteConfig.showWinterDrop ? 26 : 3,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#ffffff',
                      transition: 'left 0.25s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    }} />
                  </button>
                </div>

                {siteConfig.showWinterDrop && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                          Drop Section Title
                        </label>
                        <input
                          type="text"
                          value={siteConfig.winterDropTitle || ''}
                          onChange={(e) => setSiteConfig({ ...siteConfig, winterDropTitle: e.target.value })}
                          placeholder="e.g. WINTER DROP 01"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            background: 'var(--surface-container-lowest)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={siteConfig.winterDropCta || ''}
                          onChange={(e) => setSiteConfig({ ...siteConfig, winterDropCta: e.target.value })}
                          placeholder="e.g. Shop Winter Drop"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            background: 'var(--surface-container-lowest)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                        Drop Section Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={siteConfig.winterDropSubtitle || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, winterDropSubtitle: e.target.value })}
                        placeholder="Short description of this drop..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--surface-container-lowest)',
                          border: '1px solid var(--outline-variant)',
                          color: 'var(--on-surface)',
                          fontSize: 13,
                          resize: 'vertical',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 6 }}>
                        Drop Background Image URL (optional)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.winterDropImage || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, winterDropImage: e.target.value })}
                        placeholder="https://..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--surface-container-lowest)',
                          border: '1px solid var(--outline-variant)',
                          color: 'var(--on-surface)',
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  marginTop: 10,
                }}
              >
                {loading ? 'Publishing...' : 'Publish Live Updates'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== TAB 3: ORDERS & TRACKING ==================== */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
              Atelier Orders & Tracking
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((ord) => {
                const ordId = ord._id || ord.id;
                return (
                  <div
                    key={ordId}
                    style={{
                      background: 'var(--surface-container-low)',
                      borderRadius: 12,
                      padding: '1.25rem',
                      border: '1px solid var(--outline-variant)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span style={{ fontWeight: 800, color: 'var(--on-surface)', fontSize: 15 }}>
                          {ord.orderNumber}
                        </span>
                        <span style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginLeft: 8 }}>
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrder(ordId, e.target.value, ord.trackingNumber, ord.courier)}
                          style={{
                            background: 'var(--surface-container)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
                      <strong>Client:</strong> {ord.customer?.name} ({ord.customer?.email}, {ord.customer?.phone}) • {ord.customer?.address}, {ord.customer?.city}
                    </div>

                    {/* Order Items */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '8px 0' }}>
                      {ord.items?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'var(--surface-container)',
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{item.name}</span>
                          <span style={{ color: 'var(--on-surface-variant)' }}>({item.size})</span>
                          <span style={{ color: 'var(--primary-container)', fontWeight: 600 }}>₹{item.price?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--outline-variant)',
                      paddingTop: 10,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ color: 'var(--on-surface-variant)' }}>Courier Tracking:</span>
                        <input
                          type="text"
                          defaultValue={ord.trackingNumber || ''}
                          placeholder="e.g. DHL-8492019482"
                          onBlur={(e) => handleUpdateOrder(ordId, ord.orderStatus, e.target.value, ord.courier)}
                          style={{
                            background: 'var(--surface-container-lowest)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                        />
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--on-surface)' }}>
                        Total: ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ==================== ADD / EDIT GARMENT MODAL ==================== */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 680,
            background: 'var(--surface-container-low)',
            borderRadius: 16,
            border: '1px solid var(--outline-variant)',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Atelier'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 22 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Garment Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Structured Wool Overshirt"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Colorway Name
                  </label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    placeholder="e.g. Charcoal Melange"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 18500"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              {/* Badges and Drop Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Product Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Drop 01, Limited, Organic"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>
                    <input
                      type="checkbox"
                      checked={productForm.isWinterDrop}
                      onChange={(e) => setProductForm({ ...productForm, isWinterDrop: e.target.checked })}
                    />
                    Feature in Winter Drop
                  </label>
                </div>
              </div>

              {/* Garment Images */}
              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Garment Image URLs / Upload *
                </label>
                {productForm.images.map((img, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const updated = [...productForm.images];
                        updated[idx] = e.target.value;
                        setProductForm({ ...productForm, images: updated });
                      }}
                      placeholder="Paste Image URL..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: 'var(--surface-container-lowest)',
                        border: '1px solid var(--outline-variant)',
                        color: 'var(--on-surface)',
                        fontSize: 12,
                      }}
                    />

                    <label style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--surface-container)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e, idx)}
                      />
                    </label>

                    {productForm.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = productForm.images.filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, images: updated });
                        }}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-container)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 4,
                  }}
                >
                  + Add another angle image
                </button>
              </div>

              {/* Fabric Specs & Description */}
              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Fabric & Construction Details
                </label>
                <input
                  type="text"
                  value={productForm.fabricDetails}
                  onChange={(e) => setProductForm({ ...productForm, fabricDetails: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 12,
                  }}
                />
              </div>

              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Garment Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 12,
                    resize: 'none',
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    background: 'transparent',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface-variant)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Garment' : 'Publish Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
