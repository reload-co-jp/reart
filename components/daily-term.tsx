"use client"

import Link from "next/link"
import { FC, useSyncExternalStore } from "react"
import type { TermIndex } from "@/lib/types"
import { color, font, size, space, styles } from "@/components/theme"

const dayNumber = () => Math.floor(Date.now() / 86_400_000)
const noop = () => () => {}

// 閲覧日に応じて用語を選ぶ。静的 HTML にはビルド日の用語が入り、表示時に差し替わる。
export const DailyTerm: FC<{ terms: TermIndex[]; buildDay: number }> = ({
  terms,
  buildDay,
}) => {
  const day = useSyncExternalStore(noop, dayNumber, () => buildDay)
  const t = terms[day % terms.length]
  return (
    <div
      style={{
        background: color.surface,
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.accent}`,
        padding: space.lg,
      }}
    >
      <p style={{ color: color.accent, fontSize: size.xs, fontWeight: 500 }}>
        今日の用語
      </p>
      <p
        style={{
          fontFamily: font.serif,
          fontSize: size.xl,
          fontWeight: 500,
          marginTop: space.xs,
        }}
      >
        {t.term}
      </p>
      <p style={{ color: color.sub, fontSize: size.xs }}>
        {t.reading}
        {t.english && ` / ${t.english}`}
      </p>
      <p style={{ lineHeight: 1.8, margin: `${space.sm} 0` }}>{t.summary}</p>
      <Link href={`/terms/${t.slug}/`} style={styles.link}>
        「{t.term}」の解説を読む
      </Link>
    </div>
  )
}
