'use client'

import { useEffect, useState } from 'react'

// 選択肢UI付きチャット
export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [uuid, setUUID] = useState<string | null>(null)

  useEffect(() => {
    const storedUUID = getCookie('user-uuid')
    setUUID(storedUUID)

    if (storedUUID) {
      const saved = localStorage.getItem(`log-${storedUUID}`)
      if (saved) setMessages(JSON.parse(saved))
    }

    // 初期選択肢（例）
    setOptions(['探索する', '話しかける', '部屋を出る'])
  }, [])

  const handleOptionClick = async (optionText: string) => {
    const userMsg = { sender: 'user', text: optionText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: optionText }),
    })

    const data = await res.json()
    const gptMsg = { sender: 'gpt', text: data.reply }
    const updated = [...newMessages, gptMsg]
    setMessages(updated)

    if (uuid) {
      localStorage.setItem(`log-${uuid}`, JSON.stringify(updated))
    }

    // 新たな選択肢を仮設定（本来は data.options などから生成）
　　setOptions(data.options || [])
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`text-${msg.sender === 'user' ? 'right' : 'left'}`}>
            <span className="inline-block bg-gray-100 p-2 rounded">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(opt)}
            className="block w-full p-2 bg-blue-100 hover:bg-blue-200 rounded"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// クッキー取得（ブラウザ用）
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null
  return null
}
