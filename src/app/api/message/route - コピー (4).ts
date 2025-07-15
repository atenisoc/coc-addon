import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/gpt'

// シナリオごとの system prompt をここに定義
const scenarioPrompts: Record<string, string> = {
  'kisaragi-simple': `あなたは「きさらぎ駅」を題材にしたクトゥルフ神話TRPGのゲームマスターです。
プレイヤーは1人で、現代日本に暮らす一般人です。
舞台は「きさらぎ駅」という都市伝説に基づく異界の世界で、不可思議な出来事が次々と起こります。

以下の制約を守ってください：

- まずは電車内で目覚める導入シーンから始めてください。
- プレイヤーの行動に応じて選択肢を3～4個出してください。
- 雰囲気はホラー・サスペンス寄り。心理的な不安や異常な静けさを演出してください。
- 進行中は、奇妙な駅、異常な通話、見知らぬ存在、異界の風景などの描写を丁寧に行ってください。
- プレイヤーが死亡または異界から脱出するまで、ストーリーを適切に継続してください。

プレイヤーが何も言っていなくても、あなたの最初の発話として導入文を表示してください。`,
  // 他のシナリオもここに追加可能
}

export async function POST(req: NextRequest) {
  try {
    const { messages, scenarioId } = await req.json()

    console.log('[API] 受信 messages:', messages)
    console.log('[API] 受信 scenarioId:', scenarioId)

    const systemPrompt = scenarioPrompts[scenarioId]

    if (!systemPrompt) {
      return NextResponse.json(
        { error: `未知のシナリオIDです: ${scenarioId}` },
        { status: 400 }
      )
    }

    // systemメッセージを先頭に追加
    const fullMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ]

    const gptResponse = await chat(fullMessages)

    console.log('[API] GPT応答:', gptResponse)

    return NextResponse.json({
      result: gptResponse || '(empty)',
    })
  } catch (error) {
    console.error('[ERROR in /api/message]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
