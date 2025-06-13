// src/app/api/log/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message } = body

    // 実際にはここでDB保存 or ファイル書き込み処理（ここではログ出力のみ）
    console.log('📝 フィードバック:', message)

    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('⚠️ フィードバック送信エラー:', error)
    return new Response(JSON.stringify({ status: 'error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
