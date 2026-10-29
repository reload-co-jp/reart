import { pageMeta } from "@/lib/site"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { color, font, size, space, styles } from "@/components/theme"
import { categories, termsInCategory } from "@/lib/data"

const description =
  "素材・技法、美術史・芸術運動、現代美術など、テーマ別に美術用語を探せます。"

export const metadata = pageMeta({
  title: "カテゴリから美術用語を探す",
  description,
  path: "/categories/",
})

const CategoriesPage = () => (
  <div style={styles.container}>
    <Breadcrumbs items={[{ name: "カテゴリ", path: "/categories/" }]} />
    <h1
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        marginBottom: space.lg,
      }}
    >
      カテゴリから探す
    </h1>
    <ul
      style={{
        ...styles.grid,
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 20rem), 1fr))",
      }}
    >
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/categories/${c.slug}/`}
            style={{
              background: color.surface,
              border: `1px solid ${color.border}`,
              color: color.text,
              display: "block",
              height: "100%",
              padding: space.lg,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: font.serif,
                fontSize: size.lg,
                fontWeight: 500,
              }}
            >
              {c.name}
              <span
                style={{
                  color: color.sub,
                  fontSize: size.xs,
                  marginLeft: space.sm,
                }}
              >
                {termsInCategory(c.slug).length}語
              </span>
            </span>
            <span
              style={{
                display: "block",
                fontSize: size.sm,
                lineHeight: 1.8,
                marginTop: space.sm,
              }}
            >
              {c.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default CategoriesPage
