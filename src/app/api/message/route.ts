// ファイル: src/app/api/message/route.ts
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { userInput, history } = await req.json()

  const messages = [
    {
      role: 'system',
      content: `あなたはクトゥルフ神話TRPGのゲームマスターです。
プレイヤーの行動に応じて、ホラー・謎・緊張感ある展開を返してください。文体は描写中心に。`,
    },
    ...history,
    { role: 'user', content: userInput },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.8,
  })

  const reply = response.choices[0].message.content
  return NextResponse.json({ reply })
}
