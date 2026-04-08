import React from 'react'

export default function Toast({ message, type, id }) {
  return (
    <div key={id} className={`toast ${type === 'success' ? 'success' : ''}`}>
      {message}
    </div>
  )
}
