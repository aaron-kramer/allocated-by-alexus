import React from 'react'
import { TruckSVG } from '../sprites/index.jsx'
import { startMusic } from '../audio/audioSystem.js'

export default function IntroScreen({ onStart }) {
  const handleStart = async () => {
    await startMusic()
    onStart()
  }

  return (
    <div className="intro-screen">
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 75%, rgba(244,167,195,0.12) 0%, transparent 55%),
          radial-gradient(circle at 75% 20%, rgba(196,168,240,0.10) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(160,232,196,0.05) 0%, transparent 70%)
        `,
      }} />

      <div style={{
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        padding: '0 24px',
        maxWidth: 400,
        width: '100%',
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#8a78b0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          A ZEN PUZZLE GAME
        </div>

        <div className="intro-title">
          ALLOCATED<br />BY ALEXUS
        </div>

        <TruckSVG />

        <div className="intro-subtitle">
          Organize the delivery. Stock the restaurant.
        </div>

        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13,
          color: '#6a5a80',
          textAlign: 'center',
          lineHeight: 1.9,
          maxWidth: 300,
        }}>
          Tap a crate to grab an item, then drop it in the correct zone.
          Every item has a home. Stock it all before doors open!
        </div>

        <button className="glow-btn" onClick={handleStart}>
          START SHIFT
        </button>

        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: '#4a3a60',
        }}>
          TOUCH OR CLICK TO PLAY
        </div>
      </div>
    </div>
  )
}
