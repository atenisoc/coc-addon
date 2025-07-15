import OpenAI from 'openai';
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function determinePhase(flags: any): string {
  const visitedCount = flags.visited?.length ?? 0;
  const elapsed = flags.time_elapsed ?? 0;

  if (flags.phase === 'phase04_分岐' && elapsed >= 1 + (flags.last_phase04_turn ?? 0)) {
    return 'phase05_結末';
  } else if (flags.knows_exit_direction || flags.fear_level >= 60) {
    return 'phase04_分岐';
  } else if (elapsed >= 6 || visitedCount >= 5) {
    return 'phase03_干渉';
  } else if (elapsed >= 3 || visitedCount >= 3) {
    return 'phase02_探索';
  } else {
    return 'phase01_導入';
  }
}

function mergeFlags(base: any, gptFlags: any): any {
  const merged = { ...base, ...gptFlags };

  // phaseは常にこちらで上書き（GPT出力より優先）
  merged.phase = determinePhase(merged);

  // 分岐に入ったら一度だけ記録
  if (merged.phase === 'phase04_分岐' && !('last_phase04_turn' in merged)) {
    merged.last_phase04_turn = merged.time_elapsed;
  }

  // 必須初期化（安全性のため）
  merged.visited = Array.isArray(merged.visited) ? merged.visited : [];
  merged.items = Array.isArray(merged.items) ? merged.items : [];
  merged.time_elapsed = typeof merged.time_elapsed === 'number' ? merged.time_elapsed : 0;
  merged.san_level = typeof merged.san_level === 'number' ? merged.san_level : 100;
  merged.fear_level = typeof merged.fear_level === 'number' ? merged.fear_level : 0;

  return merged;
}

export async function chat(
  flags: any,
  userMessage: string,
  memorySummary?: string
): Promise<{ reply: string; flags?: any }> {
  try {
    const safeInput = userMessage?.trim() || '(黙って周囲を見回した)';

    const messages = [
      {
        role: 'system',
        content: kisaragiPrompt(flags, safeInput, memorySummary),
      },
      {
        role: 'user',
        content: safeInput,
      },
    ];

    console.log('[chat.ts] ✅ sending:', messages);

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.8,
    });

    const content = res.choices?.[0]?.message?.content ?? '(応答が取得できませんでした)';
    console.log('[chat.ts] ✅ raw GPT content:', content);

    const parseJson = (text: string): any | null => {
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/```json\s*([\s\S]*?)```/i);
        if (match) {
          try {
            return JSON.parse(match[1].trim());
          } catch {
            return null;
          }
        }
        return null;
      }
    };

    const parsed = parseJson(content);

    const gptFlags = parsed?.flags ?? {};
    const mergedFlags = mergeFlags(flags, gptFlags);

// ✅ バッチ（コンソール）に出力
console.log('[Chat.tsx] ✅ mergedFlags after GPT response:', mergedFlags);

    return {
      reply: parsed?.reply ?? content,
      flags: mergedFlags,
    };
  } catch (err) {
    console.error('[chat.ts] ❌ Error during OpenAI request:', err);
    return {
      reply: '(エラーが発生しましたが、物語は続行されます)',
      flags,
    };
  }
}
