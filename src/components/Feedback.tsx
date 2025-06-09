'use client'
import { useState } from 'react'

export default function Feedback() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!message.trim()) return
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', content: message }),
      })
      setStatus('sent')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="font-bold text-lg mb-2">開発者へのフィードバック</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ご意見・ご感想をどうぞ"
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        送信
      </button>
      {status === 'sent' && <p className="text-green-600 mt-1">送信しました！</p>}
      {status === 'error' && <p className="text-red-600 mt-1">送信に失敗しました</p>}
    </div>
  )
}
