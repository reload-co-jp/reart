import Link from "next/link"
import { FC, Fragment } from "react"
import { absoluteUrl } from "@/lib/site"
import { color, size, space } from "@/components/theme"

export const JsonLd: FC<{ data: object }> = ({ data }) => (
  <script
    type="application/ld+json"
    // JSON-LD 内で </script> が閉じタグとして解釈されないようにする
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)

// 画面のパンくずと BreadcrumbList を同じデータから出力する
export const Breadcrumbs: FC<{ items: { name: string; path: string }[] }> = ({
  items,
}) => {
  const all = [{ name: "トップ", path: "/" }, ...items]
  return (
    <>
      <nav aria-label="パンくずリスト" style={{ marginBottom: space.lg }}>
        <ol
          style={{
            color: color.sub,
            display: "flex",
            flexWrap: "wrap",
            fontSize: size.xs,
            gap: space.xs,
            listStyle: "none",
            padding: 0,
          }}
        >
          {all.map((item, i) => (
            <Fragment key={item.path}>
              {i > 0 && <li aria-hidden="true">›</li>}
              <li>
                {i === all.length - 1 ? (
                  <span aria-current="page">{item.name}</span>
                ) : (
                  <Link href={item.path} style={{ color: color.sub }}>
                    {item.name}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: absoluteUrl(item.path),
          })),
        }}
      />
    </>
  )
}
