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
  const [typing, setTyping] = useState('')
  const [errorFlag, setErrorFlag] = useState('')

  const params = useSearchParams()
  const scenarioId = params.get('id') || 'echoes'
  const disableOptions = params.get('noopt') === 'true'
  const typingSpeed = 20

  useEffect(() => {
    // 初期状態：まずGM確認中だけ表示
    setMessages([{ role: 'assistant', content: 'GMが確認中...' }])
    setOptions([])
    setTyping('')

    // 少し遅れて本来のプロンプトと選択肢を出す
    const timer = setTimeout(() => {
      setMessages([
        { role: 'assistant', content: '探索を開始しますか？' }
      ])
      setOptions(['探索を開始する', '引き返す'])
    }, 1000)

    return () => clearTimeout(timer)
  }, [scenarioId])

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant') return
    let i = 0
    setTyping('')
    const interval = setInterval(() => {
      setTyping((prev) => prev + last.content[i])
      i++
      if (i >= last.content.length) {
        clearInterval(interval)
        setTyping('')
      }
    }, typingSpeed)
    return () => clearInterval(interval)
  }, [messages])

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setOptions([])
    setTyping('')
    setLoading(true)
    setErrorFlag('')

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: text, history: updated, scenarioId }),
      })

      let data = await res.json()

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          setMessages([
            ...updated,
            { role: 'assistant', content: '⚠️ 応答の構造が不正です（JSONとして解釈できません）' },
          ])
          setLoading(false)
          return
        }
      }

      setMessages([...updated, { role: 'assistant', content: data.reply }])
      setOptions(data.options || [])
      if (data.errorFlag) setErrorFlag(data.errorFlag)

    } catch (e: any) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: `通信エラーが発生しました。\n\n(APIエラー: ${e.message})`,
        },
      ])
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-4 font-[Kiwi_Maru]">

      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1
        const isTyping = isLast && msg.role === 'assistant' && typing
        return (
          <div
            key={idx}
            className={`whitespace-pre-wrap leading-relaxed text-shadow ${
              msg.role === 'user'
                ? 'text-blue-300 text-right font-semibold'
                : 'text-green-100 text-left font-mono text-sm'
            }`}
          >
            {isTyping ? typing : msg.content}
          </div>
        )
      })}

      {errorFlag && (
        <div className="text-xs text-yellow-300">
          ※ 正常な応答が得られませんでした（{errorFlag}）
        </div>
      )}

      {!disableOptions && (
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
      )}

      {loading && (
        <div className="text-center text-white/60 italic text-sm">
          ⏳ GMが状況を確認中…
        </div>
      )}

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

    </div>
  )
}
