// src/components/NpcChatLog.tsx
type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function NpcChatLog({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 rounded-xl max-w-[80%] ${
            msg.role === 'user'
              ? 'bg-blue-700 text-right ml-auto'
              : 'bg-gray-800 text-left mr-auto'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  )
}
