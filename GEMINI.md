# Gemini.md

This file provides guidance to Gemini CLI when working with code in this repository.

## 🚨 重要：リンク先ドキュメントの必読

**Gemini CLIは、このファイル内のすべてのリンク先ドキュメントを必ず読み込むこと。**
下記リンクがある箇所では、作業開始前に必ずリンク先のファイルをReadツールで読み込み、内容を把握してから作業を行うこと。

### 必読ドキュメント一覧

- `./docs/01.requirements.md` - 要件定義書
- `./docs/02.screenDesign.md` - 画面設計書(全体)
- `./docs/screenDesigns/` - 画面設計書(個別)
- `./docs/03.developmentAgreement.md` - **開発規約（最重要）**
- `./docs/04.domainSystem.md` - 音楽理論ドメイン設計
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

# 単体テスト実行
npm run test:run

# 単体テストカバレッジ率算出
npm run test:coverage

# Storybookテスト実行
npm run test:storybook

# 単体テストとStorybookテスト実行
npm run test:all

# Storybookビルド
npm run build-storybook
```

## 技術スタック

- **フロントエンド**: Next.js 15.x (App Router) + React 19.x + TypeScript 5.x + Shadcn/ui
- **スタイリング**: Tailwind CSS 4.x + clsx + tailwind-merge
- **アニメーション**: Framer Motion (motion) 12.x
- **状態管理**: Zustand 5.x
- **音声処理**: Tone.js 15.x
- **コード品質**: ESLint + Prettier + Husky + lint-staged

## プロジェクト構造とアーキテクチャ

本プロジェクトは、複雑で豊かなドメイン知識を正確かつ堅牢にコードへ反映させるため、ドメイン駆動設計（DDD） の思想を全面的に採用している。

音楽理論に関する中核的な概念（例: PitchClass, Interval, Scale, Chord, Keyなど）の定義や、それらの振る舞いに関するルールは、すべてこのドメイン層（src/domain ディレクトリ）に集約されている。

音楽理論に関する仕様の確認や、機能追加を行う際は、まずこのドメイン層のモデルを参照すること。各ドメインオブジェクトの責務や関係性についての詳細は、別途[音楽理論ドメイン設計書](./docs/04.domainSystem.md)にまとめられている。

### ディレクトリ構成

```
src/
├── app/                       # Next.js App Router
│   ├── page.tsx              # ルートページ
│   ├── layout.tsx            # ルートレイアウト
│   ├── library/              # ライブラリページ
│   └── tutorial/             # チュートリアルページ
├── components/               # UIコンテナ
│   ├── layouts/              # レイアウト専用コンポーネント
│   │   ├── SidePanel/        # サイドパネルレイアウト
│   │   ├── Canvas/           # メイン表示エリアレイアウト
│   │   ├── MobileBottomSheet/# モバイルボトムシートレイアウト
│   │   └── GlobalHeader/     # グローバルヘッダーレイアウト
│   └── ui/                   # shadcn/ui 用コンポーネント
├── domain/                   # ドメイン
│   ├── common/               # 共通の値オブジェクト
│   │   ├── PitchClass.md     # ピッチクラスVO
│   │   ├── Note.md           # NoteVO
│   │   ├── Interval.md       # インターバルVO
│   │   └── ScalePattern.md   # スケールパターンVO
│   ├── scale/                # スケール集約
│   ├── chord/                # コード集約
│   ├── key/                  # キー集約
│   └── services/             # ドメインサービス
├── features/                 # 機能Feature
│   ├── view-controller/      # Hub切り替え機能
│   ├── circle-of-fifths/     # 五度圏機能
│   │   ├── README.md         # コンポーネント設計書
│   │   ├── index.ts          # エクスポート統合
│   │   ├── components/       # UIコンポーネント
│   │   ├── __stories__/      # Storybookストーリー
│   │   ├── animations.ts     # アニメーション定義
│   │   ├── constants/        # 定数定義
│   │   ├── hooks/            # カスタムフック
│   │   ├── store/            # 状態管理（Zustand）
│   │   ├── types.ts          # ローカル型定義
│   │   └── utils/            # ユーティリティ関数
│   └── chromatic-circle/     # クロマチック機能
├── shared/                   # 共通要素
│   ├── components/           # 共通コンポーネント
│   │   └── icons/          　# SVGアイコン
│   ├── hooks/                # 共通フックス
│   ├── constants/            # 共通定数
│   ├── types/                # 共通型定義
│   └── utils/                # 共通ユーティリティ
├── stores/                   # グローバル状態管理
└── test/                     # テスト設定
docs/                         # 設計書・要件定義
```

## 開発規約

**🚨 作業前に必ず読むこと：** [開発規約](./docs/03.developmentAgreement.md)

### PR/Issue作成時の規約

- ghコマンドでPRやIssueを作成する際は、以下の手順を厳守すること。

  1.  まず、リポジトリ内の適切なテンプレートファイル（`.github/` 以下にある `.md` ファイル）を探し、その内容を文字列として読み込む。
  2.  ユーザーからの指示（修正内容やバグの詳細など）に基づいて、手順1で読み込んだテンプレート文字列の各項目を埋めた**完全な本文文字列**を生成する。
  3.  `gh` コマンドを実行する際は、必ず `--body` オプションを使用し、手順2で生成した完全な本文文字列をすべて渡す。
      （例: `gh issue create --title "..." --body "（ここにテンプレートを埋めた長い本文）"`）

- **例外手順:** `gh` コマンドや `git commit` 実行時に、本文が長すぎることが原因でツールがコマンドを拒否する場合がある。その際は、本文を一時ファイルに書き出し、`--body-file` (gh) や `-F` (git) オプションでファイルを指定して実行すること。

- コード内のコメント、PR、Issue、Reviewなどは日本語で記述すること
- commit messageは英語で記述すること

### ドキュメント更新規約

- PR作成前に、必要に応じてドキュメント(./docs)との整合性を確認し、ドキュメントを更新すること
  - 基本ドキュメントはこちら: `./docs`
  - 主要なコンポーネントのドキュメントはsrcの各階層に保存:
    - Features: `./src/features/circle-of-fifths/README.md`
    - UI Containers: `./src/components/layouts/SidePanel/README.md`

### PRレビュー対応について

- github copilot等からレビューをもらうことがあるが、これは必ずしも鵜呑みにするのではなく、対応方針を自身で判断すること。柔軟に考え、対応不要と判断してもよい。ただしその場合はその理由を伝えること

### Playwright MCP スクリーンショット設定

#### 基本方針

- 常に全画面（full_page: true）でスクリーンショットを取得する
- ファイルサイズを最小化するため、品質とサイズを調整する
- レスポンストークンサイズを制限内に収める

#### スクリーンショット実行時の指示

1. まずビューポートサイズを設定。何も指示が無ければ、1920x1080と設定する：

```
playwright:browser_set_viewport_size(width: 1920, height: 1080)
```

2. 以下の設定で全画面スクリーンショットを取得：

```
playwright:browser_take_screenshot(
  filename: "[descriptive_name].jpg",
  full_page: true,
  quality: 70,
  type: "jpeg",
  raw: false
)
```

#### 下記に一般的な画面サイズを記載する。例えば「スマホサイズで」と指示されたら下記のスマートフォンのサイズを設定する。

- スマートフォン（一般的なサイズ）  
  playwright:browser_set_viewport_size(width: 360, height: 800)
- タブレット（10インチ）  
  playwright:browser_set_viewport_size(width: 800, height: 1280)
- FHD  
  playwright:browser_set_viewport_size(width: 1920, height: 1080)
- WQHD (2K)  
  playwright:browser_set_viewport_size(width: 2560, height: 1440)
- 4K  
  playwright:browser_set_viewport_size(width: 3840, height: 2160)
- ウルトラワイド  
  playwright:browser_set_viewport_size(width: 3440, height: 1440)
