import type { Metadata } from "next"

export const SITE_URL = "https://reart.reload.co.jp"
export const SITE_NAME = "ReArt｜美術用語辞典"
export const SITE_DESCRIPTION =
  "美術館の言葉がわかる、美術鑑賞のための辞典。テキスタイル、コンテンポラリー、インスタレーションなど、美術館の解説で出会う専門用語を初心者向けにわかりやすく解説します。"
export const OG_IMAGE = "/og.png"

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`

// ページ単位の title / description / canonical / OGP。
// 子ページで openGraph を指定すると親の値は丸ごと置き換わるため、毎回すべて指定する。
export const pageMeta = ({
  title,
  description = SITE_DESCRIPTION,
  path,
  type = "website",
}: {
  title?: string
  description?: string
  path: string
  type?: "website" | "article"
}): Metadata => ({
  ...(title && { title }),
  description,
  alternates: { canonical: path },
  openGraph: {
    type,
    url: path,
    title: title ? `${title}｜ReArt` : SITE_NAME,
    description,
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
})
