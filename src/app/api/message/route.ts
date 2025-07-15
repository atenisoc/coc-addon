import { NextResponse } from 'next/server';
import { chat } from '@/components/chat';
// chat.ts の先頭にこれを追加
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt'; // または相対パスで


const initialFlags = {
  phase: 'start',
  visited: [],
  has_seen_shadow: false,
  has_heard_whisper: false,
  san_level: 100,
  has_flashlight: false,
  injured: false,
  knows_exit_direction: false,
  trust_npc_yamamoto: 50,
  fear_level: 0,
  is_followed: false,
  loop_count: 0,
  phase_log: [],
  items: [],



  time_elapsed_global: 0, // ← 追加①
  time_elapsed_local: 0,  // ← 追加②

};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, flags: clientFlags } = body;

const flags = 
  clientFlags && Object.keys(clientFlags).length > 0
    ? { ...initialFlags, ...clientFlags } // → 正常な送信があればマージ
    : { ...initialFlags };                // → 無ければ初期化


    const lastMessage = messages?.[messages.length - 1]?.content ?? '';

    // ✅ GPT応答の取得（reply に埋め込みJSONを含むことを想定）
    const { reply: rawReply } = await chat(flags, lastMessage);


// ✅ chat.ts 側で正規化された flags をそのまま受け取る
const { reply: finalReply, flags: mergedFlags } = await chat(flags, lastMessage);

// ✅ そのまま返す
return NextResponse.json({ reply: finalReply, flags: mergedFlags });



    // ✅ フラグ整備・サニタイズ
    flags.phase = typeof flags.phase === 'string' ? flags.phase : 'start';
    flags.visited = Array.isArray(flags.visited) ? flags.visited : [];
    flags.has_seen_shadow = !!flags.has_seen_shadow;
    flags.has_heard_whisper = !!flags.has_heard_whisper;

    flags.san_level = typeof flags.san_level === 'number' ? flags.san_level - 1 : 99;
    if (flags.san_level < 0) flags.san_level = 0;

    flags.has_flashlight = !!flags.has_flashlight;
    flags.injured = !!flags.injured;
    flags.knows_exit_direction = !!flags.knows_exit_direction;

    flags.trust_npc_yamamoto = typeof flags.trust_npc_yamamoto === 'number'
      ? flags.trust_npc_yamamoto
      : 50;

    flags.fear_level = typeof flags.fear_level === 'number' ? flags.fear_level : 0;


    flags.is_followed = !!flags.is_followed;
    flags.loop_count = typeof flags.loop_count === 'number' ? flags.loop_count : 0;
    flags.phase_log = Array.isArray(flags.phase_log) ? flags.phase_log : [];


// ✅ 直前のフェーズを取得
const prevPhase = flags.phase_log?.at(-1) ?? 'start';

// ✅ フェーズ変化時はローカルタイマーをリセット、それ以外は +1
if (flags.phase !== prevPhase) {
  flags.time_elapsed_local = 0;
} else {
  flags.time_elapsed_local = typeof flags.time_elapsed_local === 'number'
    ? flags.time_elapsed_local + 1
    : 1;
}

// ✅ phaseが一定時間経過したら自動で次のphaseへ進行
const phaseOrder = [
  'phase01_導入',
  'phase02_探索',
  'phase03_外部探索',
  'phase04_終盤',
  'phase99_脱出'
];

const currentPhaseIndex = phaseOrder.indexOf(flags.phase);
const LOCAL_TIME_LIMIT = 5;

if (
  currentPhaseIndex >= 0 &&
  currentPhaseIndex < phaseOrder.length - 1 &&
  flags.time_elapsed_local >= LOCAL_TIME_LIMIT
) {
  const nextPhase = phaseOrder[currentPhaseIndex + 1];
  console.log(`[route.ts] ⏳ ローカル時間 ${flags.time_elapsed_local} により ${flags.phase} → ${nextPhase}`);
  flags.phase = nextPhase;
  flags.time_elapsed_local = 0; // 次フェーズのためにリセット
}



// ✅ グローバルタイマーは常に +1
const prevGlobal = clientFlags?.time_elapsed_global;
flags.time_elapsed_global = typeof prevGlobal === 'number' && Number.isFinite(prevGlobal)
  ? prevGlobal + 1
  : 1;

// ✅ ローカルタイマー：phaseが変わっていなければ +1、変わっていれば 0
const prevLocal = clientFlags?.time_elapsed_local;
if (flags.phase !== prevPhase) {
  flags.time_elapsed_local = 0;
} else {
  flags.time_elapsed_local = typeof prevLocal === 'number' && Number.isFinite(prevLocal)
    ? prevLocal + 1
    : 1;
}

// ✅ 共通タイマー（全体的な時間の指標）も +1
const prevTime = clientFlags?.time_elapsed;
flags.time_elapsed = typeof prevTime === 'number' && Number.isFinite(prevTime)
  ? prevTime + 1
  : 1;




// ✅ フェーズ巻き戻し防止ロジック（追加）
const isPhaseRewind = (current: string, previous: string): boolean => {
  const phaseRank = {
    start: 0,
    phase01_導入: 1,
    phase02_探索: 2,
    phase03_外部探索: 3,
    phase04_終盤: 4,
    phase99_脱出: 5,
  };
  return (phaseRank[current] ?? 0) < (phaseRank[previous] ?? 0);
};

if (isPhaseRewind(flags.phase, prevPhase)) {
  console.warn(`[route.ts] ⚠️ phaseが巻き戻ろうとしました: ${flags.phase} → ${prevPhase} に補正`);
  flags.phase = prevPhase;
}



    flags.phase_log.push(flags.phase);
    flags.items = Array.isArray(flags.items) ? flags.items : [];


    return NextResponse.json({ reply: finalReply, flags });
  } catch (err) {
    console.error('[route.ts] Error:', err);
    return NextResponse.json({
      reply: '（エラーが発生しましたが、物語は続行されます）',
      flags: initialFlags
    });
  }
}
