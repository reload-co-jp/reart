import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import {
  currentExhibitions,
  currentExhibitionsSource,
  getCurrentExhibition,
} from "@/lib/data"
import { pageMeta } from "@/lib/site"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false
// ponytail: 全展覧会が終了済みだと空になり static export が失敗する。起きたら fetch-exhibitions を再実行
export const generateStaticParams = () =>
  currentExhibitions.map((e) => ({ id: e.id }))

const fmt = (d: string) => d.replaceAll("-", ".")

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const e = getCurrentExhibition((await params).id)
  if (!e) return {}
  return pageMeta({
    title: `${e.title} 知っておきたい用語`,
    description: `${e.venue}で開催の「${e.title}」（${fmt(e.start)}〜${fmt(e.end)}）を見る前に知っておきたい美術用語をまとめました。`,
    path: `/exhibitions/current/${e.id}/`,
  })
}

const CurrentExhibitionPage = async ({ params }: Props) => {
  const e = getCurrentExhibition((await params).id)
  if (!e) notFound()
  const path = `/exhibitions/current/${e.id}/`
  return (
    <div style={{ ...styles.container, maxWidth: "48rem" }}>
      <Breadcrumbs
        items={[
          { name: "展覧会別", path: "/exhibitions/" },
          { name: "東京の企画展", path: "/exhibitions/current/" },
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
            <p style={{ fontSize: size.sm, lineHeight: 1.8 }}>{t.summary}</p>
          </li>
        ))}
      </ul>
      <p
        style={{
          color: color.sub,
          fontSize: size.xs,
          lineHeight: 1.8,
          marginTop: space.lg,
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
      <p style={{ marginTop: space.xl }}>
        <Link href="/exhibitions/current/" style={styles.link}>
          東京の企画展の一覧へ戻る
        </Link>
      </p>
    </div>
  )
}

export default CurrentExhibitionPage
