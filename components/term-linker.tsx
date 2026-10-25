import Link from "next/link"
import { ReactNode } from "react"
import type { TermIndex } from "@/lib/types"
import { styles } from "@/components/theme"

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// 本文中に出てくる他の用語名を、ページ内で最初の1回だけ用語ページへリンクする。
// 長い用語名を先に試すので「抽象表現主義」が「抽象」より優先される。
export const createTermLinker = (terms: TermIndex[], selfSlug: string) => {
  const bySlug = new Map(
    terms.filter((t) => t.slug !== selfSlug).map((t) => [t.term, t.slug])
  )
  const pattern = new RegExp(
    [...bySlug.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escape)
      .join("|"),
    "g"
  )
  const used = new Set<string>()

  return (text: string): ReactNode[] =>
    text.split(new RegExp(`(${pattern.source})`)).map((part, i) => {
      const slug = bySlug.get(part)
      if (i % 2 === 0 || !slug || used.has(slug)) return part
      used.add(slug)
      return (
        <Link key={i} href={`/terms/${slug}/`} style={styles.link}>
          {part}
        </Link>
      )
    })
}
