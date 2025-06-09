// Chat.tsx（完全版）
'use client'

import { useState } from 'react'

type Message = {
  role: 'user' | 'gpt'
  content: string
  options?: string[]
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (content: string) => {
    setLoading(true)
    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      const data = await res.json()
      setMessages([
        ...newMessages,
        { role: 'gpt', content: data.reply, options: data.options },
      ])
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'gpt', content: 'エラーが発生しました。' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="p-2 rounded border bg-white shadow">
          <p className="font-bold">{msg.role === 'user' ? 'あなた' : 'GPT'}</p>
          <p>{msg.content}</p>
          {msg.role === 'gpt' && msg.options && (
            <div className="mt-2 space-x-2">
              {msg.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(opt)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {!loading && (
        <button
          onClick={() => sendMessage('話しかける')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          話しかける
        </button>
      )}
      {loading && <p>GPTの応答を待っています...</p>}
    </div>
  )
}
