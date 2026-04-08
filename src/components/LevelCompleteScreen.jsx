import React, { useEffect } from 'react'
import { playLevelCompleteSound } from '../audio/audioSystem.js'

export default function LevelCompleteScreen({ level, elapsedTime, onNext, onLevelSelect, hasNext }) {
  useEffect(() => {
    playLevelCompleteSound()
  }, [])

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="level-complete-screen">
      <div className="complete-badge">✓ SHIFT COMPLETE!</div>
      <div className="complete-title">
        {level.day}
        <br />
        {level.title}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        color: '#c9b8e8',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 1.7,
      }}>
        Everything is stocked and in the right place. Doors open soon!
      </div>
      <div className="complete-stars">
        {[1, 2, 3].map((s) => (
          <div key={s} className="complete-star">★</div>
        ))}
      </div>
      <div className="complete-stats">
        <div>TIME &nbsp;&nbsp;&nbsp;→ <span style={{ color: '#f5eeff' }}>{timeStr}</span></div>
        <div>STOCKED → <span style={{ color: '#a0e8c4' }}>ALL ITEMS</span></div>
        <div>RATING &nbsp;→ <span style={{ color: '#f0d4a8' }}>PERFECT SHIFT</span></div>
      </div>
      <div className="complete-buttons">
        {hasNext && (
          <button className="glow-btn" onClick={onNext}>NEXT DAY →</button>
        )}
        {!hasNext && (
          <button
            className="glow-btn"
            onClick={onLevelSelect}
            style={{ background: 'linear-gradient(135deg, #a0e8c4, #50c890)', color: '#1a0f2e' }}
          >
            ALL SHIFTS DONE! 🎉
          </button>
        )}
        <button className="glow-btn secondary" onClick={onLevelSelect}>
          LEVEL SELECT
        </button>
      </div>
    </div>
  )
}
