// src/app/api/message/route.ts

import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getScenarioDescription } from '@/lib/scenario'

export const runtime = 'edge'

const MAX_FALLBACK_COUNT = 2

export async function POST(req: NextRequest) {
  const { userInput, history, scenarioId, fallbackCount = 0 } = await req.json()

  if (fallbackCount >= MAX_FALLBACK_COUNT) {
    return new Response(JSON.stringify({
      reply: '※ システム異常により進行を変更します。再構成された選択肢により継続可能です。',
      options: ['無理やり進める', '直近に戻る', 'テンプレート選択肢で続ける'],
      fallback: true,
      errorFlag: 'loop-detected',
      debugFlags: ['FALLBACK_LOOP_LIMIT']
    }), { status: 207 })
  }

  if (userInput === 'force-error') {
    return new Response(JSON.stringify({
      reply: '※ 構造不正テスト: 強制エラー応答',
      options: ['再試行', '確認する'],
      fallback: true,
      errorFlag: 'structure-invalid',
      debugFlags: ['FORCED_TEST']
    }), { status: 206 })
  }

  if (userInput === 'force-exception') {
    throw new Error('強制例外 for test')
  }

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
- options 各要素は "" で囲った文字列
- options に "," や "\"" や 改行 を含まないこと
- 絶対に reply や options を省略しない
- 上記JSONのみを返すこと（前後の補足は禁止）`

  try {
    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content }))
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatHistory,
      temperature: 0.8,
    })

    let raw = response.choices[0]?.message.content?.trim() ?? ''
    console.log('[GPT応答]', raw) // ⭐ 追加ログ出力

    if (raw.startsWith('```')) {
      raw = raw.replace(/```json|```/g, '').trim()
    }

    const json = JSON.parse(raw)
    const isValid =
      typeof json === 'object' &&
      typeof json.reply === 'string' &&
      Array.isArray(json.options) &&
      json.options.every((opt: any) => typeof opt === 'string') &&
      json.options.length >= 2 && json.options.length <= 4

    if (!isValid) throw new Error('構造検証エラー')

    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.warn('[構造不正または例外]', err)

    return new Response(JSON.stringify({
      reply: '……沈黙が流れる。空気が不穏に揺れた。何かが狂っているようだ。',
      options: ['様子を見る', '静かに待つ', '誰かを呼ぶ'],
      fallback: true,
      errorFlag: 'structure-invalid-or-exception',
      debugFlags: ['RAW_FAIL_PARSE_OR_EXCEPTION'],
      fallbackCount: fallbackCount + 1
    }), { status: 206 })
  }
}
