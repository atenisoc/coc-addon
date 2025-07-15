export function generateMemorySummary(flags: Record<string, any>): string {
  const visited = flags.visited?.length
    ? `これまでに「${flags.visited.join("」「")}」を訪れました。`
    : "まだ何も探索していません。";

  const npcs = flags.met_npcs?.length
    ? `遭遇した人物は「${flags.met_npcs.join("」「")}」です。`
    : "まだ誰とも遭遇していません。";

  const items = flags.items?.length
    ? `現在の所持品は「${flags.items.join("」「")}」です。`
    : "";

  const san = typeof flags.san_level === "number"
    ? `SAN値は ${flags.san_level} です。`
    : "";

  const fear = typeof flags.fear_level === "number" && flags.fear_level > 0
    ? `不安感や恐怖の影響が強まりつつあります（恐怖レベル: ${flags.fear_level}）。`
    : "";

  const injured = flags.injured ? "身体に負傷があります。" : "";

  const time = typeof flags.time_elapsed === "number" && flags.time_elapsed > 0
    ? `駅に滞在してから、すでに ${flags.time_elapsed}単位の時間が経過しています。`
    : "";

  const loop = typeof flags.loop_count === "number" && flags.loop_count > 0
    ? `すでにこの駅を ${flags.loop_count} 回ループしています。`
    : "";

  return [
    visited,
    npcs,
    items,
    san,
    fear,
    injured,
    time,
    loop,
  ]
    .filter(Boolean)
    .join("\n");
}
