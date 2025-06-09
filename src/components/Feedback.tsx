'use client'

import { useState } from 'react'

export default function Feedback() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return

    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (res.ok) {
      setSent(true)
      setMessage('')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mt-8">開発者へのフィードバック</h2>
      {sent ? (
        <p className="text-green-600 mt-2">ご意見ありがとうございました！</p>
      ) : (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="ご意見・ご感想をどうぞ"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={handleSubmit}
          >
            送信
          </button>
        </div>
      )}
    </div>
  )
}
