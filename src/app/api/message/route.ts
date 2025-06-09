import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const uuid = cookieStore.get('user-uuid')?.value || 'unknown'

    const referer = req.headers.get('referer') || ''
    const isJapanese = referer.includes('/ja') || referer.endsWith('/coc')

    const systemPrompt = isJapanese
      ? `あなたはクトゥルフ神話TRPGのゲームマスターです。
必ず以下の形式で応答してください。
{
  "reply": "あなたの返答メッセージ",
  "options": ["選択肢A", "選択肢B"] // 任意。ない場合は含めない。
}`
      : `You are the Game Master of a Cthulhu Mythos TRPG.
Always respond strictly in the following JSON format:
{
  "reply": "Your response to the player.",
  "options": ["Option A", "Option B"] // Optional. Omit this field if no options.
}`

    const { message } = await req.json()

    // GPT API 呼び出し
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    })

    const gptRaw = chatCompletion.choices[0].message.content || ''

    const parsed = JSON.parse(gptRaw)

    return NextResponse.json({
      reply: parsed.reply || '(no reply)',
      options: parsed.options || [],
      user: uuid,
    })
  } catch (err: any) {
    console.error('GPT API error:', err)
    return NextResponse.json({ reply: 'エラーが発生しました。' }, { status: 500 })
  }
}
