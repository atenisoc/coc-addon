'use client'

export default function COCPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-4 text-white"
      style={{ backgroundImage: 'url(/backgrounds/cthulhu-bg.jpg)' }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">シナリオを選んでください</h1>

        {/* Echoes */}
        <ScenarioCard
          title="「エコーズ」"
          subtitle="過去に囚われた叫びが、今、再び響く。"
          description="廃地となった村に足を踏み入れた探索者たちは、かつてそこで起きた惨劇の幻影を見る。死者の囁きに導かれながら、真実を掘り起こしていく。"
          href="/session4?id=echoes"
        />

        {/* 闇の図書館 */}
        <ScenarioCard
          title="「闇の図書館」"
          subtitle="知識を求める者は、狂気に辿り着く。"
          description="探索者たちは封印された図書館に引き寄せられ、古代の神々と謎とかかわる。真実を知るとは、常に危険を伴う。"
          href="/session4?id=library"
        />

        {/* 時計塔の彼方 */}
        <ScenarioCard
          title="「時計塔の彼方」"
          subtitle="時を巡る者は、記憶に喰われる。"
          description="時計塔に導かれた探索者たちは、歪んだ時間と失われた記憶に翻弄される。過去と未来の交差点で、真実を選び取れるか。"
          href="/session4?id=clocktower"
        />
      </div>
    </div>
  )
}

function ScenarioCard({
  title,
  subtitle,
  description,
  href,
}: {
  title: string
  subtitle: string
  description: string
  href: string
}) {
  return (
    <div className="bg-black bg-opacity-70 p-4 rounded-lg space-y-2 shadow">
      <h2 className="text-white font-bold">{title}</h2>
      <p className="text-red-300">{subtitle}</p>
      <p className="text-white text-sm">{description}</p>
      <a href={href}>
        <button className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
          このシナリオで始める
        </button>
      </a>
    </div>
  )
}
