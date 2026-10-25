import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { createTermLinker } from "./term-linker"
import type { TermIndex } from "@/lib/types"

const t = (slug: string, term: string) => ({ slug, term }) as TermIndex
const terms = [
  t("abstract", "抽象"),
  t("abstract-expressionism", "抽象表現主義"),
  t("collage", "コラージュ"),
]

describe("createTermLinker", () => {
  it("links the longest match once per page and skips itself", () => {
    const linkify = createTermLinker(terms, "collage")
    const { container } = render(
      <>
        <p>{linkify("抽象表現主義と抽象、コラージュ。")}</p>
        <p>{linkify("抽象をもう一度。")}</p>
      </>
    )
    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href")
    )
    expect(hrefs).toEqual([
      expect.stringMatching(/^\/terms\/abstract-expressionism\/?$/),
      expect.stringMatching(/^\/terms\/abstract\/?$/),
    ])
    expect(container.textContent).toBe(
      "抽象表現主義と抽象、コラージュ。抽象をもう一度。"
    )
  })
})
