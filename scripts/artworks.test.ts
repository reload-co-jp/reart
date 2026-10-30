import { describe, expect, it } from "vitest"
import { fromCma, fromWikidata, toQuery } from "./artworks"

describe("artworks", () => {
  it("keeps only CC0 Cleveland works with an image", () => {
    const d = {
      id: 1,
      share_license_status: "CC0",
      title: "T",
      creators: [{ description: "A (1800–1900)" }],
      description: "<p>desc</p>",
      images: { web: { url: "https://x/1.jpg" } },
      url: "https://clevelandart.org/art/1",
    }
    expect(fromCma(d)).toMatchObject({ sourceId: "1", description: "desc" })
    expect(fromCma({ ...d, share_license_status: "Copyrighted" })).toBe(
      undefined
    )
    expect(fromCma({ ...d, images: null })).toBe(undefined)
  })

  it("keeps only Wikidata works whose Commons image is PD or CC0", () => {
    const r = {
      image: { value: "x" },
      title: { value: "T" },
      year: { value: "1872" },
    }
    const c = { url: "https://upload.wikimedia.org/a.jpg", license: "pd" }
    expect(fromWikidata("Q1", r, c)).toMatchObject({
      sourceId: "Q1",
      date: "1872",
      rights: "Public Domain（Wikimedia Commons）",
    })
    expect(fromWikidata("Q1", r, { ...c, license: "cc-by-sa-4.0" })).toBe(
      undefined
    )
    expect(fromWikidata("Q1", r, undefined)).toBe(undefined)
  })

  it("builds a search query from the english name", () => {
    expect(toQuery("Blank space / Negative space")).toBe("Blank space")
    expect(toQuery("Matière (仏)")).toBe("Matière")
  })
})
