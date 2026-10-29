import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FC, ReactNode } from "react"
import { ImageViewer } from "@/components/image-viewer"
import { Breadcrumbs, JsonLd } from "@/components/seo"
import { TermActions } from "@/components/term-actions"
import { createTermLinker } from "@/components/term-linker"
import { color, font, size, space, styles, width } from "@/components/theme"
import {
  artworksForTerm,
  getCategory,
  getTerm,
  getTerms,
  guidesForTerm,
  termIndex,
  terms,
  termsInCategory,
} from "@/lib/data"
import {
  absoluteUrl,
  OG_IMAGE,
  pageMeta,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site"
import { DIFFICULTY_LABEL, Term } from "@/lib/types"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => terms.map((t) => ({ slug: t.slug }))

const describe = (t: Term) =>
  `${t.term}（${t.reading}）とは、${t.summary.replace(/。$/, "")}。美術での使われ方、具体例、鑑賞のポイント、関連用語を初心者向けにわかりやすく解説します。`

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const t = getTerm((await params).slug)
  if (!t) return {}
  return pageMeta({
    title: `${t.term}とは？意味・作品の見方を解説`,
    description: describe(t),
    path: `/terms/${t.slug}/`,
    type: "article",
    publishedTime: t.createdAt,
    modifiedTime: t.updatedAt,
  })
}

const Block: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginTop: space.xl }}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </section>
)

const SubHeading: FC<{ children: ReactNode }> = ({ children }) => (
  <h3
    style={{
      fontSize: size.md,
      margin: `${space.lg} 0 ${space.sm}`,
    }}
  >
    {children}
  </h3>
)

const LinkList: FC<{ title: string; items: Term[] }> = ({ title, items }) =>
  items.length > 0 && (
    <div style={{ marginBottom: space.lg }}>
      <h2 style={{ fontSize: size.sm, marginBottom: space.sm }}>{title}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((t) => (
          <li key={t.slug} style={{ borderTop: `1px solid ${color.border}` }}>
            <Link
              href={`/terms/${t.slug}/`}
              style={{
                color: color.text,
                display: "block",
                padding: `${space.sm} 0`,
                textDecoration: "none",
              }}
            >
              <span style={{ color: color.accent, fontWeight: 500 }}>
                {t.term}
              </span>
              <span
                style={{
                  color: color.sub,
                  display: "block",
                  fontSize: size.xs,
                }}
              >
                {t.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

const bullet = { lineHeight: 1.9, paddingLeft: "1.25em" }

const TermPage = async ({ params }: Props) => {
  const t = getTerm((await params).slug)
  if (!t) notFound()

  const cats = t.categoryIds.map(getCategory)
  const primary = cats[0]!
  const path = `/terms/${t.slug}/`
  const related = getTerms(t.relatedTerms)
  const artworks = artworksForTerm(t.slug)
  const sameCategory = termsInCategory(primary.slug)
    .filter((x) => x.slug !== t.slug && !t.relatedTerms.includes(x.slug))
    .slice(0, 5)
  const confusables = (t.confusables ?? []).map((c) => ({
    ...c,
    term: getTerm(c.slug)!,
  }))
  const guides = guidesForTerm(t.slug)
  const linkify = createTermLinker(termIndex, t.slug)

  return (
    <div style={styles.container}>
      <Breadcrumbs
        items={[
          { name: primary.name, path: `/categories/${primary.slug}/` },
          { name: t.term, path },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${t.term}とは？意味・作品の見方を解説`,
          description: t.summary,
          url: absoluteUrl(path),
          image: [...artworks.map((a) => a.localImagePath), OG_IMAGE].map(
            absoluteUrl
          ),
          inLanguage: "ja",
          datePublished: t.createdAt,
          dateModified: t.updatedAt,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          mainEntity: {
            "@type": "DefinedTerm",
            name: t.term,
            alternateName: [t.reading, t.english, ...t.aliases].filter(Boolean),
            description: t.summary,
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: SITE_NAME,
              url: `${SITE_URL}/terms/`,
            },
          },
        }}
      />

      <header style={{ marginBottom: space.lg }}>
        <p style={{ color: color.sub, fontSize: size.sm }}>
          {t.reading}
          {t.english && <span lang="en"> / {t.english}</span>}
        </p>
        <h1
          style={{
            fontFamily: font.serif,
            fontSize: size.xxl,
            fontWeight: 500,
            lineHeight: 1.3,
            margin: `${space.xs} 0 ${space.md}`,
          }}
        >
          {t.term}
        </h1>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: space.xs,
          }}
        >
          {cats.map((c) => (
            <Link
              key={c!.slug}
              href={`/categories/${c!.slug}/`}
              style={{ ...styles.tag, textDecoration: "none" }}
            >
              {c!.name}
            </Link>
          ))}
          <span
            style={{
              ...styles.tag,
              borderColor: color.accent,
              color: color.accent,
            }}
          >
            難易度：{DIFFICULTY_LABEL[t.difficulty]}
          </span>
        </div>
        {t.aliases.length > 0 && (
          <p
            style={{ color: color.sub, fontSize: size.xs, marginTop: space.sm }}
          >
            別名・関連する表記：{t.aliases.join("、")}
          </p>
        )}
      </header>

      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexWrap: "wrap",
          gap: space.xl,
        }}
      >
        <article
          style={{ flex: "999 1 32rem", maxWidth: width.text, minWidth: 0 }}
        >
          <p
            style={{
              background: color.surface,
              borderLeft: `4px solid ${color.accent}`,
              fontSize: "1.125rem",
              lineHeight: 1.9,
              padding: space.lg,
            }}
          >
            {t.summary}
          </p>
          <div style={{ marginTop: space.md }}>
            <TermActions slug={t.slug} />
          </div>

          <Block title="詳しい解説">
            <p style={{ lineHeight: 2 }}>{linkify(t.definition)}</p>
            {t.artUsage && (
              <>
                <SubHeading>美術の分野での使われ方</SubHeading>
                <p style={{ lineHeight: 2 }}>{linkify(t.artUsage)}</p>
              </>
            )}
            {t.generalDifference && (
              <>
                <SubHeading>一般的な意味との違い</SubHeading>
                <p style={{ lineHeight: 2 }}>{linkify(t.generalDifference)}</p>
              </>
            )}
            {confusables.length > 0 && (
              <>
                <SubHeading>混同しやすい用語との違い</SubHeading>
                <dl style={{ lineHeight: 1.9 }}>
                  {confusables.map((c) => (
                    <div key={c.slug} style={{ marginBottom: space.sm }}>
                      <dt>
                        <Link href={`/terms/${c.slug}/`} style={styles.link}>
                          {c.term.term}
                        </Link>
                      </dt>
                      <dd style={{ marginLeft: 0 }}>{c.note}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </Block>

          {t.examples.length > 0 && (
            <Block title="具体例">
              <ul style={bullet}>
                {t.examples.map((e, i) => (
                  <li key={i}>
                    {e.description}
                    {e.work && (
                      <span style={{ color: color.sub, fontSize: size.sm }}>
                        （{e.work.artist}《{e.work.title}》
                        {e.work.year && `${e.work.year}年`}
                        {e.work.collection && `、${e.work.collection}`}／出典：
                        {e.work.source.url ? (
                          <a href={e.work.source.url} style={styles.link}>
                            {e.work.source.title}
                          </a>
                        ) : (
                          e.work.source.title
                        )}
                        ）
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {artworks.length > 0 && (
            <Block title="関連作品">
              <ul
                style={{
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: space.md,
                }}
              >
                {artworks.map((a) => (
                  <li key={a.id}>
                    <figure>
                      <ImageViewer
                        src={a.localImagePath}
                        alt={a.title}
                        caption={
                          <>
                            <p>
                              {a.artist && `${a.artist}`}《{a.title}》
                              {a.date && `、${a.date}`}
                            </p>
                            {a.description && (
                              <p lang="en" style={{ marginTop: space.sm }}>
                                {a.description}
                              </p>
                            )}
                          </>
                        }
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "contain",
                          background: color.accentSoft,
                        }}
                      />
                      <figcaption
                        style={{ fontSize: size.sm, marginTop: space.xs }}
                      >
                        {a.artist && `${a.artist}`}《{a.title}》
                        {a.date && `、${a.date}`}
                        <br />
                        <span style={{ color: color.sub }}>
                          {a.museum}／{a.rights}／
                          <a
                            href={a.sourceUrl}
                            style={styles.link}
                            rel="noopener"
                          >
                            作品ページ
                          </a>
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {t.viewingTips.length > 0 && (
            <Block title="鑑賞のポイント">
              <p
                style={{
                  color: color.sub,
                  fontSize: size.sm,
                  marginBottom: space.sm,
                }}
              >
                この言葉を知っていると、作品のこんなところに注目できます。
              </p>
              <ul style={bullet}>
                {t.viewingTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </Block>
          )}

          {(t.museumUsage || t.museumExample) && (
            <Block title="美術館の解説文での使われ方">
              {t.museumUsage && (
                <p style={{ lineHeight: 2 }}>{linkify(t.museumUsage)}</p>
              )}
              {t.museumExample && (
                <figure style={{ marginTop: space.md }}>
                  <blockquote
                    style={{
                      background: color.surface,
                      border: `1px solid ${color.border}`,
                      fontFamily: font.serif,
                      lineHeight: 2,
                      padding: space.md,
                    }}
                  >
                    {t.museumExample}
                  </blockquote>
                  <figcaption
                    style={{
                      color: color.sub,
                      fontSize: size.xs,
                      marginTop: space.xs,
                    }}
                  >
                    ※説明のために編集部が作成した例文です。
                  </figcaption>
                </figure>
              )}
            </Block>
          )}

          {t.sources.length === 0 && t.verification.note && (
            <Block title="参考情報">
              <p style={{ color: color.sub, fontSize: size.sm }}>
                {t.verification.note}
              </p>
            </Block>
          )}

          {t.sources.length > 0 && (
            <Block title="参考情報">
              <ul style={{ ...bullet, fontSize: size.sm }}>
                {t.sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} style={styles.link} rel="noopener">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                    {s.publisher && `（${s.publisher}）`}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <p
            style={{ color: color.sub, fontSize: size.xs, marginTop: space.xl }}
          >
            公開日 {t.createdAt} ／ 最終更新 {t.updatedAt}
          </p>
        </article>

        <aside aria-label="関連情報" style={{ flex: "1 1 16rem", minWidth: 0 }}>
          <LinkList
            title="先に知っておくとよい用語"
            items={getTerms(t.prerequisiteTerms)}
          />
          <LinkList title="関連用語" items={related} />
          <LinkList title={`「${primary.name}」の用語`} items={sameCategory} />
          {guides.length > 0 && (
            <div>
              <h2 style={{ fontSize: size.sm, marginBottom: space.sm }}>
                この用語が出てくる学習ガイド
              </h2>
              <ul style={{ ...bullet, fontSize: size.sm }}>
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}/`} style={styles.link}>
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default TermPage
