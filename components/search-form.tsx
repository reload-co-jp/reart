import { FC } from "react"
import { color, size, space, styles } from "@/components/theme"

// JS なしでも動くよう、/terms/?q= への GET フォームにする
export const SearchForm: FC<{
  id: string
  compact?: boolean
  defaultValue?: string
}> = ({ id, compact, defaultValue }) => (
  <form
    role="search"
    action="/terms/"
    method="get"
    style={{ display: "flex", gap: space.xs }}
  >
    <label htmlFor={id} style={styles.visuallyHidden}>
      美術用語を検索
    </label>
    <input
      id={id}
      name="q"
      type="search"
      placeholder="気になる美術用語を検索"
      defaultValue={defaultValue}
      style={{
        ...styles.input,
        ...(compact ? { fontSize: size.sm } : { minHeight: "3.5rem" }),
      }}
    />
    <button
      type="submit"
      style={{
        ...styles.button,
        background: color.text,
        color: color.surface,
        flexShrink: 0,
        ...(compact ? {} : { minHeight: "3.5rem", padding: `0 ${space.lg}` }),
      }}
    >
      検索
    </button>
  </form>
)
