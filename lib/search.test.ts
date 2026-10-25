import { describe, expect, it } from "vitest"
import { normalize, searchTerms } from "./search"
import type { TermIndex } from "./types"

const t = (slug: string, term: string, reading: string, extra = {}) =>
  ({
    slug,
    term,
    reading,
    aliases: [],
    summary: "",
    categoryIds: [],
    difficulty: 1,
    updatedAt: "2026-10-25",
    ...extra,
  }) as TermIndex

const items = [
  t("collage", "コラージュ", "こらーじゅ", { english: "Collage" }),
  t("photomontage", "フォトモンタージュ", "ふぉともんたーじゅ", {
    summary: "写真を使ったコラージュの一種",
  }),
  t("surrealism", "シュルレアリスム", "しゅるれありすむ", {
    aliases: ["超現実主義"],
  }),
]

describe("search", () => {
  it("normalizes kana, width, case and separators", () => {
    expect(normalize("コンセプチュアル・アート")).toBe(
      normalize("こんせぷちゅあるあーと")
    )
    expect(normalize("ＣＯＬＬＡＧＥ")).toBe("collage")
  })

  it("matches term, reading, english and aliases", () => {
    expect(searchTerms(items, "こらーじゅ")[0].slug).toBe("collage")
    expect(searchTerms(items, "collage")[0].slug).toBe("collage")
    expect(searchTerms(items, "超現実")[0].slug).toBe("surrealism")
  })

  it("ranks name matches above summary matches", () => {
    expect(searchTerms(items, "コラージュ").map((x) => x.slug)).toEqual([
      "collage",
      "photomontage",
    ])
  })

  it("returns nothing for unknown words", () => {
    expect(searchTerms(items, "存在しない")).toEqual([])
  })
})
