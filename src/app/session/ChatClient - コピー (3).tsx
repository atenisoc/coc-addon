'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt';


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
  const [playerFlags, setPlayerFlags] = useState<string[]>([])
  const [playerSan, setPlayerSan] = useState<number>(100)

  const scenarioData = useRef<any>(null)
  const currentNodeId = useRef<string | null>(null)

  const params = useSearchParams()
  const scenarioId = params.get('id') || 'echoes'
  const disableOptions = params.get('noopt') === 'true'
  const typingSpeed = 20

  useEffect(() => {
    if (scenarioId === 'kisaragi-simple') {
      fetch('/data/kisaragi-simple.json')
        .then(res => res.json())
        .then(data => {
          const start = data.nodes.find((n: any) => n.id === 'phase01_01')
          if (!start) return
          scenarioData.current = data
          currentNodeId.current = start.id
          setMessages([{ role: 'assistant', content: start.text }])
          setOptions(start.options.map((opt: any) => opt.text))
        })
        .catch(() => {
          setMessages([{ role: 'assistant', content: '⚠️ シナリオ読み込み失敗' }])
        })
      return
    }

    setMessages([{ role: 'assistant', content: 'GMが確認中...' }])
    setOptions([])
    setTyping('')

    const timer = setTimeout(() => {
      setMessages([{ role: 'assistant', content: '探索を開始しますか？' }])
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

  const evaluateLossCondition = (cond: any): boolean => {
    if (!cond) return false
    if (cond.sanLessThan !== undefined && playerSan < cond.sanLessThan) return true
    if (cond.hasFlag && !playerFlags.includes(cond.hasFlag)) return true
    if (cond.notFlag && playerFlags.includes(cond.notFlag)) return true
    return false
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    const updated: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(updated)
    setInput('')
    setOptions([])
    setTyping('')
    setLoading(true)
    setErrorFlag('')

    if (scenarioId === 'kisaragi-simple' && scenarioData.current) {
      let currentNode = scenarioData.current.nodes.find((n: any) => n.id === currentNodeId.current)
      const selected = currentNode?.options?.find((o: any) => o.text === text)
      let nextNode = scenarioData.current.nodes.find((n: any) => n.id === selected?.next)

      if (!nextNode) {
        setMessages([
          ...updated,
          { role: 'assistant', content: '⚠️ 次のノードが見つかりません。' },
        ])
        setLoading(false)
        return
      }

      if (nextNode.setFlags) {
        setPlayerFlags((prev) => Array.from(new Set([...prev, ...nextNode.setFlags])))
      }

      if (typeof nextNode.sanChange === 'number') {
        setPlayerSan((prev) => prev + nextNode.sanChange)
      }

      if (nextNode.lossCondition && evaluateLossCondition(nextNode.lossCondition)) {
        const jumpId = nextNode.jump
        const jumpNode = scenarioData.current.nodes.find((n: any) => n.id === jumpId)
        if (jumpNode) {
          currentNodeId.current = jumpNode.id
          setMessages([...updated, { role: 'assistant', content: jumpNode.text }])
          setOptions(jumpNode.options?.map((o: any) => o.text) || [])
          setLoading(false)
          return
        }
      }

      currentNodeId.current = nextNode.id
      setMessages([...updated, { role: 'assistant', content: nextNode.text }])
      setOptions(nextNode.options?.map((o: any) => o.text) || [])
      setLoading(false)
      return
    }

try {
  const res = await fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: text,
      history: updated,
      scenarioId,
      prompt: scenarioId === 'kisaragi-simple' ? kisaragiPrompt : undefined
    })
  });

  const dataRaw = await res.json();
  let data = dataRaw;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      setMessages([
        ...updated,
        { role: 'assistant', content: '⚠️ 応答の構造が不正です（JSONとして解釈できません）' },
      ]);
      setLoading(false);
      return;
    }
  }

  setMessages([...updated, { role: 'assistant', content: data.reply }]);
  setOptions(data.options || []);
  if (data.errorFlag) setErrorFlag(data.errorFlag);
} catch (e: any) {
  setMessages([
    ...updated,
    {
      role: 'assistant',
      content: `通信エラーが発生しました。\n\n(APIエラー: ${e.message})`,
    },
  ]);
}


    setLoading(false)
  }

return (
  <div className="w-full max-w-3xl mx-auto px-4 space-y-4 font-[Kiwi_Maru]">
    {/* kisaragi MODE ヘッダーなど */}
    {scenarioId === 'kisaragi-simple' && (
      <>
        <div className="bg-purple-800 text-white text-center text-sm py-2 rounded shadow">
          [KISARAGI MODE] アクティブです
        </div>
        <div className="whitespace-pre-wrap bg-black text-green-400 text-left text-xs mt-2 p-4 rounded shadow max-h-[300px] overflow-auto">
          {kisaragiPrompt}
        </div>
      </>
    )}

    {/* メッセージ表示 */}
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

    {/* エラーフラグ */}
    {errorFlag && (
      <div className="text-xs text-yellow-300">
        ※ 正常な応答が得られませんでした（{errorFlag}）
      </div>
    )}

    {/* 選択肢ボタン */}
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

    {/* ローディング */}
    {loading && (
      <div className="text-center text-white/60 italic text-sm">
        ⏳ GMが状況を確認中…
      </div>
    )}

    {/* 入力欄 */}
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
) // ✅ return の閉じ括弧
} // ✅ ChatClient 関数の終わり（必須）
