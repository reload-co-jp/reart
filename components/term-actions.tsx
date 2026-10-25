"use client"

import { FC } from "react"
import { LEARNED_KEY, SAVED_KEY, useSlugList } from "@/lib/storage"
import { color, space, styles } from "@/components/theme"

export const TermActions: FC<{ slug: string }> = ({ slug }) => {
  const [saved, toggleSaved] = useSlugList(SAVED_KEY)
  const [learned, toggleLearned] = useSlugList(LEARNED_KEY)
  const isSaved = saved.includes(slug)
  const isLearned = learned.includes(slug)
  const active = { background: color.text, color: color.surface }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: space.sm }}>
      <button
        type="button"
        aria-pressed={isSaved}
        onClick={() => toggleSaved(slug)}
        style={{ ...styles.button, ...(isSaved ? active : {}) }}
      >
        {isSaved ? "★ 保存済み" : "☆ 保存する"}
      </button>
      <button
        type="button"
        aria-pressed={isLearned}
        onClick={() => toggleLearned(slug)}
        style={{ ...styles.button, ...(isLearned ? active : {}) }}
      >
        {isLearned ? "✓ 学習済み" : "学習済みにする"}
      </button>
    </div>
  )
}
