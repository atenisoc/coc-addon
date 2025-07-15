import ChatClient from './ChatClient'

export default function Page() {
  const scenarioId = 'kisaragi-simple' // ここでシナリオIDを決定

  return (
    <div>
      {/* scenarioId を props として ChatClient に渡す */}
      <ChatClient scenarioId={scenarioId} />
    </div>
  )
}
