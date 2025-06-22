# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

音楽理論のインタラクティブ・ビジュアライゼーションアプリケーション。五度圏を中心としたUIで音楽理論の学習を支援する。

[要件定義書はこちらのリンク](./docs/01.requirements.md)

[画面設計書(全体)はこちらのリンク](./docs/02.screenDesign.md)

[画面設計書(個別)はこちらのリンク](./docs/screenDesigns/)

## 基本的な開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint

# コードフォーマット
npm run format

# フォーマットチェック
npm run format:check
```

## 技術スタック

- **フロントエンド**: Next.js 15.x (App Router) + React 19.x + TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x + clsx + tailwind-merge
- **アニメーション**: Framer Motion (motion) 12.x
- **状態管理**: Zustand 5.x
- **音声処理**: Tone.js 15.x
- **コード品質**: ESLint + Prettier + Husky + lint-staged

## プロジェクト構造とアーキテクチャ

### ディレクトリ構成
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ルートページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── library/           # ライブラリページ
│   └── tutorial/          # チュートリアルページ
├── components/            # 再利用可能コンポーネント
│   └── CircleOfFifths/   # 五度圏コンポーネント（メインUI）
├── store/                # Zustandストア
├── types/                # TypeScript型定義
└── docs/                 # 設計書・要件定義
```

### コンポーネント設計パターン

[CircleOfFifthsコンポーネントの詳細設計はこちらのリンク](./src/components/CircleOfFifths/README.md)



### 状態管理アーキテクチャ

- **Zustandストア** (`circleOfFifthsStore.ts`)
  - `selectedKey`: 現在選択されているキー
  - `hoveredKey`: ホバー中のキー
  - `isPlaying`: 音声再生状態

- **型安全性**: `@/types/circleOfFifths.ts`でアプリケーション全体の型を定義



## 開発規約

[開発規約はこちらのリンク](./docs/03.developmentAgreement.md)

## 注意点

- コード内のコメント、PR、Issue、Reviewなどは日本語で記述すること
- commit messageは英語で記述すること
- PRやIssueは必ずテンプレートを使うこと
- PR作成前に、必要に応じてドキュメント(./docs)との整合性を確認し、ドキュメントを更新すること
  - 基本ドキュメントはこちら: `./docs`
  - 主要なコンポーネントのドキュメントはsrcの各階層に保存: 例. `./src/components/CircleOfFifths/README.md`