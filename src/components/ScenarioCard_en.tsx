'use client';

import { useState } from 'react';

interface ScenarioCardProps {
  title: string;
  summary: string;
  prompt: string;
}

export function ScenarioCard({ title, summary, prompt }: ScenarioCardProps) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling jump
    textarea.style.opacity = '0';      // Hide element
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed', err);
      alert('Failed to copy text.');
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
      console.error('Copy failed', err);
      fallbackCopy(prompt);
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray rounded-lg shadow hover:shadow-md transition p-5 space-y-3 border">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={handleCopy}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 whitespace-nowrap"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
        <div className="text-left w-full">
          <h3 className="text-2xl font-bold text-red-500 font-serif tracking-wide leading-snug">
            {title}
          </h3>
          <p className="text-base text-white-700 leading-relaxed tracking-wide mt-1">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
