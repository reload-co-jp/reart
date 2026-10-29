import type { CSSProperties } from "react"

// デザイントークン
export const color = {
  bg: "#fff",
  surface: "#fff",
  text: "#000",
  sub: "#666",
  border: "#ddd",
  accent: "#c7002c",
  accentSoft: "#f6f6f6",
  ink: "#333",
  inverse: "#fff",
}

export const font = {
  sans: 'var(--font-noto-sans-jp), "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif',
  // 欧文を Cormorant、和文を Shippori Mincho で組む見出し用
  serif:
    'var(--font-cormorant), var(--font-shippori-mincho), "Hiragino Mincho ProN", "Yu Mincho", serif',
}

export const size = {
  xs: ".75rem",
  sm: ".875rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "clamp(1.5rem, 4vw, 2rem)",
  xxl: "clamp(2rem, 7vw, 3.25rem)",
}

export const space = {
  xs: ".25rem",
  sm: ".5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2.5rem",
  xxl: "4rem",
}

export const width = {
  content: "72rem",
  text: "42rem",
}

// 共通スタイル
export const styles = {
  container: {
    margin: "0 auto",
    maxWidth: width.content,
    padding: `0 ${space.md}`,
    width: "100%",
  },
  sectionTitle: {
    borderBottom: `1px solid ${color.text}`,
    fontFamily: font.serif,
    fontFeatureSettings: '"palt"',
    fontSize: size.xl,
    fontWeight: 500,
    letterSpacing: ".06em",
    marginBottom: space.lg,
    paddingBottom: space.sm,
  },
  grid: {
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 15rem), 1fr))",
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: color.accent,
    textDecoration: "underline",
    textUnderlineOffset: ".2em",
  },
  tag: {
    border: `1px solid ${color.border}`,
    borderRadius: 0,
    color: color.sub,
    display: "inline-block",
    fontSize: size.xs,
    padding: `.1rem ${space.sm}`,
  },
  button: {
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.text}`,
    borderRadius: 0,
    color: color.text,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: size.sm,
    gap: space.xs,
    minHeight: "2.75rem",
    padding: `0 ${space.md}`,
  },
  input: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: 0,
    color: color.text,
    fontSize: size.md,
    minHeight: "2.75rem",
    padding: `0 ${space.md}`,
    width: "100%",
  },
  visuallyHidden: {
    clip: "rect(0 0 0 0)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
} satisfies Record<string, CSSProperties>
