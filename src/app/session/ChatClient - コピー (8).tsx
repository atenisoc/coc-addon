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
  const [choices, setChoices] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
　const [debugFlags, setDebugFlags] = useState<Record<string, any>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const initialFlags = {
    phase: 'start', visited: [], has_seen_shadow: false, has_heard_whisper: false,
    san_level: 100, has_flashlight: false, injured: false, knows_exit_direction: false,
    trust_npc_yamamoto: 50, fear_level: 0, time_elapsed: 0, is_followed: false, loop_count: 0,
    phase_log: []
  }


function extractChoices(text: string): string[] {
  return text
    .split('\n')
    .filter(line => /^\s*\d+[.:、]\s*/.test(line.trim()))
    .map(line => line.replace(/^\s*\d+[.:、]\s*/, '').trim())
    .filter(choice => choice.length > 0)
}

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true)
      const initialMessages: Message[] = []
      setMessages([...initialMessages, { role: 'assistant', content: '' }])

      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], flags: initialFlags }),
      })

      if (!res.ok) {
        console.error('初回APIエラー:', await res.text())
        setIsLoading(false)
        return
      }

      const data = await res.json()
      setMessages([{ role: 'assistant', content: data.reply ?? '[応答なし]' }])
      setFlags(data.flags ?? initialFlags)
      setChoices(extractChoices(data.reply ?? ''))
      setIsLoading(false)
    }
    fetchInitial()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, flags }),
    })

    if (!res.ok) {
      console.error('送信APIエラー:', await res.text())
      setIsLoading(false)
      return
    }

    const data = await res.json()
    const reply = data.reply ?? '[応答なし]'


if (data.flags) {
  setFlags((prevFlags) => {
    const serverFlags = data.flags ?? {}; // ✅ これを最初に定義！
    const newPhaseLog = [...(prevFlags.phase_log ?? [])];
    if (data.flags.phase && !newPhaseLog.includes(data.flags.phase)) {
      newPhaseLog.push(data.flags.phase);
    }
　  const mergedFlags = {
  　  ...prevFlags,
  　  ...serverFlags,
 　   phase_log: newPhaseLog,
  　};
　　// フラグをマージする直前にバッチ出力
　　console.log('[ChatClient.tsx] 🟡 prevFlags:', prevFlags);
　　console.log('[ChatClient.tsx] 🟡 data.flags (from GPT):', data.flags);
    setDebugFlags(mergedFlags); // ✅ デバッグにも保存
　  return mergedFlags;

　　// マージ後の状態をバッチ出力（既にあるなら省略可）
　　console.log('[ChatClient.tsx] ✅ mergedFlags after GPT response:', mergedFlags);

    // ✅ ここでログ出力（バッチ的なトレース）
    console.log('[ChatClient] フラグマージ結果:', mergedFlags);
    console.log('[ChatClient] GPT返却 flags:', data.flags);
    console.log('[ChatClient] 旧 flags:', prevFlags);

  console.log('[ChatClient.tsx] ✅ mergedFlags after GPT response:', mergedFlags);

  setDebugFlags(mergedFlags); // ✅ これで OK（定義後に使用）
  return mergedFlags;
  });
}




    setChoices(extractChoices(reply))
    setMessages([...newMessages, { role: 'assistant', content: reply }])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="relative min-h-screen font-['Kiwi_Maru'] text-white">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url('/bg/kisaragi/phase00_fix.png')` }}></div>

      <div className="relative p-4 max-w-2xl mx-auto min-h-screen bg-transparent z-10">
        <div className="mb-4">
          <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-md font-serif">きさらぎ駅セッション</h2>
          {isLoading && <div className="text-sm italic text-[#a8fca8] animate-pulse mt-1"> </div>}
        </div>

        <div className="space-y-4 mb-4">
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1
            const isAssistant = msg.role === 'assistant'
            return (
              <div key={i} className={msg.role === 'user' ? 'text-right text-sky-300' : ''}>
                <div className="text-xs font-bold text-[#a8fca8] mb-1">{msg.role}</div>
                {msg.content !== undefined && (
                  isAssistant && isLast && isLoading ? (
                    <div className="text-sm italic text-[#a8fca8] animate-pulse">GMが確認中...</div>
                  ) : isAssistant && isLast ? (
                    <TypingText text={msg.content} speed={25} />
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )
                )}
              </div>
            )
          })}
          <div ref={scrollRef} />
        </div>

        {choices.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                className="bg-[#3aa86a] text-white px-3 py-1 rounded text-sm hover:bg-[#4ecf8f]"
                onClick={() => {
                  setInput(choice)
                  setTimeout(() => handleSend(), 0)
                }}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border px-2 py-1 text-sm bg-transparent placeholder-gray-400"
            placeholder="選択肢または自由入力..."
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-1 text-sm">
            送信
          </button>
        </div>

        <div className="text-xs text-[#88bfa8] rounded border border-[#88bfa8] p-2">
          <div className="font-bold mb-1">[デバッグ] flags 状態:</div>
          <pre>{JSON.stringify(debugFlags, null, 2)}</pre>
        </div>

　　　　<div className="p-4 bg-gray-100 rounded-lg mt-4">
  <div className="flex items-center space-x-2 mb-2">
    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
      debugFlags
    </span>
    <span className="text-sm text-gray-600">（デバッグ用のフラグ状態）</span>
  </div>
  <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
    {JSON.stringify(debugFlags, null, 2)}
  </pre>
</div>

      </div>
    </div>
  )
}
