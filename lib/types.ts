// 用語データの型。data/ 以下の JSON はこの形に従う。

export type Difficulty = 1 | 2 | 3

export type Source = {
  title: string
  url?: string
  publisher?: string
}

export type Example = {
  description: string
  // 実在作品を載せる場合のみ。作者・制作年・所蔵先・出典を確認してから登録する。
  work?: {
    title: string
    artist: string
    year?: string
    collection?: string
    source: Source
  }
}

export type Term = {
  slug: string
  term: string
  reading: string
  english?: string
  aliases: string[]
  summary: string
  definition: string
  artUsage?: string
  generalDifference?: string
  confusables?: { slug: string; note: string }[]
  categoryIds: string[]
  difficulty: Difficulty
  examples: Example[]
  viewingTips: string[]
  museumUsage?: string
  museumExample?: string
  relatedTerms: string[]
  prerequisiteTerms: string[]
  sources: Source[]
  verification: { status: "unverified" | "verified"; checkedAt?: string }
  status: "published" | "draft"
  createdAt: string
  updatedAt: string
}

export type Category = {
  slug: string
  name: string
  description: string
  featuredTerms: string[]
}

export type Guide = {
  slug: string
  title: string
  description: string
  steps: { slug: string; note?: string }[]
  nextGuides: string[]
}

// クライアントへ渡す軽量版（一覧・検索・保存用語で使う）
export type TermIndex = Pick<
  Term,
  | "slug"
  | "term"
  | "reading"
  | "english"
  | "aliases"
  | "summary"
  | "categoryIds"
  | "difficulty"
  | "updatedAt"
>

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "入門",
  2: "基本",
  3: "発展",
}
