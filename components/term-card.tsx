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
      padding: space.lg,
      textDecoration: "none",
    }}
  >
    {term.english && (
      <span
        style={{
          color: color.accent,
          fontSize: size.xs,
          fontWeight: 600,
          letterSpacing: ".18em",
          textTransform: "uppercase",
        }}
      >
        {term.english}
      </span>
    )}
    <span
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        fontWeight: 700,
        letterSpacing: ".04em",
        lineHeight: 1.3,
      }}
    >
      {term.term}
    </span>
    <span
      style={{
        borderBottom: `1px solid ${color.border}`,
        color: color.sub,
        fontSize: size.xs,
        letterSpacing: ".2em",
        paddingBottom: space.sm,
      }}
    >
      {term.reading}
    </span>
    <span
      style={{
        color: color.ink,
        fontSize: size.md,
        letterSpacing: ".03em",
        lineHeight: 1.9,
        paddingTop: space.xs,
      }}
    >
      {term.summary}
    </span>
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
  <ul
    style={{
      ...styles.grid,
      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 20rem), 1fr))",
    }}
  >
    {terms.map((t) => (
      <li key={t.slug}>
        <TermCard term={t} categoryNames={categoryNames} />
      </li>
    ))}
  </ul>
)
