# CLAUDE.md

## 用語の追加（data/terms/*.json）

用語を追加・更新するときは、必ず出典を探し、その内容を本文に反映する。

1. **出典を探す**: 辞書に加え、美術大学・美術専門メディアの資料も探し、見つかったものは併記する（1語につき1〜3件）。
   - artscape アートワード（現代美術用語辞典）: 主に現代美術・概念・動向の用語。`https://artscape.jp/?s=<語>` で検索し、結果のうち `https://artscape.jp/artword/<数字ID>/` のページを開いて見出し語が一致するか確認する（URLから語は推測できない）。
   - 武蔵野美術大学 造形ファイル: 主に素材・道具・技法の用語。`https://zokeifile.musabi.ac.jp/<見出し語>/` で直接引けるほか、`https://zokeifile.musabi.ac.jp/wp-json/wp/v2/search?search=<語>` で検索できる。
   - コトバンク: `https://kotobank.jp/word/<語>` で引く。カタカナ語は404になりやすいので、ひらがなに直し（`・`を除去、小書き文字は大きく: `インスタレーション` → `いんすたれーしよん`）て再試行する。
   - 採用する辞書は 日本大百科全書(ニッポニカ) → 百科事典マイペディア → ブリタニカ国際大百科事典 小項目事典 → 改訂新版 世界大百科事典 の順。同名の別項目（人名・神話・雑誌など）を取り違えないよう、美術の意味の解説かを必ず確かめる。
   - 該当がなければ Tate Art Terms（`https://www.tate.org.uk/art/art-terms/<頭文字>/<slug>`）。
   - URLは実際に開いて内容を読んだ個別ページのみ。トップページや `example.com` などの仮URLは使わない。
2. **本文に反映する**: `definition` に、出典に書かれた事実（来歴・提唱者・年代・語源など）を盛り込む。出典にない事実は書かない。文体は既存の用語と同じ「です・ます」調。
3. **`sources` に記載する**
   - コトバンク: `{ "title": "「<見出し語>」<辞書名>", "url": "<ページURL>", "publisher": "コトバンク" }`
   - Tate: `{ "title": "Art Term「<英語名>」", "url": "<ページURL>", "publisher": "Tate" }`
   - artscape: `{ "title": "現代美術用語辞典「<見出し語>」", "url": "<ページURL>", "publisher": "artscape" }`
   - 造形ファイル: `{ "title": "造形ファイル「<見出し語>」", "url": "<ページURL>", "publisher": "武蔵野美術大学" }`
4. **`verification` を設定する**: 確認したら `{ "status": "verified", "checkedAt": "<YYYY-MM-DD>" }`。出典が見つからなかった場合は `sources: []` とし、`note` にその旨を書いて verified にする（`note` は参考情報欄に表示される）。
   - 例: `"note": "主要な辞典・用語集（コトバンク、artscape、造形ファイル、Tate Art Terms）を確認しましたが、この用語を美術の意味で解説した出典は見つかりませんでした。本文は編集部の記述によるものです。"`
5. JSONは既存ファイルの書式を保ったまま編集し、`npx prettier --write` と `npx vitest run` で確認する。
