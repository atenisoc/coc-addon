'use client'

import ja from './ja.json'
import en from './en.json'

const translations: Record<string, Record<string, string>> = {
  ja,
  en,
}

export function useTranslation() {
  const lang = getLangFromCookieOrDefault()
  const t = (key: string) => translations[lang]?.[key] || key
  return { t, lang }
}

function getLangFromCookieOrDefault(): 'ja' | 'en' {
  if (typeof document === 'undefined') return 'ja'
  const match = document.cookie.match(/lang=(ja|en)/)
  return (match?.[1] as 'ja' | 'en') || 'ja'
}
