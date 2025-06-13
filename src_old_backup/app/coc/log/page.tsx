'use client'

import { useEffect, useState } from 'react'

export default function LogPage() {
  const [logs, setLogs] = useState<{ uuid: string; data: any[] }[]>([])

  useEffect(() => {
    const items: { uuid: string; data: any[] }[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('log-')) {
        const raw = localStorage.getItem(key)
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            items.push({ uuid: key.replace('log-', ''), data: parsed })
          } catch (e) {
            console.error('Failed to parse log:', key)
          }
        }
      }
    }

    setLogs(items)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">保存されたログ一覧</h1>

      {logs.length === 0 && <p className="text-gray-500">ログはありません。</p>}

      {logs.map((log, index) => (
        <div key={index} className="border p-2 rounded bg-white shadow">
          <h2 className="font-semibold">UUID: {log.uuid}</h2>
          <div className="space-y-1 mt-2 max-h-48 overflow-y-auto text-sm">
            {log.data.map((msg, idx) => (
              <div key={idx} className={`text-${msg.sender === 'user' ? 'right' : 'left'}`}>
                <span className="inline-block bg-gray-100 p-1 rounded">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
