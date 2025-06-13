'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Message = { role: 'user' | 'assistant'; content: string }

export const dynamic = 'force-dynamic'

export default function Page() {
  const [scenarioId, setScenarioId] = useState<string>('echoes')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id') || 'echoes'
    setScenarioId(id)
    const title = getScenarioTitle(id)
    setMessages([
      {
        role: 'assistant',
        content: `ようこそ「${title}」。探索を開始しますか？`,
      },
    ])
    setOptions(['探索を開始する', '引き返す'])
  }, [])

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setOptions([])

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ userInput: text, history: updated, scenarioId }),
      })

      const data = await res.json()
      const replyText: string = data.reply
      let currentText = ''

      for (let i = 0; i < replyText.length; i++) {
        currentText += replyText[i]
        await new Promise((r) => setTimeout(r, 15))
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: currentText }]
          } else {
            return [...prev, { role: 'assistant', content: currentText }]
          }
        })
      }

      setOptions(data.options || [])
    } catch (e) {
      console.error('APIエラー:', e)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'エラーが発生しました。もう一度お試しください。' },
      ])
      setOptions(['最初に戻る'])
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen bg-no-repeat bg-center bg-cover bg-fixed p-4 text-white"
      style={{ backgroundImage: 'url(/backgrounds/cthulhu-bg.jpg)' }}
    >
      <div className="max-w-xl mx-auto bg-black bg-opacity-70 p-4 rounded-xl space-y-4">
        <h1 className="text-xl font-bold">
          Scenario: {getScenarioTitle(scenarioId)}（ID: {scenarioId}）
        </h1>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-blue-800 text-right' : 'bg-gray-800 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}

        <div className="space-y-2">
          {options.map((opt, i) => (
            <button
              key={i}
              className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded"
              onClick={() => handleSubmit(opt)}
              disabled={loading}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex space-x-2 pt-4">
          <input
            className="flex-1 bg-gray-800 p-2 rounded text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="自由行動・状況確認など"
            disabled={loading}
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
          >
            送信
          </button>
        </div>

        <div className="text-center pt-4">
          <Link href="/coc" className="text-sm text-blue-400 hover:underline">
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

function getScenarioTitle(id: string): string {
  const map: Record<string, string> = {
    echoes: 'エコーズ',
    library: '闇の図書館',
    clocktower: '時計塔の彼方',
  }
  return map[id] || '未知のシナリオ'
}
