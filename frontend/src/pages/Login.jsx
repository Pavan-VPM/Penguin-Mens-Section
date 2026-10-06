import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { resendCustomerVerification } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomerAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Unverified state handling
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnverified(false);
    setResendStatus('');
    setLoading(true);

    try {
      const res = await login(form);
      if (res?.success) {
        const redirectTo = location.state?.from || '/account';
        navigate(redirectTo);
      } else {
        if (res?.unverified) {
          setIsUnverified(true);
          setUnverifiedEmail(res.email || form.email);
        }
        setError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.unverified) {
        setIsUnverified(true);
        setUnverifiedEmail(resp.email || form.email);
      }
      setError(resp?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendStatus('');
    try {
      const res = await resendCustomerVerification(unverifiedEmail || form.email);
      setResendStatus(res?.message || 'Verification link resent to your email.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Could not resend verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px 80px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'var(--brand-accent)',
            display: 'block',
            marginBottom: 8,
          }}>
            Penguin // Atelier
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 8px 0',
          }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Sign in to access your orders, saved addresses, and tailored wishlist.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: isUnverified ? 'rgba(212, 163, 115, 0.12)' : 'rgba(239, 68, 68, 0.1)',
            border: isUnverified ? '1px solid rgba(212, 163, 115, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 6,
            color: isUnverified ? 'var(--brand-gold, #d4a373)' : '#ef4444',
            fontSize: 13,
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 800, marginBottom: isUnverified ? 6 : 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {isUnverified ? 'mail_lock' : 'error'}
              </span>
              <span>{isUnverified ? 'Email Verification Required' : 'Authentication Error'}</span>
            </div>
            <div>{error}</div>

            {isUnverified && (
              <div style={{ marginTop: 12, borderTop: '1px solid rgba(212, 163, 115, 0.2)', paddingTop: 10 }}>
                {resendStatus ? (
                  <div style={{ color: 'var(--brand-green, #22c55e)', fontWeight: 700, fontSize: 12 }}>
                    {resendStatus}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-accent)',
                      fontWeight: 800,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: resending ? 'not-allowed' : 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    {resending ? 'Sending Link...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, display: 'block', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                borderRadius: 4,
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Forgot?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 40px 0 14px',
                  borderRadius: 4,
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-solid-accent"
            style={{
              width: '100%',
              height: 48,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-secondary)',
        }}>
          New to Penguin?{' '}
          <Link
            to="/signup"
            state={location.state}
            style={{
              color: 'var(--brand-accent)',
              fontWeight: 700,
              textDecoration: 'none',
              marginLeft: 4,
            }}
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
