'use client'

import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleOptions, setVisibleOptions] = useState<string[]>([])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const updated: Message[] = [...messages, { role: 'user' as const, content: text }]
    setMessages(updated)
    setLoading(true)
    setInput('')
    setVisibleOptions([])

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      const gptMessage: Message = { role: 'assistant', content: data.reply }
      setMessages((prev) => [...prev, gptMessage])
      setVisibleOptions(data.options || [])
    } catch (err) {
      console.error('API error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {/* 選択肢ボタン */}
      {visibleOptions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {visibleOptions.map((opt, i) => (
            <button
              key={i}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => handleSend(opt)}
              disabled={loading}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* 入力欄 */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend(input)
            }
          }}
          disabled={loading}
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          送信
        </button>
      </div>
    </div>
  )
}
