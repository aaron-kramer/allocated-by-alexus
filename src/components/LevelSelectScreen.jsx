import React from 'react'
import { LEVELS } from '../data/levels.js'
import { RECIPES } from '../data/recipes.js'

export default function LevelSelectScreen({ completedLevels, onSelectLevel, onBack }) {
  return (
    <div className="level-select-screen">
      {/* Header row */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 400,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '2px solid rgba(196,168,240,0.3)',
            color: '#8a78b0',
            borderRadius: 8,
            padding: '8px 14px',
            cursor: 'pointer',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            minHeight: 44,
            touchAction: 'manipulation',
          }}
        >
          ← BACK
        </button>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
          color: '#f4a7c3',
          textShadow: '0 0 12px rgba(244,167,195,0.6)',
        }}>
          SELECT DAY
        </div>
      </div>

      {LEVELS.map((level, i) => {
        const isCompleted = completedLevels.includes(level.id)
        const isLocked = i > 0 && !completedLevels.includes(LEVELS[i - 1].id)
        const orderEmojis = level.orders.map(o => RECIPES[o.recipeId].emoji).join(' ')
        return (
          <div
            key={level.id}
            className={`level-card ${isLocked ? 'locked' : ''}`}
            onClick={() => !isLocked && onSelectLevel(i)}
            style={{ maxWidth: 400, width: '100%', position: 'relative' }}
          >
            <div className="level-card-day">{level.day}</div>
            <div className="level-card-name">{level.title}</div>
            <div className="level-card-desc">{level.description}</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 18,
              marginTop: 8,
              letterSpacing: 2,
            }}>
              {orderEmojis}
            </div>
            <div className="level-stars">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`star ${isCompleted ? 'earned' : ''}`}>
                  {isCompleted ? '★' : '☆'}
                </span>
              ))}
            </div>
            {isLocked && (
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 20 }}>🔒</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
