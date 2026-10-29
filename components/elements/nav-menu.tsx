"use client"

import Link from "next/link"
import { FC, useState } from "react"
import { color, size, space, styles } from "@/components/theme"

// 狭い画面ではハンバーガーで開閉（表示切替は reset.css の .nav-* ）
export const NavMenu: FC<{ items: { href: string; label: string }[] }> = ({
  items,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <nav
      aria-label="メインメニュー"
      className="nav"
      style={{ flex: "1 1 auto" }}
    >
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-list"
        onClick={() => setOpen(!open)}
        style={{
          alignItems: "center",
          background: "none",
          border: `1px solid ${color.inverse}`,
          borderRadius: 0,
          color: color.inverse,
          cursor: "pointer",
          fontSize: size.lg,
          justifyContent: "center",
          minHeight: "2.75rem",
          minWidth: "2.75rem",
        }}
      >
        <span aria-hidden>{open ? "×" : "☰"}</span>
        <span style={styles.visuallyHidden}>メニュー</span>
      </button>
      <ul
        id="nav-list"
        className="nav-list"
        data-open={open || undefined}
        style={{
          background: color.ink,
          display: "flex",
          flexWrap: "wrap",
          gap: space.xs,
          listStyle: "none",
          padding: 0,
        }}
      >
        {items.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              onClick={() => setOpen(false)}
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
  )
}
