import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, history: chatHistory } = await req.json()

  const messages = [
    ...(Array.isArray(chatHistory) ? chatHistory.map(m => ({ role: m.role, content: m.content })) : []),
    {
      role: 'system',
      content: 'あなたはクトゥルフ神話TRPGのゲームマスターです。',
    },
    {
      role: 'user',
      content: message,
    }
  ]

  // GPT呼び出しなどの処理...

  return NextResponse.json({ reply: '応答テキスト', options: [] })
}
