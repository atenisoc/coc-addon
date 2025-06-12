import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env.localに設定必須
})

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId } = await req.json()

  // systemプロンプト（ここで世界観や初期設定を調整）
  const systemPrompt = `あなたはクトゥルフ神話TRPGのゲームマスターです。シナリオID: ${scenarioId}。
プレイヤーの発言に対し、描写や状況、選択肢を提示してください。
必ず以下の形式で返答してください：
{
  "reply": "描写本文…",
  "options": ["選択肢A", "選択肢B", ...]
}`

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4', // または 'gpt-3.5-turbo'
      messages: chatHistory,
      temperature: 0.8,
    })

    const reply = response.choices[0].message.content ?? ''

    // JSONとしてパース（GPTの返答形式を前提とする）
    const parsed = JSON.parse(reply)

    return Response.json({
      reply: parsed.reply,
      options: parsed.options || [],
    })
  } catch (err: any) {
    console.error('[API ERROR]', err)
    return Response.json({
      reply: '通信エラーが発生しました。もう一度お試しください。',
      options: ['最初に戻る'],
    })
  }
}
