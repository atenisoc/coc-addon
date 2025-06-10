'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function useTypewriter(text: string, delay = 30, trigger = true) {
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

type Message = { role: 'user' | 'assistant'; content: string }

export default function SessionPage() {
  const [scenario, setScenario] = useState<{ title: string; summary: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [visibleOptions, setVisibleOptions] = useState<string[]>([])
  const [optionTrigger, setOptionTrigger] = useState(0)
  const [optionTypewriters, setOptionTypewriters] = useState<string[]>([])

  const pathname = usePathname()
  const isJapanese = pathname.includes('/ja') || pathname.endsWith('/coc')

  const [showTitle, setShowTitle] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  const typedTitle = useTypewriter(
    isJapanese ? `🧠 シナリオ：${scenario?.title || ''}` : `🧠 Scenario: ${scenario?.title || ''}`,
    25,
    showTitle
  )

  const typedSummary = useTypewriter(scenario?.summary || '', 15, showSummary)

  const introMessage = isJapanese
    ? `ようこそ「${scenario?.title}」。探索者たちは、${(scenario?.summary || '').slice(0, 40)}… どうする？`
    : `Welcome to "${scenario?.title}". The investigators arrive... What will they do?`

  const typedIntro = useTypewriter(introMessage, 25, showIntro)

  useEffect(() => {
    const saved = localStorage.getItem('selectedScenario')
    if (saved) {
      const parsed = JSON.parse(saved)
      setScenario(parsed)
      setTimeout(() => setShowTitle(true), 300)
      setTimeout(() => setShowSummary(true), 1000)
      setTimeout(() => {
        setShowIntro(true)
        setMessages([{ role: 'assistant', content: introMessage }])
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (!options || options.length === 0) return
    setVisibleOptions([])
    setOptionTypewriters([])

    let i = 0
    const interval = setInterval(() => {
      setVisibleOptions((prev) => [...prev, options[i]])
      setOptionTypewriters((prev) => [...prev, ''])
      i++
      if (i >= options.length) clearInterval(interval)
    }, 600)

    return () => clearInterval(interval)
  }, [optionTrigger])

  useEffect(() => {
    visibleOptions.forEach((opt, idx) => {
      let i = 0
      const timer = setInterval(() => {
        setOptionTypewriters((prev) => {
          const updated = [...prev]
          updated[idx] = (updated[idx] || '') + opt[i]
          return updated
        })
        i++
        if (i >= opt.length) clearInterval(timer)
      }, 20)
      return () => clearInterval(timer)
    })
  }, [visibleOptions])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const updated = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setLoading(true)
    setInput('')
    setVisibleOptions([])
    setOptionTypewriters([])

    const res = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ userInput: text, history: updated }),
    })

    const data = await res.json()
    setMessages([...updated, { role: 'assistant', content: data.reply }])
    setOptions(data.options || [])
    setOptionTrigger((prev) => prev + 1)
    setLoading(false)
  }

  const handleChoice = (text: string) => handleSend(text)

  return (
    <main className="min-h-screen text-white p-4 max-w-xl mx-auto space-y-4">
      {showTitle && <h1 className="text-2xl font-bold">{typedTitle}</h1>}
      {showSummary && <p className="text-sm whitespace-pre-wrap">{typedSummary}</p>}

      {showIntro && (
        <div className="space-y-2 bg-black bg-opacity-50 p-4 rounded max-h-[300px] overflow-y-auto">
          {messages.map((msg, i) => (
            <p key={i} className={`text-sm ${msg.role === 'user' ? 'text-sky-300' : ''}`}>
              {msg.role === 'user'
                ? isJapanese
                  ? `あなた：${msg.content}`
                  : `You: ${msg.content}`
                : msg.content}
            </p>
          ))}
          {loading && <p className="text-gray-400 animate-pulse">…{isJapanese ? '応答中' : 'thinking...'}</p>}
        </div>
      )}

      {showIntro && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-black"
              placeholder={
                isJapanese
                  ? '行動を入力（例：神社を調べる）'
                  : 'Enter your action (e.g., Investigate the shrine)'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded"
              onClick={() => handleSend(input)}
            >
              {isJapanese ? '送信' : 'Send'}
            </button>
          </div>

          {visibleOptions.length > 0 && (
            <div className="space-y-2">
              {visibleOptions.map((_, i) => (
                <button
                  key={i}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded"
                  onClick={() => handleChoice(visibleOptions[i])}
                >
                  {optionTypewriters[i] || ''}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
