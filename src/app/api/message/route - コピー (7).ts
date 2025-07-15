import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/chat';
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt';
import { summarizeMemory } from '@/lib/memorySummary';

// flags の初期値
const defaultFlags = {
  phase: "start",
  visited: [],
  has_seen_shadow: false,
  has_heard_whisper: false,
  san_level: 100,
  has_flashlight: false,
  injured: false,
  knows_exit_direction: false,
  trust_npc_yamamoto: 50,
  fear_level: 0,
  time_elapsed: 0,
  is_followed: false,
  loop_count: 0,
  phase_log: ["start"]
};


export async function POST(req: NextRequest) {
  console.log("[DEBUG] 🔔 POST /api/message CALLED"); // ← これで入口確認

  try {
    const body = await req.json();
    console.log("[DEBUG] 🧾 raw body.input:", body.input); // ← ここが出るか？

    const userInput = body.input ?? "";
    console.log("[DEBUG] 🧾 resolved userInput:", userInput);



    const flags = {
      ...defaultFlags,
      ...(body.flags || {})
    };

    let finalInput = userInput;
    if ((!userInput || userInput.trim() === "") && flags.phase === "start") {
      finalInput = "駅の構内を見渡す";
    }

    console.log("[DEBUG] 📝 userInput:", userInput);
    console.log("[DEBUG] 📌 finalInput:", finalInput);

    const summary = summarizeMemory(flags);
    const prompt = kisaragiPrompt(flags, finalInput);

    const messages = [
      { role: "system", content: prompt },
      { role: "user", content: finalInput }
    ];
    console.log("[DEBUG] ✅ Final messages sent to chat:", messages);

    const reply = await chat(messages);

    return NextResponse.json({ reply, flags });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ reply: "エラーが発生しました。", flags: defaultFlags });
  }
}  // ← ← ← ✅ この } が足りていなかった！
