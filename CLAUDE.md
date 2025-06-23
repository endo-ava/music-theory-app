# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 重要：リンク先ドキュメントの必読

**Claude Codeは、このファイル内のすべてのリンク先ドキュメントを必ず読み込むこと。**
下記リンクがある箇所では、作業開始前に必ずリンク先のファイルをReadツールで読み込み、内容を把握してから作業を行うこと。

### 必読ドキュメント一覧

- `./docs/01.requirements.md` - 要件定義書
- `./docs/02.screenDesign.md` - 画面設計書(全体)
- `./docs/screenDesigns/` - 画面設計書(個別)
- `./docs/03.developmentAgreement.md` - **開発規約（最重要）**
- `./src/components/CircleOfFifths/README.md` - CircleOfFifthsコンポーネント設計
- `.github/PULL_REQUEST_TEMPLATE.md` - PRテンプレート
- `.github/ISSUE_TEMPLATE/` - Issueテンプレート群

## プロジェクト概要

音楽理論のインタラクティブ・ビジュアライゼーションアプリケーション。五度圏を中心としたUIで音楽理論の学習を支援する。

詳しくは、必読ドキュメント一覧における、[要件定義書](./docs/01.requirements.md)を参照

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

## 開発規約

**🚨 作業前に必ず読むこと：** [開発規約](./docs/03.developmentAgreement.md)

### PR/Issue作成時の規約

- ghコマンドでPRやIssueを作成する際は、以下の手順を厳守すること。

  1.  まず、リポジトリ内の適切なテンプレートファイル（`.github/` 以下にある `.md` ファイル）を探し、その内容を文字列として読み込む。
  2.  ユーザーからの指示（修正内容やバグの詳細など）に基づいて、手順1で読み込んだテンプレート文字列の各項目を埋めた**完全な本文文字列**を生成する。
  3.  `gh` コマンドを実行する際は、必ず `--body` オプションを使用し、手順2で生成した完全な本文文字列をすべて渡す。
      （例: `gh issue create --title "..." --body "（ここにテンプレートを埋めた長い本文）"`）

- コード内のコメント、PR、Issue、Reviewなどは日本語で記述すること
- commit messageは英語で記述すること

### ドキュメント更新規約

- PR作成前に、必要に応じてドキュメント(./docs)との整合性を確認し、ドキュメントを更新すること
  - 基本ドキュメントはこちら: `./docs`
  - 主要なコンポーネントのドキュメントはsrcの各階層に保存: 例. `./src/components/CircleOfFifths/README.md`
