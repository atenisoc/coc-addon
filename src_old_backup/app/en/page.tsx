'use client'

import Chat from '@/components/Chat'
import Feedback from '@/components/Feedback'

export default function CocPageEN() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Welcome to the World of Cthulhu</h1>
      <p>Test in progress</p>

      <Chat />
      <Feedback />
    </div>
  )
}
