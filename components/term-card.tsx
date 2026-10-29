import Link from "next/link"
import { FC } from "react"
import { DIFFICULTY_LABEL, TermIndex } from "@/lib/types"
import { color, font, size, space, styles } from "@/components/theme"

// 一覧・カテゴリ・保存用語で共通のカード。categoryNames は slug→名称
export const TermCard: FC<{
  term: TermIndex
  categoryNames?: Record<string, string>
}> = ({ term, categoryNames }) => (
  <Link
    href={`/terms/${term.slug}/`}
    style={{
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: 0,
      color: color.text,
      display: "flex",
      flexDirection: "column",
      gap: space.xs,
      height: "100%",
      padding: space.md,
      textDecoration: "none",
    }}
  >
    <span style={{ color: color.sub, fontSize: size.xs }}>
      {term.reading}
      {term.english && ` / ${term.english}`}
    </span>
    <span
      style={{ fontFamily: font.serif, fontSize: size.lg, fontWeight: 500 }}
    >
      {term.term}
    </span>
    <span style={{ fontSize: size.sm, lineHeight: 1.7 }}>{term.summary}</span>
    {categoryNames && (
      <span
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: space.xs,
          marginTop: "auto",
          paddingTop: space.sm,
        }}
      >
        {term.categoryIds.map((c) => (
          <span key={c} style={styles.tag}>
            {categoryNames[c]}
          </span>
        ))}
        <span
          style={{
            ...styles.tag,
            borderColor: color.accent,
            color: color.accent,
          }}
        >
          {DIFFICULTY_LABEL[term.difficulty]}
        </span>
      </span>
    )}
  </Link>
)

export const TermGrid: FC<{
  terms: TermIndex[]
  categoryNames?: Record<string, string>
}> = ({ terms, categoryNames }) => (
  <ul style={styles.grid}>
    {terms.map((t) => (
      <li key={t.slug}>
        <TermCard term={t} categoryNames={categoryNames} />
      </li>
    ))}
  </ul>
)
