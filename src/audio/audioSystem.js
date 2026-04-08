import * as Tone from 'tone'

// ── State ──────────────────────────────────────────────────────────────────────
let bgInitialized = false
let isMuted = false
let masterVol = null

// ── Melody notes (F major pentatonic with Bb passing tone, cute/upbeat) ───────
const MELODY_NOTES = [
  // Bar 1 — Fmaj feel
  { time: '0:0:0', note: 'F4',  dur: '8n' },
  { time: '0:0:2', note: 'A4',  dur: '8n' },
  { time: '0:1:0', note: 'C5',  dur: '4n' },
  { time: '0:2:0', note: 'A4',  dur: '8n' },
  { time: '0:2:2', note: 'G4',  dur: '8n' },
  { time: '0:3:0', note: 'F4',  dur: '4n' },
  // Bar 2 — Gm feel
  { time: '1:0:0', note: 'G4',  dur: '8n' },
  { time: '1:0:2', note: 'Bb4', dur: '8n' },
  { time: '1:1:0', note: 'D5',  dur: '8n' },
  { time: '1:1:2', note: 'C5',  dur: '8n' },
  { time: '1:2:0', note: 'Bb4', dur: '4n' },
  { time: '1:3:0', note: 'G4',  dur: '4n' },
  // Bar 3 — Am feel
  { time: '2:0:0', note: 'A4',  dur: '8n' },
  { time: '2:0:2', note: 'C5',  dur: '8n' },
  { time: '2:1:0', note: 'E5',  dur: '4n' },
  { time: '2:2:0', note: 'C5',  dur: '8n' },
  { time: '2:2:2', note: 'A4',  dur: '8n' },
  { time: '2:3:0', note: 'F4',  dur: '4n' },
  // Bar 4 — Fmaj resolve
  { time: '3:0:0', note: 'C5',  dur: '8n' },
  { time: '3:0:2', note: 'A4',  dur: '8n' },
  { time: '3:1:0', note: 'G4',  dur: '8n' },
  { time: '3:1:2', note: 'F4',  dur: '8n' },
  { time: '3:2:0', note: 'A4',  dur: '4n' },
  { time: '3:3:0', note: 'F4',  dur: '4n' },
]

// ── Chord backing (whole-note pads per bar) ────────────────────────────────────
const CHORD_NOTES = [
  { time: '0:0', chord: ['F3', 'A3', 'C4'], dur: '1n' }, // Fmaj
  { time: '1:0', chord: ['G3', 'Bb3', 'D4'], dur: '1n' }, // Gm
  { time: '2:0', chord: ['A3', 'C4', 'E4'], dur: '1n' }, // Am
  { time: '3:0', chord: ['F3', 'A3', 'C4'], dur: '1n' }, // Fmaj
]

// ── Bass line (root + fifth every 2 beats) ─────────────────────────────────────
const BASS_NOTES = [
  // Bar 0 — F
  { time: '0:0:0', note: 'F2', dur: '4n' },
  { time: '0:2:0', note: 'C3', dur: '4n' },
  // Bar 1 — G
  { time: '1:0:0', note: 'G2', dur: '4n' },
  { time: '1:2:0', note: 'D3', dur: '4n' },
  // Bar 2 — A
  { time: '2:0:0', note: 'A2', dur: '4n' },
  { time: '2:2:0', note: 'E3', dur: '4n' },
  // Bar 3 — F
  { time: '3:0:0', note: 'F2', dur: '4n' },
  { time: '3:2:0', note: 'C3', dur: '4n' },
]

// ── Init background music ──────────────────────────────────────────────────────
async function initBackgroundMusic() {
  if (bgInitialized) return
  bgInitialized = true

  try {
    await Tone.start()

    Tone.Transport.bpm.value = 108
    Tone.Transport.loop = true
    Tone.Transport.loopStart = 0
    Tone.Transport.loopEnd = '4:0'

    // Master volume — connect to destination; muting here silences everything
    masterVol = new Tone.Volume(-6).toDestination()

    // Shared reverb for melody + chords
    const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.25 })
    await reverb.ready
    reverb.connect(masterVol)

    // ── Melody synth (marimba / vibraphone feel) ───────────────────────────
    const melodySynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.05, release: 0.6 },
    }).connect(reverb)
    melodySynth.volume.value = -10

    // ── Chord synth (soft sine pad) ────────────────────────────────────────
    const chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.15, decay: 0.6, sustain: 0.2, release: 1.2 },
    }).connect(reverb)
    chordSynth.volume.value = -20

    // ── Bass synth (round sine, no reverb for clarity) ─────────────────────
    const bassSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 },
    }).connect(masterVol)
    bassSynth.volume.value = -16

    // ── Parts ──────────────────────────────────────────────────────────────
    const melodyPart = new Tone.Part((time, val) => {
      melodySynth.triggerAttackRelease(val.note, val.dur, time)
    }, MELODY_NOTES)
    melodyPart.loop = true
    melodyPart.loopEnd = '4:0'

    const chordPart = new Tone.Part((time, val) => {
      chordSynth.triggerAttackRelease(val.chord, val.dur, time)
    }, CHORD_NOTES)
    chordPart.loop = true
    chordPart.loopEnd = '4:0'

    const bassPart = new Tone.Part((time, val) => {
      bassSynth.triggerAttackRelease(val.note, val.dur, time)
    }, BASS_NOTES)
    bassPart.loop = true
    bassPart.loopEnd = '4:0'

    melodyPart.start(0)
    chordPart.start(0)
    bassPart.start(0)

    // Apply initial mute state in case setMuted was called before init
    if (masterVol) masterVol.mute = isMuted

    Tone.Transport.start()
  } catch (err) {
    console.warn('[AudioSystem] Background music init failed:', err)
  }
}

// ── Mute / unmute ──────────────────────────────────────────────────────────────
export function setMuted(muted) {
  isMuted = muted
  if (masterVol) {
    masterVol.mute = muted
  }
}

export function getMuted() {
  return isMuted
}

// ── Start music (call on first user interaction) ───────────────────────────────
export async function startMusic() {
  try {
    if (!bgInitialized) {
      await initBackgroundMusic()
    } else if (Tone.Transport.state !== 'started') {
      Tone.Transport.start()
    }
  } catch (err) {
    console.warn('[AudioSystem] startMusic failed:', err)
  }
}

// ── Sound effects ──────────────────────────────────────────────────────────────

// Helper: ensure AudioContext is running before playing a one-shot
async function ensureContext() {
  if (Tone.context.state !== 'running') {
    await Tone.start()
  }
}

/**
 * Soft "thud" — item placed correctly on table.
 */
export const playPlaceSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 },
    }).toDestination()
    synth.volume.value = -12
    synth.triggerAttackRelease('C4', '16n')
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playPlaceSound failed:', err)
  }
}

/**
 * Short buzz / wobble — wrong placement.
 */
export const playErrorSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    const synth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination()
    synth.volume.value = -18
    const now = Tone.now()
    synth.triggerAttackRelease('A2', '16n', now)
    synth.triggerAttackRelease('Ab2', '16n', now + 0.07)
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playErrorSound failed:', err)
  }
}

/**
 * Light "pop" — picking an item up.
 */
export const playPickupSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.08 },
    }).toDestination()
    synth.volume.value = -14
    synth.triggerAttackRelease('E5', '32n')
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playPickupSound failed:', err)
  }
}

/**
 * Wooden knock — opening or interacting with a crate.
 */
export const playCrateSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    // Simulate a wooden knock with a noise burst + pitch drop
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' },
      envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
    }).toDestination()
    noise.volume.value = -20
    noise.triggerAttackRelease('16n')

    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    }).toDestination()
    synth.volume.value = -16
    synth.triggerAttackRelease('G2', '16n')

    noise.dispose()
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playCrateSound failed:', err)
  }
}

/**
 * Cheerful ascending arpeggio — level complete fanfare.
 */
export const playLevelCompleteSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 },
    }).toDestination()
    synth.volume.value = -10

    const now = Tone.now()
    const arpeggio = ['C5', 'E5', 'G5', 'C6']
    const step = 0.13

    arpeggio.forEach((note, i) => {
      synth.triggerAttackRelease(note, '8n', now + i * step)
    })
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playLevelCompleteSound failed:', err)
  }
}

/**
 * Soft chime — hint revealed.
 */
export const playHintSound = async () => {
  if (isMuted) return
  try {
    await ensureContext()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0.1, release: 1.0 },
    }).toDestination()
    synth.volume.value = -14

    const reverb = new Tone.Reverb({ decay: 2, wet: 0.4 }).toDestination()
    synth.connect(reverb)

    const now = Tone.now()
    synth.triggerAttackRelease('A5', '8n', now)
    synth.triggerAttackRelease('E5', '8n', now + 0.18)

    reverb.dispose()
    synth.dispose()
  } catch (err) {
    console.warn('[AudioSystem] playHintSound failed:', err)
  }
}

