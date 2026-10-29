import Link from "next/link"
import { FC, ReactNode } from "react"
import { color, font, size, space, styles } from "@/components/theme"
import { SearchForm } from "@/components/search-form"

const NAV = [
  { href: "/terms/", label: "用語一覧" },
  { href: "/categories/", label: "カテゴリ" },
  { href: "/guides/", label: "学習ガイド" },
  { href: "/exhibitions/", label: "展覧会別" },
  { href: "/saved/", label: "保存した用語" },
]

export const Header: FC = () => (
  <header
    style={{
      background: color.ink,
      color: color.inverse,
      padding: `${space.sm} 0`,
    }}
  >
    <div
      style={{
        ...styles.container,
        alignItems: "center",
        columnGap: space.lg,
        display: "flex",
        flexWrap: "wrap",
        rowGap: space.sm,
      }}
    >
      <Link
        href="/"
        style={{
          alignItems: "baseline",
          color: color.inverse,
          display: "flex",
          gap: space.sm,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: font.serif,
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: ".04em",
          }}
        >
          Re<span style={{ color: color.accent }}>A</span>rt
        </span>
        <span style={{ fontSize: size.xs }}>美術用語辞典</span>
      </Link>
      <nav aria-label="メインメニュー" style={{ flex: "1 1 auto" }}>
        <ul
          style={{
            display: "flex",
            gap: space.xs,
            listStyle: "none",
            overflowX: "auto",
            padding: 0,
          }}
        >
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                style={{
                  alignItems: "center",
                  color: color.inverse,
                  display: "flex",
                  fontSize: size.sm,
                  minHeight: "2.75rem",
                  padding: `0 ${space.sm}`,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ flex: "1 1 16rem", maxWidth: "24rem" }}>
        <SearchForm id="header-search" compact />
      </div>
    </div>
  </header>
)

export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <main
    style={{
      minHeight: "calc(100dvh - 12rem)",
      padding: `${space.xl} 0 ${space.xxl}`,
    }}
  >
    {children}
  </main>
)

export const Footer: FC<{ children: ReactNode }> = ({ children }) => (
  <footer
    style={{
      background: "rgba(0, 0, 0, 0.9)",
      color: color.inverse,
      fontSize: size.xs,
      padding: `${space.xl} 0`,
    }}
  >
    <div style={styles.container}>{children}</div>
  </footer>
)
