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
  const [displayedText, setDisplayedText] = useState('')
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1)

  const params = useSearchParams()
  const scenarioId = params.get('id') || 'echoes'

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '探索を開始しますか？', // ← これだけでOK
      },
    ])
    setOptions(['探索を開始する', '引き返す'])
  }, [scenarioId])

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ userInput: text, history: updated, scenarioId }),
    })

    const data = await res.json()
    const newMessages = [...updated, { role: 'assistant', content: data.reply }]
    setMessages(newMessages)
    setOptions(data.options || [])
    setLoading(false)
  }

  // リアルタイム風表示：assistantの最後のメッセージだけ対象
  useEffect(() => {
    if (!loading && messages.length > 0) {
      const last = messages[messages.length - 1]
      if (last.role === 'assistant') {
        setDisplayedText('')
        setCurrentMessageIndex(messages.length - 1)
        let i = 0
        const interval = setInterval(() => {
          setDisplayedText(last.content.slice(0, i + 1))
          i++
          if (i >= last.content.length) clearInterval(interval)
        }, 20)
        return () => clearInterval(interval)
      }
    }
  }, [messages, loading])

  return (
    <div className="space-y-3">
      {/* メッセージ表示 */}
      {messages.map((msg, i) => (
        <div
          key={i}
          className={msg.role === 'user' ? 'text-right text-white' : 'text-left text-green-300'}
        >
          {i === currentMessageIndex && msg.role === 'assistant'
            ? displayedText
            : msg.content}
        </div>
      ))}

      {/* ローディング中表示 */}
      {loading && (
        <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="gray" strokeWidth="4" fill="none" />
          </svg>
          GMが状況を整理しています…
        </div>
      )}

      {/* 選択肢 */}
      <div className="flex gap-2 flex-wrap mt-4">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
            onClick={() => handleSubmit(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* 自由記入欄 */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="自由行動・状況確認など"
          className="flex-1 rounded bg-gray-800 text-white p-2"
        />
        <button
          onClick={() => handleSubmit(input)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          送信
        </button>
      </div>

      {/* トップへ戻る */}
      <div className="mt-6 text-center">
        <a href="/coc" className="inline-block text-sm text-blue-300 hover:text-blue-400 underline">
          トップへもどる
        </a>
      </div>
    </div>
  )
}
