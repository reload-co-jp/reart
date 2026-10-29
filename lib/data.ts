import fs from "node:fs"
import path from "node:path"
import categoriesJson from "@/data/categories.json"
import exhibitionsJson from "@/data/exhibitions.json"
import guidesJson from "@/data/guides.json"
import type { Category, Exhibition, Guide, Term, TermIndex } from "./types"

// data/terms/*.json（各ファイルは Term の配列）をすべて読み込む。
// ファイルを追加するだけで一覧・カテゴリ・検索・sitemap に反映される。
const loadTerms = (): Term[] => {
  const dir = path.join(process.cwd(), "data", "terms")
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

// 参照切れ・重複などを検出してエラー文字列の配列で返す
export const validate = (
  terms: Term[],
  categories: Category[],
  guides: Guide[],
  exhibitions: Exhibition[] = []
): string[] => {
  const errors: string[] = []
  const termSlugs = new Set<string>()
  const published = new Set(
    terms.filter((t) => t.status === "published").map((t) => t.slug)
  )
  const categorySlugs = new Set(categories.map((c) => c.slug))
  const guideSlugs = new Set(guides.map((g) => g.slug))

  for (const t of terms) {
    const at = `term "${t.slug}"`
    if (!SLUG.test(t.slug)) errors.push(`${at}: invalid slug`)
    if (termSlugs.has(t.slug)) errors.push(`${at}: duplicate slug`)
    termSlugs.add(t.slug)
    for (const key of ["term", "reading", "summary", "definition"] as const)
      if (!t[key]) errors.push(`${at}: missing ${key}`)
    if (![1, 2, 3].includes(t.difficulty))
      errors.push(`${at}: invalid difficulty`)
    if (!["published", "draft"].includes(t.status))
      errors.push(`${at}: invalid status`)
    if (!DATE.test(t.createdAt) || !DATE.test(t.updatedAt))
      errors.push(`${at}: invalid date`)
    if (!t.categoryIds.length) errors.push(`${at}: no category`)
    for (const c of t.categoryIds)
      if (!categorySlugs.has(c)) errors.push(`${at}: unknown category "${c}"`)
    // 公開用語から未公開・存在しない用語へはリンクさせない
    const refs = [
      ...t.relatedTerms,
      ...t.prerequisiteTerms,
      ...(t.confusables ?? []).map((c) => c.slug),
    ]
    for (const r of refs) {
      if (r === t.slug) errors.push(`${at}: references itself`)
      else if (t.status === "published" && !published.has(r))
        errors.push(`${at}: broken reference "${r}"`)
    }
  }
  for (const c of categories)
    for (const s of c.featuredTerms)
      if (!published.has(s))
        errors.push(`category "${c.slug}": broken reference "${s}"`)
  for (const g of guides) {
    for (const s of g.steps)
      if (!published.has(s.slug))
        errors.push(`guide "${g.slug}": broken reference "${s.slug}"`)
    for (const n of g.nextGuides)
      if (!guideSlugs.has(n))
        errors.push(`guide "${g.slug}": unknown guide "${n}"`)
  }
  for (const e of exhibitions)
    for (const s of e.terms)
      if (!published.has(s.slug))
        errors.push(`exhibition "${e.slug}": broken reference "${s.slug}"`)
  return errors
}

const allTerms = loadTerms()
export const categories: Category[] = categoriesJson
export const guides: Guide[] = guidesJson
export const exhibitions: Exhibition[] = exhibitionsJson

const errors = validate(allTerms, categories, guides, exhibitions)
if (errors.length) throw new Error(`Invalid data:\n${errors.join("\n")}`)

// 以降、公開済みの用語だけを扱う
export const terms: Term[] = allTerms
  .filter((t) => t.status === "published")
  .sort((a, b) => a.reading.localeCompare(b.reading, "ja"))

const termMap = new Map(terms.map((t) => [t.slug, t]))
export const getTerm = (slug: string) => termMap.get(slug)
export const getTerms = (slugs: string[]) =>
  slugs.map((s) => termMap.get(s)).filter((t): t is Term => !!t)

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug)
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug)

export const termsInCategory = (slug: string) =>
  terms.filter((t) => t.categoryIds.includes(slug))

// 用語群の最終更新日（sitemap / 記事の dateModified 用）
export const lastUpdated = (ts: Term[]) =>
  ts
    .map((t) => t.updatedAt)
    .sort()
    .at(-1)

export const guidesForTerm = (slug: string) =>
  guides.filter((g) => g.steps.some((s) => s.slug === slug))

// カテゴリに関連するガイド = そのカテゴリの用語を含むガイドを、含む数の多い順に
export const guidesForCategory = (slug: string) =>
  guides
    .map((g) => ({
      g,
      n: g.steps.filter((s) => getTerm(s.slug)?.categoryIds.includes(slug))
        .length,
    }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((x) => x.g)

export const toIndex = (t: Term): TermIndex => ({
  slug: t.slug,
  term: t.term,
  reading: t.reading,
  english: t.english,
  aliases: t.aliases,
  summary: t.summary,
  categoryIds: t.categoryIds,
  difficulty: t.difficulty,
  updatedAt: t.updatedAt,
})

export const termIndex: TermIndex[] = terms.map(toIndex)
