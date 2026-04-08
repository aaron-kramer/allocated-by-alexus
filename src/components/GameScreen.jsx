import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { ZONE_DEFS } from '../data/zones.js'
import { SPRITE_MAP } from '../data/items.js'
import { getItemDef, getItemType } from '../data/levels.js'
import {
  playPlaceSound, playErrorSound, playPickupSound,
  playCrateSound, playHintSound,
} from '../audio/audioSystem.js'
import ZoneCard from './ZoneCard.jsx'
import CrateCard from './CrateCard.jsx'
import LevelCompleteScreen from './LevelCompleteScreen.jsx'
import SparkleEffect from './SparkleEffect.jsx'
import Toast from './Toast.jsx'
import MuteButton from './MuteButton.jsx'

export default function GameScreen({ level, levelIdx, onComplete, onBack, onNext, hasNext }) {
  const [placedItems, setPlacedItems] = useState({})
  const [heldItem, setHeldItem] = useState(null)
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 })
  const [hintsActive, setHintsActive] = useState(false)
  const [animations, setAnimations] = useState({})
  const [sparkles, setSparkles] = useState([])
  const [toast, setToast] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentCrateId, setCurrentCrateId] = useState(level.crates[0]?.id)
  const [levelComplete, setLevelComplete] = useState(false)

  const startTimeRef = useRef(Date.now())
  const zoneRefs = useRef({})
  const timerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const completedRef = useRef(false)

  /* Timer */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  /* Derived: all item ids and placed set */
  const allItemIds = useMemo(() => level.crates.flatMap((c) => c.items), [level])
  const placedItemIdSet = useMemo(
    () => new Set(Object.keys(placedItems).filter((k) => placedItems[k]?.valid)),
    [placedItems]
  )

  /* Check level complete */
  useEffect(() => {
    if (completedRef.current) return
    const allPlaced = allItemIds.every((id) => placedItemIdSet.has(id))
    if (allPlaced && allItemIds.length > 0) {
      completedRef.current = true
      clearInterval(timerRef.current)
      setTimeout(() => {
        setLevelComplete(true)
        onComplete(level.id)
      }, 600)
    }
  }, [placedItemIdSet, allItemIds, onComplete, level.id])

  /* Animation helper */
  const triggerAnim = useCallback((itemId, animName) => {
    setAnimations((prev) => ({ ...prev, [itemId]: animName }))
    setTimeout(() => {
      setAnimations((prev) => {
        const n = { ...prev }
        delete n[itemId]
        return n
      })
    }, 600)
  }, [])

  /* Toast helper */
  const showToast = useCallback((msg, type = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, type, id: Date.now() })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  /* Pick up from a placed zone */
  const handlePickupFromZone = useCallback((itemId, fromZone) => {
    setHeldItem({ itemId, fromZone })
    playPickupSound()
    setPlacedItems((prev) => {
      const n = { ...prev }
      delete n[itemId]
      return n
    })
  }, [])

  /* Pick up from crate */
  const handlePickupFromCrate = useCallback((itemId) => {
    if (placedItemIdSet.has(itemId)) return
    setHeldItem({ itemId, fromCrate: currentCrateId })
    playPickupSound()
    playCrateSound()
  }, [placedItemIdSet, currentCrateId])

  /* Pointer/touch move */
  const handlePointerMove = useCallback((e) => {
    if (!heldItem) return
    const pt = e.touches ? e.touches[0] : e
    setPointerPos({ x: pt.clientX, y: pt.clientY })
  }, [heldItem])

  /* Drop: find zone by hit test, validate, place or reject */
  const handlePointerUp = useCallback((e) => {
    if (!heldItem) return
    const pt = e.changedTouches ? e.changedTouches[0] : e
    const { clientX, clientY } = pt

    let droppedZone = null
    for (const [zoneId, ref] of Object.entries(zoneRefs.current)) {
      if (!ref) continue
      const rect = ref.getBoundingClientRect()
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        droppedZone = zoneId
        break
      }
    }

    if (droppedZone) {
      const itemDef = getItemDef(heldItem.itemId)
      const zoneDef = ZONE_DEFS[droppedZone]
      const valid = zoneDef && itemDef && zoneDef.accepts.includes(itemDef.category)

      if (valid) {
        const itemsInZone = Object.values(placedItems).filter((v) => v.zoneId === droppedZone).length
        if (itemsInZone >= zoneDef.capacity) {
          showToast('Zone is full!')
          playErrorSound()
          if (heldItem.fromZone) {
            setPlacedItems((prev) => ({ ...prev, [heldItem.itemId]: { zoneId: heldItem.fromZone, valid: true } }))
          }
        } else {
          setPlacedItems((prev) => ({ ...prev, [heldItem.itemId]: { zoneId: droppedZone, valid: true } }))
          triggerAnim(heldItem.itemId, 'item-thunk')
          playPlaceSound()
          setSparkles((prev) => [...prev, { id: Date.now(), x: clientX, y: clientY }])
        }
      } else {
        playErrorSound()
        showToast(itemDef ? `${itemDef.name} doesn't go there!` : 'Wrong zone!')
        if (heldItem.fromZone) {
          setPlacedItems((prev) => ({ ...prev, [heldItem.itemId]: { zoneId: heldItem.fromZone, valid: true } }))
        }
      }
    } else {
      // Dropped in empty space — return to zone if from one
      if (heldItem.fromZone) {
        setPlacedItems((prev) => ({ ...prev, [heldItem.itemId]: { zoneId: heldItem.fromZone, valid: true } }))
      }
    }

    setHeldItem(null)
    setHintsActive(false)
  }, [heldItem, placedItems, showToast, triggerAnim])

  /* Tap a crate to pull the next item */
  const handleCrateTap = useCallback((crateId) => {
    const crate = level.crates.find((c) => c.id === crateId)
    if (!crate) return
    const nextItem = crate.items.find((id) => !placedItemIdSet.has(id))
    if (nextItem) {
      setCurrentCrateId(crateId)
      handlePickupFromCrate(nextItem)
    } else {
      const nextCrate = level.crates.find((c) => c.items.some((id) => !placedItemIdSet.has(id)))
      if (nextCrate) setCurrentCrateId(nextCrate.id)
    }
  }, [level.crates, placedItemIdSet, handlePickupFromCrate])

  /* Hint toggle */
  const handleHint = useCallback(() => {
    if (!heldItem) return
    setHintsActive((v) => !v)
    playHintSound()
  }, [heldItem])

  /* Display values */
  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const placedCount = placedItemIdSet.size
  const totalCount = allItemIds.length
  const HeldSprite = heldItem ? SPRITE_MAP[getItemType(heldItem.itemId)] : null

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* ── HUD ─────────────────────────────────────────── */}
      <div className="hud">
        {/* Back button + level name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none',
              color: '#8a78b0', fontSize: 20, cursor: 'pointer',
              padding: '4px 6px', touchAction: 'manipulation',
            }}
          >
            ←
          </button>
          <div>
            <div className="hud-level">{level.day}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#6a58a0', marginTop: 1 }}>
              {level.title}
            </div>
          </div>
        </div>

        {/* Item count */}
        <div className="hud-items">
          <div style={{ fontSize: 20, color: '#3a9870', fontWeight: 700 }}>
            {placedCount}
            <span style={{ color: '#a090c0', fontSize: 14 }}>/{totalCount}</span>
          </div>
          <div style={{ fontSize: 9, color: '#8070a8' }}>STOCKED</div>
        </div>

        {/* Timer + Hint + Mute */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div className="hud-timer">{timeStr}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className={`hint-btn ${hintsActive ? 'active' : ''}`}
              onClick={handleHint}
              disabled={!heldItem}
            >
              HINT
            </button>
            <MuteButton />
          </div>
        </div>
      </div>

      {/* ── Objective banner ────────────────────────────── */}
      <div style={{
        padding: '7px 14px',
        background: 'rgba(196,140,220,0.07)',
        borderBottom: '1px solid rgba(196,140,220,0.18)',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: '#6858a0',
        letterSpacing: '0.5px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ color: '#c060a0' }}>▸</span>
        {heldItem
          ? <span>Drop <strong style={{ color: '#2d1f4a' }}>{getItemDef(heldItem.itemId)?.name}</strong> in the correct zone — or tap HINT</span>
          : <span>Tap a crate below to grab an item, then drop it in the right zone</span>
        }
      </div>

      {/* ── Zones grid ──────────────────────────────────── */}
      <div className="zones-area">
        {level.zones.map((zoneId) => (
          <ZoneCard
            key={zoneId}
            ref={(el) => { zoneRefs.current[zoneId] = el }}
            zoneId={zoneId}
            zoneDef={ZONE_DEFS[zoneId]}
            placedItems={placedItems}
            heldItem={heldItem}
            hintsActive={hintsActive}
            onPickupFromZone={handlePickupFromZone}
            onItemAnim={(itemId) => animations[itemId] || ''}
          />
        ))}
        <div style={{ height: 10, gridColumn: 'span 2' }} />
      </div>

      {/* ── Crate area ──────────────────────────────────── */}
      <div className="crate-area">
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#6a4880',
          letterSpacing: '2px',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>📦 DELIVERY CRATES</span>
          {heldItem
            ? <span style={{ color: '#c060a0', fontWeight: 700 }}>✋ {getItemDef(heldItem.itemId)?.name}</span>
            : <span style={{ color: '#a090c0', fontSize: 10 }}>tap to grab an item</span>
          }
        </div>
        <div className="crate-scroll">
          {level.crates.map((crate) => {
            const isCurrent = crate.id === currentCrateId
            const isDone = crate.items.every((id) => placedItemIdSet.has(id))
            return (
              <CrateCard
                key={crate.id}
                crate={crate}
                isCurrent={isCurrent}
                isDone={isDone}
                placedItemIds={placedItemIdSet}
                onOpenCrate={handleCrateTap}
              />
            )
          })}
        </div>
      </div>

      {/* ── Floating held item ──────────────────────────── */}
      {heldItem && HeldSprite && (
        <div className="held-item" style={{ left: pointerPos.x, top: pointerPos.y }}>
          <HeldSprite size={54} />
        </div>
      )}

      {/* ── Sparkle effects ─────────────────────────────── */}
      {sparkles.map((s) => (
        <SparkleEffect
          key={s.id}
          x={s.x}
          y={s.y}
          onDone={() => setSparkles((prev) => prev.filter((p) => p.id !== s.id))}
        />
      ))}

      {/* ── Toast messages ──────────────────────────────── */}
      {toast && <Toast message={toast.msg} type={toast.type} id={toast.id} />}


      {/* ── Level complete overlay ──────────────────────── */}
      {levelComplete && (
        <LevelCompleteScreen
          level={level}
          elapsedTime={elapsedTime}
          onNext={onNext}
          onLevelSelect={onBack}
          hasNext={hasNext}
        />
      )}
    </div>
  )
}
