# konohachi-web

Markdownベースのブログサイト

## 技術スタック

### コア技術

| 技術 | バージョン | 選定理由 |
|------|-----------|----------|
| **React** | 19 | Concurrent Renderingによる高速なUI更新、Activity APIによるプリレンダリング対応、業界標準のUIライブラリ |
| **TypeScript** | 5.9 | 静的型付けによるバグの早期発見、IDEの補完・リファクタリング支援、ドキュメントとしての型定義 |
| **Vite** | 7 | ESM Native対応による高速な開発サーバー起動、HMRの即時反映、将来的にRolldownへの移行でさらなる高速化 |
| **React Router** | 7 | React公式推奨のルーティングライブラリ、将来的なSSG/SSR対応（Framework Mode）への拡張性 |

### Markdown処理

| 技術 | 選定理由 |
|------|----------|
| **react-markdown** | ReactコンポーネントとしてMarkdownをレンダリング、`dangerouslySetInnerHTML`を使わない安全な実装、remarkプラグインによる拡張性 |
| **remark-gfm** | GitHub Flavored Markdown対応（テーブル、タスクリスト、取り消し線など）、開発者に馴染みのある記法 |
| **gray-matter** | YAML/JSON/TOMLフロントマター対応、Gatsby・Next.js・Astro等で広く採用された実績、柔軟なカスタムパーサー対応 |

### スタイリング

| 技術 | 選定理由 |
|------|----------|
| **CSS Modules** | スコープ付きスタイルで命名衝突を防止、ランタイムコストゼロ、CSS-in-JSのようなJSバンドル肥大化なし |
| **CSS変数** | テーマ切り替え対応、一貫したデザイントークン管理、ブラウザネイティブで追加ライブラリ不要 |

### 開発ツール

| 技術 | 選定理由 |
|------|----------|
| **pnpm** | 高速なパッケージインストール、ディスク効率の良いハードリンク、厳格な依存関係管理 |
| **ESLint** | コード品質の統一、潜在的バグの早期発見 |
| **Prettier** | コードフォーマットの自動化、レビュー時のスタイル議論を排除 |

## 起動方法

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# プロダクションビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

## プロジェクト構成

```
src/
├── main.tsx                 # エントリーポイント
├── App.tsx                  # RouterProviderの設定
├── router.tsx               # ルーティング定義
├── lib/
│   └── markdown.ts          # Markdown記事のパース処理
├── components/
│   ├── Layout/              # ヘッダー・フッターを含むレイアウト
│   ├── Markdown/            # Markdownレンダラー
│   └── common/
│       ├── Container/       # レスポンシブコンテナ
│       └── Typography/      # 見出し・テキストコンポーネント
├── features/
│   └── posts/
│       ├── types.ts         # Post型定義
│       └── components/
│           ├── PostList/    # 記事一覧グリッド
│           └── PostCard/    # 記事カード
├── pages/
│   ├── HomePage/            # トップページ（記事一覧）
│   └── PostPage/            # 記事詳細ページ
└── styles/
    ├── global.css           # グローバルスタイル
    └── variables.css        # CSS変数
content/
└── posts/                   # Markdown記事ファイル
    └── *.md
```

## 設計思想

### Feature-Sliced Design (FSD)

[Feature-Sliced Design](https://feature-sliced.design/)を採用し、機能ごとにコードを分離しています。

**採用理由:**
- 機能単位での分離により、変更の影響範囲を局所化
- 依存関係の方向を一方向に保ち、循環参照を防止
- チーム開発時のコンフリクト軽減
- 2026年のフロントエンドトレンドでも推奨されるアーキテクチャ

**レイヤー構成:**
- `features/` - 機能単位のモジュール（posts など）
- `components/` - 汎用UIコンポーネント（Layout, Markdown, common）
- `pages/` - ルーティングに対応するページコンポーネント
- `lib/` - ユーティリティ・ヘルパー関数

### ビルド時記事読み込み

Viteの`import.meta.glob`を使用し、ビルド時にMarkdownファイルを静的に読み込みます。

**メリット:**
- サーバーサイドのAPI不要
- 静的サイトホスティング対応（Cloudflare Pages, Vercel, Netlify等）
- バンドルに記事データが含まれるため初期表示が高速

**現状の制約:**
- クライアントサイドでフロントマターをパースするため、`gray-matter`のNode.js依存（Buffer）をポリフィルで対応中

### コンポーネント設計

- 各コンポーネントはディレクトリ単位で管理（Colocation）
- `index.ts`によるバレルエクスポートで明確な公開API
- CSS Modulesによるスタイルのスコープ化

## 将来的な技術ロードマップ

### Phase 1: SSG対応（推奨）

**目的:** SEO改善、初期表示速度の向上、バンドルサイズ削減

| 変更内容 | 効果 |
|----------|------|
| React Router v7 Framework Mode採用 | ビルド時にHTMLを生成、Lighthouse 99+達成可能 |
| gray-matterをビルド時のみ使用 | Bufferポリフィル不要、バンドルサイズ削減 |
| Pre-rendering設定 | `/`, `/posts/:slug`をSSGで事前生成 |

```ts
// react-router.config.ts（将来の設定例）
export default {
  ssr: false,
  async prerender() {
    const posts = await getPostSlugs()
    return ['/', ...posts.map(slug => `/posts/${slug}`)]
  }
}
```

### Phase 2: コンテンツ拡張

| 技術 | 用途 |
|------|------|
| **MDX** | Markdownにreactコンポーネントを埋め込み、インタラクティブな記事作成 |
| **rehype-highlight / Shiki** | シンタックスハイライト（コードブロックの見た目改善） |
| **rehype-slug + rehype-autolink-headings** | 見出しへのアンカーリンク自動生成 |

### Phase 3: パフォーマンス最適化

| 技術 | 用途 |
|------|------|
| **Dynamic Import** | 記事ページの遅延読み込み、初期バンドル削減 |
| **Image Optimization** | 画像の自動最適化（WebP/AVIF変換、レスポンシブ画像） |
| **Service Worker** | オフライン対応、キャッシュ戦略 |

### Phase 4: 機能拡張（検討中）

| 機能 | 技術候補 |
|------|----------|
| **検索機能** | Pagefind（静的サイト向け全文検索） |
| **ダークモード** | CSS変数によるテーマ切り替え |
| **コメント機能** | Giscus（GitHub Discussions連携） |
| **RSS/Atom** | ビルド時にフィード生成 |
| **OGP画像自動生成** | Satori + Resvg |

## 技術選定の代替案と比較

### フレームワーク比較

| 選択肢 | 採用/不採用 | 理由 |
|--------|-------------|------|
| **Vite + React Router** | 採用 | シンプル、学習コスト低、必要に応じてSSG拡張可能 |
| Next.js | 不採用 | 高機能だがオーバースペック、App Routerの学習コスト、Vercelへのロックイン懸念 |
| Astro | 不採用 | コンテンツサイトに最適だが、将来的なアプリ化時の制約 |
| Gatsby | 不採用 | GraphQL必須でアーキテクチャが複雑、ビルド時間の懸念 |

### フロントマターパーサー比較

| 選択肢 | 採用/不採用 | 理由 |
|--------|-------------|------|
| **gray-matter** | 採用 | 業界標準、豊富なドキュメント、YAML/JSON/TOML対応 |
| front-matter | 不採用 | 軽量だが機能が限定的 |
| @11ty/gray-matter | 検討中 | eval削除版でセキュリティ向上、SSG移行時に検討 |

### スタイリング比較

| 選択肢 | 採用/不採用 | 理由 |
|--------|-------------|------|
| **CSS Modules** | 採用 | ゼロランタイム、シンプル、学習コスト低 |
| Tailwind CSS | 不採用 | ユーティリティファーストは好みが分かれる、HTML肥大化 |
| styled-components | 不採用 | ランタイムコスト、SSR時の複雑さ |
| vanilla-extract | 検討中 | 型安全なCSS、将来的に検討 |

## 記事の追加方法

`content/posts/`に新しいMarkdownファイルを作成します。

```markdown
---
title: 記事タイトル
date: '2025-01-21'
excerpt: 記事の概要（任意）
---

記事の本文...
```

## ルーティング

| パス | ページ | レンダリング |
|------|--------|--------------|
| `/` | トップページ（記事一覧） | CSR（将来: SSG） |
| `/posts/:slug` | 記事詳細ページ | CSR（将来: SSG） |

## 参考リンク

- [React Router Pre-Rendering](https://reactrouter.com/how-to/pre-rendering)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vite Static Site Generation](https://github.com/Daydreamer-riri/vite-react-ssg)
- [react-markdown](https://github.com/remarkjs/react-markdown)
