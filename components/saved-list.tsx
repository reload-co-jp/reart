"use client"

import Link from "next/link"
import { FC } from "react"
import { LEARNED_KEY, SAVED_KEY, useSlugList } from "@/lib/storage"
import type { TermIndex } from "@/lib/types"
import { TermGrid } from "@/components/term-card"
import { color, space, styles } from "@/components/theme"

const Section: FC<{
  title: string
  items: TermIndex[]
  empty: string
  categoryNames: Record<string, string>
}> = ({ title, items, empty, categoryNames }) => (
  <section style={{ marginBottom: space.xl }}>
    <h2 style={styles.sectionTitle}>
      {title}（{items.length}）
    </h2>
    {items.length ? (
      <TermGrid terms={items} categoryNames={categoryNames} />
    ) : (
      <p style={{ color: color.sub }}>{empty}</p>
    )}
  </section>
)

export const SavedList: FC<{
  terms: TermIndex[]
  categoryNames: Record<string, string>
}> = ({ terms, categoryNames }) => {
  const [saved] = useSlugList(SAVED_KEY)
  const [learned] = useSlugList(LEARNED_KEY)
  // 公開終了した用語の slug は無視する
  const pick = (slugs: string[]) =>
    slugs
      .map((s) => terms.find((t) => t.slug === s))
      .filter((t): t is TermIndex => !!t)
  return (
    <>
      <Section
        title="保存した用語"
        items={pick(saved)}
        categoryNames={categoryNames}
        empty="まだ保存した用語はありません。用語ページの「保存する」から追加できます。"
      />
      <Section
        title="学習済みの用語"
        items={pick(learned)}
        categoryNames={categoryNames}
        empty="まだ学習済みの用語はありません。"
      />
      <p style={{ color: color.sub, fontSize: ".875rem" }}>
        保存状態はこのブラウザ内にのみ記録され、端末間では同期されません。
        <Link href="/terms/" style={styles.link}>
          用語一覧へ
        </Link>
      </p>
    </>
  )
}
