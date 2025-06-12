import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId } = await req.json()

  // ✅ ログ：POSTが呼ばれたことを確認
  console.log('[POST呼び出し]', { userInput, scenarioId })

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

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ]

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.8,
    })

    const replyText = res.choices[0]?.message?.content ?? ''
    console.log('[GPT replyText]', replyText)

    let parsed
    try {
      parsed = JSON.parse(replyText)
    } catch (e) {
      console.error('[JSON.parse ERROR] raw replyText:', replyText)
      parsed = {
        reply: replyText,
        options: ['続ける', '終了する'],
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('[GPT ERROR]', err?.message || err)
    console.error('[環境変数確認]', process.env.OPENAI_API_KEY ? '✔️ 設定済み' : '❌ 未設定')

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
