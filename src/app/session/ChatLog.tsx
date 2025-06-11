'use client'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Props = {
  messages: Message[]
  loading: boolean
}

export default function ChatLog({ messages, loading }: Props) {
  return (
    <div className="bg-black bg-opacity-50 p-4 rounded max-h-64 overflow-y-auto space-y-2">
      {messages.map((msg, i) => (
        <p key={i} className={`text-sm ${msg.role === 'user' ? 'text-sky-300' : 'text-white'}`}>
          {msg.role === 'user' ? `あなた：${msg.content}` : msg.content}
        </p>
      ))}
      {loading && <p className="text-gray-400 animate-pulse">…thinking</p>}
    </div>
  )
}
