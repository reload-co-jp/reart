import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { guides } from "@/lib/data"

const description =
  "テーマに沿って美術用語を順番に学べる学習ガイドです。美術館初心者向けの基本用語から現代美術まで。"

export const metadata: Metadata = {
  title: "学習ガイド",
  description,
  alternates: { canonical: "/guides/" },
  openGraph: { url: "/guides/", title: "学習ガイド｜ReArt", description },
}

const GuidesPage = () => (
  <div style={{ ...styles.container, maxWidth: "48rem" }}>
    <Breadcrumbs items={[{ name: "学習ガイド", path: "/guides/" }]} />
    <h1
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        marginBottom: space.lg,
      }}
    >
      学習ガイド
    </h1>
    <ol style={{ listStyle: "none", padding: 0 }}>
      {guides.map((g, i) => (
        <li key={g.slug} style={{ borderTop: `1px solid ${color.border}` }}>
          <Link
            href={`/guides/${g.slug}/`}
            style={{
              color: color.text,
              display: "flex",
              gap: space.md,
              padding: `${space.lg} 0`,
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
              <span
                style={{
                  display: "block",
                  fontFamily: font.serif,
                  fontSize: size.lg,
                  fontWeight: 600,
                }}
              >
                {g.title}
              </span>
              <span
                style={{ color: color.sub, fontSize: size.sm, lineHeight: 1.8 }}
              >
                {g.description}（{g.steps.length}語）
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  </div>
)

export default GuidesPage
