import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    // history が配列かチェックし、OpenAIに渡す形式に変換
    const messagesForOpenAI = [
      ...(Array.isArray(history)
        ? history.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          }))
        : []),
      {
        role: 'system',
        content: 'あなたはクトゥルフ神話TRPGのゲームマスターです。',
      },
      {
        role: 'user',
        content: message,
      },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesForOpenAI,
    })

    const gptResponse = completion.choices[0].message?.content || ''

    // GPTの返答をJSONとして解釈（失敗してもテキスト返し）
    let parsed = { reply: gptResponse, options: [] as string[] }
    try {
      parsed = JSON.parse(gptResponse)
    } catch {
      // JSON parse error は無視してテキストをそのまま返す
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
