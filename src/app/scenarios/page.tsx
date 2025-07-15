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
    summary: '「スープには“毒”がある？」\n暗い部屋に集められたあなたとスープ。\n時間内に逃げられるか！？',
    file: 'poisoned_soup.txt',
  },
  {
    title: '死にたがり電車',
    summary: '「この列車は、・・・。降りられない。」\n気づけば見知らぬ列車の中。\n不気味な乗客と謎を追い脱出を目指す。',
    file: 'deathTrainPrompt.txt',
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


<div className="max-w-3xl mx-auto p-4 bg-white/00 rounded-lg shadow">
  {/* 📌 表題と一覧タイトル */}


<h1 className="text-3xl font-serif font-bold text-center text-gray-00 tracking-wide mb-6">
  【クトゥルフ神話TRPG】
</h1>

    {/* 📋 利用手順 */}
    <section className="p-5 bg-yellow-00 border-yellow-00 rounded shadow-md text-gray-900">
      <h3 className="text-2xl text-white font-bold mb-2">📋 利用手順</h3>
      <ol className="list-decimal pl-6 space-y-1  text-white">
        <li>
          気になるシナリオのボタンを押して、 <span className="font-semibold text-green-500">「テキストをコピー」</span> してください。
        </li>
        <li>
  <a
    href="https://chat.openai.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-4 py-2 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700 transition"
  >
    💬 ChatGPTを開く（貼り付けてEnterを押してください！）
  </a>
</li>

      </ol>
      <ul className="mt-5 text-sm text-white space-y-1">
<li>※１．チャット欄が表示されない場合、<br />　　  中央の「今すぐ始める」をクリック</li> 
<li>※２．GPT-4o（有料版）推奨。<br />　　  より没入感ある体験に</li>

      </ul>
    </section>



        {/* カード表示 */}
        <div className="flex flex-col items-center gap-8 mt-6">
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
