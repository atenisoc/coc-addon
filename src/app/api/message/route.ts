import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const messagesForOpenAI = []

    if (Array.isArray(history)) {
      for (const m of history) {
        if (m.role === 'function') {
          // function roleはname必須なのでスキップ
          continue
        }
        messagesForOpenAI.push({ role: m.role, content: m.content })
      }
    }

    messagesForOpenAI.unshift({
      role: 'system',
      content: 'あなたはクトゥルフ神話TRPGのゲームマスターです。',
    })

    messagesForOpenAI.push({
      role: 'user',
      content: message,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesForOpenAI,
    })

    const gptResponse = completion.choices[0].message?.content || ''

    let parsed = { reply: gptResponse, options: [] as string[] }
    try {
      parsed = JSON.parse(gptResponse)
    } catch {
      // JSON parse error ignored
    }

    return NextResponse.json({
      reply: parsed.reply || gptResponse,
      options: parsed.options || [],
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ reply: 'エラーが発生しました。' }, { status: 500 })
  }
}
