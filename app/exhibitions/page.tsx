import { pageMeta } from "@/lib/site"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { exhibitions } from "@/lib/data"

const description =
  "印象派展、日本美術展、現代美術展、工芸展など、展覧会の種類ごとに知っておきたい美術用語をまとめました。行く前の予習にどうぞ。"

export const metadata = pageMeta({
  title: "展覧会別 知っておきたい用語",
  description,
  path: "/exhibitions/",
})

const ExhibitionsPage = () => (
  <div style={{ ...styles.container, maxWidth: "48rem" }}>
    <Breadcrumbs items={[{ name: "展覧会別", path: "/exhibitions/" }]} />
    <h1
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        marginBottom: space.md,
      }}
    >
      展覧会別 知っておきたい用語
    </h1>
    <p style={{ lineHeight: 2, marginBottom: space.lg }}>{description}</p>
    <p style={{ lineHeight: 2, marginBottom: space.lg }}>
      <Link href="/exhibitions/current/" style={styles.link}>
        東京で開催中の企画展ごとの用語はこちら
      </Link>
    </p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {exhibitions.map((e) => (
        <li
          key={e.slug}
          style={{
            borderBottom: `1px solid ${color.border}`,
            padding: `${space.md} 0`,
          }}
        >
          <Link
            href={`/exhibitions/${e.slug}/`}
            style={{ ...styles.link, fontWeight: 500 }}
          >
            {e.title}
          </Link>
          <span
            style={{
              color: color.sub,
              fontSize: size.xs,
              marginLeft: space.sm,
            }}
          >
            {e.terms.length}語
          </span>
          <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>{e.description}</p>
        </li>
      ))}
    </ul>
  </div>
)

export default ExhibitionsPage
