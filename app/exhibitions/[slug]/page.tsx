import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { exhibitions, getExhibition, getTerm } from "@/lib/data"
import { pageMeta } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  exhibitions.map((e) => ({ slug: e.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const e = getExhibition((await params).slug)
  if (!e) return {}
  return pageMeta({
    title: `${e.title} 知っておきたい用語`,
    description: e.description,
    path: `/exhibitions/${e.slug}/`,
  })
}

const ExhibitionPage = async ({ params }: Props) => {
  const e = getExhibition((await params).slug)
  if (!e) notFound()
  const path = `/exhibitions/${e.slug}/`
  return (
    <div style={{ ...styles.container, maxWidth: "48rem" }}>
      <Breadcrumbs
        items={[
          { name: "展覧会別", path: "/exhibitions/" },
          { name: e.title, path },
        ]}
      />
      <h1
        style={{
          fontFamily: font.serif,
          fontSize: size.xl,
          marginBottom: space.md,
        }}
      >
        {e.title} 知っておきたい用語
      </h1>
      <p style={{ lineHeight: 2, marginBottom: space.lg }}>{e.description}</p>
      {e.event && (
        <dl
          style={{
            border: `1px solid ${color.border}`,
            fontSize: size.sm,
            lineHeight: 1.8,
            marginBottom: space.lg,
            padding: space.md,
          }}
        >
          {[
            ["開催日時", e.event.date],
            ["会場", e.event.venue],
            ["料金", e.event.price],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: space.xs }}>
              <dt style={{ color: color.sub, fontSize: size.xs }}>{k}</dt>
              <dd style={{ margin: 0 }}>{v}</dd>
            </div>
          ))}
          <div>
            <dt style={{ color: color.sub, fontSize: size.xs }}>公式サイト</dt>
            <dd style={{ margin: 0 }}>
              <a
                href={e.event.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {e.event.url}
              </a>
            </dd>
          </div>
        </dl>
      )}
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
              <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>{t.summary}</p>
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
      <p style={{ marginTop: space.xl }}>
        <Link href="/exhibitions/" style={styles.link}>
          展覧会別の一覧へ戻る
        </Link>
      </p>
    </div>
  )
}

export default ExhibitionPage
