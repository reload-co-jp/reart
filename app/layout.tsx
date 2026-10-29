import Link from "next/link"
import type { Metadata, Viewport } from "next"
import { Footer, Header, Main } from "@/components/elements/layout"
import { color, font } from "@/components/theme"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import {
  Cormorant_Garamond,
  Noto_Sans_JP,
  Shippori_Mincho,
} from "next/font/google"
import Script from "next/script"
import "./reset.css"

const notoSansJp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
})

// 見出し用: 欧文は Cormorant、和文は Shippori Mincho
const shipporiMincho = Shippori_Mincho({
  weight: ["500", "700"],
  variable: "--font-shippori-mincho",
  display: "swap",
  preload: false,
})

const cormorant = Cormorant_Garamond({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
})

const GA_ID = "G-6P78M1W5D8"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: "%s｜ReArt" },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: color.bg,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${shipporiMincho.variable} ${cormorant.variable}`}
    >
      <body
        style={{
          background: color.bg,
          color: color.text,
          fontFamily: font.sans,
          lineHeight: 1.6,
          WebkitTextSizeAdjust: "100%",
        }}
      >
        <Header />
        <Main>{children}</Main>
        <Footer>
          <p>
            &copy; ReArt｜美術用語辞典 —
            美術館の言葉がわかる、美術鑑賞のための辞典。
          </p>
          <p>
            <Link href="/about/" style={{ color: "inherit" }}>
              このサイトについて
            </Link>
          </p>
        </Footer>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  )
}
export default RootLayout
