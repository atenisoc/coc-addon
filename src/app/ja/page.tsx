'use client'

import Chat from '@/components/Chat'
import Feedback from '@/components/Feedback'

export default function JaPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">クトゥルフの世界へようこそ</h1>
      <Chat />
      <Feedback />
    </div>
  )
}
