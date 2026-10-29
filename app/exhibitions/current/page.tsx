import { pageMeta } from "@/lib/site"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { getTerms } from "@/lib/data"
import data from "@/data/current-exhibitions.json"

const description =
  "東京で開催中・開催予定の企画展ごとに、展示を見る前に知っておきたい美術用語をまとめました。"

export const metadata = pageMeta({
  title: "東京の企画展 知っておきたい用語",
  description,
  path: "/exhibitions/current/",
})

const fmt = (d: string) => d.replaceAll("-", ".")

const CurrentExhibitionsPage = () => {
  // ビルド時点で終了済みの展覧会は出さない
  const today = new Date().toISOString().slice(0, 10)
  const items = data.exhibitions
    .filter((e) => e.end >= today)
    .map((e) => ({ ...e, terms: getTerms(e.terms), open: e.start <= today }))
    .filter((e) => e.terms.length > 0)
    .sort(
      (a, b) => Number(b.open) - Number(a.open) || a.end.localeCompare(b.end)
    )

  return (
    <div style={{ ...styles.container, maxWidth: "48rem" }}>
      <Breadcrumbs
        items={[
          { name: "展覧会別", path: "/exhibitions/" },
          { name: "東京の企画展", path: "/exhibitions/current/" },
        ]}
      />
      <h1
        style={{
          fontFamily: font.serif,
          fontSize: size.xl,
          marginBottom: space.md,
        }}
      >
        東京の企画展 知っておきたい用語
      </h1>
      <p style={{ lineHeight: 2 }}>{description}</p>
      <p
        style={{
          color: color.sub,
          fontSize: size.xs,
          lineHeight: 1.8,
          marginBottom: space.xl,
        }}
      >
        展覧会情報の出典：
        <a href={data.source} style={styles.link}>
          artscape
        </a>
        （{fmt(data.fetchedAt.slice(0, 10))}
        取得）。用語は展覧会紹介文から自動で抽出しています。
        お出かけの際は最新の開催情報を各展覧会の公式サイトでご確認ください。
      </p>

      {items.map((e) => (
        <section key={e.id} style={{ marginBottom: space.xl }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: space.sm }}>
            {e.title}
          </h2>
          <p style={{ color: color.sub, fontSize: size.sm, lineHeight: 1.8 }}>
            <span style={{ color: e.open ? color.accent : color.sub }}>
              {e.open ? "開催中" : "開催前"}
            </span>
            {" ／ "}
            {e.venue} ／ {fmt(e.start)}〜{fmt(e.end)} ／{" "}
            <a href={e.url} style={styles.link}>
              詳細
            </a>
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {e.terms.map((t) => (
              <li
                key={t.slug}
                style={{
                  borderBottom: `1px solid ${color.border}`,
                  padding: `${space.md} 0`,
                }}
              >
                <Link
                  href={`/terms/${t.slug}/`}
                  style={{ ...styles.link, fontWeight: 500 }}
                >
                  {t.term}
                </Link>
                <span
                  style={{
                    color: color.sub,
                    fontSize: size.xs,
                    marginLeft: space.sm,
                  }}
                >
                  {t.reading}
                </span>
                <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>
                  {t.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default CurrentExhibitionsPage
