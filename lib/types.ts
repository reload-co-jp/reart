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
  // note: 出典が見つからなかった場合などの確認メモ。参考情報欄に表示する
  verification: {
    status: "unverified" | "verified"
    checkedAt?: string
    note?: string
  }
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

// 美術館 API から取得した作品（data/artworks.json）。`pnpm artworks` で登録する。
// 利用条件（CC0 / Public Domain）を確認できた作品だけを保存する。
export type Artwork = {
  id: string // `${source}:${sourceId}`
  source: "met" | "cma"
  sourceId: string
  title: string
  artist: string
  date: string
  museum: string
  description: string
  imageUrl: string
  localImagePath?: string // public/ 以下の画像パス。未取得なら無し
  sourceUrl: string
  rights: string
  downloadedAt?: string
  error?: string // 画像取得エラー。`pnpm artworks refresh` で再試行
}

// 用語と作品の紐付け（data/term-artworks.json、用語 slug → 配列順 = 表示順）
export type TermArtwork = {
  artworkId: string
  keyword: string
  reason: string
  unchecked?: boolean // `collect` で自動収集した未確認の候補
}

export type Exhibition = {
  slug: string
  title: string
  description: string
  // 開催日が決まっているイベントの開催情報
  event?: { date: string; venue: string; price: string; url: string }
  terms: { slug: string; note?: string }[]
}
