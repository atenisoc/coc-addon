// /src/app/api/message/route.ts
export async function POST(req: Request) {
  const { userInput, history } = await req.json()

  const dummyReply = `仮応答：「${userInput}」を受け取りました。探索を続けますか？`

  const dummyOptions = [
    '📖 禁断の書を開く',
    '🕯 シンボルを調べる',
    '🚪 奥に進む',
  ]

  return Response.json({
    reply: dummyReply,
    options: dummyOptions,
  })
}
