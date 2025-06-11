'use client'

import { useRouter } from 'next/navigation'

const scenarios = [
  {
    id: 'dark-library',
    title: '闇の図書館',
    tagline: '知識を求める者は、狂気に辿り着く。',
    summary: '探索者たちは封印された図書館に引き寄せられた力に巻き込まれる。古代の神々と戦うため、探索者たちは禁断の知識を探し求める。しかし、真実を知ることは常に危険を伴う。彼らは理性を保てるだろうか？',
  },
  {
    id: 'echoes',
    title: 'エコーズ',
    tagline: '過去に囚われた叫びが、今、再び響く。',
    summary: '廃墟となった村に足を踏み入れた探索者たちは、かつてそこで起きた惨劇の幻影を見る。死者の囁きに導かれながら、真実を掘り起こしていく。',
  },
  {
    id: 'clocktower',
    title: '時計塔の彼方',
    tagline: '時の歪みが、現実を侵食する。',
    summary: '奇妙な夢の導きで辿り着いた時計塔。時間が巻き戻り、進まなくなるその場所で、探索者たちは現実の境界線を見失っていく。',
  },
]

export default function CoCPage() {
  const router = useRouter()

  const handleSelect = (scenario: typeof scenarios[number]) => {
    localStorage.setItem('selectedScenario', JSON.stringify(scenario))
    router.push('/session4')
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📖 シナリオを選んでください</h1>
      {scenarios.map((s, i) => (
        <div
          key={i}
          className="bg-zinc-800 rounded-lg p-4 shadow space-y-2 border border-zinc-700"
        >
          <h2 className="text-lg font-bold text-white">📖 「{s.title}」</h2>
          <p className="text-sm text-red-400 italic">{s.tagline}</p>
          <p className="text-sm text-zinc-200 whitespace-pre-wrap">{s.summary}</p>
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
            onClick={() => handleSelect(s)}
          >
            このシナリオで始める
          </button>
        </div>
      ))}
    </main>
  )
}
