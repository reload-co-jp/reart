import type { TermIndex } from "./types"

// 全角半角・大小文字・カタカナ/ひらがな・中黒や空白の差を吸収する
export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s・･\-ー＝=]/g, "")

// スコアの高い順に返す。名称の一致を要約の一致より優先する。
export const searchTerms = (items: TermIndex[], query: string) => {
  const q = normalize(query)
  if (!q) return items
  return items
    .map((t) => {
      const names = [t.term, t.reading, t.english ?? "", ...t.aliases].map(
        normalize
      )
      const score = names.some((n) => n === q)
        ? 3
        : names.some((n) => n.startsWith(q))
          ? 2
          : names.some((n) => n.includes(q))
            ? 1
            : normalize(t.summary).includes(q)
              ? 0.5
              : 0
      return { t, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.t)
}
