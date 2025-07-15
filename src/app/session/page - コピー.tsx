'use client'

import { Suspense } from 'react'
import ChatClient from './ChatClient'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function PageInner() {
  const params = useSearchParams()
  const scenarioId = params.get('id') || ''

  const scenarioTitleMap: Record<string, string> = {
    'kisaragi': 'きさらぎ駅',
    'mirror-home': '鏡の奥の家',
    'echoes': '繰り返される命日',
    'demon-mansion': '悪魔の館',
    'hotel-hilbert': 'HOTELヒルベルト',
  }

  const backgroundMap: Record<string, string> = {
    'kisaragi': '/bg/bg-kisaragi.jpg',
    'mirror-home': '/bg/bg-mirror.jpg',
    'echoes': '/bg/bg-echoes.jpg',
    'demon-mansion': '/bg/bg-demon.jpg',
    'hotel-hilbert': '/bg/bg-hotel.jpg',
  }

  const title = scenarioTitleMap[scenarioId] || ''

  const [bgUrl, setBgUrl] = useState('/bg/session-dark.jpg')

  useEffect(() => {
    const url = backgroundMap[scenarioId]
    if (!url) {
      setBgUrl('/bg/session-dark.jpg')
      return
    }

    const img = new Image()
    img.src = url
    img.onload = () => setBgUrl(url)
    img.onerror = () => setBgUrl('/bg/session-dark.jpg')
  }, [scenarioId])

  return (
    <main
      className="relative min-h-screen px-4 py-8 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url('${bgUrl}')`,
        backgroundColor: '#111827',
      }}
    >
      {/* バージョン表示 */}
      <p className="absolute bottom-2 right-4 text-xs text-gray-300 z-10">
        ver. 1.2
      </p>

      <div className="max-w-screen-md mx-auto space-y-6 text-shadow text-center">
        {title && (
          <h1
            className="text-4xl md:text-5xl font-bold tracking-widest text-white"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            {title}
          </h1>
        )}

        {/* ✅ リンク先を /coc に修正 */}
        <a
          href="/coc"
          className="inline-block text-sm text-blue-300 hover:underline mt-1"
        >
          トップへ戻る
        </a>

        <ChatClient />
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-white">読み込み中…</div>}>
      <PageInner />
    </Suspense>
  )
}
