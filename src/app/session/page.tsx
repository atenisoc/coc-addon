'use client'

import { useEffect, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function SessionPage() {
  const [scenario, setScenario] = useState<{ title: string; summary: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [typedOptions, setTypedOptions] = useState<string[]>([])
  const [showTitle, setShowTitle] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [loading, setLoading] = useState(false)

  const useTypewriter = (text: string, delay = 30, trigger = true) => {
    const [displayed, setDisplayed] = useState('')
    useEffect(() => {
      if (!trigger) return
      setDisplayed('')
      let i = 0
      const timer = setInterval(() => {
        setDisplayed((prev) => prev + text[i])
        i++
        if (i >= text.length) clearInterval(timer)
      }, delay)
      return () => clearInterval(timer)
    }, [text, trigger])
    return displayed
  }

  const titleText = `🕰️ Scenario: ${scenario?.title ?? 'タイトル不明'}`
  const summaryText = scenario?.summary ?? '（シナリオ概要がありません）'
  const typedTitle = useTypewriter(titleText, 20, showTitle)
  const typedSummary = useTypewriter(summaryText, 10, showSummary)

  useEffect(() => {
    const saved = localStorage.getItem('selectedScenario')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setScenario(parsed)
        setTimeout(() => setShowTitle(true), 300)
        setTimeout(() => setShowSummary(true), 1200)
        setTimeout(() => {
          setShowIntro(true)
          const intro = `ようこそ『${parsed?.title ?? 'タイトル不明'}』。探索を開始しますか？`
          setMessages([{ role: 'assistant', content: intro }])
        }, 2000)
      } catch (e) {
        console.error('シナリオ読み込み失敗:', e)
      }
    }
  }, [])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setTypedOptions([])
    setOptions([])

    const res = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ userInput: text, history: updated }),
    })
    const data = await res.json()
    setMessages([...updated, { role: 'assistant', content: data.reply }])
    setOptions(data.options || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!options || options.length === 0) return
    setTypedOptions([])
    let i = 0
    const interval = setInterval(() => {
      const full = options[i]
      let j = 0
      const typeTimer = setInterval(() => {
        setTypedOptions((prev) => {
          const updated = [...prev]
          updated[i] = full.slice(0, j + 1)
          return updated
        })
        j++
        if (j >= full.length) clearInterval(typeTimer)
      }, 25)
      i++
      if (i >= options.length) clearInterval(interval)
    }, 500)
    return () => clearInterval(interval)
  }, [options])

  return (
    <main className="min-h-screen text-white p-4 max-w-xl mx-auto space-y-4">
      {showTitle && <h1 className="text-2xl font-bold">{typedTitle}</h1>}
      {showSummary && <p className="text-sm text-yellow-300 whitespace-pre-wrap">{typedSummary}</p>}
      {showIntro && (
        <>
          <div className="bg-black bg-opacity-60 p-4 rounded max-h-64 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <p key={idx} className={`text-sm ${msg.role === 'user' ? 'text-sky-300' : ''}`}>
                {msg.role === 'user' ? `あなた：${msg.content}` : msg.content}
              </p>
            ))}
            {loading && <p className="text-gray-400 animate-pulse">...thinking</p>}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="行動を入力してください"
              className="flex-1 rounded px-3 py-2 text-black"
            />
            <button
              onClick={() => handleSend(input)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              送信
            </button>
          </div>

          {typedOptions.length > 0 && (
            <div className="mt-4 space-y-2">
              {typedOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(options[idx])}
                  className="block w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
