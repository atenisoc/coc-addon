'use client';

import { useEffect, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function NpcChatLog() {
  const [messages, setMessages] = useState<Message[]>([]);

  const STORAGE_KEY = 'coc-session1-log';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (newMsg: Message) => {
    setMessages([...messages, newMsg]);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow space-y-3">
      {messages.map((msg, i) => (
        <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-blue-300' : 'text-white'}`}>
          <strong>{msg.role === 'user' ? 'あなた' : 'NPC'}:</strong> {msg.content}
        </div>
      ))}
      <button
        onClick={() =>
          addMessage({ role: 'assistant', content: '何かが物陰からこちらを見ている気がする…' })
        }
        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        GPT風応答を追加
      </button>
    </div>
  );
}
