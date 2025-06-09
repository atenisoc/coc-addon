const messages = [
  ...history.map(m => ({ role: m.role, content: m.content })),
  {
    role: 'system',
    content: `以下の形式で返答してください：
{
  "reply": "応答メッセージ",
  "options": ["選択肢1", "選択肢2", "選択肢3"]
}`,
  },
]
