import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getScenarioDescription } from '@/lib/scenario'

export const runtime = 'edge'

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

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const scenarioSummary = getScenarioDescription(scenarioId)

  const systemPrompt = `あなたはクトゥルフ神話TRPGのゲームマスターです。現在、以下のシナリオを進行中です。

【シナリオ名】
${scenarioId}

【シナリオ概要】
${scenarioSummary}

プレイヤーの発言や選択に応じて、以下の形式で描写と選択肢を返してください。
コードブロックを使わず、純粋なJSONのみで出力してください：

{
  "reply": "描写文や状況説明をここに記述します。",
  "options": ["選択肢1", "選択肢2", "選択肢3"]
}`

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatHistory,
      temperature: 0.8,
    })

    let raw = response.choices[0]?.message.content ?? ''
    raw = raw.trim()

    if (raw.startsWith('```')) {
      raw = raw.replace(/```json|```/g, '').trim()
    }

    const json = JSON.parse(raw)

    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
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
