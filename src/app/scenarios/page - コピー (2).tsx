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
  style={{ backgroundImage: 'url("/bg/common.jpg")' }}
>
  <div className="max-w-3xl mx-auto p-6 bg-white/80 rounded-lg shadow-lg space-y-8">
    {/* 🕯️ タイトル */}
    <header className="text-center space-y-2">
      <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wide">
        🕯️ クトゥルフ神話TRPG
      </h1>
      <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
        【シナリオ選択】
      </h2>
    </header>

    {/* 📋 利用手順 */}
    <section className="p-5 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow-md text-gray-900">
      <h3 className="text-lg font-bold mb-2">📋 利用手順</h3>
      <ol className="list-decimal pl-6 space-y-1 text-base">
        <li>
          気になるシナリオの <span className="font-semibold text-green-700">テキストをコピー</span> してください。
        </li>
        <li>
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-blue-700"
          >
            こちらから ChatGPT を開く
          </a>（貼り付けて「開始！」と入力）
        </li>
      </ol>
      <ul className="mt-3 text-sm text-gray-700 space-y-1">
        <li>※ チャット欄が表示されない場合、中央の「今すぐ始める」をクリック</li>
        <li>※ GPT-4o（有料版）推奨。より没入感ある体験に</li>
      </ul>
    </section>


       {/* 📚 シナリオカード一覧 */}
        <section className="flex flex-col items-center gap-8">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className="w-full max-w-xl bg-white rounded-lg shadow hover:shadow-md transition p-5 space-y-3 border"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{scenario.title}</h3>
                  <p className="text-sm text-gray-700">{scenario.summary}</p>
                </div>
                <button
                  onClick={() => handleCopy(scenario.prompt, index)}
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
                >
                  {copiedIndex === index ? '✅ コピー済' : '📋 コピー'}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}