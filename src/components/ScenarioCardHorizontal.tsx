'use client';

import { useState } from 'react';

interface ScenarioCardProps {
  title: string;
  summary: string;
  prompt: string;
  image?: string;
}

export function ScenarioCardHorizontal({ title, summary, prompt, image }: ScenarioCardProps) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('フォールバックコピーに失敗しました', err);
      alert('コピーに失敗しました');
    }
    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        fallbackCopy(prompt);
      }
    } catch (err) {
      console.error('コピーに失敗しました', err);
      fallbackCopy(prompt);
    }
  };

  return (
    <div className="w-full max-w-xl flex bg-gray rounded-lg shadow hover:shadow-md transition overflow-hidden border">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-1/3 object-cover"
        />
      )}
      <div className="p-4 w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-red-500 font-serif tracking-wide">
            {title}
          </h3>
          <p className="text-sm text-white leading-snug mt-1 whitespace-pre-line">
            {summary}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 self-start px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          {copied ? '✅ コピー済' : '📋 コピー'}
        </button>
      </div>
    </div>
  );
}
