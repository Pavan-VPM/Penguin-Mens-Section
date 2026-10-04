import React, { useState, useEffect } from 'react'

const OFFERS = [
  '✨ COMPLIMENTARY EXPRESS ATELIER SHIPPING ACROSS INDIA',
  '🔥 NEW SEASON DROP: LUXE LINEN & ARCHITECTURAL STREETWEAR',
  '🛡️ 7-DAY EASY HASSLE-FREE RETURNS & INSTANT REFUNDS'
]

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % OFFERS.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="top-announcement-bar">
      <div className="ticker-item" style={{ animation: 'fadeIn 0.4s ease' }} key={currentIndex}>
        <span style={{ fontSize: 13, color: '#ffb300' }}>⚡</span>
        <span>{OFFERS[currentIndex]}</span>
      </div>
    </div>
  )
}
