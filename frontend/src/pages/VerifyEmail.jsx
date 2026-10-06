import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyCustomerEmail } from '../services/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function VerifyEmail() {
  const { token } = useParams();
  const { fetchProfile } = useCustomerAuth();

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    verifyCustomerEmail(token)
      .then((res) => {
        if (res?.success) {
          setStatus('success');
          setMessage(res.message || 'Email verified successfully.');
          fetchProfile();
        } else {
          setStatus('error');
          setMessage(res?.message || 'Verification link is invalid or expired.');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      });
  }, [token, fetchProfile]);

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
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      }}>
        {status === 'verifying' && (
          <div>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '3px solid var(--border-light)',
              borderTopColor: 'var(--brand-accent)',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }} />
            <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>Verifying Email...</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Please wait while we confirm your credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-green-bg, rgba(34, 197, 94, 0.15))',
              color: 'var(--brand-green, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>verified</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
              Email Verified
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
              Your email address has been verified successfully. Your Penguin Atelier membership is now fully authenticated.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/account"
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
                Go to My Account
              </Link>
              <Link
                to="/collection"
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
                Explore Collection
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>error</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>
              Verification Failed
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
              {message}
            </p>
            <Link
              to="/login"
              className="btn-solid-primary"
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
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
