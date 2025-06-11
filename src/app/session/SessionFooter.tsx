'use client'

type Props = {
  messageCount: number
  saved: boolean
}

export default function SessionFooter({ messageCount, saved }: Props) {
  return (
    <div className="text-xs text-right text-gray-400 mt-2">
      メッセージ数: {messageCount} / 状態: {saved ? '保存済み' : '未保存'}
    </div>
  )
}
