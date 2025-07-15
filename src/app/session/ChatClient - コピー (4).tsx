'use client'

import React, { useEffect, useState } from 'react'
import { TypingText } from '@/components/TypingText'

type ChatMessage = {
  role: string
  content: string
}

export default function ChatClient({ scenarioId }: { scenarioId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [choices, setChoices] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const extractChoices = (text: string): string[] => {
    const lines = text.split('\n')
    return lines
      .filter(line => /^\d+[\.\：、]/.test(line))
      .map(line => line.replace(/^\d+[\.\：、]\s*/, '').trim())
  }

  const removeChoicesFromText = (text: string): string => {
    const lines = text.split('\n')
    const body = lines.filter(line => !/^\d+[\.\：、]/.test(line))
    return body.join('\n').trim()
  }

  const fetchFromGPT = async (msgList: ChatMessage[]) => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgList, scenarioId }),
      })

      const data = await res.json()
      if (data.result) {
  const assistantText = removeChoicesFromText(data.result)
  const safeText = assistantText?.trim() || '(何も語られなかった...)'  // ここを追加！
  const assistantMessage = { role: 'assistant', content: safeText }
  const newMessages = [...msgList, assistantMessage]
  setMessages(newMessages)
  setChoices(extractChoices(data.result))
}
 else {
        setError('応答がありません（result フィールドが空）')
      }
    } catch (err) {
      setError('通信エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const startScenario = async () => {
      const initial = [
        { role: 'system', content: 'シナリオを開始してください' }
      ]
      await fetchFromGPT(initial)
    }
    startScenario()
  }, [scenarioId])

  const handleChoice = async (choice: string) => {
    const newMessages = [...messages, { role: 'user', content: choice }]
    setMessages(newMessages)
    setChoices([])
    await fetchFromGPT(newMessages)
  }

  return (
    <div className="min-h-screen text-white bg-gray-900">
      <div className="bg-purple-700 p-2 text-center font-bold">
        [{scenarioId.toUpperCase()} MODE] アクティブです
      </div>
      <div className="p-4 space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`border rounded p-3 max-w-xl ${
              msg.role === 'user' ? 'ml-auto bg-blue-100 text-black' : 'bg-white text-black'
            }`}
          >

<div className="text-xs font-bold text-gray-600 mb-1">{msg.role}</div>

{msg.content !== undefined && (
  msg.role === 'assistant' && i === messages.length - 1 ? (
    <TypingText text={msg.content} speed={25} />
  ) : (
    <div>{msg.content}</div>
  )
)}


          </div>
        ))}

        {isLoading && (
          <div className="text-center text-sm text-gray-300 mb-4 animate-pulse">
            GM整理中⏳・・・
          </div>
        )}

        {choices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm sm:text-base"
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
