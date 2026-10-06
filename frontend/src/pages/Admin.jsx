import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
  seedInitialProducts,
  getSiteConfig,
  updateSiteConfig,
  getOrders,
  updateOrderStatus,
  adminLogin,
  adminChangeTempPassword,
  adminMfaSetup,
  adminMfaVerifySetup,
  adminLoginVerifyMfa,
  adminLogout,
  getAdminProfile,
  createAdminUser,
  listAdminUsers,
  uploadProductImage,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminCustomers,
} from '../services/api';

const DEFAULT_CATEGORIES = ['Shirts', 'Jackets', 'Tees', 'Tailoring', 'Jeans', 'Footwear', 'Knitwear', 'Accessories', 'Formals'];

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Authentication & MFA States
  // 'credentials' | 'change_password' | 'mfa_setup' | 'mfa' | 'backup_codes_modal'
  const [authStep, setAuthStep] = useState('credentials');
  const [emailInput, setEmailInput] = useState('admin@penguin.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [changeToken, setChangeToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // MFA Setup State
  const [setupToken, setSetupToken] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodesList, setBackupCodesList] = useState([]);
  const [showBackupCodeModal, setShowBackupCodeModal] = useState(false);
  const [useBackupCodeLogin, setUseBackupCodeLogin] = useState(false);

  // Active Tab: 'products' | 'categories' | 'config' | 'orders' | 'customers' | 'team'
  const [activeTab, setActiveTab] = useState('products');

  // Superadmin Team Management State
  const [adminUsers, setAdminUsers] = useState([]);
  const [isInviteAdminOpen, setIsInviteAdminOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '' });
  const [createdAdminResult, setCreatedAdminResult] = useState(null);

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerStats, setCustomerStats] = useState({ totalCustomers: 0, verifiedCustomers: 0, unverifiedCustomers: 0 });
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all'); // all | verified | unverified
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

  // Multi-Select / Bulk Actions State
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditForm, setBulkEditForm] = useState({
    category: 'keep',
    stockStatus: 'keep',
    badge: 'keep',
    isFeatured: 'keep',
    isWinterDrop: 'keep',
    price: '',
    originalPrice: '',
  });

  // Filters for Garments table
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Category Modal State (Option A)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sortOrder: 1,
    isActive: true,
  });

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
    getAdminProfile()
      .then((res) => {
        if (res?.user) {
          setIsAuthenticated(true);
          setCurrentUser(res.user);
          loadAllAdminData();
          if (res.user.role === 'superadmin') {
            loadTeamData();
          }
        }
      })
      .catch(() => {
        // Not logged in
      });
  }, []);

  const loadCustomerData = async (query = customerSearch, status = customerStatusFilter) => {
    try {
      const params = {};
      if (query) params.search = query;
      if (status !== 'all') params.status = status;
      const res = await getAdminCustomers(params);
      if (res?.success && res.data) {
        setCustomers(res.data);
        if (res.stats) setCustomerStats(res.stats);
      }
    } catch (err) {
      console.warn('Could not load customers:', err.message);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, cfgRes, catRes, custRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getSiteConfig(),
        getAdminCategories(),
        getAdminCustomers().catch(() => ({ success: false })),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (orderRes?.data) setOrders(orderRes.data);
      if (cfgRes?.data) setSiteConfig(cfgRes.data);
      if (catRes?.data) setCategories(catRes.data);
      if (custRes?.data) {
        setCustomers(custRes.data);
        if (custRes.stats) setCustomerStats(custRes.stats);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async () => {
    try {
      const teamRes = await listAdminUsers();
      if (teamRes?.data) setAdminUsers(teamRes.data);
    } catch (_) {}
  };

  // ── Step 1: Handle Credentials Submission ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await adminLogin({ email: emailInput, password: passwordInput });

      if (res?.success) {
        if (res.requiresPasswordChange) {
          setChangeToken(res.changeToken);
          setAuthStep('change_password');
        } else if (res.requiresMfaSetup) {
          setSetupToken(res.setupToken);
          const setupRes = await adminMfaSetup(res.setupToken);
          if (setupRes?.success) {
            setQrCodeImage(setupRes.qrCodeImage);
            setManualEntryKey(setupRes.manualEntryKey);
            setAuthStep('mfa_setup');
          } else {
            setAuthError(setupRes?.message || 'Failed to initialize MFA QR code.');
          }
        } else if (res.requiresMfaCode) {
          setTempToken(res.tempToken);
          setAuthStep('mfa');
        }
      } else {
        setAuthError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setAuthError('Authentication service unreachable.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Force Password Change ──
  const handleChangeTempPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 8) {
      setAuthError('New password must be at least 8 characters long.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await adminChangeTempPassword(changeToken, newPasswordInput);
      if (res?.success) {
        if (res.requiresMfaSetup) {
          setSetupToken(res.setupToken);
          const setupRes = await adminMfaSetup(res.setupToken);
          if (setupRes?.success) {
            setQrCodeImage(setupRes.qrCodeImage);
            setManualEntryKey(setupRes.manualEntryKey);
            setAuthStep('mfa_setup');
          } else {
            setAuthError(setupRes?.message || 'Failed to initialize MFA QR code.');
          }
        } else if (res.requiresMfaCode) {
          setTempToken(res.tempToken);
          setAuthStep('mfa');
        }
      } else {
        setAuthError(res?.message || 'Failed to update temporary password.');
      }
    } catch (err) {
      setAuthError('Password update error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 2: Handle MFA Setup Verification ──
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.trim().length < 6) {
      setAuthError('Please enter the 6-digit code from Google Authenticator / Authy.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await adminMfaVerifySetup(setupToken, totpCode.trim());
      if (res?.success) {
        setBackupCodesList(res.backupCodes || []);
        setShowBackupCodeModal(true);
        setCurrentUser(res.user || { role: res.role });
      } else {
        setAuthError(res?.message || 'Invalid 6-digit code. Ensure device clock is synced.');
      }
    } catch (err) {
      setAuthError('Failed to verify MFA setup.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 3: Handle Regular TOTP Verification or Recovery Code ──
  const handleVerifyMfaCode = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.trim().length < 6) {
      setAuthError('Please enter the code from your authenticator app or an 8-char backup code.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      const isBackup = totpCode.trim().length === 8;
      const res = await adminLoginVerifyMfa(tempToken, totpCode.trim(), isBackup);
      if (res?.success) {
        setIsAuthenticated(true);
        setCurrentUser(res.user || { role: res.role });
        loadAllAdminData();
        if (res.user?.role === 'superadmin') {
          loadTeamData();
        }
      } else {
        setAuthError(res?.message || 'Invalid authenticator code.');
      }
    } catch (err) {
      setAuthError('MFA verification failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthStep('credentials');
    setPasswordInput('');
    setTotpCode('');
  };

  // Superadmin Invite Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAdminUser(newAdminForm);
      if (res?.success) {
        setCreatedAdminResult(res);
        setNewAdminForm({ name: '', email: '' });
        await loadTeamData();
        showToast(`Admin invite generated for ${res.admin?.email}`);
      } else {
        showToast(res?.message || 'Failed to create admin user', 'error');
      }
    } catch (err) {
      showToast('Error creating admin user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: 'success' }), 4000);
  };

  // ==================== AUTHENTICATION & MFA SCREENS ====================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--surface)',
      }}>
        {/* Backup Codes Modal upon first-time setup */}
        {showBackupCodeModal && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal-card" style={{ maxWidth: 500, textAlign: 'center' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>verified_user</span>
              </div>

              <div>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: '8px 0 4px' }}>
                  Save Your Emergency Backup Codes
                </h3>
                <p className="text-body-sm text-on-surface-variant" style={{ margin: 0 }}>
                  If you ever lose your phone or authenticator app, these one-time recovery codes are the <strong>only way</strong> to unlock your account.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                background: 'var(--surface-container-lowest)',
                padding: '16px',
                borderRadius: 10,
                border: '1px solid var(--outline-variant)',
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}>
                {backupCodesList.map((c, i) => (
                  <div key={i} style={{ color: 'var(--on-surface)', padding: '4px' }}>
                    {c}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(backupCodesList.join('\n'));
                    showToast('Backup codes copied to clipboard!');
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: 'var(--surface-container)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
                  Copy All
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setShowBackupCodeModal(false);
                    setIsAuthenticated(true);
                    loadAllAdminData();
                  }}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  I Have Saved Them → Enter Atelier
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{
          width: '100%',
          maxWidth: authStep === 'mfa_setup' ? 480 : 420,
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 16,
          padding: '2.25rem 1.75rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          textAlign: 'center',
          boxSizing: 'border-box',
        }}>
          {/* Top Shield Icon */}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--glow-primary)',
            border: '2px solid var(--primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--primary-container)' }}>
              {authStep === 'mfa_setup' ? 'qr_code_2' : authStep === 'mfa' ? 'phonelink_lock' : 'security'}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <span className="text-label-caps text-primary" style={{ fontSize: 10 }}>PENGUIN HARDENED ATELIER</span>
              <span style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                padding: '2px 6px',
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 800,
              }}>
                2FA MFA
              </span>
            </div>
            <h2 className="text-headline-md text-on-surface" style={{ textTransform: 'uppercase', margin: 0, fontSize: 'clamp(18px, 4vw, 22px)' }}>
              {authStep === 'mfa_setup' ? 'Configure 2FA Authenticator' : authStep === 'mfa' ? 'Two-Factor Challenge' : 'Atelier Access Portal'}
            </h2>
            <p className="text-body-sm text-on-surface-variant" style={{ marginTop: 4, fontSize: 12 }}>
              {authStep === 'mfa_setup'
                ? 'Scan the QR code with Google Authenticator or Authy to bind your device.'
                : authStep === 'mfa'
                ? 'Enter the 6-digit dynamic passcode from your authenticator app.'
                : 'Role-separated superadmin & admin access with hardware TOTP.'}
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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
              <span>{authError}</span>
            </div>
          )}

          {/* ── STEP 1: CREDENTIALS SCREEN ── */}
          {authStep === 'credentials' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              <div>
                <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>
                  Admin Account Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. admin@penguin.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary"
                style={{
                  padding: '13px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                {authLoading ? 'Verifying Credentials...' : 'Proceed to Two-Factor Auth →'}
              </button>
            </form>
          )}

          {/* ── FORCE PASSWORD CHANGE SCREEN ── */}
          {authStep === 'change_password' && (
            <form onSubmit={handleChangeTempPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: 'var(--primary-container)', margin: 0 }}>
                ⚠️ You must set a permanent secure password (min 8 chars) before continuing.
              </p>

              <div>
                <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoFocus
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary"
                style={{
                  padding: '13px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {authLoading ? 'Saving...' : 'Set Password & Continue →'}
              </button>
            </form>
          )}

          {/* ── STEP 2: MFA INITIAL SETUP (QR CODE) ── */}
          {authStep === 'mfa_setup' && (
            <form onSubmit={handleVerifySetup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {qrCodeImage && (
                <div style={{
                  background: '#ffffff',
                  padding: 12,
                  borderRadius: 12,
                  width: 'fit-content',
                  margin: '0 auto',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                  <img src={qrCodeImage} alt="TOTP QR Code" style={{ width: 170, height: 170, display: 'block' }} />
                </div>
              )}

              {manualEntryKey && (
                <div style={{
                  background: 'var(--surface-container)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'var(--on-surface-variant)',
                }}>
                  <span>Manual Setup Secret: </span>
                  <code style={{ color: 'var(--primary-container)', fontWeight: 'bold', fontFamily: 'monospace' }}>{manualEntryKey}</code>
                </div>
              )}

              <div>
                <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 6 }}>
                  Enter 6-Digit Code to Confirm
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000 000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 22,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    fontWeight: 900,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setAuthStep('credentials')}
                  style={{
                    padding: '12px',
                    borderRadius: 8,
                    background: 'transparent',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {authLoading ? 'Verifying...' : 'Activate MFA & Generate Keys'}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: REGULAR TOTP / BACKUP CODE LOGIN ── */}
          {authStep === 'mfa' && (
            <form onSubmit={handleVerifyMfaCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 6 }}>
                  {useBackupCodeLogin ? 'Enter 8-Character Backup Code' : '6-Digit Authenticator Passcode'}
                </label>
                <input
                  type="text"
                  maxLength={useBackupCodeLogin ? 8 : 6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.toUpperCase())}
                  placeholder={useBackupCodeLogin ? 'e.g. 7A9F3E1B' : '• • • • • •'}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: useBackupCodeLogin ? 18 : 24,
                    letterSpacing: '0.25em',
                    textAlign: 'center',
                    fontWeight: 900,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary"
                style={{
                  padding: '13px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {authLoading ? 'Verifying...' : 'Authenticate Session'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCodeLogin(!useBackupCodeLogin);
                    setTotpCode('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-container)',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {useBackupCodeLogin ? '← Use Authenticator App' : 'Lost Device? Use Recovery Code'}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('credentials')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--on-surface-variant)',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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

  const isSuperAdmin = currentUser?.role === 'superadmin';


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
      setSelectedProductIds(prev => prev.filter(x => x !== id));
    } catch (err) {
      showToast('Error removing product', 'error');
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectProduct = (id) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = (filteredList) => {
    const allFilteredIds = filteredList.map(p => p._id || p.id);
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedProductIds.length} selected garments from the store catalog?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await bulkDeleteProducts(selectedProductIds);
      showToast(res?.message || `Successfully deleted ${selectedProductIds.length} garments.`);
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p._id || p.id)));
      setSelectedProductIds([]);
    } catch (err) {
      console.error('Bulk delete error:', err);
      showToast('Failed to delete selected items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) return;

    const updates = {};
    if (bulkEditForm.category && bulkEditForm.category !== 'keep') {
      updates.category = bulkEditForm.category;
    }
    if (bulkEditForm.stockStatus && bulkEditForm.stockStatus !== 'keep') {
      updates.stockStatus = bulkEditForm.stockStatus;
      updates.inStock = bulkEditForm.stockStatus !== 'Sold Out' && bulkEditForm.stockStatus !== 'Out of Stock';
    }
    if (bulkEditForm.badge !== undefined && bulkEditForm.badge !== 'keep') {
      updates.badge = bulkEditForm.badge === 'none' ? null : bulkEditForm.badge;
    }
    if (bulkEditForm.isFeatured === 'true') updates.isFeatured = true;
    if (bulkEditForm.isFeatured === 'false') updates.isFeatured = false;
    if (bulkEditForm.isWinterDrop === 'true') updates.isWinterDrop = true;
    if (bulkEditForm.isWinterDrop === 'false') updates.isWinterDrop = false;
    if (bulkEditForm.price) updates.price = Number(bulkEditForm.price);
    if (bulkEditForm.originalPrice) updates.originalPrice = Number(bulkEditForm.originalPrice);

    if (Object.keys(updates).length === 0) {
      showToast('No property changes specified to apply.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await bulkUpdateProducts(selectedProductIds, updates);
      showToast(res?.message || `Updated ${selectedProductIds.length} garments.`);
      setIsBulkEditModalOpen(false);
      setSelectedProductIds([]);
      await loadAllAdminData();
    } catch (err) {
      console.error('Bulk update error:', err);
      showToast('Failed to update selected items.', 'error');
    } finally {
      setLoading(false);
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

  // ==================== CATEGORY ACTIONS (OPTION A) ====================
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      description: cat.description || '',
      sortOrder: cat.sortOrder || 1,
      isActive: cat.isActive !== false,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory && (editingCategory._id || editingCategory.id)) {
        const id = editingCategory._id || editingCategory.id;
        const res = await updateCategory(id, categoryForm);
        if (res.success === false) {
          showToast(res.message || 'Failed to update category', 'error');
        } else {
          showToast(`Category "${categoryForm.name}" updated successfully`);
          setIsCategoryModalOpen(false);
          await loadAllAdminData();
        }
      } else {
        const res = await createCategory(categoryForm);
        if (res.success === false) {
          showToast(res.message || 'Failed to create category', 'error');
        } else {
          showToast(`Category "${categoryForm.name}" added to store`);
          setIsCategoryModalOpen(false);
          await loadAllAdminData();
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const id = cat._id || cat.id;
    if (!window.confirm(`Are you sure you want to delete the category "${cat.name}"?`)) return;

    setLoading(true);
    try {
      const res = await deleteCategory(id);
      if (res.success === false) {
        showToast(res.message || `Cannot delete category "${cat.name}"`, 'error');
      } else {
        showToast(`Category "${cat.name}" deleted successfully`);
        await loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Error deleting category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategoryActive = async (cat) => {
    const id = cat._id || cat.id;
    const newStatus = !cat.isActive;
    try {
      await updateCategory(id, { isActive: newStatus });
      showToast(`Category "${cat.name}" marked as ${newStatus ? 'Active' : 'Inactive'}`);
      setCategories(prev => prev.map(c => ((c._id || c.id) === id ? { ...c, isActive: newStatus } : c)));
    } catch (err) {
      showToast('Error updating status', 'error');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* ── Mobile-Optimized Responsive Styles ── */}
      <style>{`
        .admin-page-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 1.5rem 1rem;
          box-sizing: border-box;
        }
        .admin-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--outline-variant);
        }
        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin: 1.5rem 0;
        }
        .admin-metric-card {
          background: var(--surface-container-low);
          border-radius: 12px;
          padding: 1.25rem;
          border: 1px solid var(--outline-variant);
          box-sizing: border-box;
        }
        .admin-metric-val {
          font-size: 28px;
          font-weight: 900;
          margin-top: 4px;
        }
        .admin-tabs-bar {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--outline-variant);
          padding-bottom: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .admin-tabs-bar::-webkit-scrollbar {
          display: none;
        }
        .admin-tab-btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .admin-desktop-view {
          display: block;
        }
        .admin-mobile-view {
          display: none;
        }
        .admin-filter-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          background: var(--surface-container-low);
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--outline-variant);
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow-y: auto;
          box-sizing: border-box;
        }
        .admin-modal-card {
          width: 100%;
          max-width: 680px;
          background: var(--surface-container-low);
          border-radius: 16px;
          border: 1px solid var(--outline-variant);
          padding: 2rem;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          box-sizing: border-box;
        }
        .admin-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .admin-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
        }
        .admin-card-container {
          background: var(--surface-container-low);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--outline-variant);
          box-sizing: border-box;
        }
        .admin-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 99999;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: calc(100vw - 32px);
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .admin-page-container {
            padding: 1rem 0.75rem;
          }
          .admin-header-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            padding-bottom: 1.25rem;
          }
          .admin-header-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .admin-header-actions button {
            width: 100%;
            padding: 10px 12px !important;
            justify-content: center;
            font-size: 12px !important;
          }
          .admin-metrics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 1rem 0;
          }
          .admin-metric-card {
            padding: 0.85rem;
            border-radius: 10px;
          }
          .admin-metric-val {
            font-size: 20px;
          }
          .admin-tab-btn {
            padding: 8px 14px;
            font-size: 11px;
            gap: 6px;
          }
          .admin-desktop-view {
            display: none !important;
          }
          .admin-mobile-view {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
          .admin-filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
            gap: 10px;
          }
          .admin-filter-bar select {
            width: 100%;
          }
          .admin-modal-backdrop {
            padding: 0.5rem;
            align-items: flex-end;
          }
          .admin-modal-card {
            padding: 1.25rem !important;
            max-height: 92vh !important;
            border-radius: 16px 16px 8px 8px !important;
            gap: 12px !important;
          }
          .admin-grid-2col {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .admin-form-actions {
            flex-direction: column-reverse;
            gap: 8px;
          }
          .admin-form-actions button {
            width: 100%;
            padding: 12px !important;
          }
          .admin-card-container {
            padding: 1.25rem !important;
            border-radius: 12px !important;
          }
          .admin-toast {
            top: 16px;
            left: 16px;
            right: 16px;
            justify-content: center;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {statusMsg.text && (
        <div
          className="admin-toast"
          style={{
            background: statusMsg.type === 'error' ? '#dc2626' : 'var(--primary-container)',
            color: statusMsg.type === 'error' ? '#fff' : 'var(--on-primary-fixed)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {statusMsg.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="admin-page-container">
        {/* Top Header Bar */}
        <div className="admin-header-flex">
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
            <h1 className="text-headline-lg text-on-surface" style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 'clamp(18px, 4vw, 28px)' }}>
              Store Management Portal
            </h1>
          </div>

          <div className="admin-header-actions">
            {isSuperAdmin && (
              <button
                onClick={() => navigate('/superadmin')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  background: 'rgba(234, 179, 8, 0.12)',
                  color: '#eab308',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>military_tech</span>
                Superadmin Console →
              </button>
            )}

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
        <div className="admin-metrics-grid">
          <div className="admin-metric-card">
            <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>Active Products</span>
            <div className="admin-metric-val" style={{ color: 'var(--on-surface)' }}>
              {products.length}
            </div>
            <span style={{ fontSize: 10, color: 'var(--primary-container)' }}>Garments in catalog</span>
          </div>

          <div className="admin-metric-card">
            <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>Active Orders</span>
            <div className="admin-metric-val" style={{ color: '#60a5fa' }}>
              {activeOrdersCount}
            </div>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Processing or Transit</span>
          </div>

          <div className="admin-metric-card">
            <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>Gross Volume</span>
            <div className="admin-metric-val" style={{ color: '#34d399' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>From {orders.length} orders</span>
          </div>

          <div className="admin-metric-card">
            <span className="text-label-caps text-on-surface-variant" style={{ fontSize: 10 }}>Low Stock Alerts</span>
            <div className="admin-metric-val" style={{ color: lowStockProducts > 0 ? '#fbbf24' : '#34d399' }}>
              {lowStockProducts}
            </div>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Sizes needing restock</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-bar no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'products' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'products' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>checkroom</span>
            Garments ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'categories' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'categories' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>category</span>
            Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'config' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'config' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>campaign</span>
            Hero & Drops
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
            }}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'orders' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_shipping</span>
            Orders ({orders.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('customers');
              loadCustomerData();
            }}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'customers' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'customers' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>people</span>
            Customers ({customers.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('team');
              loadTeamData();
            }}
            className="admin-tab-btn"
            style={{
              background: activeTab === 'team' ? 'var(--primary-container)' : 'transparent',
              color: activeTab === 'team' ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shield_person</span>
            Team & 2FA Security
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

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: 'auto' }}>
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

            {/* Garments Search & Filter Bar */}
            <div className="admin-filter-bar">
              <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 200, alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)', fontSize: 18 }}>search</span>
                <input
                  type="text"
                  placeholder="Search garments by name, color, category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    width: '100%',
                    outline: 'none',
                  }}
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 14 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600, textTransform: 'uppercase' }}>Filter:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    background: 'var(--surface-container)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 12,
                    padding: '6px 12px',
                    borderRadius: 6,
                  }}
                >
                  <option value="All">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c._id || c.slug} value={c.name}>
                      {c.name} ({c.productCount ?? products.filter(p => (typeof p.category === 'object' ? p.category?.name : p.category) === c.name).length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-Select Floating Bulk Action Toolbar */}
            {selectedProductIds.length > 0 && (
              <div style={{
                position: 'sticky',
                top: 16,
                zIndex: 90,
                background: 'var(--surface-container)',
                color: 'var(--on-surface)',
                borderRadius: 12,
                padding: '12px 20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                border: '1px solid var(--outline-variant)',
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    background: 'var(--primary)',
                    color: 'var(--on-primary, #ffffff)',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                  }}>
                    {selectedProductIds.length} Selected
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--on-surface)', fontWeight: 600 }}>
                    Batch Operations
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const filteredList = products.filter(prod => {
                        const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || '');
                        const matchesCategory = categoryFilter === 'All' || catName.toLowerCase() === categoryFilter.toLowerCase();
                        const matchesSearch = !productSearch ||
                          prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                          catName.toLowerCase().includes(productSearch.toLowerCase()) ||
                          prod.color?.toLowerCase().includes(productSearch.toLowerCase());
                        return matchesCategory && matchesSearch;
                      });
                      handleSelectAllFiltered(filteredList);
                    }}
                    style={{
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 11,
                      padding: '5px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Select / Deselect All Filtered
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsBulkEditModalOpen(true)}
                    className="btn-primary"
                    style={{
                      fontSize: 12,
                      padding: '8px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 700,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_note</span>
                    Bulk Edit ({selectedProductIds.length})
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#dc2626',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      fontWeight: 700,
                      fontSize: 12,
                      padding: '8px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_sweep</span>
                    Bulk Delete ({selectedProductIds.length})
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--on-surface-variant)',
                      cursor: 'pointer',
                      fontSize: 18,
                      padding: '4px 8px',
                    }}
                    title="Clear selection"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Products Table */}
            <div className="admin-desktop-view" style={{
              background: 'var(--surface-container-low)',
              borderRadius: 12,
              border: '1px solid var(--outline-variant)',
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
                      <th style={{ padding: '12px 14px', width: 36, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={
                            products.length > 0 &&
                            products
                              .filter(prod => {
                                const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || '');
                                const matchesCategory = categoryFilter === 'All' || catName.toLowerCase() === categoryFilter.toLowerCase();
                                const matchesSearch = !productSearch ||
                                  prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                                  catName.toLowerCase().includes(productSearch.toLowerCase()) ||
                                  prod.color?.toLowerCase().includes(productSearch.toLowerCase());
                                return matchesCategory && matchesSearch;
                              })
                              .every(p => selectedProductIds.includes(p._id || p.id))
                          }
                          onChange={() => {
                            const filteredList = products.filter(prod => {
                              const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || '');
                              const matchesCategory = categoryFilter === 'All' || catName.toLowerCase() === categoryFilter.toLowerCase();
                              const matchesSearch = !productSearch ||
                                prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                                catName.toLowerCase().includes(productSearch.toLowerCase()) ||
                                prod.color?.toLowerCase().includes(productSearch.toLowerCase());
                              return matchesCategory && matchesSearch;
                            });
                            handleSelectAllFiltered(filteredList);
                          }}
                          style={{ cursor: 'pointer', width: 16, height: 16, accentColor: 'var(--primary)' }}
                          title="Select / Deselect all visible garments"
                        />
                      </th>
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
                    {products
                      .filter(prod => {
                        const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || '');
                        const matchesCategory = categoryFilter === 'All' || catName.toLowerCase() === categoryFilter.toLowerCase();
                        const matchesSearch = !productSearch ||
                          prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                          catName.toLowerCase().includes(productSearch.toLowerCase()) ||
                          prod.color?.toLowerCase().includes(productSearch.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .map((prod) => {
                        const prodId = prod._id || prod.id;
                        const mainImg = prod.images?.[0] || prod.img;
                        const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || 'Shirts');
                        const isSelected = selectedProductIds.includes(prodId);

                        return (
                          <tr
                            key={prodId}
                            style={{
                              borderBottom: '1px solid var(--outline-variant)',
                              backgroundColor: isSelected ? 'var(--surface-container-high)' : 'transparent',
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectProduct(prodId)}
                                style={{ cursor: 'pointer', width: 16, height: 16, accentColor: 'var(--primary)' }}
                              />
                            </td>
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
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                background: 'var(--surface-container)',
                                border: '1px solid var(--outline-variant)',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--on-surface)',
                              }}>
                                {catName}
                              </span>
                            </td>
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
                                  display: 'inline-block',
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
                                  display: 'inline-block',
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

            {/* Mobile Products Cards List (<768px) */}
            <div className="admin-mobile-view">
              {products
                .filter(prod => {
                  const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || '');
                  const matchesCategory = categoryFilter === 'All' || catName.toLowerCase() === categoryFilter.toLowerCase();
                  const matchesSearch = !productSearch ||
                    prod.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    catName.toLowerCase().includes(productSearch.toLowerCase()) ||
                    prod.color?.toLowerCase().includes(productSearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                })
                .map((prod) => {
                  const prodId = prod._id || prod.id;
                  const mainImg = prod.images?.[0] || prod.img;
                  const catName = typeof prod.category === 'object' && prod.category ? prod.category.name : (prod.category || 'Shirts');
                  const isSelected = selectedProductIds.includes(prodId);

                  return (
                    <div
                      key={prodId}
                      style={{
                        background: 'var(--surface-container-low)',
                        borderRadius: 12,
                        padding: '12px',
                        border: isSelected ? '2px solid #eab308' : '1px solid var(--outline-variant)',
                        backgroundColor: isSelected ? 'rgba(234, 179, 8, 0.06)' : 'var(--surface-container-low)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectProduct(prodId)}
                          style={{ cursor: 'pointer', width: 18, height: 18, accentColor: '#eab308' }}
                        />
                        <img
                          src={mainImg}
                          alt={prod.name}
                          style={{ width: 64, height: 80, borderRadius: 8, objectFit: 'cover', background: '#000', flexShrink: 0 }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                              <span style={{
                                background: 'var(--surface-container)',
                                border: '1px solid var(--outline-variant)',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                color: 'var(--primary-container)',
                              }}>
                                {catName}
                              </span>
                              <span style={{
                                color: prod.inStock !== false ? '#34d399' : '#f87171',
                                fontSize: 11,
                                fontWeight: 700,
                              }}>
                                {prod.inStock !== false ? '● In Stock' : '○ Out'}
                              </span>
                            </div>
                            <h4 style={{ margin: '4px 0 2px', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.name}
                            </h4>
                            <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>{prod.color}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--on-surface)' }}>
                              ₹{Number(prod.price).toLocaleString('en-IN')}
                            </span>
                            {prod.badge && (
                              <span style={{
                                background: 'var(--surface-container)',
                                color: 'var(--primary-container)',
                                padding: '2px 6px',
                                borderRadius: 999,
                                fontSize: 9,
                                fontWeight: 700,
                              }}>
                                {prod.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sizes Row */}
                      {prod.sizes && prod.sizes.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid var(--outline-variant)' }}>
                          <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', alignSelf: 'center', marginRight: 4 }}>Sizes:</span>
                          {prod.sizes.map(s => (
                            <span
                              key={s.size}
                              style={{
                                fontSize: 9,
                                padding: '2px 5px',
                                borderRadius: 4,
                                background: s.isSoldOut || s.stock === 0 ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-container)',
                                color: s.isSoldOut || s.stock === 0 ? '#f87171' : 'var(--on-surface)',
                                fontWeight: 600,
                              }}
                            >
                              {s.size} ({s.stock ?? 0})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => handleEditProduct(prod)}
                          style={{
                            padding: '10px',
                            borderRadius: 6,
                            background: 'var(--surface-container)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prodId, prod.name)}
                          style={{
                            padding: '10px',
                            borderRadius: 6,
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: CATEGORIES MANAGER (OPTION A) ==================== */}
        {activeTab === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
                  Categories Management
                </h3>
                <p className="text-body-sm text-on-surface-variant" style={{ margin: '2px 0 0' }}>
                  Create custom departments (e.g. Blazers, Loungewear) to organize your garments catalog with automated delete protection.
                </p>
              </div>

              <button
                onClick={handleOpenNewCategory}
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  width: 'fit-content',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
                + Add New Category
              </button>
            </div>

            {/* Desktop Categories Table */}
            <div className="admin-desktop-view" style={{
              background: 'var(--surface-container-low)',
              borderRadius: 12,
              border: '1px solid var(--outline-variant)',
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
                      <th style={{ padding: '12px 16px' }}>Category Name</th>
                      <th style={{ padding: '12px 16px' }}>URL Slug</th>
                      <th style={{ padding: '12px 16px' }}>Description</th>
                      <th style={{ padding: '12px 16px' }}>Attached Garments</th>
                      <th style={{ padding: '12px 16px' }}>Display Order</th>
                      <th style={{ padding: '12px 16px' }}>Storefront Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const catId = cat._id || cat.id;
                      const count = cat.productCount ?? products.filter(p => {
                        const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
                        return pCat?.toLowerCase() === cat.name?.toLowerCase();
                      }).length;

                      return (
                        <tr key={catId} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--on-surface)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 18 }}>
                                label
                              </span>
                              <span>{cat.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontFamily: 'monospace', fontSize: 12 }}>
                            /collection/{cat.slug}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontSize: 12, maxWidth: 260 }}>
                            {cat.description || <span style={{ opacity: 0.5 }}>—</span>}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              background: count > 0 ? 'rgba(52, 211, 153, 0.15)' : 'var(--surface-container)',
                              color: count > 0 ? '#34d399' : 'var(--on-surface-variant)',
                              padding: '3px 10px',
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 700,
                            }}>
                              {count} {count === 1 ? 'garment' : 'garments'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                            #{cat.sortOrder || 0}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => handleToggleCategoryActive(cat)}
                              style={{
                                background: cat.isActive !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: cat.isActive !== false ? '#34d399' : '#f87171',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {cat.isActive !== false ? '● Visible' : '○ Hidden'}
                            </button>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <button
                                onClick={() => handleEditCategory(cat)}
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
                                onClick={() => handleDeleteCategory(cat)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                }}
                                title={count > 0 ? `Delete blocked: ${count} products assigned` : 'Delete category'}
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

            {/* Mobile Categories Cards List (<768px) */}
            <div className="admin-mobile-view">
              {categories.map((cat) => {
                const catId = cat._id || cat.id;
                const count = cat.productCount ?? products.filter(p => {
                  const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
                  return pCat?.toLowerCase() === cat.name?.toLowerCase();
                }).length;

                return (
                  <div
                    key={catId}
                    style={{
                      background: 'var(--surface-container-low)',
                      borderRadius: 12,
                      padding: '14px',
                      border: '1px solid var(--outline-variant)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 18 }}>label</span>
                          <span style={{ fontWeight: 800, color: 'var(--on-surface)', fontSize: 15 }}>{cat.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontFamily: 'monospace', marginTop: 2, display: 'block' }}>
                          /collection/{cat.slug}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleCategoryActive(cat)}
                        style={{
                          background: cat.isActive !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: cat.isActive !== false ? '#34d399' : '#f87171',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {cat.isActive !== false ? '● Visible' : '○ Hidden'}
                      </button>
                    </div>

                    {cat.description && (
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', margin: 0 }}>
                        {cat.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--outline-variant)', paddingTop: 8 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{
                          background: count > 0 ? 'rgba(52, 211, 153, 0.15)' : 'var(--surface-container)',
                          color: count > 0 ? '#34d399' : 'var(--on-surface-variant)',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                        }}>
                          {count} {count === 1 ? 'garment' : 'garments'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>
                          Order #{cat.sortOrder || 0}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleEditCategory(cat)}
                          style={{
                            padding: '6px 12px',
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
                          onClick={() => handleDeleteCategory(cat)}
                          style={{
                            padding: '6px 12px',
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: HERO & DROPS CONFIG ==================== */}
        {activeTab === 'config' && (
          <div className="admin-card-container" style={{ maxWidth: 800 }}>
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
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div className="admin-grid-2col">
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
                      boxSizing: 'border-box',
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
                      boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                padding: '16px',
                borderRadius: 12,
                border: '1px solid var(--outline-variant)',
                background: siteConfig.showWinterDrop
                  ? 'linear-gradient(135deg, rgba(0,120,200,0.07) 0%, rgba(0,80,160,0.04) 100%)'
                  : 'var(--surface-container-lowest)',
                boxSizing: 'border-box',
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
                    <div className="admin-grid-2col">
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
                            boxSizing: 'border-box',
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
                            boxSizing: 'border-box',
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
                          boxSizing: 'border-box',
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
                          boxSizing: 'border-box',
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
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
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
                            padding: '8px 12px',
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
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '6px 0' }}>
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
                      gap: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, flex: 1, minWidth: 200 }}>
                        <span style={{ color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>Courier Tracking:</span>
                        <input
                          type="text"
                          defaultValue={ord.trackingNumber || ''}
                          placeholder="e.g. DHL-8492019482"
                          onBlur={(e) => handleUpdateOrder(ordId, ord.orderStatus, e.target.value, ord.courier)}
                          style={{
                            background: 'var(--surface-container-lowest)',
                            border: '1px solid var(--outline-variant)',
                            color: 'var(--on-surface)',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            width: '100%',
                            maxWidth: 220,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--on-surface)' }}>
                        Total: ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: CUSTOMER DIRECTORY & CRM ==================== */}
        {activeTab === 'customers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
                  Customer Directory & Client Intelligence
                </h3>
                <p className="text-body-sm text-on-surface-variant" style={{ margin: '3px 0 0' }}>
                  Live tracking of registered shoppers, account verification states, lifetime value (LTV), and delivery destinations.
                </p>
              </div>

              <button
                onClick={() => loadCustomerData(customerSearch, customerStatusFilter)}
                className="btn-outline"
                style={{
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                Refresh Data
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
            }}>
              <div className="admin-metric-card" style={{ padding: '16px 20px', borderRadius: 8, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>
                  Total Registered Clients
                </span>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)', marginTop: 4 }}>
                  {customerStats.totalCustomers || customers.length}
                </div>
                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Store accounts created</span>
              </div>

              <div className="admin-metric-card" style={{ padding: '16px 20px', borderRadius: 8, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>
                  Verified Accounts
                </span>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#34d399', marginTop: 4 }}>
                  {customerStats.verifiedCustomers}
                </div>
                <span style={{ fontSize: 11, color: '#34d399' }}>Email authenticated</span>
              </div>

              <div className="admin-metric-card" style={{ padding: '16px 20px', borderRadius: 8, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>
                  Pending Verification
                </span>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fbbf24', marginTop: 4 }}>
                  {customerStats.unverifiedCustomers}
                </div>
                <span style={{ fontSize: 11, color: '#fbbf24' }}>Awaiting email activation</span>
              </div>

              <div className="admin-metric-card" style={{ padding: '16px 20px', borderRadius: 8, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>
                  Client Lifetime Spend
                </span>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', marginTop: 4 }}>
                  ₹{customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0).toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>Cumulative fulfilled volume</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
              backgroundColor: 'var(--surface-container-low)',
              padding: '14px 18px',
              borderRadius: 8,
              border: '1px solid var(--outline-variant)',
            }}>
              <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: 18 }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by client name, email, or phone number..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    loadCustomerData(e.target.value, customerStatusFilter);
                  }}
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 12px 0 36px',
                    borderRadius: 6,
                    border: '1px solid var(--outline-variant)',
                    backgroundColor: 'var(--surface-container-lowest)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'verified', 'unverified'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setCustomerStatusFilter(st);
                      loadCustomerData(customerSearch, st);
                    }}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 6,
                      border: customerStatusFilter === st ? '1.5px solid var(--primary)' : '1px solid var(--outline-variant)',
                      backgroundColor: customerStatusFilter === st ? 'var(--primary-container)' : 'transparent',
                      color: customerStatusFilter === st ? 'var(--on-primary-fixed)' : 'var(--on-surface-variant)',
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {st === 'all' ? 'All Clients' : st === 'verified' ? 'Verified' : 'Unverified'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Data Table */}
            {customers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--surface-container-low)',
                borderRadius: 8,
                border: '1px solid var(--outline-variant)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--on-surface-variant)', marginBottom: 10 }}>person_search</span>
                <h4 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', color: 'var(--on-surface)', margin: '0 0 6px 0' }}>No Customers Found</h4>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', margin: 0 }}>
                  {customerSearch ? `No registered users match "${customerSearch}".` : 'No customer records available.'}
                </p>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--surface-container-low)',
                borderRadius: 8,
                border: '1px solid var(--outline-variant)',
                overflow: 'hidden',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Customer</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Contact Info</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Verification</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Orders / Spend</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Joined Date</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Saved Addresses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => {
                        const initials = c.name ? c.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'CU';
                        const defaultAddr = c.addresses?.find((a) => a.isDefault) || c.addresses?.[0];

                        return (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--primary-container)',
                                  color: 'var(--on-primary-fixed)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 13,
                                  fontWeight: 900,
                                }}>
                                  {initials}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 800, color: 'var(--on-surface)' }}>{c.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontFamily: 'monospace' }}>ID: {c.id.substring(0, 8)}...</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{c.email}</div>
                              <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{c.phone}</div>
                            </td>

                            <td style={{ padding: '14px 18px' }}>
                              {c.emailVerified ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '3px 8px',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                                  color: '#22c55e',
                                }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                                  Verified
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '3px 8px',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  backgroundColor: 'rgba(251, 191, 36, 0.15)',
                                  color: '#fbbf24',
                                }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>hourglass_top</span>
                                  Unverified
                                </span>
                              )}
                            </td>

                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 800, color: 'var(--on-surface)' }}>
                                {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 800 }}>
                                ₹{c.totalSpend.toLocaleString('en-IN')}
                              </div>
                            </td>

                            <td style={{ padding: '14px 18px', color: 'var(--on-surface-variant)', fontSize: 12 }}>
                              {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>

                            <td style={{ padding: '14px 18px' }}>
                              {defaultAddr ? (
                                <div style={{ fontSize: 12 }}>
                                  <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{defaultAddr.city}, {defaultAddr.state}</span>
                                  <span style={{ color: 'var(--on-surface-variant)', marginLeft: 4 }}>({defaultAddr.pincode})</span>
                                </div>
                              ) : (
                                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>No saved address</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 6: TEAM & 2FA SECURITY (LAYER 2 & 5) ==================== */}
        {activeTab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0 }}>
                  Team Roles & Security Governance
                </h3>
                <p className="text-body-sm text-on-surface-variant" style={{ margin: '2px 0 0' }}>
                  Manage store personnel, enforce mandatory 2FA TOTP authentication, and track security privileges.
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => {
                    setCreatedAdminResult(null);
                    setIsInviteAdminOpen(true);
                  }}
                  className="btn-primary"
                  style={{
                    padding: '10px 18px',
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
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                  + Invite New Admin
                </button>
              )}
            </div>

            {/* Security Architecture Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.08) 0%, rgba(0, 50, 100, 0.04) 100%)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 12,
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
            }}>
              <div>
                <span className="text-label-caps text-primary" style={{ fontSize: 10 }}>Active Security Layer</span>
                <div style={{ fontWeight: 800, color: 'var(--on-surface)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ color: '#34d399', fontSize: 18 }}>check_circle</span>
                  Obscure Route + 2FA TOTP
                </div>
              </div>
              <div>
                <span className="text-label-caps text-primary" style={{ fontSize: 10 }}>Your Role</span>
                <div style={{ fontWeight: 800, color: 'var(--on-surface)', marginTop: 4, textTransform: 'uppercase' }}>
                  {currentUser?.role || 'admin'}
                </div>
              </div>
              <div>
                <span className="text-label-caps text-primary" style={{ fontSize: 10 }}>Session Storage</span>
                <div style={{ fontWeight: 800, color: 'var(--on-surface)', marginTop: 4 }}>
                  httpOnly Secure Cookie (2hr)
                </div>
              </div>
            </div>

            {/* Admins Table */}
            <div className="admin-desktop-view" style={{
              background: 'var(--surface-container-low)',
              borderRadius: 12,
              border: '1px solid var(--outline-variant)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
                    <th style={{ padding: '12px 16px' }}>Admin User</th>
                    <th style={{ padding: '12px 16px' }}>Email Address</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>MFA Authenticator</th>
                    <th style={{ padding: '12px 16px' }}>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminUsers.length > 0 ? adminUsers : [
                    { _id: '1', name: 'Lead Architect', email: 'admin@penguin.com', role: 'superadmin', mfaEnabled: true, createdBy: { name: 'CLI Initializer' } },
                    { _id: '2', name: 'Store Owner', email: 'owner@penguin.com', role: 'admin', mfaEnabled: true, createdBy: { name: 'Superadmin' } },
                  ]).map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--on-surface)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 18 }}>
                            {u.role === 'superadmin' ? 'military_tech' : 'account_circle'}
                          </span>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontFamily: 'monospace', fontSize: 12 }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: u.role === 'superadmin' ? 'rgba(234, 179, 8, 0.15)' : 'var(--surface-container)',
                          color: u.role === 'superadmin' ? '#eab308' : 'var(--on-surface)',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: u.mfaEnabled !== false ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: u.mfaEnabled !== false ? '#34d399' : '#f87171',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                        }}>
                          {u.mfaEnabled !== false ? '● Bound & Active' : '○ Pending Setup'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--on-surface-variant)', fontSize: 12 }}>
                        {typeof u.createdBy === 'object' && u.createdBy ? u.createdBy.name : 'System Initializer'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Admins */}
            <div className="admin-mobile-view">
              {(adminUsers.length > 0 ? adminUsers : [
                { _id: '1', name: 'Lead Architect', email: 'admin@penguin.com', role: 'superadmin', mfaEnabled: true },
                { _id: '2', name: 'Store Owner', email: 'owner@penguin.com', role: 'admin', mfaEnabled: true },
              ]).map((u) => (
                <div
                  key={u._id}
                  style={{
                    background: 'var(--surface-container-low)',
                    borderRadius: 12,
                    padding: '14px',
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 18 }}>
                        {u.role === 'superadmin' ? 'military_tech' : 'account_circle'}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--on-surface)' }}>{u.name}</span>
                    </div>
                    <span style={{
                      background: u.role === 'superadmin' ? 'rgba(234, 179, 8, 0.15)' : 'var(--surface-container)',
                      color: u.role === 'superadmin' ? '#eab308' : 'var(--on-surface)',
                      padding: '2px 6px',
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}>
                      {u.role}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontFamily: 'monospace' }}>
                    {u.email}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid var(--outline-variant)' }}>
                    <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>2FA Status:</span>
                    <span style={{
                      color: u.mfaEnabled !== false ? '#34d399' : '#f87171',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      {u.mfaEnabled !== false ? '● Active' : '○ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================== INVITE / CREATE ADMIN MODAL (SUPERADMIN ONLY) ==================== */}
      {isInviteAdminOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-label-caps text-primary">Superadmin Access</span>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
                  Invite Store Admin
                </h3>
              </div>
              <button
                onClick={() => setIsInviteAdminOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 24, padding: 4 }}
              >
                ✕
              </button>
            </div>

            {createdAdminResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  padding: '16px',
                  borderRadius: 10,
                  color: 'var(--on-surface)',
                }}>
                  <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 4 }}>
                    ✓ Admin Account Created!
                  </div>
                  <p style={{ fontSize: 12, margin: '0 0 10px', color: 'var(--on-surface-variant)' }}>
                    Provide these one-time temporary credentials to the staff member. They will be forced to setup Google Authenticator / Authy upon first login.
                  </p>
                  <div style={{ background: 'var(--surface-container-lowest)', padding: '10px', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}>
                    <div><strong>Email:</strong> {createdAdminResult.admin?.email}</div>
                    <div style={{ marginTop: 4 }}><strong>Temp Password:</strong> <code style={{ color: '#34d399', fontWeight: 'bold' }}>{createdAdminResult.tempPassword}</code></div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsInviteAdminOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>
                    Staff Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label className="text-label-caps text-on-surface-variant" style={{ fontSize: 10, display: 'block', marginBottom: 4 }}>
                    Staff Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="e.g. marcus@penguin.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div className="admin-form-actions">
                  <button
                    type="button"
                    onClick={() => setIsInviteAdminOpen(false)}
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
                      cursor: 'pointer',
                    }}
                  >
                    {loading ? 'Creating...' : 'Generate Temporary Invite'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT GARMENT MODAL ==================== */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: 0, fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Atelier'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 24, padding: 4 }}
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
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div className="admin-grid-2col">
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
                      boxSizing: 'border-box',
                    }}
                  >
                    {(categories.length > 0 ? categories : DEFAULT_CATEGORIES.map(n => ({ name: n }))).map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
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
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div className="admin-grid-2col">
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
                      boxSizing: 'border-box',
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
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Badges and Drop Toggles */}
              <div className="admin-grid-2col">
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
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>
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
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
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
                        boxSizing: 'border-box',
                        minWidth: 0,
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
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
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
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Actions */}
              <div className="admin-form-actions">
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

      {/* ==================== BULK EDIT MODAL ==================== */}
      {isBulkEditModalOpen && (
        <div className="admin-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsBulkEditModalOpen(false); }}>
          <div className="admin-modal-card" style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-label-caps text-primary">Batch Operations</span>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
                  Bulk Edit ({selectedProductIds.length} Garments)
                </h3>
              </div>
              <button
                onClick={() => setIsBulkEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 24, padding: 4 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', margin: 0 }}>
              Specify the attributes you wish to update across all {selectedProductIds.length} selected garments. Fields left as "Keep Current" will remain untouched.
            </p>

            <form onSubmit={handleBulkEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="admin-grid-2col">
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Move to Category
                  </label>
                  <select
                    value={bulkEditForm.category}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="keep">— Keep Current Categories —</option>
                    {(categories.length > 0 ? categories : DEFAULT_CATEGORIES.map(n => ({ name: n }))).map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Inventory Stock Status
                  </label>
                  <select
                    value={bulkEditForm.stockStatus}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, stockStatus: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="keep">— Keep Current Status —</option>
                    <option value="In Stock">● Set All In Stock</option>
                    <option value="Out of Stock">○ Set All Out of Stock</option>
                    <option value="Pre-Order">⏱ Set All Pre-Order</option>
                  </select>
                </div>
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Badge / Tag
                  </label>
                  <select
                    value={bulkEditForm.badge}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, badge: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="keep">— Keep Current Badges —</option>
                    <option value="none">Clear Badges (None)</option>
                    <option value="40% OFF">40% OFF</option>
                    <option value="50% OFF">50% OFF</option>
                    <option value="NEW DROP">NEW DROP</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="LIMITED CAPSULE">LIMITED CAPSULE</option>
                  </select>
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Winter Drop Collection
                  </label>
                  <select
                    value={bulkEditForm.isWinterDrop}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, isWinterDrop: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="keep">— Keep Current —</option>
                    <option value="true">Include in Winter Drop</option>
                    <option value="false">Remove from Winter Drop</option>
                  </select>
                </div>
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Featured Flag
                  </label>
                  <select
                    value={bulkEditForm.isFeatured}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, isFeatured: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="keep">— Keep Current —</option>
                    <option value="true">Feature on Homepage</option>
                    <option value="false">Remove from Featured</option>
                  </select>
                </div>

                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Set Price Override (INR ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave blank to keep unchanged"
                    value={bulkEditForm.price}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(false)}
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
                  {loading ? 'Applying Changes...' : `Update ${selectedProductIds.length} Garments`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT CATEGORY MODAL (OPTION A) ==================== */}
      {isCategoryModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="text-label-caps text-primary">Department Taxonomy</span>
                <h3 className="text-headline-sm text-on-surface" style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 'clamp(16px, 3.5vw, 20px)' }}>
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: 24, padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Blazers, Loungewear, Cashmere"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
                {categoryForm.name && (
                  <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 4, display: 'block', fontFamily: 'monospace' }}>
                    Storefront URL: /collection/{categoryForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}
                  </span>
                )}
              </div>

              <div>
                <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Short subtitle or merchandising note for this collection..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    color: 'var(--on-surface)',
                    fontSize: 13,
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label className="text-label-caps text-on-surface" style={{ display: 'block', marginBottom: 4 }}>
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                    />
                    Visible on Storefront
                  </label>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
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
                  {loading ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
