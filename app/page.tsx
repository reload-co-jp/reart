import Link from "next/link"
import { FC } from "react"
import { DailyTerm } from "@/components/daily-term"
import { SearchForm } from "@/components/search-form"
import { JsonLd } from "@/components/seo"
import { TermGrid } from "@/components/term-card"
import { color, font, size, space, styles } from "@/components/theme"
import {
  categories,
  getTerms,
  guides,
  termIndex,
  terms,
  termsInCategory,
  toIndex,
} from "@/lib/data"
import { pageMeta, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata = pageMeta({ path: "/" })

// ビルド日の用語を静的 HTML に入れておく
const BUILD_DAY = Math.floor(Date.now() / 86_400_000)

const BEGINNER = [
  "abstract",
  "figurative",
  "contemporary",
  "installation",
  "textile",
  "collage",
]

const byDate = (key: "createdAt" | "updatedAt") =>
  [...terms].sort((a, b) => b[key].localeCompare(a[key])).slice(0, 6)

const Section: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ ...styles.container, marginTop: space.xxl }}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </section>
)

const Page: FC = () => {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description: SITE_DESCRIPTION,
          inLanguage: "ja",
        }}
      />
      <section
        style={{
          ...styles.container,
          maxWidth: "48rem",
          padding: `${space.xl} ${space.md}`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: font.serif,
            fontSize: size.xxl,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          美術館の言葉がわかる、
          <wbr />
          美術用語辞典。
        </h1>
        <p
          style={{
            color: color.sub,
            lineHeight: 1.9,
            margin: `${space.lg} 0 ${space.xl}`,
          }}
        >
          テキスタイル、コンテンポラリー、インスタレーション。
          <wbr />
          美術館の解説で出会う言葉を、わかりやすく学べます。
        </p>
        <SearchForm id="hero-search" />
      </section>

      <section style={{ ...styles.container, maxWidth: "48rem" }}>
        <DailyTerm terms={termIndex} buildDay={BUILD_DAY} />
      </section>

      <Section title="初心者向けの基本用語">
        <TermGrid terms={getTerms(BEGINNER).map(toIndex)} />
      </Section>

      <Section title="カテゴリから探す">
        <ul style={styles.grid}>
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/categories/${c.slug}/`}
                style={{
                  borderTop: `1px solid ${color.border}`,
                  color: color.text,
                  display: "flex",
                  gap: space.md,
                  padding: `${space.md} 0`,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    color: color.accent,
                    fontFamily: font.serif,
                    fontSize: size.lg,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>
                    {c.name}
                  </span>
                  <span style={{ color: color.sub, fontSize: size.xs }}>
                    {termsInCategory(c.slug).length}語
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="新着・更新用語">
        <div style={{ ...styles.grid, gap: space.xl }}>
          {(
            [
              ["最近追加した用語", byDate("createdAt")],
              ["最近更新した用語", byDate("updatedAt")],
            ] as const
          ).map(([label, list]) => (
            <div key={label}>
              <h3 style={{ fontSize: size.md, marginBottom: space.sm }}>
                {label}
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {list.map((t) => (
                  <li
                    key={t.slug}
                    style={{
                      borderBottom: `1px solid ${color.border}`,
                      padding: `${space.sm} 0`,
                    }}
                  >
                    <Link href={`/terms/${t.slug}/`} style={styles.link}>
                      {t.term}
                    </Link>
                    <span
                      style={{
                        color: color.sub,
                        fontSize: size.xs,
                        marginLeft: space.sm,
                      }}
                    >
                      {label === "最近追加した用語" ? t.createdAt : t.updatedAt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="学習ガイド">
        <ul style={styles.grid}>
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}/`}
                style={{
                  background: color.surface,
                  border: `1px solid ${color.border}`,
                  color: color.text,
                  display: "block",
                  height: "100%",
                  padding: space.md,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: font.serif,
                    fontWeight: 500,
                  }}
                >
                  {g.title}
                </span>
                <span style={{ color: color.sub, fontSize: size.xs }}>
                  {g.steps.length}語 ・{" "}
                  {getTerms(g.steps.slice(0, 3).map((s) => s.slug))
                    .map((t) => t.term)
                    .join("、")}
                  ほか
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

export default Page
