import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/seo"
import { SavedList } from "@/components/saved-list"
import { font, size, space, styles } from "@/components/theme"
import { categories, termIndex } from "@/lib/data"

export const metadata: Metadata = {
  title: "保存した用語",
  alternates: { canonical: "/saved/" },
  robots: { index: false },
}

const SavedPage = () => (
  <div style={styles.container}>
    <Breadcrumbs items={[{ name: "保存した用語", path: "/saved/" }]} />
    <h1
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        marginBottom: space.lg,
      }}
    >
      保存した用語
    </h1>
    <SavedList
      terms={termIndex}
      categoryNames={Object.fromEntries(
        categories.map((c) => [c.slug, c.name])
      )}
    />
  </div>
)

export default SavedPage
