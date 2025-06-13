'use client'

export default function COCPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-4 text-white"
      style={{ backgroundImage: 'url(/bg/common.jpg)' }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">シナリオを選んでください</h1>

        <ScenarioCard
          title="「悪魔の住む館」"
          subtitle="その館には、決して触れてはならない過去がある。"
          description="探索者たちは古びた洋館に招かれ、住人たちの奇怪な言動と不自然な出来事に巻き込まれていく。"
          href="/session?id=demon-mansion"
        />

        <ScenarioCard
          title="「きさらぎ駅」"
          subtitle="誰も知らない駅に降りた瞬間、帰り道は消えた。"
          description="都市伝説として語られる“きさらぎ駅”。その噂を追った探索者たちは、異界の駅に迷い込み、現実が崩れていく。"
          href="/session?id=kisaragi"
        />

        <ScenarioCard
          title="「ラジオから、声がする」"
          subtitle="微かなノイズの中に、聞き覚えのない誰かの声。"
          description="深夜のラジオ放送を聞いていた探索者のもとに届く不可解な声。その発信源を辿るとき、想像を超えた恐怖が姿を現す。"
          href="/session?id=radio-voice"
        />

        <ScenarioCard
          title="「鏡の奥の家」"
          subtitle="その家では、鏡がすべてを見ている。"
          description="探索者たちは古民家に泊まることになるが、そこには“向こう側”とつながる鏡が存在していた…。"
          href="/session?id=mirror-home"
        />

        <ScenarioCard
          title="「繰り返される命日」"
          subtitle="過去に囚われた叫びが、今、再び響く。"
          description="廃地となった村に足を踏み入れた探索者たちは、かつてそこで起きた惨劇の幻影を見る。死者の囁きに導かれながら、真実を掘り起こしていく。"
          href="/session?id=echoes"
        />

        <ScenarioCard
          title="「闇の図書館」"
          subtitle="知識を求める者は、狂気に辿り着く。"
          description="封印された図書館に引き寄せられた探索者たちは、古代の神々と謎とかかわる。真実を知るとは、常に危険を伴う。"
          href="/session?id=library"
        />

        <ScenarioCard
          title="「時計塔の彼方」"
          subtitle="時を巡る者は、記憶に喰われる。"
          description="時計塔に導かれた探索者たちは、歪んだ時間と失われた記憶に翻弄される。過去と未来の交差点で、真実を選び取れるか。"
          href="/session?id=clocktower"
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
