import type { Metadata } from "next"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/seo"
import { TermGrid } from "@/components/term-card"
import { TermsBrowser } from "@/components/terms-browser"
import { font, size, space, styles } from "@/components/theme"
import { categories, termIndex } from "@/lib/data"

const description =
  "ReArtに掲載している美術用語の一覧です。用語名・読み・英語表記で検索し、カテゴリや難易度で絞り込めます。"

export const metadata: Metadata = {
  title: "美術用語一覧",
  description,
  alternates: { canonical: "/terms/" },
  openGraph: { url: "/terms/", title: "美術用語一覧｜ReArt", description },
}

const TermsPage = () => {
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name }))
  const categoryNames = Object.fromEntries(cats.map((c) => [c.slug, c.name]))
  return (
    <div style={styles.container}>
      <Breadcrumbs items={[{ name: "用語一覧", path: "/terms/" }]} />
      <h1
        style={{
          fontFamily: font.serif,
          fontSize: size.xl,
          marginBottom: space.lg,
        }}
      >
        美術用語一覧
      </h1>
      {/* JS なしでは全用語の静的リストを表示し、JS 有効時に検索 UI に置き換わる */}
      <Suspense
        fallback={<TermGrid terms={termIndex} categoryNames={categoryNames} />}
      >
        <TermsBrowser terms={termIndex} categories={cats} />
      </Suspense>
    </div>
  )
}

export default TermsPage
