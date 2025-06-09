'use client'

import Chat from '@/components/Chat'
import Feedback from '@/components/Feedback'

export default function CocPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">クトゥルフの世界へようこそ</h1>

      {/* チャットエリア */}
      <Chat />

      {/* フィードバック欄（開発者へのメッセージ） */}
      <Feedback />
    </div>
  )
}
