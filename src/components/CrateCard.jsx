import React from 'react'
import { SPRITE_MAP } from '../data/items.js'
import { getItemType } from '../data/levels.js'

export default function CrateCard({ crate, isCurrent, isDone, placedItemIds, onOpenCrate }) {
  const totalItems = crate.items.length
  const placedCount = crate.items.filter((id) => placedItemIds.has(id)).length
  const nextUnplaced = crate.items.find((id) => !placedItemIds.has(id))
  const Sprite = nextUnplaced ? SPRITE_MAP[getItemType(nextUnplaced)] : null

  return (
    <div
      className={`crate-box ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
      onClick={() => !isDone && onOpenCrate(crate.id)}
    >
      <div className="crate-label">{crate.label}</div>

      {/* Mini crate illustration */}
      <svg width="50" height="30" viewBox="0 0 50 30" style={{ marginBottom: 4 }}>
        <rect x="1" y="4" width="48" height="25" rx="3" fill="#2a1a30" stroke="#8060a0" strokeWidth="1.5" />
        <rect x="1" y="4" width="48" height="25" rx="3" fill="#3a2848" />
        <line x1="1" y1="12" x2="49" y2="12" stroke="#6040a0" strokeWidth="1.5" />
        <line x1="1" y1="20" x2="49" y2="20" stroke="#6040a0" strokeWidth="1.5" />
        <line x1="16" y1="4" x2="16" y2="29" stroke="#6040a0" strokeWidth="1" />
        <line x1="33" y1="4" x2="33" y2="29" stroke="#6040a0" strokeWidth="1" />
        <rect x="17" y="1" width="16" height="5" rx="2" fill="#2a1a38" stroke="#8060a0" strokeWidth="1" />
        {isDone && (
          <text x="25" y="22" textAnchor="middle" fontSize="8" fill="#a0e8c4">✓</text>
        )}
      </svg>

      {/* Next item preview for active crate */}
      {isCurrent && Sprite && !isDone && (
        <div style={{ margin: '2px 0' }}>
          <Sprite size={40} />
        </div>
      )}

      {/* Dot progress indicators */}
      <div className="crate-items-preview">
        {crate.items.map((id) => (
          <div
            key={id}
            className={`crate-item-dot ${placedItemIds.has(id) ? 'placed' : ''}`}
          />
        ))}
      </div>
      <div className="crate-count">{placedCount}/{totalItems}</div>
    </div>
  )
}
