import { describe, expect, it } from "vitest"
import { matchTerms, parseDetail, parseList } from "./fetch-exhibitions"

const term = (slug: string, name: string, aliases: string[] = []) => ({
  slug,
  term: name,
  aliases,
  status: "published",
})

describe("fetch-exhibitions", () => {
  it("parses list items", () => {
    const html = `<article class="item-article item-exhibitions"><div class="item-txt">
      <h3 class="article-title"><a href="https://artscape.jp/exhibitions/123/"><span>A &#038; B 展</span></a></h3>
      <p>某美術館<br>東京</p>
      <p>会期：2026年10月10日～2026年11月14日</p></div></article>`
    expect(parseList(html)).toEqual([
      {
        id: "123",
        url: "https://artscape.jp/exhibitions/123/",
        title: "A & B 展",
        venue: "某美術館",
        start: "2026-10-10",
        end: "2026-11-14",
      },
    ])
  })

  it("parses detail type and body", () => {
    const html = `<section class="post-content">版画<br />作品</section>
      <dt>分類</dt><dd> 企画展 </dd>`
    expect(parseDetail(html)).toEqual({ type: "企画展", text: "版画\n作品" })
  })

  it("matches longest names first, in order, without duplicates", () => {
    const terms = [
      term("abstract", "抽象"),
      term("abstract-expressionism", "抽象表現主義"),
      term("printmaking", "版画"),
      { ...term("draft", "下書き"), status: "draft" },
    ]
    expect(
      matchTerms("版画と抽象表現主義、そして抽象と版画。下書き", terms)
    ).toEqual(["printmaking", "abstract-expressionism", "abstract"])
  })
})
