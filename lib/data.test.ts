import { describe, expect, it } from "vitest"
import { categories, getTerm, guides, terms, validate } from "./data"
import type { Term } from "./types"

const base = terms[0]

describe("data", () => {
  it("loads published terms with valid references", () => {
    expect(terms.length).toBeGreaterThanOrEqual(100)
    // 読み込み時に validate が走るので、ここまで来れば参照切れはない
    expect(getTerm("textile")?.term).toBe("テキスタイル")
  })

  it("detects broken references, duplicates and unknown categories", () => {
    const bad: Term[] = [
      { ...base, slug: "a", relatedTerms: ["missing"] },
      { ...base, slug: "a", categoryIds: ["nope"], relatedTerms: [] },
    ]
    const errors = validate(bad, categories, [])
    expect(errors).toContain('term "a": broken reference "missing"')
    expect(errors).toContain('term "a": duplicate slug')
    expect(errors).toContain('term "a": unknown category "nope"')
  })

  it("does not allow links to draft terms and hides drafts", () => {
    const draft = { ...base, slug: "draft-term", status: "draft" as const }
    const linking = { ...base, slug: "b", relatedTerms: ["draft-term"] }
    expect(validate([draft, linking], categories, [])).toContain(
      'term "b": broken reference "draft-term"'
    )
    expect(terms.every((t) => t.status === "published")).toBe(true)
  })

  it("guides reference existing guides", () => {
    expect(validate(terms, categories, guides)).toEqual([])
  })
})
