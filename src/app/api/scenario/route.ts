import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  const prompt = `
あなたはクトゥルフ神話TRPGのゲームマスターです。
異なる3つの短編シナリオを以下の形式で生成してください：

[
  {
    "title": "シナリオタイトルA",
    "summary": "あらすじA"
  },
  {
    "title": "シナリオタイトルB",
    "summary": "あらすじB"
  },
  {
    "title": "シナリオタイトルC",
    "summary": "あらすじC"
  }
]

ホラー、オカルト、サスペンス、神話系などジャンルにばらつきを持たせてください。
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  })

  const content = completion.choices[0].message.content
  return NextResponse.json(JSON.parse(content!))
}
