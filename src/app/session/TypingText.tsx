'use client'

import { useEffect, useState } from 'react'

export const TypingText = ({ text, speed = 25 }: { text: string; speed?: number }) => {
  const safeText = text ?? ''
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    let current = ''
    const interval = setInterval(() => {
      if (i < safeText.length) {
        current += safeText[i]
        setDisplayed(current)
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [safeText, speed])

  return <p className="whitespace-pre-line">{displayed}</p>
}
