'use client'

import { useState } from 'react'

type Message = {
  role: 'user' | 'gpt'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    // 送信処理...
  }

  return (
    <div>
      {/* チャットUI内容 */}
    </div>
  )
}
