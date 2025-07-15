import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function chat(flags: any, userMessage: string, memorySummary: string): Promise<string> {
  try {
    const systemPrompt = `あなたはクトゥルフ神話TRPG（CoC）の進行役AIです。
プレイヤーの状態: ${JSON.stringify(flags)}
過去の要約: ${memorySummary}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    console.log('[chat.ts] ⬆️ messages to OpenAI:', JSON.stringify(messages, null, 2));

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages, // ← 配列として渡す
      temperature: 0.6,
    });

    return res.choices?.[0]?.message?.content ?? '（応答が取得できませんでした）';
  } catch (error: any) {
    console.error('[chat.ts] ❌ Error during OpenAI request:', error);
    return '（エラーが発生しましたが、物語は続行されます）';
  }
}
