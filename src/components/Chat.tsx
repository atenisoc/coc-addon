import { useState } from 'react'

type Message = {
  role: 'user' | 'gpt'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (content: string) => {
    setLoading(true)
    const newMessages: Message[] = [...messages, { role: 'user', content }]  // ← 型を揃える
    setMessages(newMessages)

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'gpt', content: data.reply }])
    } catch (err) {
      console.error('API error', err)
    } finally {
      setLoading(false)
    }
  }

  // ...
}
