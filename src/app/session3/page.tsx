'use client';

import { useState } from 'react';
import NpcChatLog from '@/components/NpcChatLog';

export default function Session1Page() {
  const [agreed, setAgreed] = useState(false);

  if (!agreed) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center">セッション1：闇の図書館</h1>
          <p className="text-sm text-gray-300 whitespace-pre-line">
            このゲームはAIによって進行されるクトゥルフ神話TRPGです。
            登場する人物・団体・出来事はすべてフィクションです。
            選択によって物語が分岐し、異なる結末にたどり着くことがあります。
            ブラウザに履歴が保存され、再訪問時に続きから再開される場合があります。
            苦手な表現が含まれる可能性もありますので、自己責任でご利用ください。
          </p>
          <button
            onClick={() => setAgreed(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition rounded-xl py-3 px-6 text-center text-white font-semibold shadow mx-auto block"
          >
            ▶ はじめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">闇の図書館</h2>
        <p className="text-gray-300 text-sm">
          あなたは奇妙な夢に導かれ、廃墟となった図書館へと足を踏み入れた……。
        </p>
        <NpcChatLog />
      </div>
    </div>
  );
}
