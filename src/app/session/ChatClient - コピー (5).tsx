'use client'

import { useEffect, useRef, useState } from 'react'
import { TypingText } from './TypingText'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export default function ChatClient() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [flags, setFlags] = useState<Record<string, any>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  // ✅ 初期 flags を定義
  const initialFlags = {
    phase: 'start',
    visited: [],
    has_seen_shadow: false,
    has_heard_whisper: false,
    san_level: 100,
    has_flashlight: false,
    injured: false,
    knows_exit_direction: false,
    trust_npc_yamamoto: 50,
    fear_level: 0,
    time_elapsed: 0,
    is_followed: false,
    loop_count: 0,
    phase_log: []
  }

  // 初回ロード時に開始プロンプト送信
  useEffect(() => {
    const fetchInitial = async () => {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], flags: initialFlags }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error('初回APIエラー:', errorText)
        return
      }
      const data = await res.json()
      setMessages([{ role: 'assistant', content: data.reply ?? '[応答なし]' }])
      if (data.flags) {
        setFlags(data.flags)
      } else {
        setFlags(initialFlags)
      }
    }

    fetchInitial()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      input, // ← 🔧ここを追加
      messages: newMessages,
      flags
    }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('送信APIエラー:', errorText)
      return
    }

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.reply ?? '[応答なし]' }])
    if (data.flags) setFlags(data.flags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen bg-white text-black">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">きさらぎ駅セッション</h2>
        <div className="text-sm text-gray-600">※最後のメッセージはタイピング表示</div>
      </div>

      <div className="space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className="text-xs font-bold text-gray-600 mb-1">{msg.role}</div>
            {msg.content !== undefined && (
              msg.role === 'assistant' && i === messages.length - 1 ? (
                <TypingText text={msg.content} speed={25} />
              ) : (
                <div className="whitespace-pre-wrap text-black">
                  {typeof msg.content === 'string' ? msg.content : '[不正な形式]'}
                </div>
              )
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border px-2 py-1 text-sm text-black"
          placeholder="選択肢または自由入力..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-1 text-sm">
          送信
        </button>
      </div>

      <div className="bg-gray-100 p-2 text-xs text-gray-700 rounded">
        <div className="font-bold mb-1">[デバッグ] flags 状態:</div>
        <pre>{JSON.stringify(flags, null, 2)}</pre>
      </div>
    </div>
  )
}
