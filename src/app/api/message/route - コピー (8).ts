import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// 選択肢を抽出する関数
function extractOptions(text: string): string[] {
  return text
    .split('\n')
    .filter(line => /^\d+\.\s/.test(line))
    .map(line => line.replace(/^\d+\.\s*/, '').trim());
}

// デフォルトフラグ
const defaultFlags = {
  phase: 'start',
  visited: [],
  san_level: 100,
  has_seen_shadow: false,
  has_heard_whisper: false,
  has_flashlight: false,
};

export async function POST(req: NextRequest) {
  console.log('[DEBUG] 🔔 POST /api/message CALLED');

  try {
    const body = await req.json();

    const messages = body.messages || [];
    const flags = body.flags || defaultFlags;

    console.log('[DEBUG] 🧾 messages.length:', messages.length);
    console.log('[DEBUG] 🧾 flags:', flags);

    const lastUserMessage =
      [...messages].reverse().find(msg => msg.role === 'user')?.content || '駅の構内を見渡す';

    const finalMessages = [
      {
        role: 'system',
        content: kisaragiPrompt(flags),
      },
      {
        role: 'user',
        content: lastUserMessage,
      },
    ];

    console.log('[DEBUG] 📌 finalInput:', lastUserMessage);
    console.log('[DEBUG] ✅ Final messages sent to chat:', finalMessages);

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: finalMessages,
      temperature: 0.8,
    });

    const reply = res.choices?.[0]?.message?.content ?? '(応答なし)';
    const options = extractOptions(reply);

    console.log('[chat.ts] ✅ reply received:', reply);
    console.log('[chat.ts] ✅ extracted options:', options);

    return NextResponse.json({ reply, options, flags });
  } catch (error) {
    console.error('[chat.ts] ❌ Error during OpenAI request:', error);
    return NextResponse.json({
      reply: 'エラーが発生しました。',
      options: [],
      flags: defaultFlags,
    });
  }
}
