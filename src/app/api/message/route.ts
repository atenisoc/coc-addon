import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { userInput, history } = await req.json()

  const messages = [
    {
      role: 'system',
      content: `
あなたは探索系TRPGのゲームマスターです。
プレイヤーの入力に対して、物語を少しずつ進め、次の選択肢を提示してください。

以下のJSON形式のみをそのまま返してください。
**前後に一切の説明・挨拶・補足などを書かないでください。**

{
  "reply": "語り手としての返答文（改行可）",
  "options": ["選択肢1", "選択肢2", "選択肢3"]
}

・replyは400文字以内で自然に進行させてください。
・optionsは常に2〜4個を目安に出してください（なければ["自由に行動する"]）。
・**必ずパース可能なJSONで返してください。**
      `,
    },
    ...history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: userInput },
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4', // ← gpt-4に変更済
    messages,
    temperature: 0.7,
  })

  let raw = completion.choices[0].message.content || ''
  raw = raw.trim()

  // コードブロック除去
  if (raw.startsWith('```json')) {
    raw = raw.replace(/^```json\s*/, '').replace(/```$/, '').trim()
  } else if (raw.startsWith('```')) {
    raw = raw.replace(/^```\s*/, '').replace(/```$/, '').trim()
  }

  let reply = ''
  let options: string[] = []

  try {
    const json = JSON.parse(raw)
    reply = json.reply
    options = Array.isArray(json.options) ? json.options : []
    if (options.length === 0) {
      options = ['自由に行動する']
    }
  } catch (e) {
    reply = '⚠️ GPTの応答が不正な形式でした。もう一度試してください。'
    options = []
    console.error('GPT応答のパース失敗:', raw)
  }

  return NextResponse.json({
    reply,
    options,
  })
}
