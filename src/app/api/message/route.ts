import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

type ChatCompletionMessageParam = {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    const messagesForOpenAI: ChatCompletionMessageParam[] = []

    if (Array.isArray(history)) {
      for (const m of history) {
        if (m.role === 'function') {
          // function roleならnameが必須だがここではスキップ
          continue
        }
        if (
          m.role === 'user' ||
          m.role === 'assistant' ||
          m.role === 'system'
        ) {
          messagesForOpenAI.push({ role: m.role, content: m.content })
        }
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
      // JSONパースエラーは無視してテキスト返し
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
