import type { Metadata } from "next"
import Link from "next/link"
import { SearchForm } from "@/components/search-form"
import { font, size, space, styles } from "@/components/theme"

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false },
}

const NotFound = () => (
  <div style={{ ...styles.container, maxWidth: "36rem", textAlign: "center" }}>
    <h1 style={{ fontFamily: font.serif, fontSize: size.xl }}>
      ページが見つかりません
    </h1>
    <p style={{ lineHeight: 2, margin: `${space.md} 0 ${space.lg}` }}>
      お探しの用語は、まだ掲載されていないか、URLが変更された可能性があります。
    </p>
    <SearchForm id="notfound-search" />
    <p style={{ marginTop: space.lg }}>
      <Link href="/terms/" style={styles.link}>
        用語一覧を見る
      </Link>
    </p>
  </div>
)

export default NotFound
