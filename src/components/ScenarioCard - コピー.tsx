'use client';

import { useState } from 'react';

export function ScenarioCard({
  title,
  summary,
  prompt,
}: {
  title: string;
  summary: string;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

return (
  <div className="bg-white border rounded shadow p-4 mb-8 max-w-xl mx-auto">
    {/* 📌 シナリオの表題 */}
    <h2 className="text-2xl font-serif font-bold text-center text-gray-900 tracking-wide mb-6">{title}</h2>

    {/* 📋 コピー用ボタン＋📝 概要を横並び */}
    <div className="flex items-center justify-between gap-4 mb-4">
      <button
        onClick={handleCopy}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
      >
        {copied ? '✅ コピーしました！' : '📋 シナリオをコピー'}
      </button>
      <p className="text-sm text-gray-700">{summary}</p>
    </div>
  </div>
);
}
