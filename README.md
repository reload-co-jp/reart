# ReArt｜美術用語辞典

美術館で出会うなじみのない美術用語を事前に知り、作品を文脈や背景とともに鑑賞するための学習用の辞典です。

https://reart.reload.co.jp

## 主な機能

- **用語辞典** - カテゴリ別の美術用語。各用語に出典（コトバンク、artscape、武蔵野美術大学 造形ファイル、Tate など）を併記
- **ガイド** - テーマに沿って用語を順にたどる学習ページ
- **展覧会** - 開催中の展覧会と、その解説に出てくる用語の紐付け
- **関連作品** - The Met / Cleveland Museum of Art のパブリックドメイン（CC0）作品画像
- **保存** - 気になる用語をブラウザに保存

## 技術スタック

- Next.js 16（App Router / Static Export）
- React 19 / TypeScript 5
- Vitest + Testing Library
- ESLint 9 / Prettier 3

## 開発

```bash
pnpm install
pnpm dev
```

| コマンド                  | 説明                                        |
| ------------------------- | ------------------------------------------- |
| `pnpm dev`                | 開発サーバーを起動                          |
| `pnpm build`              | 静的サイトをビルド（`/out` に出力）         |
| `pnpm test`               | テストを実行                                |
| `pnpm lint`               | ESLint を実行                               |
| `pnpm typecheck`          | 型チェック                                  |
| `pnpm format`             | Prettier でフォーマット                     |
| `pnpm fetch:exhibitions`  | artscape から開催中の展覧会と関連用語を取得 |
| `pnpm artworks <command>` | 用語に関連する作品を検索・登録（下記参照）  |

### 作品の登録

```bash
pnpm artworks search <slug> [keyword] [--page N]   # 候補を検索
pnpm artworks add <slug> <artworkId> <keyword> [理由]
pnpm artworks remove <slug> <artworkId>
pnpm artworks refresh [artworkId]                  # 画像を再取得
pnpm artworks collect                              # 全用語に未確認の候補を登録
```

利用条件を確認できた CC0 / パブリックドメインの作品のみ保存します。

## ディレクトリ構成

```
.
├── app/                 # ページ（terms, categories, guides, exhibitions, saved, about）
├── components/          # UI コンポーネント
├── lib/                 # データ読み込み・検索・サイト設定
├── data/
│   ├── terms/*.json     # 用語（カテゴリごと）
│   ├── categories.json
│   ├── guides.json
│   ├── exhibitions.json
│   ├── current-exhibitions.json
│   ├── artworks.json
│   └── term-artworks.json
├── public/artworks/     # 作品画像
└── scripts/             # データ取得スクリプト
```

## 用語の追加

`data/terms/*.json` を編集します。出典の探し方・記載方法・`verification` の書き方は [CLAUDE.md](./CLAUDE.md) を参照してください。編集後は `pnpm format` と `pnpm test` で確認します。

## デプロイ

main ブランチへの push で GitHub Actions が GitHub Pages にデプロイします。

## ライセンス

ISC
