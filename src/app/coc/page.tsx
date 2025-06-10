'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CoCPage() {
  const [scenarios, setScenarios] = useState<{ title: string; summary: string }[]>([])
  const [visibleScenarios, setVisibleScenarios] = useState<{ title: string; summary: string }[]>([])
  const [typedSummaries, setTypedSummaries] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // 仮のシナリオデータ（本来はAPI経由）
    const data = [
      { title: '闇の図書館', summary: '探索者たちは封印された図書館に引き寄せられた力に巻き込まれる。古代の神々と戦うため、探索者たちは禁断の知識を探し求める。しかし、真実を知ることは常に危険を伴う。彼らは理性を保てるだろうか？' },
      { title: '窓から見える海', summary: 'シナリオは奇妙な絵本と灯台から始まり、現実と非現実の境界が曖昧になる探索へ。' },
      { title: '黄金都市の立体地図', summary: 'アーカムで見つかった立体地図を巡って発生する奇妙な事件と都市神話が交差する謎解き探索。' }
    ]
    setScenarios(data)
  }, [])

  useEffect(() => {
    if (scenarios.length === 0) return
    let i = 0
    const interval = setInterval(() => {
      setVisibleScenarios((prev) => [...prev, scenarios[i]])
      setTypedSummaries((prev) => [...prev, ''])
      i++
      if (i >= scenarios.length) clearInterval(interval)
    }, 800)
    return () => clearInterval(interval)
  }, [scenarios])

  useEffect(() => {
    visibleScenarios.forEach((s, idx) => {
      let j = 0
      const timer = setInterval(() => {
        setTypedSummaries((prev) => {
          const updated = [...prev]
          updated[idx] = (updated[idx] || '') + s.summary[j]
          return updated
        })
        j++
        if (j >= s.summary.length) clearInterval(timer)
      }, 20)
    })
  }, [visibleScenarios])

  const handleSelect = (s: { title: string; summary: string }) => {
    localStorage.setItem('selectedScenario', JSON.stringify(s))
    router.push('/session')
  }

  return (
    <main className="min-h-screen text-white bg-black bg-opacity-70 p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">🧠 GPT-CoC セッション</h1>
      {visibleScenarios.map((s, i) => (
        <div key={i} className="bg-slate-800 rounded p-4 space-y-2">
          <h2 className="font-semibold">シナリオタイトル:「{s.title}」</h2>
          <p className="text-sm whitespace-pre-wrap">{typedSummaries[i]}</p>
          <button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            onClick={() => handleSelect(s)}
          >
            このシナリオで始める
          </button>
        </div>
      ))}
    </main>
  )
}
