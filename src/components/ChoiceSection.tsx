'use client'

import { useEffect, useState } from 'react'

type Scenario = { title: string; summary: string }
const isJapanese = typeof window !== 'undefined' && window.location.pathname.includes('/ja')

export default function ChoiceSection() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])

  useEffect(() => {
    fetch('/api/scenario')
      .then(res => res.json())
      .then(data => setScenarios(Array.isArray(data) ? data : [data]))
  }, [])

  if (scenarios.length === 0) return <p>{isJapanese ? 'シナリオを生成中...' : 'Loading scenarios...'}</p>

  return (
    <div className="space-y-6 mt-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">
        🧠 GPT-CoC セッション
      </h2>

      {scenarios.map((scenario, index) => (
        <div
          key={index}
          className="bg-slate-800 bg-opacity-90 text-white p-4 rounded space-y-2"
        >
          <p className="text-sm">
            {isJapanese ? `シナリオタイトル：「${scenario.title}」` : `Scenario: "${scenario.title}"`}
          </p>
          <p className="text-sm whitespace-pre-wrap">{scenario.summary}</p>

          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
            {isJapanese ? 'このシナリオで始める' : 'Start with this scenario'}
          </button>
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          placeholder={
            isJapanese ? '自由入力も可能です（状況確認など）' : 'Free input (e.g. ask about the setting)'
          }
          className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-black"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded"
        >
          {isJapanese ? '送信' : 'Send'}
        </button>
      </div>
    </div>
  )
}
