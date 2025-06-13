import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getScenarioDescription } from '@/lib/scenario'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId } = await req.json()

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })
  const scenarioSummary = getScenarioDescription(scenarioId)

  const systemPrompt = `あなたはクトゥルフ神話TRPGのゲームマスターです。
プレイヤーは現在、シナリオ「${scenarioId}」を探索中です。

【シナリオ概要】
${scenarioSummary}

以下のJSON形式だけを、説明なしでそのまま返してください。
- コードブロック、補足、説明、見出し、HTMLは禁止
- JSON以外は出力してはいけません

【出力形式】
{
  "reply": "描写本文をここに記述します。",
  "options": ["選択肢1", "選択肢2", "選択肢3"]
}

【ルール】
- reply は簡潔に。情景描写を含めつつ300字以内
- options は必ず ["〜", "〜", "〜"] という JSON 配列
- options 各要素は「""」で囲った文字列
- options に「,」「"」「改行」が含まれる場合は避けてください
- 絶対に reply や options を省略しないでください
- 上記JSONのみを返してください（前後の説明なども出力禁止）
`

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatHistory,
      temperature: 0.8,
    })

    let raw = response.choices[0]?.message.content?.trim() ?? ''

    // コードブロック除去
    if (raw.startsWith('```')) {
      raw = raw.replace(/```json|```/g, '').trim()
    }

    // JSONパース＋構造チェック
    const json = JSON.parse(raw)

    const isValid =
      typeof json === 'object' &&
      typeof json.reply === 'string' &&
      Array.isArray(json.options) &&
      json.options.every((opt: any) => typeof opt === 'string')

    if (!isValid) {
      throw new Error('GPTからの出力が正しいJSON形式ではありません。')
    }

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
