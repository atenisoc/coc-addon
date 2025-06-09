// ファイル: src/app/api/scenario/route.ts
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  const prompt = `
あなたはクトゥルフ神話TRPGのゲームマスターです。
以下の形式で短めのシナリオを返してください。

形式:
{
  "title": "タイトル",
  "summary": "あらすじ"
}

ジャンル: ホラー、オカルト、謎解きから毎回ランダムにしてください。
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  })

  const content = completion.choices[0].message.content

  return NextResponse.json(JSON.parse(content!))
}
