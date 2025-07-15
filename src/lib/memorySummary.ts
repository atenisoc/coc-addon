// /src/lib/memorySummary.ts
export function summarizeMemory(flags: Record<string, any>): string {
  const log = flags?.phase_log ?? [];
  if (!Array.isArray(log) || log.length === 0) {
    return '（記録はありません）';
  }
  return `過去の進行: ${log.join(' → ')}`;
}
