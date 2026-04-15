import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { RECIPES } from '../data/recipes.js'
import { SPRITE_MAP, ITEM_DEFS } from '../data/items.js'
import {
  playPlaceSound, playErrorSound, playPickupSound,
} from '../audio/audioSystem.js'
import LevelCompleteScreen from './LevelCompleteScreen.jsx'
import SparkleEffect from './SparkleEffect.jsx'
import Toast from './Toast.jsx'
import MuteButton from './MuteButton.jsx'

function buildPool(level) {
  const pool = []
  const counts = {}
  for (const order of level.orders) {
    const recipe = RECIPES[order.recipeId]
    for (const itemType of recipe.items) {
      const n = counts[itemType] || 0
      pool.push({ id: `${itemType}_${n}`, type: itemType })
      counts[itemType] = n + 1
    }
  }
  return pool
}

function OrderTicketCard({ recipe, filled, isDone, tableNum }) {
  const filledCounts = {}
  for (const t of filled) filledCounts[t] = (filledCounts[t] || 0) + 1

  const slots = []
  const runningNeeds = {}
  for (const itemType of recipe.items) {
    const n = (runningNeeds[itemType] || 0) + 1
    runningNeeds[itemType] = n
    const got = filledCounts[itemType] || 0
    slots.push({ itemType, isFilled: got >= n })
  }

  return (
    <div className={`order-ticket${isDone ? ' ticket-done' : ''}`}>
      <div className="ticket-header">
        <span className="ticket-table">TABLE {tableNum}</span>
        {isDone && <span className="ticket-check-badge">✓</span>}
      </div>
      <div className="ticket-emoji">{recipe.emoji}</div>
      <div className="ticket-name">{recipe.name}</div>
      <div className="ticket-slots">
        {slots.map(({ itemType, isFilled }, idx) => {
          const Sprite = SPRITE_MAP[itemType]
          return (
            <div key={idx} className={`ticket-slot${isFilled ? ' slot-filled' : ''}`}>
              {Sprite && <Sprite size={26} />}
              {isFilled && <div className="slot-checkmark">✓</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function GameScreen({ level, onComplete, onBack, onNext, hasNext }) {
  const [filledSlots, setFilledSlots] = useState({})
  const [shelfPool, setShelfPool] = useState(() => buildPool(level))
  const [poppingItems, setPoppingItems] = useState(new Set())
  const [sparkles, setSparkles] = useState([])
  const [toast, setToast] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [levelComplete, setLevelComplete] = useState(false)

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const completedRef = useRef(false)
  const filledSlotsRef = useRef(filledSlots)
  filledSlotsRef.current = filledSlots

  // Derived: completed order ids
  const completedOrderIds = useMemo(() => {
    const done = new Set()
    for (const order of level.orders) {
      const recipe = RECIPES[order.recipeId]
      const filled = filledSlots[order.id] || []
      if (filled.length >= recipe.items.length) done.add(order.id)
    }
    return done
  }, [filledSlots, level.orders])

  const completedOrderIdsRef = useRef(completedOrderIds)
  completedOrderIdsRef.current = completedOrderIds

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Level complete check
  useEffect(() => {
    if (completedRef.current) return
    if (completedOrderIds.size === level.orders.length && level.orders.length > 0) {
      completedRef.current = true
      clearInterval(timerRef.current)
      setTimeout(() => {
        setLevelComplete(true)
        onComplete(level.id)
      }, 600)
    }
  }, [completedOrderIds, level.orders.length, onComplete, level.id])

  const showToast = useCallback((msg, type = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, type, id: Date.now() })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const handleShelfTap = useCallback((poolItem, e) => {
    if (poppingItems.has(poolItem.id)) return

    playPickupSound()

    const currentFilled = filledSlotsRef.current
    const currentCompleted = completedOrderIdsRef.current

    // Find first unfilled order that needs this item type
    let targetOrderId = null
    for (const order of level.orders) {
      if (currentCompleted.has(order.id)) continue
      const recipe = RECIPES[order.recipeId]
      const filled = currentFilled[order.id] || []
      const needed = recipe.items.filter(x => x === poolItem.type).length
      const got = filled.filter(x => x === poolItem.type).length
      if (got < needed) {
        targetOrderId = order.id
        break
      }
    }

    if (!targetOrderId) {
      playErrorSound()
      showToast('No order needs that right now!')
      return
    }

    // Deliver to target order
    setFilledSlots(prev => {
      const filled = prev[targetOrderId] || []
      return { ...prev, [targetOrderId]: [...filled, poolItem.type] }
    })

    // Sparkle at tap position
    const pt = e.nativeEvent?.changedTouches?.[0] ?? e
    setSparkles(prev => [...prev, { id: Date.now(), x: pt.clientX, y: pt.clientY }])
    playPlaceSound()

    // Pop animation then remove from shelf
    setPoppingItems(prev => new Set([...prev, poolItem.id]))
    setTimeout(() => {
      setShelfPool(prev => prev.filter(p => p.id !== poolItem.id))
      setPoppingItems(prev => {
        const n = new Set(prev)
        n.delete(poolItem.id)
        return n
      })
    }, 220)
  }, [level.orders, poppingItems, showToast])

  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const doneOrders = completedOrderIds.size
  const totalOrders = level.orders.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* HUD */}
      <div className="hud">
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

        <div className="hud-items">
          <div style={{ fontSize: 20, color: '#3a9870', fontWeight: 700 }}>
            {doneOrders}<span style={{ color: '#a090c0', fontSize: 14 }}>/{totalOrders}</span>
          </div>
          <div style={{ fontSize: 9, color: '#8070a8' }}>SERVED</div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div className="hud-timer">{timeStr}</div>
          <MuteButton />
        </div>
      </div>

      {/* Instruction banner */}
      <div style={{
        padding: '7px 14px',
        background: 'rgba(196,140,220,0.07)',
        borderBottom: '1px solid rgba(196,140,220,0.18)',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        color: '#6858a0',
        letterSpacing: '0.5px',
        flexShrink: 0,
      }}>
        <span style={{ color: '#c060a0' }}>▸</span>
        {shelfPool.length > 0
          ? ' Tap an ingredient — it goes to the right order automatically!'
          : ' All ingredients sent! Orders are being prepared...'}
      </div>

      {/* Order ticket rail */}
      <div className="tickets-area">
        {level.orders.map((order, i) => {
          const recipe = RECIPES[order.recipeId]
          const filled = filledSlots[order.id] || []
          const isDone = completedOrderIds.has(order.id)
          return (
            <OrderTicketCard
              key={order.id}
              recipe={recipe}
              filled={filled}
              isDone={isDone}
              tableNum={i + 1}
            />
          )
        })}
      </div>

      {/* Shelf label */}
      <div style={{
        padding: '8px 14px 4px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: '#6a4880',
        letterSpacing: '2px',
        background: '#ffffff',
        borderTop: '2px solid rgba(196,150,210,0.25)',
        flexShrink: 0,
      }}>
        📦 DELIVERY · {shelfPool.length} ingredient{shelfPool.length !== 1 ? 's' : ''} remaining
      </div>

      {/* Ingredient shelf */}
      <div className="shelf-area">
        {shelfPool.map((poolItem) => {
          const Sprite = SPRITE_MAP[poolItem.type]
          const def = ITEM_DEFS[poolItem.type]
          const isPopping = poppingItems.has(poolItem.id)
          return (
            <button
              key={poolItem.id}
              className={`shelf-item${isPopping ? ' shelf-pop' : ''}`}
              onPointerDown={(e) => handleShelfTap(poolItem, e)}
            >
              {Sprite && <Sprite size={38} />}
              <div className="shelf-item-name">{def?.name}</div>
            </button>
          )
        })}
      </div>

      {sparkles.map(s => (
        <SparkleEffect
          key={s.id}
          x={s.x}
          y={s.y}
          onDone={() => setSparkles(prev => prev.filter(p => p.id !== s.id))}
        />
      ))}

      {toast && <Toast message={toast.msg} type={toast.type} id={toast.id} />}

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
