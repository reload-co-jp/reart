import { pageMeta } from "@/lib/site"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { currentExhibitions, currentExhibitionsSource } from "@/lib/data"

const description =
  "東京で開催中・開催予定の企画展ごとに、展示を見る前に知っておきたい美術用語をまとめました。"

export const metadata = pageMeta({
  title: "東京の企画展 知っておきたい用語",
  description,
  path: "/exhibitions/current/",
})

const fmt = (d: string) => d.replaceAll("-", ".")

const CurrentExhibitionsPage = () => (
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
      <a href={currentExhibitionsSource.source} style={styles.link}>
        artscape
      </a>
      （{fmt(currentExhibitionsSource.fetchedAt.slice(0, 10))}
      取得）。用語は展覧会紹介文から自動で抽出しています。
      お出かけの際は最新の開催情報を各展覧会の公式サイトでご確認ください。
    </p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {currentExhibitions.map((e) => (
        <li
          key={e.id}
          style={{
            borderBottom: `1px solid ${color.border}`,
            padding: `${space.md} 0`,
          }}
        >
          <Link
            href={`/exhibitions/current/${e.id}/`}
            style={{ ...styles.link, fontWeight: 500 }}
          >
            {e.title}
          </Link>
          <p style={{ color: color.sub, fontSize: size.sm, lineHeight: 1.8 }}>
            <span style={{ color: e.open ? color.accent : color.sub }}>
              {e.open ? "開催中" : "開催前"}
            </span>
            {" ／ "}
            {e.venue} ／ {fmt(e.start)}〜{fmt(e.end)} ／ {e.terms.length}語
          </p>
        </li>
      ))}
    </ul>
  </div>
)

export default CurrentExhibitionsPage
