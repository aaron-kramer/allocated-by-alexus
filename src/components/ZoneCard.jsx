import React from 'react'
import { SPRITE_MAP } from '../data/items.js'
import { getItemDef, getItemType } from '../data/levels.js'

const ZoneCard = React.forwardRef(function ZoneCard(
  { zoneDef, zoneId, placedItems, heldItem, hintsActive, onPickupFromZone, onItemAnim },
  ref
) {
  const isValidDrop = heldItem && zoneDef.accepts.includes(getItemDef(heldItem.itemId)?.category)
  const showHint = hintsActive && isValidDrop

  const itemsInZone = Object.entries(placedItems)
    .filter(([, v]) => v.zoneId === zoneId)
    .map(([itemId]) => itemId)

  const emptySlots = Math.max(0, zoneDef.capacity - itemsInZone.length)

  return (
    <div
      ref={ref}
      className={`zone-card ${zoneDef.cssClass} ${showHint ? 'zone-valid-hover' : ''}`}
      style={{
        gridColumn: ['walkin', 'dry_storage', 'service_station'].includes(zoneId) ? 'span 2' : 'span 1',
      }}
    >
      <div className="zone-label">{zoneDef.shortName}</div>
      <div className="zone-slots">
        {itemsInZone.map((itemId) => {
          const def = getItemDef(itemId)
          const Sprite = SPRITE_MAP[getItemType(itemId)]
          const anim = onItemAnim(itemId)
          return (
            <div
              key={itemId}
              className={`zone-slot filled ${anim}`}
              title={def?.name}
              onPointerDown={(e) => {
                e.stopPropagation()
                onPickupFromZone(itemId, zoneId)
              }}
              style={{ cursor: 'grab' }}
            >
              {Sprite && <Sprite size={36} />}
            </div>
          )
        })}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="zone-slot" />
        ))}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
        color: 'rgba(255,255,255,0.22)',
        marginTop: 4,
        letterSpacing: 0.5,
      }}>
        {zoneDef.accepts.join(' · ')}
      </div>
    </div>
  )
})

export default ZoneCard
