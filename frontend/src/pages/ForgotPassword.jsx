import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
            Account Recovery
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 24,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 8px 0',
          }}>
            Reset Password
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Enter your registered email address and we'll send you a secure link to reset your credentials.
          </p>
        </div>

        {submitted ? (
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
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>mark_email_read</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>Check Your Inbox</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              If an account matches <strong>{email}</strong>, a recovery link has been dispatched. Links expire in 60 minutes.
            </p>
            <Link
              to="/login"
              className="btn-outline"
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
              Return to Login
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
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? 'Sending Link...' : 'Send Recovery Link'}
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
              Remembered your password?{' '}
              <Link
                to="/login"
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
