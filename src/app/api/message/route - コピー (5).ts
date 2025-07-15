import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt' // ✅ 追加

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, scenarioId } = body

    // ✅ scenarioIdに応じた systemPrompt を挿入
    const systemMessage = {
      role: 'system',
      content:
        scenarioId === 'kisaragi-simple'
          ? kisaragiPrompt
          : 'あなたはシナリオの進行を担当するAIです。',
    }

    // ✅ デバッグログ（確認用）
    console.log('[API] 受信 messages:', messages)
    console.log('[API] 受信 scenarioId:', scenarioId)
    console.log('[SYSTEM PROMPT PREVIEW]', systemMessage.content.substring(0, 200))

    // ✅ フロント側の system を除外して送信
    const filteredMessages = messages.filter((msg: any) => msg.role !== 'system')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [systemMessage, ...filteredMessages],
      temperature: 0.8,
      max_tokens: 1024,
    })

    let result = completion.choices[0]?.message?.content


// ---------- 応答安全装置ここから ----------
if (!result?.match(/^\s*[①1１][\.、．)]/m)) {
  console.warn('[API] 応答に選択肢が含まれていません。補足を追加します。')
  const fallbackOptions = `\n\n※選択肢が出力されていません。以下は一例です：\n\n1. 駅員室に入る\n2. 耳を澄ます\n3. 駅の他の場所を調べる`
  result = (result ?? '') + fallbackOptions
}
// ---------- 応答安全装置ここまで ----------



    console.log('[API] GPT応答:', result)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[API] エラー:', error)
    return NextResponse.json({ error: 'APIエラーが発生しました' }, { status: 500 })
  }
}
