// src/app/scenarios/page.tsx
import fs from 'fs';
import path from 'path';
import { ScenarioCard } from '@/components/ScenarioCard'; // 縦型カード
import { ScenarioCardHorizontal } from '@/components/ScenarioCardHorizontal'; // 横型カード（新規追加）

interface Scenario {
  title: string;
  summary: string;
  file: string;
  prompt: string;
  image?: string;
}

const rawScenarios = [
  {
    title: '毒入りスープ',
    summary: '「スープには“毒”がある？」\n暗い部屋に集められたあなたとスープ。\n時間内に逃げられるか！？',
    file: 'poisoned_soup.txt',
    image: '/images/poisoned_soup.jpg',
  },
  {
    title: '死にたがり電車',
    summary: '「この列車は、・・・。降りられない。」\n気づけば見知らぬ列車の中。\n不気味な乗客と謎を追い脱出を目指す。',
    file: 'deathTrainPrompt.txt',
    image: '/images/death_train.jpg',
  },
  {
    title: 'きさらぎ駅',
    summary: 'ネット都市伝説から着想。\n終電に乗ったあなたは、存在しない駅「きさらぎ駅」へ辿り着く。\nそこに降り立ったとき、何が待つのか…',
    file: 'kisaragi.txt',
    image: '/images/kisaragi.jpg',
  },
];


export default function ScenarioListPage() {
  const basePath = path.join(process.cwd(), 'public', 'data');

  const scenarios: Scenario[] = rawScenarios.map((s) => {
    let prompt = '';
    try {
      prompt = fs.readFileSync(path.join(basePath, s.file), 'utf8');
    } catch (e) {
      prompt = '⚠️ 読み込みエラー';
    }
    return { ...s, prompt };
  });

  return (
<main
  className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: 'url("/bg/common.jpg")' }}
>
  <div className="max-w-3xl mx-auto h-full flex flex-col p-4 pb-12 bg-white/0 rounded-lg shadow">

    {/* 📋 利用手順（固定ヘッダー） */}
    <section className="p-5 bg-yellow-00 border-yellow-00 rounded shadow-md text-white sticky top-0 z-10 backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-2">📋 利用手順</h3>
      <ol className="list-decimal pl-6 space-y-1">
        <li>
          気になるシナリオのボタンを押して、{' '}
          <span className="font-semibold text-green-400">「テキストをコピー」</span> してください。
        </li>
        <li>
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 mt-1 bg-blue-500 rounded hover:bg-blue-700 transition"
          >
            💬 ChatGPTを開く（貼り付けてEnterを押してください！）
          </a>
        </li>
      </ol>
      <ul className="mt-5 text-sm space-y-1">
        <li>※１．チャット欄が表示されない場合、<br />　　 中央の「今すぐ始める」をクリック</li>
        <li>※２．GPT-4o（有料版）推奨。<br />　　 より没入感ある体験に</li>
      </ul>
    </section>

{/* 🔽 スクロール可能なコンテンツ部分だけを明示的に可変サイズ化 */}
<section className="overflow-y-auto flex-grow px-2 space-y-8 pb-10">
  <h1 className="text-2xl font-serif font-bold text-center text-white tracking-wide mb-6">
    【クトゥルフ神話TRPG】
  </h1>
  {scenarios.map((scenario, index) => (
    <div key={`h-${index}`} className="w-full max-w-xl mx-auto">
      <ScenarioCardHorizontal {...scenario} />
    </div>
  ))}
</section>


  </div>
</main>

  );
}
