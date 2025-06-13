// シナリオID → 表示タイトル
export const getScenarioTitle = (id: string): string => {
  switch (id) {
    case 'demon-mansion':
      return '悪魔の住む館'
    case 'kisaragi':
      return 'きさらぎ駅'
    case 'radio-voice':
      return 'ラジオから、声がする'
    case 'mirror-home':
      return '鏡の奥の家'
    case 'echoes':
      return '繰り返される命日'
    case 'library':
      return '闇の図書館'
    case 'clocktower':
      return '時計塔の彼方'
    case 'real-type':
      return 'リアルタイプ'
    default:
      return '未知のシナリオ'
  }
}

// シナリオID → 背景画像パス
export const getScenarioBackground = (id: string): string => {
  const bgMap: Record<string, string> = {
    'demon-mansion': '/bg/mansion.jpg',
    'kisaragi': '/bg/kisaragi.jpg',
    'radio-voice': '/bg/radio.jpg',
    'mirror-home': '/bg/mirror.jpg',
    'real-type': '/bg/real.jpg', // 画像があれば
  }
  return bgMap[id] ?? '/bg/common.jpg'
}

// シナリオID → GPTプロンプト用のシナリオ説明
export const getScenarioDescription = (id: string): string => {
  switch (id) {
    case 'demon-mansion':
      return '古びた洋館に招かれた探索者たちは、住人の奇妙な行動と怪異に巻き込まれていく。'
    case 'kisaragi':
      return '都市伝説「きさらぎ駅」の噂を追って異界に迷い込む探索者たち。駅や異空間を彷徨う恐怖と不安が主題。'
    case 'radio-voice':
      return '深夜ラジオから聞こえる声を追い、奇怪な出来事に巻き込まれていくホラー探索。'
    case 'mirror-home':
      return '古民家に泊まる探索者たちは、鏡の異常現象と異界との接触に巻き込まれる。'
    case 'echoes':
      return '廃村に眠る過去の惨劇の記憶を辿る探索型ホラー。死者の声や幻影に導かれる。'
    case 'library':
      return '封印された図書館を探索するシナリオ。禁書や古代神話と狂気の知識に迫る。'
    case 'clocktower':
      return '歪んだ時間と失われた記憶の中を巡るタイムホラー。真実を選び取る物語。'
    case 'real-type':
      return '自由に物語を描写するリアル志向のシナリオ。会話、演出、状況描写すべてがプレイヤーに委ねられる。'
    default:
      return '未知のシナリオ。'
  }
}
