import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(res?.message || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
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
            Penguin // Security
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 8px 0',
          }}>
            New Password
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-green-bg, rgba(34, 197, 94, 0.15))',
              color: 'var(--brand-green, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>verified</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>Password Updated</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Your password has been reset successfully. Redirecting you to login...
            </p>
            <Link
              to="/login"
              className="btn-solid-accent"
              style={{
                width: '100%',
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <>
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
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, display: 'block', letterSpacing: '0.05em' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
