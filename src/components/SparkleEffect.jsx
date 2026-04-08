import React, { useEffect } from 'react'

export default function SparkleEffect({ x, y, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 700)
    return () => clearTimeout(t)
  }, [onDone])

  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2
    const dist = 20 + Math.random() * 10
    const colors = ['#f4a7c3', '#c4a8f0', '#a0e8c4', '#f8c4a0', '#f0d4a8', '#d0a8f8']
    const color = colors[i % colors.length]
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color }
  })

  return (
    <div className="sparkle-container" style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            left: p.dx,
            top: p.dy,
            background: p.color,
            animationDelay: `${i * 0.04}s`,
            boxShadow: `0 0 6px ${p.color}`,
            animationDuration: `${0.5 + Math.random() * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}
