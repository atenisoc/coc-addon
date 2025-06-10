import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { ChatCompletionMessageParam } from 'openai'

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
          // function roleの場合はnameが必須なのでスキップか適切にセットする
          // ここではスキップ
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

    // systemプロンプトを必ず先頭に
    messagesForOpenAI.unshift({
      role: 'system',
      content: 'あなたはクトゥルフ神話TRPGのゲームマスターです。',
    })

    // ユーザーの最新発言を追加
    messagesForOpenAI.push({
      role: 'user',
      content: message,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesForOpenAI,
    })

    const gptResponse = completion.choices[0].message?.content || ''

    // JSONパースを試みる（失敗したらテキスト返し）
    let parsed = { reply: gptResponse, options: [] as string[] }
    try {
      parsed = JSON.parse(gptResponse)
    } catch {
      // ignore parse error
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
