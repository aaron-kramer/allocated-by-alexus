import React, { useState, useCallback } from 'react'
import { setMuted } from '../audio/audioSystem.js'

export default function MuteButton() {
  const [muted, setMutedState] = useState(false)

  const toggle = useCallback(() => {
    const newMuted = !muted
    setMutedState(newMuted)
    setMuted(newMuted)
  }, [muted])

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      title={muted ? 'Unmute music' : 'Mute music'}
      className={`mute-btn-hud${muted ? ' muted' : ''}`}
    >
      {muted ? '🔇' : '🎵'}
    </button>
  )
}
