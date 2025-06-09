import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ログ情報を取得
    const { type, user, content, timestamp } = body;

    // 簡易ログ：現状は console に出力（将来的に DBやS3などへ）
    console.log('LOG:', { type, user, content, timestamp });

    // 成功応答
    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
