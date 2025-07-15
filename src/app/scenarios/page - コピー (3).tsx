// src/app/scenarios/page.tsx
import fs from 'fs';
import path from 'path';
import { ScenarioCard } from '@/components/ScenarioCard';

interface Scenario {
  title: string;
  summary: string;
  file: string;
  prompt: string;
}

const rawScenarios = [
  {
    title: '毒入りスープ',
    summary: 'スープには毒が。探索で真相に迫れ。',
    file: 'poisoned_soup.txt',
  },
  {
    title: '静寂のアトリエ',
    summary: '山奥の小さなアトリエで過ごす一夜。不気味な気配が静かに忍び寄る。',
    file: 'shizuka_atelier.txt',
  },
  {
    title: '廃病院の記憶',
    summary: '閉鎖された病院を訪れたあなたに、過去の記憶と怪異が迫る。',
    file: 'haunted_hospital.txt',
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
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(\"/bg/common.jpg\")' }}
    >


<div className="max-w-3xl mx-auto p-4 bg-white/70 rounded-lg shadow">
  {/* 📌 表題と一覧タイトル */}


<h1 className="text-3xl font-serif font-bold text-center text-gray-900 tracking-wide mb-6">
  🕯️ クトゥルフ神話TRPG
</h1>
<h1 className="text-2xl font-serif font-bold text-center text-gray-900 tracking-wide mb-6">
  【シナリオ選択】
</h1>


{/* 🧾 利用方法（強調版） */}
<div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow-md text-gray-900">
  <p className="text-lg font-semibold mb-2">📋 利用手順</p>
  <ul className="list-disc pl-5 space-y-1 text-base">
    <li>
      <span className="font-bold text-green-700">① 以下、任意のシナリオをコピーしてください。</span>
    </li>
    <li>
      <span className="font-bold text-blue-700">
        ② <a
          href="https://chat.openai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ここをクリックし、ChatGPTを開く。⇒（シナリオを貼り付け。開始！）
        </a>
      </span>
    </li>
  </ul>
  <p className="mt-2 text-sm text-gray-700">
    　　※１．チャット欄が出ない場合、画面中央の「今すぐ始める」をクリック
  </p>
  <p className="mt-2 text-sm text-gray-700">
    　　※２．有料のGPT-4oなら、より精度の高いセッションに
  </p>
</div>






        {/* カード表示 */}
        <div className="flex flex-col items-center gap-8">
          {scenarios.map((scenario, index) => (
            <div key={index} className="w-full max-w-xl">
              <ScenarioCard {...scenario} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
