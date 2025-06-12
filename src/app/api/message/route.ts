import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { userInput, scenarioId } = await req.json()

  console.log('[ダミー応答]', { userInput, scenarioId })

  // 固定の応答（ダミー）
  const dummyReply = {
    reply: `これはダミーの返答です。「${userInput}」に応じた処理はサーバー側に実装されています。`,
    options: ['選択肢A', '選択肢B', '選択肢C'],
  }

  return new Response(JSON.stringify(dummyReply), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
