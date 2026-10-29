import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs, JsonLd } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { getGuide, getTerm, getTerms, guides, lastUpdated } from "@/lib/data"
import {
  absoluteUrl,
  OG_IMAGE,
  pageMeta,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const g = getGuide((await params).slug)
  if (!g) return {}
  return pageMeta({
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}/`,
    type: "article",
    modifiedTime: lastUpdated(getTerms(g.steps.map((s) => s.slug))),
  })
}

const GuidePage = async ({ params }: Props) => {
  const g = getGuide((await params).slug)
  if (!g) notFound()
  const path = `/guides/${g.slug}/`
  const steps = g.steps.map((s) => ({ ...s, term: getTerm(s.slug)! }))
  return (
    <div style={{ ...styles.container, maxWidth: "48rem" }}>
      <Breadcrumbs
        items={[
          { name: "学習ガイド", path: "/guides/" },
          { name: g.title, path },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          url: absoluteUrl(path),
          inLanguage: "ja",
          image: absoluteUrl(OG_IMAGE),
          dateModified: lastUpdated(steps.map((s) => s.term)),
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />
      <article>
        <h1
          style={{
            fontFamily: font.serif,
            fontSize: size.xl,
            lineHeight: 1.4,
          }}
        >
          {g.title}
        </h1>
        <p style={{ lineHeight: 2, margin: `${space.md} 0 ${space.xl}` }}>
          {g.description}
        </p>

        <h2 style={styles.sectionTitle}>学ぶ順番</h2>
        <ol style={{ listStyle: "none", padding: 0 }}>
          {steps.map((s, i) => (
            <li
              key={s.slug}
              style={{
                borderBottom: `1px solid ${color.border}`,
                display: "flex",
                gap: space.md,
                padding: `${space.md} 0`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: color.accent,
                  fontFamily: font.serif,
                  fontSize: size.lg,
                  minWidth: "2ch",
                }}
              >
                {i + 1}
              </span>
              <div>
                <Link
                  href={`/terms/${s.slug}/`}
                  style={{ ...styles.link, fontSize: size.lg, fontWeight: 600 }}
                >
                  {s.term.term}
                </Link>
                <span
                  style={{
                    color: color.sub,
                    fontSize: size.xs,
                    marginLeft: space.sm,
                  }}
                >
                  {s.term.reading}
                </span>
                <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>
                  {s.term.summary}
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
              </div>
            </li>
          ))}
        </ol>
      </article>

      {g.nextGuides.length > 0 && (
        <section style={{ marginTop: space.xl }}>
          <h2 style={styles.sectionTitle}>次に学ぶテーマ</h2>
          <ul style={{ lineHeight: 2, paddingLeft: "1.25em" }}>
            {g.nextGuides.map((n) => (
              <li key={n}>
                <Link href={`/guides/${n}/`} style={styles.link}>
                  {getGuide(n)!.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default GuidePage
