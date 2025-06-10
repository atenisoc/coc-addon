const { message, history: chatHistory } = await req.json()

const messages = [
  ...(Array.isArray(chatHistory) ? chatHistory.map(m => ({ role: m.role, content: m.content })) : []),
  {
    role: 'system',
    content: systemPrompt,
  },
  {
    role: 'user',
    content: message,
  }
]
