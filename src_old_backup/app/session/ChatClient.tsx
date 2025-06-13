// lib/scenario.ts
export const getScenarioTitle = (id: string): string => {
  switch (id) {
    case "echoes": return "繰り返される命日"
    case "kisaragi": return "きさらぎ駅"
    case "demon-mansion": return "悪魔の住む館"
    case "radio-voice": return "ラジオから、声がする"
    case "mirror-home": return "鏡の奥の家"
    case "library": return "図書館"
    case "clocktower": return "時計塔の彼方"
    default: return "未知のシナリオ"
  }
}

export const getScenarioBackground = (id: string): string => {
  const bgMap: Record<string, string> = {
    "demon-mansion": "/bg/mansion.jpg",
    "kisaragi": "/bg/kisaragi.jpg"
  }
  return bgMap[id] ?? "/bg/common.jpg"
}
