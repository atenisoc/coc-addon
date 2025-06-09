'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Scenario = { title: string; summary: string }

export default function ChoiceSection() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => setScenarios(Array.isArray(data) ? data : [data]))
  }, [])

  const handleSelect = (index: number) => {
    // 1. シナリオを localStorage に保存（仮対応）
    localStorage.setItem('selectedScenario', JSON.stringify(scenarios[index]))

    // 2. セッションページへ遷移
    router.push('/session')
  }

  return (
    <div className="space-y-6 mt-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">🧠 GPT-CoC セッション</h2>

      {scenarios.map((scenario, i) => (
        <div
          key={i}
          className="bg-slate-800 bg-opacity-90 text-white p-4 rounded space-y-2"
        >
          <p className="text-sm">シナリオタイトル：「{scenario.title}」</p>
          <p className="text-sm">{scenario.summary}</p>

          <button
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSelect(i)}
          >
            このシナリオで始める
          </button>
        </div>
      ))}
    </div>
  )
}
