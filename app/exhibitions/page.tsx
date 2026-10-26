import { pageMeta } from "@/lib/site"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { exhibitions, getTerm } from "@/lib/data"

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

    <nav aria-label="展覧会の種類" style={{ marginBottom: space.xl }}>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: space.sm,
          listStyle: "none",
          padding: 0,
        }}
      >
        {exhibitions.map((e) => (
          <li key={e.slug}>
            <a
              href={`#${e.slug}`}
              style={{ ...styles.link, fontSize: size.sm }}
            >
              {e.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    {exhibitions.map((e) => (
      <section
        key={e.slug}
        id={e.slug}
        style={{ marginBottom: space.xl, scrollMarginTop: space.xl }}
      >
        <h2 style={styles.sectionTitle}>{e.title}</h2>
        <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>{e.description}</p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {e.terms.map((s) => {
            const t = getTerm(s.slug)!
            return (
              <li
                key={s.slug}
                style={{
                  borderBottom: `1px solid ${color.border}`,
                  padding: `${space.md} 0`,
                }}
              >
                <Link
                  href={`/terms/${s.slug}/`}
                  style={{ ...styles.link, fontWeight: 600 }}
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
                {s.note && (
                  <p
                    style={{
                      color: color.sub,
                      fontSize: size.sm,
                      lineHeight: 1.8,
                      marginTop: space.xs,
                    }}
                  >
                    {s.note}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    ))}
  </div>
)

export default ExhibitionsPage
