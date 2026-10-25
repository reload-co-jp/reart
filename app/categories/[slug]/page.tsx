import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/seo"
import { TermGrid } from "@/components/term-card"
import { color, font, size, space, styles, width } from "@/components/theme"
import {
  categories,
  getCategory,
  getTerms,
  guidesForCategory,
  termsInCategory,
  toIndex,
} from "@/lib/data"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  categories.map((c) => ({ slug: c.slug }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const c = getCategory((await params).slug)
  if (!c) return {}
  const path = `/categories/${c.slug}/`
  const title = `${c.name}の美術用語`
  return {
    title,
    description: c.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `${title}｜ReArt`,
      description: c.description,
    },
  }
}

const CategoryPage = async ({ params }: Props) => {
  const c = getCategory((await params).slug)
  if (!c) notFound()
  const list = termsInCategory(c.slug)
  const guides = guidesForCategory(c.slug)
  const categoryNames = Object.fromEntries(
    categories.map((x) => [x.slug, x.name])
  )
  return (
    <div style={styles.container}>
      <Breadcrumbs
        items={[
          { name: "カテゴリ", path: "/categories/" },
          { name: c.name, path: `/categories/${c.slug}/` },
        ]}
      />
      <h1 style={{ fontFamily: font.serif, fontSize: size.xl }}>{c.name}</h1>
      <p
        style={{
          lineHeight: 2,
          margin: `${space.md} 0 ${space.xl}`,
          maxWidth: width.text,
        }}
      >
        {c.description}
      </p>

      <section style={{ marginBottom: space.xl }}>
        <h2 style={styles.sectionTitle}>まず知っておきたい代表的な用語</h2>
        <TermGrid terms={getTerms(c.featuredTerms).map(toIndex)} />
      </section>

      <section style={{ marginBottom: space.xl }}>
        <h2 style={styles.sectionTitle}>用語一覧（{list.length}語）</h2>
        <TermGrid terms={list.map(toIndex)} categoryNames={categoryNames} />
      </section>

      {guides.length > 0 && (
        <section>
          <h2 style={styles.sectionTitle}>関連する学習ガイド</h2>
          <ul style={{ lineHeight: 2, paddingLeft: "1.25em" }}>
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}/`} style={styles.link}>
                  {g.title}
                </Link>
                <span style={{ color: color.sub, fontSize: size.xs }}>
                  {" "}
                  — {g.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default CategoryPage
