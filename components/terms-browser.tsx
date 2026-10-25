"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FC, useState } from "react"
import { searchTerms } from "@/lib/search"
import { DIFFICULTY_LABEL, TermIndex } from "@/lib/types"
import { TermGrid } from "@/components/term-card"
import { color, size, space, styles } from "@/components/theme"

const PAGE = 30

// 一致しないときは語尾を削って再検索し、近い用語を案内する
// ponytail: 前方一致の素朴な近似。表記揺れが増えたら aliases の追加かあいまい検索へ
const suggest = (terms: TermIndex[], q: string) => {
  for (let s = q.slice(0, -1); s.length > 0; s = s.slice(0, -1)) {
    const hits = searchTerms(terms, s)
    if (hits.length) return hits.slice(0, 6)
  }
  return []
}

export const TermsBrowser: FC<{
  terms: TermIndex[]
  categories: { slug: string; name: string }[]
}> = ({ terms, categories }) => {
  const params = useSearchParams()
  const [q, setQ] = useState(params.get("q") ?? "")
  const [limit, setLimit] = useState(PAGE)
  const category = params.get("category") ?? ""
  const difficulty = params.get("difficulty") ?? ""
  const sort = params.get("sort") ?? ""
  const categoryNames = Object.fromEntries(
    categories.map((c) => [c.slug, c.name])
  )

  // 検索条件を URL に反映して共有できるようにする
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search)
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    window.history.replaceState(null, "", qs ? `?${qs}` : location.pathname)
    setLimit(PAGE)
  }

  let results = searchTerms(terms, q).filter(
    (t) =>
      (!category || t.categoryIds.includes(category)) &&
      (!difficulty || t.difficulty === Number(difficulty))
  )
  if (sort === "updated")
    results = [...results].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )
  else if (!q)
    results = [...results].sort((a, b) =>
      a.reading.localeCompare(b.reading, "ja")
    )

  const field = {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  } as const
  const label = { color: color.sub, fontSize: size.xs }

  return (
    <>
      <div
        style={{
          display: "grid",
          gap: space.md,
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 11rem), 1fr))",
          marginBottom: space.lg,
        }}
      >
        <div style={{ ...field, gridColumn: "1 / -1" }}>
          <label htmlFor="terms-q" style={label}>
            キーワード（用語名・読み・英語・別名）
          </label>
          <input
            id="terms-q"
            type="search"
            value={q}
            placeholder="気になる美術用語を検索"
            onChange={(e) => {
              setQ(e.target.value)
              update("q", e.target.value)
            }}
            style={styles.input}
          />
        </div>
        <div style={field}>
          <label htmlFor="terms-category" style={label}>
            カテゴリ
          </label>
          <select
            id="terms-category"
            value={category}
            onChange={(e) => update("category", e.target.value)}
            style={styles.input}
          >
            <option value="">すべて</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div style={field}>
          <label htmlFor="terms-difficulty" style={label}>
            難易度
          </label>
          <select
            id="terms-difficulty"
            value={difficulty}
            onChange={(e) => update("difficulty", e.target.value)}
            style={styles.input}
          >
            <option value="">すべて</option>
            {Object.entries(DIFFICULTY_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div style={field}>
          <label htmlFor="terms-sort" style={label}>
            並び順
          </label>
          <select
            id="terms-sort"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            style={styles.input}
          >
            <option value="">{q ? "関連度順" : "五十音順"}</option>
            <option value="updated">更新が新しい順</option>
          </select>
        </div>
      </div>

      <p aria-live="polite" style={{ ...label, marginBottom: space.md }}>
        {results.length}件の用語
      </p>

      {results.length ? (
        <>
          <TermGrid
            terms={results.slice(0, limit)}
            categoryNames={categoryNames}
          />
          {results.length > limit && (
            <div style={{ marginTop: space.lg, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setLimit(limit + PAGE)}
                style={styles.button}
              >
                もっと見る（残り{results.length - limit}件）
              </button>
            </div>
          )}
        </>
      ) : (
        <NoResults
          suggestions={q ? suggest(terms, q) : []}
          categories={categories}
        />
      )}
    </>
  )
}

const NoResults: FC<{
  suggestions: TermIndex[]
  categories: { slug: string; name: string }[]
}> = ({ suggestions, categories }) => (
  <div style={{ display: "grid", gap: space.lg }}>
    <p>条件に一致する用語が見つかりませんでした。</p>
    {suggestions.length > 0 && (
      <div>
        <h2 style={{ fontSize: size.md, marginBottom: space.sm }}>近い用語</h2>
        <TermGrid terms={suggestions} />
      </div>
    )}
    <div>
      <h2 style={{ fontSize: size.md, marginBottom: space.sm }}>
        カテゴリから探す
      </h2>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: space.sm,
          listStyle: "none",
          padding: 0,
        }}
      >
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/categories/${c.slug}/`} style={styles.link}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
