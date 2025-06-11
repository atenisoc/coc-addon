'use client'

import { useEffect, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Scenario = {
  id: string
  title: string
  summary: string
}

export default function SessionPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [showIntro, setShowIntro] = useState(false)
  const [typingMessage, setTypingMessage] = useState<string>('')

  // 初期シナリオ読み込み
  useEffect(() => {
    const saved = localStorage.getItem('selectedScenario')
    if (saved) {
      const parsed: Scenario = JSON.parse(saved)
      setScenario(parsed)
      setMessages([{ role: 'assistant', content: `ようこそ『${parsed.title}』。探索を開始しますか？` }])
      setOptions(['探索を開始する'])
      setShowIntro(true)
    }
  }, [])

  // メッセージ送信処理
  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setOptions([])

    const res = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ userInput: text, history: newMessages }),
    })

    const data = await res.json()
    const assistantMessage: Message = { role: 'assistant', content: data.reply }
    setMessages([...newMessages, assistantMessage])
    setOptions(data.options || [])
  }

  // 順次表示（assistantの最新メッセージ）
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant') {
      let index = 0
      const interval = setInterval(() => {
        setTypingMessage(last.content.slice(0, index + 1))
        index++
        if (index >= last.content.length) {
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    } else {
      setTypingMessage('')
    }
  }, [messages])

  return (
    <main className="min-h-screen text-white p-4 max-w-xl mx-auto space-y-4">
      {scenario && (
        <>
          <h1 className="text-2xl font-bold">🔍 Scenario: {scenario.title}</h1>
          <p className="text-sm text-yellow-300 whitespace-pre-wrap">{scenario.summary}</p>
        </>
      )}

      {showIntro && (
        <>
          <div className="bg-black bg-opacity-60 p-4 rounded space-y-2">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1
              if (msg.role === 'assistant') {
                return (
                  <p key={idx}>
                    {isLast ? typingMessage : msg.content}
                  </p>
                )
              } else {
                return (
                  <p key={idx} className="text-sky-300">
                    あなた：{msg.content}
                  </p>
                )
              }
            })}
          </div>

          {/* 選択肢を上に表示 */}
          {options.length > 0 && (
            <div className="mt-4 space-y-2">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(opt)}
                  className="block w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* 自由入力欄を下に */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="行動を入力"
              className="flex-1 px-3 py-2 rounded text-black"
              id="userInput"
              name="userInput"
            />
            <button
              onClick={() => handleSend(input)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              送信
            </button>
          </div>

          {/* セッションリセット（任意） */}
          <button
            onClick={() => {
              localStorage.removeItem('selectedScenario')
              location.reload()
            }}
            className="text-xs text-gray-400 hover:underline mt-2"
          >
            セッションをリセット
          </button>
        </>
      )}
    </main>
  )
}
