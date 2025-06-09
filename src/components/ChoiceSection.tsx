'use client'
import { useEffect, useState } from 'react'

export default function ChoiceSection() {
  const [scenario, setScenario] = useState<{ title: string, summary: string } | null>(null)

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => setScenario(data))
  }, [])

  if (!scenario) return <p>シナリオを生成中...</p>

  return (
    <div className="space-y-6 mt-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">🧠 GPT-CoC セッション</h2>

      <div className="bg-slate-800 bg-opacity-90 text-white p-4 rounded">
        <p className="text-sm">シナリオタイトル：「{scenario.title}」</p>
        <p className="mt-2 text-sm">{scenario.summary}</p>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
          このシナリオで始める
        </button>
      </div>
    </div>
  )
}
