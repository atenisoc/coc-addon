'use client'

import { useState } from 'react'

export default function ChoiceSection() {
  const [input, setInput] = useState('')

  return (
    <div className="space-y-6 mt-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">🧠 GPT-CoC セッション</h2>

      <div className="bg-slate-800 bg-opacity-90 text-white p-4 rounded">
        <p className="text-sm">3. シナリオタイトル：「暗黒の聖域」</p>
        <p className="mt-2 text-sm">
          あらすじ: 遥かなる南の大地にある廃墟の中に、かつて邪悪な邪教団体が崇拝していたとされる「暗黒の聖域」が存在するという噂が立っている。
          PCたちはこの暗黒の聖域が秘める謎と恐怖に挑むため、探検隊を結成してその地に赴くことになる。
          しかし、地中深くに潜む邪悪な存在や、かつての崇拝者たちの亡霊が彼らを待ち受けており、彼らの運命は深い闇に飲み込まれていく。
        </p>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
          🔍 シナリオ①：ラジオから、声がする
        </button>
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
          🪞 シナリオ②：鏡の奥の家
        </button>
        <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded">
          🔢 シナリオ③：i・j・kの門
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="自由入力も可能です（状況確認など）"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-black"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded"
          onClick={() => alert(`入力された内容: ${input}`)}
        >
          送信
        </button>
      </div>
    </div>
  )
}
