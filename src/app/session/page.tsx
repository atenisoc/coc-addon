'use client'

import { useEffect, useState } from 'react'

export default function SessionPage() {
  const [scenario, setScenario] = useState<{ title: string; summary: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('selectedScenario')
    if (saved) {
      setScenario(JSON.parse(saved))
    }
  }, [])

  if (!scenario) return <p>シナリオを読み込み中...</p>

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold">シナリオ：{scenario.title}</h1>
      <p className="mt-2">{scenario.summary}</p>
    </div>
  )
}
