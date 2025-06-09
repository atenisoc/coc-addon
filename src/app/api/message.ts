const { message, history } = await req.json()

const messages = [
  ...(Array.isArray(history) ? history.map((m) => ({ role: m.role, content: m.content })) : []),
  {
    role: 'system',
    content: systemPrompt,
  },
  {
    role: 'user',
    content: message,
  },
]
