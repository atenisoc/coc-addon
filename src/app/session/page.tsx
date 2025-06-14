'use client'

import { Suspense } from 'react'
import ChatClient from './ChatClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-gray-400 text-sm italic text-center mt-8">
      読み込み中...
    </div>}>
      <ChatClient />
    </Suspense>
  )
}
