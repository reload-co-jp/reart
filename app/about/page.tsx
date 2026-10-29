import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/seo"
import { font, size, space, styles, width } from "@/components/theme"

export const metadata: Metadata = {
  title: "このサイトについて",
  description:
    "ReArtは、美術館で出会うなじみのない美術用語を事前に知り、作品を文脈や背景とともに鑑賞するための学習用の辞典です。",
  alternates: { canonical: "/about/" },
}

const AboutPage = () => (
  <div style={styles.container}>
    <Breadcrumbs items={[{ name: "このサイトについて", path: "/about/" }]} />
    <h1
      style={{
        fontFamily: font.serif,
        fontSize: size.xl,
        marginBottom: space.lg,
      }}
    >
      このサイトについて
    </h1>
    <div style={{ lineHeight: 2, maxWidth: width.text }}>
      <p style={{ marginBottom: space.md }}>
        美術館に行くと、作品の解説を読んでも、なじみのないカタカナの言葉が並んでいて戸惑うことがあります。
      </p>
      <p style={{ marginBottom: space.md }}>
        作品は、それが生まれた時代や動向、使われた技法や素材といった文脈や背景を知ることで、より深く味わえるようになります。ReArtは、そうした言葉を鑑賞の前に知っておくための、勉強用の美術用語辞典としてつくりました。
      </p>
      <p>
        <Link href="/terms/" style={styles.link}>
          用語一覧
        </Link>
        や
        <Link href="/guides/" style={styles.link}>
          学習ガイド
        </Link>
        から、気になる言葉を調べてみてください。
      </p>
    </div>
  </div>
)

export default AboutPage
