'use client'

import { useEffect, useState } from 'react'

type Scenario = {
  id: string
  title: string
  summary: string
  tagline?: string
}

export default function Session3Page() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [titleDebug, setTitleDebug] = useState('')
  const [summaryDebug, setSummaryDebug] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('selectedScenario')
    if (saved) {
      try {
        const parsed: Scenario = JSON.parse(saved)
        console.log('[DEBUG] parsed:', parsed)
        setScenario(parsed)
        setTitleDebug(parsed.title ?? 'タイトルなし')
        setSummaryDebug(parsed.summary ?? '要約なし')
      } catch (e) {
        console.error('[ERROR] JSON parse failed', e)
      }
    } else {
      console.warn('[WARN] selectedScenario not found in localStorage')
    }
  }, [])

  return (
    <main className="text-white p-4 max-w-xl mx-auto space-y-4 min-h-screen">
      <h1 className="text-xl font-bold">
        📘 Scenario: {titleDebug || '（タイトル未設定）'}
      </h1>
      <p className="text-yellow-300 whitespace-pre-wrap">
        {summaryDebug || '（あらすじ未設定）'}
      </p>
    </main>
  )
}
