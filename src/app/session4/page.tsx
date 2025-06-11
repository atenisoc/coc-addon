type Message = {
  role: 'user' | 'assistant'
  content: string
}

'use client'

import { useEffect, useState } from 'react'
import { NpcChatLog } from '@/components/NpcChatLog'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typedOptions, setTypedOptions] = useState<string[]>([])

  const STORAGE_KEY = 'coc-session4-log'

  // ロード時に保存データ復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch {
        console.error('ログの復元に失敗しました')
      }
    }
  }, [])

  // ローカル保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  const handleSubmit = async () => {
    if (!input.trim()) return
    const updated: Message[] = [...messages, { role: 'user', content: input }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setTypedOptions([])

    const res = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({
        messages: updated,
        systemPrompt: `あなたはクトゥルフ神話TRPGのGMです。応答は以下形式にしてください：
{
  "reply": "あなたの返答メッセージ",
  "options": ["選択肢A", "選択肢B"]
}`,
        model: 'gpt-4',
      }),
    })
    const data = await res.json()
    const reply = data.reply
    const options: string[] = data.options || []

    // 文字を1文字ずつ出す演出
    let displayed = ''
    for (const char of reply) {
      displayed += char
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: displayed }])
      await delay(15)
    }

    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setTypedOptions(options)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-4">
      <NpcChatLog messages={messages} />
      {typedOptions.length > 0 && (
        <div className="space-y-2">
          {typedOptions.map((opt, i) => (
            <button
              key={i}
              className="block w-full bg-gray-700 hover:bg-gray-600 p-3 rounded"
              onClick={() => setInput(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      <div className="flex space-x-2 pt-4">
        <input
          className="flex-1 bg-gray-800 p-2 rounded text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="入力..."
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        >
          送信
        </button>
      </div>
    </div>
  )
}
