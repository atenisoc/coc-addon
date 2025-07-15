// src/lib/gpt.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env に設定
})

export async function chat(messages: any[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4', // or 'gpt-3.5-turbo'
    messages,
  })

  return response.choices[0].message.content || '(空の応答)'
}
