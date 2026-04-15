import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { RECIPES } from '../data/recipes.js'
import {
  playPlaceSound, playErrorSound, playPickupSound,
} from '../audio/audioSystem.js'
import LevelCompleteScreen from './LevelCompleteScreen.jsx'
import SparkleEffect from './SparkleEffect.jsx'
import Toast from './Toast.jsx'
import MuteButton from './MuteButton.jsx'

// ─── Grid constants ────────────────────────────────────────────────────────────
const COLS = 6
const ROWS = 7

// ─── Category appearance ───────────────────────────────────────────────────────
const CATEGORY_COLOR = {
  produce:   '#44b872',
  protein:   '#e25040',
  dry_goods: '#d09048',
  liquor:    '#8848c8',
}
const CATEGORY_EMOJI = {
  produce:   '🥦',
  protein:   '🍖',
  dry_goods: '🥫',
  liquor:    '🍾',
}
const CATEGORY_LABEL = {
  produce:   'Produce',
  protein:   'Protein',
  dry_goods: 'Dry Goods',
  liquor:    'Liquor',
}

// ─── Utility ───────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

let tileIdCounter = 0
function makeTile(category) {
  return { id: `t${tileIdCounter++}`, category }
}

// Build initial grid with no pre-existing matches
function buildGridNoMatches(rows, cols, tileTypes) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    grid.push([])
    for (let c = 0; c < cols; c++) {
      // Shuffle tileTypes and pick the first that doesn't create a 3-match
      const shuffled = [...tileTypes].sort(() => Math.random() - 0.5)
      let chosen = shuffled[0]
      for (const cat of shuffled) {
        const h2 = c >= 2 && grid[r][c - 1].category === cat && grid[r][c - 2].category === cat
        const v2 = r >= 2 && grid[r - 1][c].category === cat && grid[r - 2][c].category === cat
        if (!h2 && !v2) { chosen = cat; break }
      }
      grid[r].push(makeTile(chosen))
    }
  }
  return grid
}

// Find all horizontal + vertical match-3+ positions, returned as Set of "r,c"
function findMatches(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const matched = new Set()

  // Horizontal runs
  for (let r = 0; r < rows; r++) {
    let c = 0
    while (c < cols) {
      const cat = grid[r][c]?.category
      if (!cat) { c++; continue }
      let end = c + 1
      while (end < cols && grid[r][end]?.category === cat) end++
      if (end - c >= 3) {
        for (let i = c; i < end; i++) matched.add(`${r},${i}`)
      }
      c = end
    }
  }

  // Vertical runs
  for (let c = 0; c < cols; c++) {
    let r = 0
    while (r < rows) {
      const cat = grid[r][c]?.category
      if (!cat) { r++; continue }
      let end = r + 1
      while (end < rows && grid[end][c]?.category === cat) end++
      if (end - r >= 3) {
        for (let i = r; i < end; i++) matched.add(`${i},${c}`)
      }
      r = end
    }
  }

  return matched
}

// Drop tiles down to fill gaps (null cells)
function applyGravity(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const newGrid = grid.map(row => [...row])
  for (let c = 0; c < cols; c++) {
    const tiles = []
    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) tiles.push(newGrid[r][c])
    }
    for (let r = rows - 1; r >= 0; r--) {
      newGrid[r][c] = tiles.shift() ?? null
    }
  }
  return newGrid
}

// Replace null cells with new random tiles
function fillNulls(grid, tileTypes) {
  return grid.map(row =>
    row.map(cell => cell === null ? makeTile(tileTypes[Math.floor(Math.random() * tileTypes.length)]) : cell)
  )
}

// ─── Ticket card ───────────────────────────────────────────────────────────────
function OrderTicketCard({ recipe, filled, isDone, tableNum }) {
  const filledCounts = {}
  for (const cat of filled) filledCounts[cat] = (filledCounts[cat] || 0) + 1

  const slots = []
  const runningNeeds = {}
  for (const cat of recipe.items) {
    const n = (runningNeeds[cat] || 0) + 1
    runningNeeds[cat] = n
    const got = filledCounts[cat] || 0
    slots.push({ cat, isFilled: got >= n })
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
        {slots.map(({ cat, isFilled }, idx) => {
          const color = CATEGORY_COLOR[cat]
          return (
            <div
              key={idx}
              className={`ticket-slot${isFilled ? ' slot-filled' : ''}`}
              style={!isFilled ? {
                background: `${color}18`,
                borderColor: `${color}66`,
              } : undefined}
            >
              <span style={{ fontSize: 18, lineHeight: 1, opacity: isFilled ? 0.35 : 1 }}>
                {CATEGORY_EMOJI[cat]}
              </span>
              {isFilled && <div className="slot-checkmark">✓</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main game screen ──────────────────────────────────────────────────────────
export default function GameScreen({ level, onComplete, onBack, onNext, hasNext }) {
  const { tileTypes } = level

  const [grid, setGrid] = useState(() => buildGridNoMatches(ROWS, COLS, tileTypes))
  const [selected, setSelected] = useState(null)       // { row, col } | null
  const [matchedCells, setMatchedCells] = useState(new Set())
  const [processing, setProcessing] = useState(false)
  const [filledSlots, setFilledSlots] = useState({})
  const [sparkles, setSparkles] = useState([])
  const [toast, setToast] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [levelComplete, setLevelComplete] = useState(false)
  const [tileSize, setTileSize] = useState(48)

  // Stable refs for async callbacks
  const gridRef = useRef(grid)
  gridRef.current = grid
  const processingRef = useRef(false)
  const completedRef = useRef(false)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)
  const toastTimerRef = useRef(null)
  const gridAreaRef = useRef(null)

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Compute tile size to fill available grid area
  useEffect(() => {
    const update = () => {
      if (!gridAreaRef.current) return
      const { width, height } = gridAreaRef.current.getBoundingClientRect()
      const gap = 4
      const pad = 10
      const maxByW = Math.floor((width  - pad * 2 - gap * (COLS - 1)) / COLS)
      const maxByH = Math.floor((height - pad * 2 - gap * (ROWS - 1)) / ROWS)
      setTileSize(Math.min(maxByW, maxByH, 60))
    }
    // Run after paint so the container has its real size
    const id = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', update) }
  }, [])

  // Derive completed orders
  const completedOrderIds = useMemo(() => {
    const done = new Set()
    for (const order of level.orders) {
      const recipe = RECIPES[order.recipeId]
      const filled = filledSlots[order.id] || []
      if (filled.length >= recipe.items.length) done.add(order.id)
    }
    return done
  }, [filledSlots, level.orders])

  // Level complete trigger
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

  // Toast helper
  const showToast = useCallback((msg, type = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, type, id: Date.now() })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  // Route matched categories to orders (functional update — always latest state)
  const deliverMatches = useCallback((matches, currentGrid) => {
    const categoryCounts = {}
    for (const key of matches) {
      const [r, c] = key.split(',').map(Number)
      const cat = currentGrid[r][c]?.category
      if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    }

    setFilledSlots(prev => {
      let updated = { ...prev }
      for (const [cat, totalCount] of Object.entries(categoryCounts)) {
        let remaining = totalCount
        for (const order of level.orders) {
          if (remaining === 0) break
          const recipe = RECIPES[order.recipeId]
          const filled = updated[order.id] || []
          if (filled.length >= recipe.items.length) continue // already done
          const needed = recipe.items.filter(x => x === cat).length
          const got    = filled.filter(x => x === cat).length
          const canDeliver = Math.min(needed - got, remaining)
          if (canDeliver > 0) {
            updated = { ...updated, [order.id]: [...filled, ...Array(canDeliver).fill(cat)] }
            remaining -= canDeliver
          }
        }
      }
      return updated
    })
  }, [level.orders])

  // Cascade: find matches → deliver → clear → gravity → fill → repeat
  const processMatchCascade = useCallback(async (startGrid) => {
    setProcessing(true)
    processingRef.current = true
    let g = startGrid

    while (true) {
      const matches = findMatches(g)
      if (matches.size === 0) break

      setMatchedCells(new Set(matches))
      playPlaceSound()
      await delay(300)

      deliverMatches(matches, g)

      const cleared = g.map((row, r) =>
        row.map((cell, c) => (matches.has(`${r},${c}`) ? null : cell))
      )
      const afterGravity = applyGravity(cleared)
      setMatchedCells(new Set())
      setGrid(afterGravity)
      await delay(180)

      const filled = fillNulls(afterGravity, tileTypes)
      setGrid(filled)
      await delay(150)

      g = filled
    }

    setProcessing(false)
    processingRef.current = false
  }, [deliverMatches, tileTypes])

  // Tile tap handler
  const handleTileTap = useCallback(async (row, col, e) => {
    if (processingRef.current) return

    // First tap → select
    if (!selected) {
      playPickupSound()
      setSelected({ row, col })
      return
    }

    // Tap same tile → deselect
    if (selected.row === row && selected.col === col) {
      setSelected(null)
      return
    }

    const dr = Math.abs(selected.row - row)
    const dc = Math.abs(selected.col - col)

    // Non-adjacent → move selection
    if (dr + dc !== 1) {
      playPickupSound()
      setSelected({ row, col })
      return
    }

    // Adjacent → attempt swap
    const selRow = selected.row
    const selCol = selected.col
    setSelected(null)
    processingRef.current = true
    setProcessing(true)

    const originalGrid = gridRef.current
    const swapped = originalGrid.map(r => [...r])
    const tmp = swapped[selRow][selCol]
    swapped[selRow][selCol] = swapped[row][col]
    swapped[row][col] = tmp
    setGrid(swapped)

    const pt = e.nativeEvent?.changedTouches?.[0] ?? e
    setSparkles(prev => [...prev, { id: Date.now(), x: pt.clientX, y: pt.clientY }])

    await delay(110)

    const matches = findMatches(swapped)
    if (matches.size === 0) {
      playErrorSound()
      setGrid(originalGrid)
      processingRef.current = false
      setProcessing(false)
      showToast('No match!')
      return
    }

    await processMatchCascade(swapped)
  }, [selected, processMatchCascade, showToast])

  // ── Render ──────────────────────────────────────────────────────────────────
  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const doneOrders  = completedOrderIds.size
  const totalOrders = level.orders.length

  const gridWidth  = COLS * tileSize + (COLS - 1) * 4
  const gridHeight = ROWS * tileSize + (ROWS - 1) * 4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>

      {/* HUD */}
      <div className="hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#8a78b0', fontSize: 20, cursor: 'pointer', padding: '4px 6px', touchAction: 'manipulation' }}
          >←</button>
          <div>
            <div className="hud-level">{level.day}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#6a58a0', marginTop: 1 }}>{level.title}</div>
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

      {/* Category legend / status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px',
        background: '#faf8ff',
        borderTop: '1px solid rgba(196,140,220,0.15)',
        borderBottom: '1px solid rgba(196,140,220,0.15)',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {tileTypes.map(cat => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 13, height: 13, borderRadius: 3, background: CATEGORY_COLOR[cat], flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#6858a0', fontFamily: "'IBM Plex Mono', monospace" }}>
              {CATEGORY_LABEL[cat]}
            </span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: processing ? '#c060a0' : '#a090c0' }}>
          {processing ? 'matching…' : selected ? '▸ tap adjacent' : '▸ tap a tile'}
        </div>
      </div>

      {/* Match-three grid */}
      <div
        ref={gridAreaRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0ebff',
          overflow: 'hidden',
          padding: 10,
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${tileSize}px)`,
          gridTemplateRows:    `repeat(${ROWS}, ${tileSize}px)`,
          gap: 4,
          width: gridWidth,
          height: gridHeight,
        }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key      = `${r},${c}`
              const isSelected = selected?.row === r && selected?.col === c
              const isMatched  = matchedCells.has(key)
              const color      = CATEGORY_COLOR[cell?.category] ?? '#ccc'
              const radius     = Math.max(6, Math.round(tileSize * 0.18))

              return (
                <div
                  key={cell?.id ?? key}
                  onPointerDown={(e) => handleTileTap(r, c, e)}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    borderRadius: radius,
                    background: isMatched
                      ? color
                      : `linear-gradient(145deg, ${color}ee, ${color}99)`,
                    border: isSelected
                      ? `3px solid #fff`
                      : `2px solid ${color}55`,
                    boxShadow: isSelected
                      ? `0 0 0 3px #b040a0, 0 4px 16px ${color}80`
                      : isMatched
                        ? `0 0 18px 5px ${color}bb`
                        : `0 2px 5px ${color}44, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: Math.round(tileSize * 0.46),
                    lineHeight: 1,
                    cursor: 'pointer',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    transition: 'transform 0.1s, box-shadow 0.12s, opacity 0.12s',
                    transform: isMatched
                      ? 'scale(1.18)'
                      : isSelected
                        ? 'scale(1.1)'
                        : 'scale(1)',
                    opacity: isMatched ? 0.8 : 1,
                    willChange: 'transform',
                  }}
                >
                  {CATEGORY_EMOJI[cell?.category]}
                </div>
              )
            })
          )}
        </div>
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
