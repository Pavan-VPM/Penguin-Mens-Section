import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { resendCustomerVerification } from '../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useCustomerAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verification prompt screen after signup
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(form);
      if (res?.success) {
        setSignedUpEmail(form.email);
        setIsVerificationPending(true);
      } else {
        setError(res?.message || 'Failed to create account.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendStatus('');
    try {
      const res = await resendCustomerVerification(signedUpEmail);
      setResendStatus(res?.message || 'Verification link resent to your email.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Failed to resend link.');
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
        maxWidth: 440,
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      }}>
        {isVerificationPending ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-gold-bg, rgba(212, 163, 115, 0.15))',
              color: 'var(--brand-gold, #d4a373)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>mark_email_unread</span>
            </div>

            <span style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--brand-accent)',
              display: 'block',
              marginBottom: 8,
            }}>
              Activation Required
            </span>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: 10,
            }}>
              Check Your Inbox
            </h1>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              We've dispatched an activation link to <strong>{signedUpEmail}</strong>. Please click the link to verify your email before logging in.
            </p>

            {resendStatus && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 4,
                color: 'var(--brand-green, #22c55e)',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 18,
                width: '100%',
              }}>
                {resendStatus}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="btn-outline"
                style={{
                  height: 44,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: resending ? 'not-allowed' : 'pointer',
                }}
              >
                {resending ? 'Sending Link...' : 'Resend Verification Link'}
              </button>

              <Link
                to="/login"
                className="btn-solid-accent"
                style={{
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Proceed to Log In
              </Link>
            </div>
          </div>
        ) : (
          <>
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
                Penguin // Membership
              </span>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 24,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: '0 0 8px 0',
              }}>
                Create Account
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Join Penguin Atelier for priority access, seamless checkout, and private order archives.
              </p>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 6,
                color: '#ef4444',
                fontSize: 13,
                marginBottom: 20,
                lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, display: 'block', letterSpacing: '0.05em' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adrian Vance"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    Phone Number
                  </label>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Optional</span>
                </div>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, display: 'block', letterSpacing: '0.05em' }}>
                  Password (Min 8 Characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
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
                {loading ? 'Creating Account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link
                to="/login"
                state={location.state}
                style={{
                  color: 'var(--brand-accent)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginLeft: 4,
                }}
              >
                Log In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
