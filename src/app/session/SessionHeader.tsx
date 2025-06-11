// components/SessionHeader.tsx
export default function SessionHeader({
  title,
  sessionId,
  tagline,
}: {
  title: string
  sessionId: string
  tagline?: string // ← オプションにする
}) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold">
        <span className="mr-2">📘</span>
        Scenario: {title}
      </h1>
      <p className="text-sm text-gray-400">Session ID: {sessionId}</p>
      {tagline && <p className="text-yellow-500 text-sm">{tagline}</p>}
    </header>
  )
}
