import { cookies } from 'next/headers'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const body = await req.json()
  const userMessage = body.message || ''

  // ✅ cookies() は Promise なので await が必要！
  const cookieStore = await cookies()
  const uuid = cookieStore.get('user-uuid')?.value

  const systemPrompt = `
あなたはクトゥルフ神話TRPGのゲームマスターです。
以下の形式で必ずJSONのみを返答してください：

{
  "reply": "描写または会話",
  "options": ["選択肢A", "選択肢B", "選択肢C"]
}

JSON以外の文字列を絶対に出力しないこと。
`

  let replyData = ''
  let json

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.8,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      response_format: 'json_object' as any,
    })

    replyData = response.choices[0].message.content || ''
    json = JSON.parse(replyData)

  } catch (err) {
    console.error('GPTエラー:', err)
    json = {
      reply: 'GPTの応答を解析できませんでした。もう一度選んでください。',
      options: ['再試行する', '最初に戻る'],
    }
  }

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
