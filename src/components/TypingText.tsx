'use client'

import { useEffect, useState } from 'react'

export const TypingText = ({ text, speed = 25 }: { text: string; speed?: number }) => {
  const safeText = text ?? ''  // nullやundefined対策
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    setDisplayed('')
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + safeText[i])
      i++
      if (i >= safeText.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [safeText, speed])

  return <p className="whitespace-pre-line">{displayed}</p>
}
