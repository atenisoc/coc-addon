import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json()
  const { message, uuid, lang } = body

  // クッキー確認
const cookieStore = await cookies();
const cookieUUID = cookieStore.get('user-uuid')?.value;

  // 仮にログをサーバー側で処理（ここでは console に出力）
  console.log('ログ保存:', {
    uuid: uuid || cookieUUID,
    lang: lang || 'ja',
    message,
    timestamp: new Date().toISOString(),
  })

  // 将来的にDB保存などに差し替え可
  return NextResponse.json({ status: 'ok' })
}
