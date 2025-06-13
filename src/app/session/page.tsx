'use client'

import ChatClient from './ChatClient'
import { useSearchParams } from 'next/navigation'
import { getScenarioBackground, getScenarioTitle } from '@/lib/scenario'

export default function Page() {
  const params = useSearchParams()
  const scenarioId = params.get('id') || 'echoes'
  const background = getScenarioBackground(scenarioId)
  const title = getScenarioTitle(scenarioId)

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-2xl mx-auto bg-black/60 p-4 rounded-xl shadow-lg space-y-4">
        <div className="text-green-300 font-bold">ようこそ「{title}」。探索を開始しますか？</div>
        <ChatClient />
      </div>

      <footer className="text-right text-xs text-gray-400 mt-6">
        ver1.1
      </footer>
    </div>
  )
}
