'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Message = { role: 'user' | 'assistant'; content: string }

export default function Page() {
  const searchParams = useSearchParams()
  const scenarioId = searchParams.get('id') ?? 'echoes'

  const [messages, setMessages] = useState<Message[]>([])
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  // ✅ 初期メッセージ表示
  useEffect(() => {
    if (messages.length === 0) {
      const title = getScenarioTitle(scenarioId)
      const initial = {
        role: 'assistant',
        content: `ようこそ「${title}」。探索を開始しますか？`,
      }
      setMessages([initial])
      setOptions(['探索を開始する', '引き返す'])
    }
  }, [scenarioId, messages])

  // ✅ リアルタイピング表示処理
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant') {
      setDisplayedMessages(messages)
      return
    }

    setTyping(true)
    let i = 0
    const interval = setInterval(() => {
      setDisplayedMessages((prev) => {
        const rest = messages.slice(0, messages.length - 1)
        const partial = { ...last, content: last.content.slice(0, i + 1) }
        return [...rest, partial]
      })

      i++
      if (i >= last.content.length) {
        clearInterval(interval)
        setTyping(false)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [messages])

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    const updated = [...messages, { role: 'user', content: text }]
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
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      setOptions(data.options || [])
    } catch (e) {
      console.error('APIエラー:', e)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '通信に失敗しました。もう一度お試しください。' },
      ])
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

        {displayedMessages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
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
              disabled={loading || typing}
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
            disabled={loading || typing}
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={loading || typing}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  )
}

// ✅ シナリオID → 表示タイトル変換
function getScenarioTitle(id: string): string {
  const map: Record<string, string> = {
    echoes: 'エコーズ',
    library: '闇の図書館',
    clocktower: '時計塔の彼方',
  }
  return map[id] || '未知のシナリオ'
}
