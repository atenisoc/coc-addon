import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId } = await req.json()

  // GPT APIキー読み込み
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // システムプロンプト（シナリオIDで切り替え可能）
  const systemPrompt = `あなたはクトゥルフ神話TRPGのゲームマスターです。シナリオID: ${scenarioId}。
プレイヤーの発言に対して、臨場感のある描写や選択肢を提示してください。
必ず以下のJSON形式で返答してください：
{
  "reply": "描写本文…",
  "options": ["選択肢A", "選択肢B", ...]
}`

  // チャット履歴整形
  const chatHistory = [
    { role: 'system', content: systemPrompt },
    ...history.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ]

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatHistory,
      temperature: 0.8,
    })

    const text = res.choices[0]?.message?.content ?? ''

    // JSON形式を想定してパース
    let parsed: { reply: string; options?: string[] }
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { reply: text, options: [] }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[GPT ERROR]', err)
    return new Response(
      JSON.stringify({
        reply: 'エラーが発生しました。もう一度お試しください。',
        options: ['最初に戻る'],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}
