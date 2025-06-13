import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge' // VercelのEdge Function対応

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId } = await req.json()

  if (!process.env.OPENAI_API_KEY) {
    console.error('[環境変数エラー] OPENAI_API_KEY が未設定')
    return new Response(
      JSON.stringify({
        reply: 'サーバー設定エラーです。管理者に連絡してください。',
        options: ['最初に戻る'],
      }),
      { status: 500 }
    )
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const systemPrompt = `あなたはクトゥルフ神話TRPGのゲームマスターです。プレイヤーは今、シナリオ「${scenarioId}」を進行中です。
プレイヤーの選択に応じて、ストーリーを描写し、行動の選択肢を提示してください。

【出力形式】
{
  "reply": "描写や状況説明をここに記述します。",
  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"]
}

【ルール】
- 選択肢は常に3〜4個提示してください。
- それぞれの選択肢は異なる展開につながるようにしてください。
- 選択肢の文言は簡潔に（例：「扉を開ける」「話しかける」「逃げる」など）
- replyは短すぎず、描写や緊張感を含めてください。`

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4', // 必要に応じて gpt-4.0, gpt-4.0-turbo 等
      messages: chatHistory,
      temperature: 0.8,
    })

    const raw = response.choices[0]?.message.content ?? ''
    const json = JSON.parse(raw)

    return new Response(JSON.stringify(json), { status: 200 })
  } catch (err: any) {
    console.error('[OpenAIエラー]', err)

    return new Response(
      JSON.stringify({
        reply: `エラーが発生しました: ${err.message}`,
        options: ['最初に戻る'],
      }),
      { status: 500 }
    )
  }
}
