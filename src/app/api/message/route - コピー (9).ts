import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { kisaragiPrompt } from '@/lib/prompts/kisaragiPrompt'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// 選択肢抽出
function extractOptions(text: string): string[] {
  return text
    .split('\n')
    .filter(line => /^\d+\.\s/.test(line))
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
}

// デフォルトフラグ
const defaultFlags = {
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
  time_elapsed: 0,
  is_followed: false,
  loop_count: 0,
  phase_log: [],
  items: [],
  met_npcs: []
}

// GPTの応答をパースして reply + flags を抽出
function safeParseReplyAndFlags(content: string, fallbackFlags: any): {
  reply: string
  flags: any
} {
  try {
    const parsed = JSON.parse(content)
    if (parsed.reply && parsed.flags) {
      return { reply: parsed.reply, flags: parsed.flags }
    }
  } catch {
    const match = content.match(/```json\s*({[\s\S]*?})\s*```/)
    if (match) {
      try {
        const parsed = JSON.parse(match[1])
        if (parsed.reply && parsed.flags) {
          return { reply: parsed.reply, flags: parsed.flags }
        }
      } catch {}
    }
  }
  return { reply: content, flags: fallbackFlags }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body.messages || []
    const flags = body.flags || defaultFlags

    const lastUserMessage =
      [...messages].reverse().find(msg => msg.role === 'user')?.content ||
      '駅の構内を見渡す'

    const finalMessages = [
      {
        role: 'system',
        content: kisaragiPrompt(flags, lastUserMessage),
      },
      {
        role: 'user',
        content: lastUserMessage,
      },
    ]

    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: finalMessages,
      temperature: 0.8,
    })

    const rawContent = res.choices?.[0]?.message?.content ?? '(応答なし)'
    const { reply, flags: updatedFlags } = safeParseReplyAndFlags(rawContent, flags)
    const options = extractOptions(reply)

    return NextResponse.json({
      reply,
      options,
      flags: updatedFlags,
    })
  } catch (error) {
    console.error('[route.ts] ❌ Error during OpenAI request:', error)
    return NextResponse.json({
      reply: 'エラーが発生しました。',
      options: [],
      flags: defaultFlags,
    })
  }
}
