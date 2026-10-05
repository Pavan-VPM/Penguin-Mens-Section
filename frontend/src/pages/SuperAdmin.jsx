import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminLogin,
  adminMfaSetup,
  adminMfaVerifySetup,
  adminLoginVerifyMfa,
  adminLogout,
  isLocalAdminAuthenticated,
  getStoredAdminUser,
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
  resetAdminMfa,
  resetAdminPassword,
  deleteAdminUser,
} from '../services/api';

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Auth States: 'credentials' | 'mfa_setup' | 'mfa'
  const [authStep, setAuthStep] = useState('credentials');
  const [loginMode, setLoginMode] = useState('email'); // 'email' | 'pin'
  const [emailInput, setEmailInput] = useState('admin@penguin.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // MFA Flow
  const [setupToken, setSetupToken] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodesList, setBackupCodesList] = useState([]);
  const [showBackupCodeModal, setShowBackupCodeModal] = useState(false);
  const [useBackupCodeLogin, setUseBackupCodeLogin] = useState(false);

  // Superadmin Data
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: 'success' });

  // Modals & Action States
  const [isInviteAdminOpen, setIsInviteAdminOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '' });
  const [createdAdminResult, setCreatedAdminResult] = useState(null);
  const [tempPasswordResult, setTempPasswordResult] = useState(null);

  // Edit Admin Credentials State
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editAdminForm, setEditAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    mfaEnabled: true,
  });

  useEffect(() => {
    if (isLocalAdminAuthenticated()) {
      const user = getStoredAdminUser();
      if (user?.role === 'superadmin') {
        setIsAuthenticated(true);
        setCurrentUser(user);
        loadAdminUsers();
      }
    }
  }, []);

  const loadAdminUsers = async () => {
    setLoading(true);
    try {
      const res = await listAdminUsers();
      if (res?.data) {
        setAdminUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: 'success' }), 4000);
  };

  // ── Step 1: Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const payload = loginMode === 'pin'
        ? { pin: pinInput, password: pinInput }
        : { email: emailInput, password: passwordInput };

      const res = await adminLogin(payload);

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
        } else if (res.token) {
          if (res.role !== 'superadmin') {
            setAuthError('Access restricted: Only Superadmin can enter this portal.');
            return;
          }
          setIsAuthenticated(true);
          setCurrentUser(res.user || { role: 'superadmin', name: 'Lead Architect' });
          loadAdminUsers();
        }
      } else {
        setAuthError(res?.message || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError('Authentication server unavailable.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 2: Verify First-Time MFA Setup ──
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await adminMfaVerifySetup(setupToken, totpCode);
      if (res?.success) {
        if (res.role !== 'superadmin') {
          setAuthError('Access restricted: Only Superadmin can enter this portal.');
          return;
        }
        setBackupCodesList(res.backupCodes || []);
        setShowBackupCodeModal(true);
        setCurrentUser(res.user || { role: 'superadmin', name: 'Lead Architect' });
      } else {
        setAuthError(res?.message || 'Invalid TOTP code. Check your authenticator.');
      }
    } catch (err) {
      setAuthError('Verification error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 3: Regular TOTP MFA Verification ──
  const handleVerifyMfaCode = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await adminLoginVerifyMfa(tempToken, totpCode);
      if (res?.success) {
        if (res.role !== 'superadmin') {
          setAuthError('Access restricted: Only Superadmin accounts can enter this portal.');
          return;
        }
        setIsAuthenticated(true);
        setCurrentUser(res.user || { role: 'superadmin', name: 'Lead Architect' });
        loadAdminUsers();
      } else {
        setAuthError(res?.message || 'Invalid 2FA code.');
      }
    } catch (err) {
      setAuthError('MFA verification failure.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Create New Store Admin ──
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAdminUser(newAdminForm);
      if (res?.success) {
        setCreatedAdminResult(res);
        showToast(`Admin invite created for ${newAdminForm.email}`);
        setNewAdminForm({ name: '', email: '' });
        loadAdminUsers();
      } else {
        showToast(res?.message || 'Failed to create admin', 'error');
      }
    } catch (err) {
      showToast('Error creating admin user', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Admin MFA ──
  const handleResetMfa = async (admin) => {
    const adminId = admin._id || admin.id || admin.email;
    if (!window.confirm(`Reset 2FA device binding for "${admin.email}"? They will scan a fresh QR code on their next login.`)) return;

    try {
      const res = await resetAdminMfa(adminId);
      if (res?.success) {
        showToast(res.message || `MFA reset for ${admin.email}`);
        loadAdminUsers();
      } else {
        showToast(res?.message || 'Failed to reset MFA', 'error');
      }
    } catch (err) {
      showToast('Error resetting MFA', 'error');
    }
  };

  // ── Reset Admin Password ──
  const handleResetPassword = async (admin) => {
    const adminId = admin._id || admin.id || admin.email;
    if (!window.confirm(`Generate a new temporary password for "${admin.email}"?`)) return;

    try {
      const res = await resetAdminPassword(adminId);
      if (res?.success) {
        setTempPasswordResult({ email: admin.email, tempPassword: res.tempPassword });
        showToast(`Temporary password generated for ${admin.email}`);
        loadAdminUsers();
      } else {
        showToast(res?.message || 'Failed to reset password', 'error');
      }
    } catch (err) {
      showToast('Error generating password', 'error');
    }
  };

  // ── Delete Admin User ──
  const handleDeleteAdmin = async (admin) => {
    const adminId = admin._id || admin.id || admin.email;
    if (admin.role === 'superadmin') {
      alert('Cannot delete the root Superadmin account.');
      return;
    }

    if (!window.confirm(`Permanently revoke access and delete admin account for "${admin.email}"?`)) return;

    try {
      const res = await deleteAdminUser(adminId);
      if (res?.success) {
        showToast(`Admin account "${admin.email}" deleted successfully`);
        loadAdminUsers();
      } else {
        showToast(res?.message || 'Failed to remove admin', 'error');
      }
    } catch (err) {
      showToast('Error deleting admin', 'error');
    }
  };

  // ── Open Edit Admin Modal ──
  const handleOpenEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setEditAdminForm({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      mfaEnabled: admin.mfaEnabled !== false,
    });
    setIsEditAdminOpen(true);
  };

  // ── Save Edited Admin Credentials ──
  const handleSaveEditAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setLoading(true);
    const adminId = editingAdmin._id || editingAdmin.id || editingAdmin.email;

    try {
      const res = await updateAdminUser(adminId, editAdminForm);
      if (res?.success) {
        showToast(res.message || `Credentials updated for ${editAdminForm.email}`);
        setIsEditAdminOpen(false);
        setEditingAdmin(null);
        loadAdminUsers();
      } else {
        showToast(res?.message || 'Failed to update admin', 'error');
      }
    } catch (err) {
      showToast('Error updating admin credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthStep('credentials');
    navigate('/');
  };

  const adminPath = import.meta.env.VITE_ADMIN_PANEL_PATH || 'penguin-ctrl-x7k2';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0c0c0e',
      color: '#f4f4f5',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
    }}>
      {/* ── Scoped Premium Dark Styling ── */}
      <style>{`
        .super-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .super-modal-card {
          width: 100%;
          max-width: 520px;
          background: #141417;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-sizing: border-box;
          color: #f4f4f5;
        }
        .super-btn-gold {
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
          color: #0c0c0e;
          font-weight: 800;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .super-btn-gold:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .super-btn-secondary {
          background: #1f1f24;
          color: #d4d4d8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .super-btn-secondary:hover {
          background: #27272a;
          color: #ffffff;
        }
        .super-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 13px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .super-input:focus {
          border-color: #eab308;
        }
        .super-table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>

      {/* Toast Notification */}
      {statusMsg.text && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 100000,
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: statusMsg.type === 'error' ? '#dc2626' : '#eab308',
            color: '#0c0c0e',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {statusMsg.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* ==================== AUTHENTICATION SCREEN ==================== */}
      {!isAuthenticated ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          background: 'radial-gradient(ellipse at top, #1a1a20 0%, #0c0c0e 100%)',
        }}>
          {/* Backup Codes Modal */}
          {showBackupCodeModal && (
            <div className="super-modal-backdrop">
              <div className="super-modal-card" style={{ textAlign: 'center' }}>
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
                  <h3 style={{ fontSize: 18, textTransform: 'uppercase', margin: '8px 0 4px', fontWeight: 800, color: '#fff' }}>
                    Save Superadmin Emergency Keys
                  </h3>
                  <p style={{ fontSize: 12, color: '#a1a1aa', margin: 0 }}>
                    Store these one-time recovery codes securely. They are the only way to recover access if your authenticator device is lost.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  background: '#09090b',
                  padding: '16px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}>
                  {backupCodesList.map((c, i) => (
                    <div key={i} style={{ color: '#eab308', padding: '4px' }}>
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
                    className="super-btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
                    Copy All
                  </button>

                  <button
                    type="button"
                    className="super-btn-gold"
                    onClick={() => {
                      setShowBackupCodeModal(false);
                      setIsAuthenticated(true);
                      loadAdminUsers();
                    }}
                  >
                    Enter Superadmin Console →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{
            width: '100%',
            maxWidth: 440,
            background: '#141417',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '2px solid #eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 30, color: '#eab308' }}>
                military_tech
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#eab308', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  SUPERADMIN SECURITY CONSOLE
                </span>
              </div>
              <h2 style={{ fontSize: 20, textTransform: 'uppercase', margin: 0, fontWeight: 900, color: '#fff' }}>
                {authStep === 'mfa_setup' ? 'Setup Root Authenticator' : authStep === 'mfa' ? 'Root 2FA Challenge' : 'Superadmin Access'}
              </h2>
              <p style={{ marginTop: 6, fontSize: 12, color: '#a1a1aa' }}>
                Dedicated platform governance, store staff provisioning, and hardware TOTP management.
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

            {authStep === 'credentials' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                <div style={{ display: 'flex', background: '#09090b', padding: 3, borderRadius: 8, gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => setLoginMode('email')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 6,
                      border: 'none',
                      background: loginMode === 'email' ? '#27272a' : 'transparent',
                      color: loginMode === 'email' ? '#fff' : '#a1a1aa',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Superadmin Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode('pin')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 6,
                      border: 'none',
                      background: loginMode === 'pin' ? '#27272a' : 'transparent',
                      color: loginMode === 'pin' ? '#fff' : '#a1a1aa',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Master PIN Mode
                  </button>
                </div>

                {loginMode === 'email' ? (
                  <>
                    <div>
                      <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                        Superadmin Email
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@penguin.com"
                        className="super-input"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                        Master Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••••••"
                        className="super-input"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                      Developer Master PIN
                    </label>
                    <input
                      type="password"
                      placeholder="8842"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      autoFocus
                      className="super-input"
                      style={{ fontSize: 18, letterSpacing: '0.25em', textAlign: 'center' }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="super-btn-gold"
                  style={{ width: '100%', marginTop: 6 }}
                >
                  {authLoading ? 'Verifying...' : 'Access Superadmin Console →'}
                </button>
              </form>
            )}

            {authStep === 'mfa_setup' && (
              <form onSubmit={handleVerifySetup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {qrCodeImage && (
                  <div style={{
                    background: '#ffffff',
                    padding: 12,
                    borderRadius: 12,
                    width: 'fit-content',
                    margin: '0 auto',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}>
                    <img src={qrCodeImage} alt="TOTP QR Code" style={{ width: 170, height: 170, display: 'block' }} />
                  </div>
                )}

                {manualEntryKey && (
                  <div style={{
                    background: '#09090b',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#a1a1aa',
                  }}>
                    <span>Secret: </span>
                    <code style={{ color: '#eab308', fontWeight: 'bold' }}>{manualEntryKey}</code>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000 000"
                    className="super-input"
                    style={{ fontSize: 22, letterSpacing: '0.3em', textAlign: 'center', fontWeight: 900 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="super-btn-gold"
                  style={{ width: '100%' }}
                >
                  {authLoading ? 'Verifying...' : 'Activate Superadmin Keys'}
                </button>
              </form>
            )}

            {authStep === 'mfa' && (
              <form onSubmit={handleVerifyMfaCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    {useBackupCodeLogin ? 'Enter 8-Character Backup Code' : '6-Digit Dynamic Authenticator Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={useBackupCodeLogin ? 8 : 6}
                    required
                    autoFocus
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.toUpperCase())}
                    placeholder={useBackupCodeLogin ? '7A9F3E1B' : '• • • • • •'}
                    className="super-input"
                    style={{ fontSize: useBackupCodeLogin ? 18 : 24, letterSpacing: '0.25em', textAlign: 'center', fontWeight: 900 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="super-btn-gold"
                  style={{ width: '100%' }}
                >
                  {authLoading ? 'Verifying...' : 'Verify & Enter Console'}
                </button>
              </form>
            )}

            <div style={{
              background: '#09090b',
              padding: '8px 10px',
              borderRadius: 8,
              fontSize: 10,
              color: '#a1a1aa',
            }}>
              💡 Developer PIN: <code style={{ color: '#eab308', fontWeight: 'bold' }}>8842</code>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== AUTHENTICATED SUPERADMIN DASHBOARD ==================== */
        <div style={{
          maxWidth: 1140,
          margin: '0 auto',
          width: '100%',
          padding: '2.5rem 1.5rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* Top Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingBottom: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#eab308', fontSize: 22 }}>military_tech</span>
                <span style={{ color: '#eab308', fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  PENGUIN ROOT GOVERNANCE
                </span>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  color: '#eab308',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 800,
                }}>
                  SUPERADMIN LEVEL
                </span>
              </div>
              <h1 style={{ textTransform: 'uppercase', margin: '6px 0 0', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                Store Admin & Identity Command Center
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#a1a1aa' }}>
                Provision store manager accounts, enforce 2FA MFA hardware authentication, and manage admin credentials.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/${adminPath}`)}
                className="super-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#eab308' }}>storefront</span>
                Launch Store Operations (Products & Orders) →
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Governance Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            <div style={{
              background: '#141417',
              borderRadius: 14,
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <span style={{ fontSize: 11, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Provisioned Store Admins
              </span>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginTop: 4 }}>
                {adminUsers.filter(u => u.role === 'admin').length}
              </div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>Shop owner & staff accounts</div>
            </div>

            <div style={{
              background: '#141417',
              borderRadius: 14,
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <span style={{ fontSize: 11, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                2FA MFA Compliance
              </span>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#34d399', marginTop: 4 }}>
                {adminUsers.length > 0 ? `${Math.round((adminUsers.filter(u => u.mfaEnabled !== false).length / adminUsers.length) * 100)}%` : '100%'}
              </div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>Hardware TOTP active</div>
            </div>

            <div style={{
              background: '#141417',
              borderRadius: 14,
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <span style={{ fontSize: 11, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Security Perimeter
              </span>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ color: '#34d399', fontSize: 22 }}>lock</span>
                Obscure + 2FA Active
              </div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>httpOnly secure cookies</div>
            </div>
          </div>

          {/* Temporary Password Announcement Banner */}
          {tempPasswordResult && (
            <div style={{
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div>
                <div style={{ fontWeight: 800, color: '#eab308' }}>🔑 Temporary Password Generated for {tempPasswordResult.email}</div>
                <div style={{ fontSize: 13, color: '#fff', marginTop: 4 }}>
                  One-time password: <code style={{ color: '#eab308', fontWeight: 900, fontSize: 15, background: '#09090b', padding: '2px 8px', borderRadius: 4 }}>{tempPasswordResult.tempPassword}</code>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tempPasswordResult.tempPassword);
                  showToast('Password copied to clipboard');
                }}
                className="super-btn-gold"
                style={{ padding: '8px 14px' }}
              >
                Copy Password
              </button>
            </div>
          )}

          {/* Admins Table Section */}
          <div style={{
            background: '#141417',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ textTransform: 'uppercase', margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>
                  Store Administrators & Privileges
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#a1a1aa' }}>
                  Control access, reset MFA keys if a phone is replaced, and provision new shop managers.
                </p>
              </div>

              <button
                onClick={() => {
                  setCreatedAdminResult(null);
                  setIsInviteAdminOpen(true);
                }}
                className="super-btn-gold"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                + Create / Invite New Admin
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0d0d10', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#a1a1aa' }}>
                    <th style={{ padding: '14px 16px' }}>Personnel</th>
                    <th style={{ padding: '14px 16px' }}>Email Address</th>
                    <th style={{ padding: '14px 16px' }}>Role</th>
                    <th style={{ padding: '14px 16px' }}>2FA Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Admin Security Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminUsers.length > 0 ? adminUsers : [
                    { _id: '1', name: 'Lead Architect', email: 'admin@penguin.com', role: 'superadmin', mfaEnabled: true },
                    { _id: '2', name: 'Store Owner', email: 'owner@penguin.com', role: 'admin', mfaEnabled: true },
                  ]).map((u) => {
                    const isRoot = u.role === 'superadmin';
                    return (
                      <tr key={u._id} className="super-table-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#ffffff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="material-symbols-outlined" style={{ color: isRoot ? '#eab308' : '#60a5fa', fontSize: 20 }}>
                              {isRoot ? 'military_tech' : 'badge'}
                            </span>
                            <div>
                              <div>{u.name}</div>
                              {isRoot && <span style={{ fontSize: 10, color: '#eab308', fontWeight: 800 }}>Root Authority</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#a1a1aa', fontFamily: 'monospace', fontSize: 12 }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: isRoot ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            color: isRoot ? '#eab308' : '#d4d4d8',
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
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          {!isRoot ? (
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleOpenEditAdmin(u)}
                                title="Edit admin name, email, custom password, and 2FA status"
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  background: 'rgba(234, 179, 8, 0.15)',
                                  border: '1px solid rgba(234, 179, 8, 0.35)',
                                  color: '#eab308',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                                Edit
                              </button>

                              <button
                                onClick={() => handleResetMfa(u)}
                                title="Reset 2FA device binding so they can scan a new QR code"
                                className="super-btn-secondary"
                                style={{ padding: '6px 10px', fontSize: 11 }}
                              >
                                Reset MFA
                              </button>

                              <button
                                onClick={() => handleResetPassword(u)}
                                title="Generate new temporary password"
                                className="super-btn-secondary"
                                style={{ padding: '6px 10px', fontSize: 11 }}
                              >
                                Reset Pass
                              </button>

                              <button
                                onClick={() => handleDeleteAdmin(u)}
                                title="Permanently remove admin account"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11, color: '#71717a', fontStyle: 'italic' }}>
                              Protected Root Account
                            </span>
                          )}
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

      {/* ==================== EDIT ADMIN CREDENTIALS MODAL ==================== */}
      {isEditAdminOpen && (
        <div className="super-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsEditAdminOpen(false); }}>
          <div className="super-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#eab308', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                  Superadmin Authority
                </span>
                <h3 style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: '#fff' }}>
                  Edit Admin Credentials
                </h3>
              </div>
              <button
                onClick={() => setIsEditAdminOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: 24, padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                  Admin Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editAdminForm.name}
                  onChange={(e) => setEditAdminForm({ ...editAdminForm, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="super-input"
                />
              </div>

              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editAdminForm.email}
                  onChange={(e) => setEditAdminForm({ ...editAdminForm, email: e.target.value })}
                  placeholder="e.g. marcus@penguin.com"
                  className="super-input"
                />
              </div>

              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                  Set New Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={editAdminForm.password}
                  onChange={(e) => setEditAdminForm({ ...editAdminForm, password: e.target.value })}
                  placeholder="Enter new password to overwrite"
                  className="super-input"
                />
              </div>

              <div style={{ background: '#09090b', padding: '12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 12, color: '#d4d4d8' }}>
                  <input
                    type="checkbox"
                    checked={editAdminForm.mfaEnabled}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, mfaEnabled: e.target.checked })}
                  />
                  <span><strong>2FA Hardware TOTP Active:</strong> Uncheck to force re-enrollment QR code on their next login</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsEditAdminOpen(false)}
                  className="super-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="super-btn-gold"
                >
                  {loading ? 'Saving...' : 'Save Admin Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== INVITE NEW ADMIN MODAL ==================== */}
      {isInviteAdminOpen && (
        <div className="super-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsInviteAdminOpen(false); }}>
          <div className="super-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#eab308', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                  Superadmin Authority
                </span>
                <h3 style={{ textTransform: 'uppercase', margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: '#fff' }}>
                  Invite Store Admin
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsInviteAdminOpen(false);
                  setCreatedAdminResult(null);
                }}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: 24, padding: 4 }}
              >
                ✕
              </button>
            </div>

            {createdAdminResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  padding: '16px',
                  borderRadius: 10,
                  color: '#fff',
                }}>
                  <div style={{ fontWeight: 800, color: '#34d399', marginBottom: 4 }}>
                    ✓ Store Admin Provisioned!
                  </div>
                  <p style={{ fontSize: 12, margin: '0 0 10px', color: '#d4d4d8' }}>
                    Provide these credentials to the store manager. They will be forced to configure their own Google Authenticator / Authy app upon first login.
                  </p>
                  <div style={{ background: '#09090b', padding: '12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div><strong>Admin Portal URL:</strong> <span style={{ color: '#eab308' }}>/penguin-ctrl-x7k2</span></div>
                    <div style={{ marginTop: 4 }}><strong>Email:</strong> {createdAdminResult.admin?.email}</div>
                    <div style={{ marginTop: 4 }}><strong>Temp Password:</strong> <code style={{ color: '#34d399', fontWeight: 'bold' }}>{createdAdminResult.tempPassword}</code></div>
                  </div>
                </div>

                <button
                  type="button"
                  className="super-btn-gold"
                  onClick={() => {
                    setIsInviteAdminOpen(false);
                    setCreatedAdminResult(null);
                  }}
                  style={{ width: '100%' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                    Admin Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    placeholder="e.g. Shop Manager"
                    className="super-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', display: 'block', marginBottom: 4, fontWeight: 700 }}>
                    Admin Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="e.g. owner@penguin.com"
                    className="super-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setIsInviteAdminOpen(false)}
                    className="super-btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="super-btn-gold"
                  >
                    {loading ? 'Creating...' : 'Provision Admin & Generate Credentials'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
