# konohachi-web 設計書

## 概要

Obsidianで書いた記事を自動的に公開するパーソナルWebサイト

**URL**: https://konohachi.com

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│ ローカル環境                                                      │
│                                                                  │
│  Obsidian                                                        │
│    └── yatami0/obsidian-vault (Private)                         │
│          ├── daily/          ← 日報など非公開                    │
│          ├── public/         ← 公開したい記事                    │
│          └── .github/workflows/sync-to-web.yml                  │
│                    │                                             │
└────────────────────│─────────────────────────────────────────────┘
                     │ public/ への Push を検知
                     │ 記事を転送
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ yatami0/konohachi-web (Public)                                  │
│                                                                  │
│  ├── content/        ← 転送された記事 (Markdown)                 │
│  ├── src/            ← Reactアプリケーション                     │
│  ├── public/         ← 静的アセット                              │
│  ├── package.json                                                │
│  └── ...                                                         │
│                                                                  │
└──────────────────────────│───────────────────────────────────────┘
                           │ Push 検知
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ Cloudflare Pages                                                │
│                                                                  │
│  - pnpm install && pnpm build                                   │
│  - 静的サイトをホスティング                                       │
│  - カスタムドメイン: konohachi.com                                │
│  - HTTPS 自動                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 技術スタック

### 最終構成

| カテゴリ           | 技術                           | 用途                       |
| ------------------ | ------------------------------ | -------------------------- |
| フレームワーク     | React 19                       | UI構築                     |
| 言語               | TypeScript                     | 型安全性                   |
| ビルドツール       | Vite                           | 高速な開発サーバー＆ビルド |
| パッケージ管理     | pnpm                           | 高速・省ディスク           |
| 状態管理           | Jotai                          | シンプルな状態管理         |
| データ取得         | TanStack Query                 | キャッシュ・再取得         |
| フォーム           | React Hook Form                | フォームバリデーション     |
| 認証               | ts-oidc-client                 | OIDC認証（必要時）         |
| スタイリング       | CSS Modules                    | スコープ付きCSS            |
| Linter/Formatter   | ESLint, Prettier               | コード品質                 |
| 単体テスト         | Vitest + React Testing Library | コンポーネントテスト       |
| モック             | msw, msw data                  | APIモック                  |
| コンポーネント管理 | Storybook                      | UIカタログ                 |
| VRT                | reg-suit など                  | ビジュアルリグレッション   |
| E2Eテスト          | Playwright                     | ブラウザテスト             |
| 受け入れテスト     | Gauge                          | シナリオテスト             |
| CI/CD              | GitHub Actions                 | 自動テスト・デプロイ       |
| ホスティング       | Cloudflare Pages               | 静的サイト配信             |
| DNS                | Cloudflare                     | ドメイン管理               |

---

## フェーズ別構築計画

### フェーズ1：最小構成でサイト公開 ⬅️ 今ここから

**ゴール**: konohachi.com で「Hello World」が表示される

**技術スタック**:

- React 19 + TypeScript
- Vite
- pnpm
- CSS Modules
- ESLint + Prettier

**作業内容**:

1. リポジトリのクローン

   ```bash
   git clone https://github.com/yatami0/konohachi-web.git
   cd konohachi-web
   ```

2. Vite + React + TypeScript プロジェクト初期化

   ```bash
   pnpm create vite . --template react-ts
   pnpm install
   ```

3. ESLint + Prettier 設定

   ```bash
   pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
   ```

4. 最小限のページ作成
   - トップページ（Hello World）

5. Cloudflare Pages 連携
   - GitHubリポジトリと接続
   - ビルド設定: `pnpm build`
   - 出力ディレクトリ: `dist`

6. カスタムドメイン設定
   - konohachi.com を Cloudflare Pages に紐付け

**成果物**:

- https://konohachi.com でサイトが表示される

---

### フェーズ2：Markdown記事表示

**ゴール**: Markdownファイルを記事として表示できる

**追加技術**:

- react-markdown
- remark-gfm（GitHub Flavored Markdown）
- gray-matter（Frontmatter解析）

**作業内容**:

1. Markdown関連ライブラリ追加

   ```bash
   pnpm add react-markdown remark-gfm gray-matter
   ```

2. content/ ディレクトリ構造を定義

   ```
   content/
   ├── posts/
   │   ├── hello-world.md
   │   └── my-first-post.md
   └── pages/
       └── about.md
   ```

3. Markdownファイルの読み込み機能実装

4. 記事一覧ページ、記事詳細ページ作成

5. obsidian-vault からの転送用 GitHub Actions 作成

**成果物**:

- /posts でブログ記事一覧が見える
- /posts/hello-world で記事が読める
- obsidian-vault の public/ に記事を置くと自動反映

---

### フェーズ3：開発環境強化

**ゴール**: テスト・コンポーネント管理の基盤を整える

**追加技術**:

- Vitest
- React Testing Library
- Storybook
- msw

**作業内容**:

1. Vitest + React Testing Library 設定

   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

2. Storybook 設定

   ```bash
   pnpm dlx storybook@latest init
   ```

3. msw 設定

   ```bash
   pnpm add -D msw
   ```

4. 既存コンポーネントのテスト・ストーリー作成

5. GitHub Actions でテスト自動実行

**成果物**:

- `pnpm test` でテストが走る
- `pnpm storybook` でUIカタログが見える
- PRでテストが自動実行される

---

### フェーズ4：状態管理・データ取得

**ゴール**: 複雑な状態やAPIデータを扱える

**追加技術**:

- Jotai
- TanStack Query

**作業内容**:

1. Jotai 導入

   ```bash
   pnpm add jotai
   ```

2. TanStack Query 導入

   ```bash
   pnpm add @tanstack/react-query
   ```

3. 状態管理のパターン整理
   - ローカル状態: useState
   - グローバル状態: Jotai
   - サーバー状態: TanStack Query

**成果物**:

- 状態管理の方針が確立

---

### フェーズ5：フォーム・認証（必要時）

**ゴール**: ユーザー入力や認証が必要な機能を追加できる

**追加技術**:

- React Hook Form
- ts-oidc-client

**作業内容**:

1. React Hook Form 導入

   ```bash
   pnpm add react-hook-form
   ```

2. 認証が必要なら ts-oidc-client 導入

**成果物**:

- お問い合わせフォームなど（必要なら）

---

### フェーズ6：E2E・VRT・受け入れテスト

**ゴール**: 品質を担保するテスト基盤

**追加技術**:

- Playwright
- VRT（reg-suit など）
- Gauge

**作業内容**:

1. Playwright 導入

   ```bash
   pnpm add -D @playwright/test
   npx playwright install
   ```

2. VRT 設定（Storybook + reg-suit など）

3. Gauge 導入（受け入れテスト）

4. GitHub Actions でCI統合

**成果物**:

- E2Eテストが自動実行
- UIの意図しない変更を検知
- ビジネス要件をテストで担保

---

## ディレクトリ構成（最終形）

```
konohachi-web/
├── .github/
│   └── workflows/
│       ├── ci.yml              # テスト・Lint
│       └── deploy.yml          # Cloudflare Pages連携（自動）
├── .storybook/                 # Storybook設定
├── content/                    # Markdown記事（obsidian-vaultから転送）
│   ├── posts/
│   └── pages/
├── public/                     # 静的アセット
├── src/
│   ├── components/             # UIコンポーネント
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   └── ...
│   ├── features/               # 機能単位のモジュール
│   │   ├── posts/
│   │   └── ...
│   ├── hooks/                  # カスタムフック
│   ├── lib/                    # ユーティリティ
│   ├── pages/                  # ページコンポーネント
│   ├── stores/                 # Jotai atoms
│   ├── styles/                 # グローバルスタイル
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── e2e/                    # Playwright E2Eテスト
│   └── vrt/                    # VRT設定
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Cloudflare Pages 設定

| 項目               | 値                    |
| ------------------ | --------------------- |
| リポジトリ         | yatami0/konohachi-web |
| ブランチ           | main                  |
| ビルドコマンド     | `pnpm build`          |
| 出力ディレクトリ   | `dist`                |
| Node.js バージョン | 20.x                  |
| カスタムドメイン   | konohachi.com         |

### 環境変数（必要に応じて）

```
NODE_VERSION=20
```

---

## obsidian-vault 転送設定

### ファイル: `obsidian-vault/.github/workflows/sync-to-web.yml`

```yaml
name: Sync public articles to web

on:
  push:
    paths:
      - 'public/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout obsidian-vault
        uses: actions/checkout@v4

      - name: Push to konohachi-web
        uses: cpina/github-action-push-to-another-repository@main
        with:
          source-directory: 'public'
          destination-github-username: 'yatami0'
          destination-repository-name: 'konohachi-web'
          target-directory: 'content'
          user-email: takumik9823@gmail.com
          target-branch: main
        env:
          API_TOKEN_GITHUB: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

### Personal Access Token 作成手順

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. スコープ: `repo` にチェック
4. 生成されたトークンを `obsidian-vault` の Secrets に `PERSONAL_ACCESS_TOKEN` として登録

---

## 次のアクション

**フェーズ1を開始する**

1. リポジトリをクローン

   ```bash
   git clone https://github.com/yatami0/konohachi-web.git
   cd konohachi-web
   ```

2. Vite + React + TypeScript を初期化

   ```bash
   pnpm create vite . --template react-ts
   ```

3. 設計書に沿って進める

---

## 参考リンク

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Jotai](https://jotai.org/)
- [TanStack Query](https://tanstack.com/query)
- [Vitest](https://vitest.dev/)
- [Storybook](https://storybook.js.org/)
- [Playwright](https://playwright.dev/)
- [msw](https://mswjs.io/)
