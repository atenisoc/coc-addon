'use client'

import { Suspense } from 'react'
import ChatClient from './ChatClient'
import { useSearchParams } from 'next/navigation'

function PageInner() {
  const params = useSearchParams()
  const scenarioId = params.get('id') || 'unknown'

  const scenarioTitleMap: Record<string, string> = {
    'kisaragi': 'きさらぎ駅',
    'mirror-home': '鏡の奥の家',
    'echoes': '繰り返される命日',
    'demon-mansion': '悪魔の館',
    'hotel-hilbert': 'HOTELヒルベルト',
  }

  const title = scenarioTitleMap[scenarioId] || `探索セッション：${scenarioId}`

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-screen-md mx-auto space-y-4 text-shadow">
        <h1 className="text-center text-3xl font-bold tracking-widest font-serif">
          {title}
        </h1>
        <h2 className="text-center text-sm text-gray-400">
          探索セッション（ver. 1.1）
        </h2>
        <ChatClient />
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-white">読み込み中…</div>}>
      <PageInner />
    </Suspense>
  )
}
