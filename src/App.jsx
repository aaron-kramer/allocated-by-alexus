import React, { useState, useCallback } from 'react'
import { LEVELS } from './data/levels.js'
import IntroScreen from './components/IntroScreen.jsx'
import LevelSelectScreen from './components/LevelSelectScreen.jsx'
import GameScreen from './components/GameScreen.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#1a0f2e', color: '#f4a7c3',
          fontFamily: 'monospace', fontSize: 13, padding: 24, overflow: 'auto', whiteSpace: 'pre-wrap',
        }}>
          {'RENDER ERROR:\n' + this.state.error.message + '\n\n' + (this.state.error.stack || '')}
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [completedLevels, setCompletedLevels] = useState([])

  const handleLevelComplete = useCallback((levelId) => {
    setCompletedLevels((prev) => prev.includes(levelId) ? prev : [...prev, levelId])
  }, [])

  const handleNextLevel = useCallback(() => {
    const nextIdx = currentLevelIdx + 1
    if (nextIdx < LEVELS.length) {
      setCurrentLevelIdx(nextIdx)
      setScreen('playing')
    } else {
      setScreen('level_select')
    }
  }, [currentLevelIdx])

  if (screen === 'intro') {
    return (
      <ErrorBoundary>
        <IntroScreen onStart={() => setScreen('level_select')} />
      </ErrorBoundary>
    )
  }

  if (screen === 'level_select') {
    return (
      <ErrorBoundary>
        <LevelSelectScreen
          completedLevels={completedLevels}
          onSelectLevel={(idx) => {
            setCurrentLevelIdx(idx)
            setScreen('playing')
          }}
          onBack={() => setScreen('intro')}
        />
      </ErrorBoundary>
    )
  }

  if (screen === 'playing') {
    return (
      <ErrorBoundary>
        <GameScreen
          key={`level-${currentLevelIdx}`}
          level={LEVELS[currentLevelIdx]}
          levelIdx={currentLevelIdx}
          onComplete={handleLevelComplete}
          onBack={() => setScreen('level_select')}
          onNext={handleNextLevel}
          hasNext={currentLevelIdx < LEVELS.length - 1}
        />
      </ErrorBoundary>
    )
  }

  return null
}
