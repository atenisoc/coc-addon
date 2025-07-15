import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt';
import { buildMemorySummary } from '@/lib/prompts/memorySummary';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const latestInput = body.input || '';
  const flags = body.flags || {};

  // ✅ ① flags拡張（副作用系の最低限の更新ロジック例）
  const updatedFlags = {
    ...flags,
    time_elapsed: (flags.time_elapsed || 0) + 1,
    phase_log: [...(flags.phase_log || []), flags.phase || 'start'],
  };

  // ✅ ② 軽量記憶テンプレートを作成
  const memorySummary = buildMemorySummary(updatedFlags);

  // ✅ ③ プロンプト生成
  const prompt = kisaragiPrompt(updatedFlags, latestInput, memorySummary);

  // ✅ ④ GPTに送信
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'system', content: prompt }],
  });

  const reply = completion.choices[0].message.content || '';

  // ✅ ⑤ 応答返却（flagsも更新状態で返す）
  return NextResponse.json({ reply, flags: updatedFlags });
}
