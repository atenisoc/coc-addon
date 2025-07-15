import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt'; // ← 追加済みであること


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// メモリ記憶マップ
const memoryMap: Record<string, string> = {};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, scenarioId, sessionId } = body;

  const isMemoryScenario = scenarioId === 'kisaragi-simple';
  const memorySummary = isMemoryScenario ? (memoryMap[sessionId] || '') : '';

  // ✅ systemPromptの構築（kisaragiPrompt + memory）
  const systemPrompt = isMemoryScenario
    ? `${kisaragiPrompt}\n\n【記録】\n${memorySummary}`
    : `あなたはTRPGのゲームマスターです。プレイヤーの発言に描写で応答してください。\n\n${memorySummary}`;

  // 確認用ログ（開発時のみ）
  console.log('✅ scenarioId:', scenarioId);
  console.log('✅ systemPrompt:\n', systemPrompt);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  let buffer = '';
  const stream = OpenAIStream(response, {
    onToken(token) {
      buffer += token;
    },
    async onFinal() {
      if (isMemoryScenario) {
        const prev = memoryMap[sessionId] || '';
        memoryMap[sessionId] = prev + '\n' + buffer;
      }
    }
  });

  return new StreamingTextResponse(stream);
}
