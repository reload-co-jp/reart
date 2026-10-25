import type { CSSProperties } from "react"

// デザイントークン
export const color = {
  bg: "#f7f4ee",
  surface: "#fffdf9",
  text: "#1f1d1a",
  sub: "#5f5a52",
  border: "#ddd5c7",
  accent: "#a8402a",
  accentSoft: "#f3e3dc",
  ink: "#24384f",
}

export const font = {
  sans: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif',
  serif:
    '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "YuMincho", serif',
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
    fontSize: size.lg,
    fontWeight: 600,
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
    borderRadius: "999px",
    color: color.sub,
    display: "inline-block",
    fontSize: size.xs,
    padding: `.1rem ${space.sm}`,
  },
  button: {
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.text}`,
    borderRadius: "4px",
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
    borderRadius: "4px",
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
