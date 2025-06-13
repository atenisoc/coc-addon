'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const params = useSearchParams()
  const scenarioId = params.get('id') || 'echoes'

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '探索を開始しますか？',
      },
    ])
    setOptions(['探索を開始する', '引き返す'])
  }, [scenarioId])

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          history: updated,
          scenarioId,
        }),
      })

      const data = await res.json()
      setMessages([...updated, { role: 'assistant', content: data.reply }])
      setOptions(data.options || [])
    } catch (e: any) {
      setMessages([
        ...updated,
        { role: 'assistant', content: `エラーが発生しました: ${e.message}` },
      ])
      setOptions(['最初に戻る'])
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`text-sm whitespace-pre-wrap ${
            msg.role === 'user' ? 'text-blue-300 text-right' : 'text-green-300'
          }`}
        >
          {msg.content}
        </div>
      ))}

      {loading && (
        <div className="text-gray-400 text-sm italic">GMが状況を整理しています...</div>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded"
            onClick={() => handleSubmit(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-2 rounded"
          placeholder="自由行動・状況確認など"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(input)
          }}
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSubmit(input)}
        >
          送信
        </button>
      </div>

      <div className="text-center text-xs text-blue-300 mt-2">
        <a href="/coc">トップへ戻る</a>
      </div>
    </div>
  )
}
