import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

🔴 import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt'; // ← 追加

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, scenarioId } = await req.json();

  🔴 const systemPrompt = scenarioId === 'kisaragi-simple'
    ? kisaragiPrompt
    : 'あなたはTRPGのゲームマスターです。プレイヤーの行動に応じて自然な描写と展開をしてください。'; // ← 追加

  🔴 const updatedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]; // ← 追加

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    🔴 messages: updatedMessages, // ← 修正: messages → updatedMessages
    stream: true,
  });

  return new StreamingTextResponse(OpenAIStream(response));
}
