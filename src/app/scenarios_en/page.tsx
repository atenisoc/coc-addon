// src/app/scenarios_en/page.tsx
import fs from 'fs';
import path from 'path';
import { ScenarioCard } from '@/components/ScenarioCard_en';

interface Scenario {
  title: string;
  summary: string;
  file: string;
  prompt: string;
}

const rawScenarios = [
  {
    title: 'Poisoned Soup',
    summary: '"Is there poison in the soup?"\nTrapped in a dark room with a mysterious bowl.\nCan you escape in time?',
    file: 'poisoned_soup_en.txt',
  },
  {
    title: 'Death Train',
    summary: '"This train... won’t stop."\nYou wake up on a strange train.\nEscape before it’s too late.',
    file: 'deathTrainPrompt_en.txt',
  },
];

export default function ScenarioListPage() {
  const basePath = path.join(process.cwd(), 'public', 'data');

  const scenarios: Scenario[] = rawScenarios.map((s) => {
    let prompt = '';
    try {
      prompt = fs.readFileSync(path.join(basePath, s.file), 'utf8');
    } catch (e) {
      prompt = '⚠️ Failed to load prompt.';
    }
    return { ...s, prompt };
  });

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(\"/bg/common.jpg\")' }}
    >
      <div className="max-w-3xl mx-auto p-4 bg-white/00 rounded-lg shadow">
        {/* 📌 Title */}
        <h1 className="text-3xl font-serif font-bold text-center text-gray-00 tracking-wide mb-6">
          🧠 GPT x Call of Cthulhu
        </h1>

        {/* 📋 Instructions */}
        <section className="p-5 bg-yellow-00 border-yellow-00 rounded shadow-md text-gray-900">
          <h3 className="text-2xl text-white font-bold mb-2">📋 How to Play</h3>
          <ol className="list-decimal pl-6 space-y-1 text-white">
            <li>
              Click the button for the scenario you want and <span className="font-semibold text-green-500">copy the text</span>.
            </li>
            <li>
              <a
                href="https://chat.openai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 mt-1 text-white bg-blue-500 rounded hover:bg-blue-700 transition"
              >
                💬 Open ChatGPT (paste and press Enter)
              </a>
            </li>
          </ol>
          <ul className="mt-5 text-sm text-white space-y-1">
            <li>* If the chat box does not appear,<br />&nbsp;&nbsp;&nbsp;&nbsp;click “Start now” in the center.</li>
            <li>* GPT-4o is recommended for the most immersive experience.</li>
          </ul>
        </section>

        {/* Scenario Cards */}
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
