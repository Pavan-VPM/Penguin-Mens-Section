import React, { useState } from 'react'

const SIZE_DATA = [
  { size: 'S', chestIn: '38', chestCm: '96.5', lengthIn: '28', lengthCm: '71', shoulderIn: '17.5', shoulderCm: '44.5' },
  { size: 'M', chestIn: '40', chestCm: '101.5', lengthIn: '29', lengthCm: '73.5', shoulderIn: '18.2', shoulderCm: '46.2' },
  { size: 'L', chestIn: '42', chestCm: '106.5', lengthIn: '30', lengthCm: '76', shoulderIn: '19.0', shoulderCm: '48.2' },
  { size: 'XL', chestIn: '44', chestCm: '111.8', lengthIn: '31', lengthCm: '78.5', shoulderIn: '19.8', shoulderCm: '50.3' },
  { size: 'XXL', chestIn: '46', chestCm: '116.8', lengthIn: '31.5', lengthCm: '80', shoulderIn: '20.5', shoulderCm: '52' },
]

export default function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('in')

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 540,
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-md)',
        padding: 24,
        zIndex: 110,
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-light)',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase' }}>Size & Fit Guide</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Measurements for standard relaxed & tailored cuts</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Unit Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
          <button 
            onClick={() => setUnit('in')}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: unit === 'in' ? '1px solid var(--brand-primary)' : '1px solid var(--border-light)',
              backgroundColor: unit === 'in' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
              color: unit === 'in' ? 'var(--text-inverse)' : 'var(--text-primary)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Inches (in)
          </button>
          <button 
            onClick={() => setUnit('cm')}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: unit === 'cm' ? '1px solid var(--brand-primary)' : '1px solid var(--border-light)',
              backgroundColor: unit === 'cm' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
              color: unit === 'cm' ? 'var(--text-inverse)' : 'var(--text-primary)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Centimeters (cm)
          </button>
        </div>

        {/* Measurement Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Size</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Chest</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Length</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Shoulder</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map((row) => (
                <tr key={row.size} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>{row.size}</td>
                  <td style={{ padding: '10px 12px' }}>{unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                  <td style={{ padding: '10px 12px' }}>{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                  <td style={{ padding: '10px 12px' }}>{unit === 'in' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div style={{ marginTop: 16, padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
          💡 <strong>Fit Advice:</strong> If you prefer an oversized or relaxed streetwear drape, select your true size. For a fitted tailored look, consider sizing down one size.
        </div>
      </div>
    </>
  )
}
