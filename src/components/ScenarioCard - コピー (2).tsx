'use client';

import { useState } from 'react';

interface ScenarioCardProps {
  title: string;
  summary: string;
  prompt: string;
}

export function ScenarioCard({ title, summary, prompt }: ScenarioCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました', err);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow hover:shadow-md transition p-5 space-y-3 border">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={handleCopy}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
        >
          {copied ? '✅ コピー済' : '📋 コピー'}
        </button>
        <div className="text-left w-full">
<h3 className="text-2xl font-bold text-red-700 font-serif tracking-wide leading-snug">
  {title}
</h3>

<p className="text-base text-gray-700 leading-relaxed tracking-wide mt-1">
  {summary}
</p>


</div>

      </div>
    </div>
  );
}
