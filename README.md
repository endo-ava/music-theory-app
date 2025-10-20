# Music Theory App

[![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://music-theory-app-phi.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8.svg)](https://tailwindcss.com/)

**音楽理論の概念とその相互関係を探求するためのインタラクティブ・ビジュアライゼーションツール**

視覚的なグラフィック表現と聴覚的なフィードバックを組み合わせることで、抽象的な理論を具体的で感覚的な体験へと転換します。

## 概要 (Overview)

Music Theory Appは、音楽理論の複雑な構造を直感的に理解するための可視化プラットフォームです。従来の教科書的なアプローチではなく、インタラクティブな視覚表現と音響フィードバックを通じて、理論概念の「つながり」と「構造」を体験的に学習できます。

五度圏やクロマチックサークルといった伝統的な可視化手法を基盤としながら、レイヤーシステムによる複数の理論概念の重ね合わせ表示により、調性・スケール・コード進行の関係性を多層的に探求できます。

### コアコンセプト

- **「視覚化による構造理解」**: 音楽理論の抽象的な関係性を、空間的・視覚的な配置で具体化
- **「レイヤー思考」**: ダイアトニックコード、スケール構成音、近親調などを重ね合わせて表示し、理論の多層的な構造を可視化
- **「体験的学習」**: 見るだけでなく、聴く・操作することで、理論と音響体験を統合

## 主要機能 (Features)

### Hub画面（実装途中）

#### ビジュアライゼーション

- **五度圏 (Circle of Fifths)**: 調性間の関係を完全五度の円環構造で可視化
- **クロマチックサークル**: 12音階の半音関係を円環上に配置
- **切り替え表示**: 五度圏とクロマチックサークルを動的に切り替え可能

#### レイヤーシステム

- **ダイアトニックコード**: 選択した調のダイアトニック和音を表示
- **スケール構成音**: スケールを構成する音を視覚的にハイライト
- **近親調**: 主要な近親調の関係を表示
- 複数レイヤーの同時表示による多層的な理論理解

#### インタラクション

- **ベースキー選択**: 任意の調を基準として設定
- **ディグリーネーム表示**: ローマ数字によるコード機能の表示
- **コントローラーパネル**: 直感的な操作インターフェース
- **インフォメーションパネル**: 選択要素の詳細情報を表示

#### 音響フィードバック

- **Tone.js統合**: 基本和音の音声再生
- **リアルタイム再生**: 選択したコードを即座に聴覚確認

### Library画面（仮実装）

- 音楽理論用語辞書（将来実装予定）

### Tutorial画面（仮実装）

- 物語形式の学習コンテンツ（将来実装予定）

## 技術スタック (Technology Stack)

### アプリケーション本体

| 技術              | バージョン | 用途                             |
| :---------------- | :--------- | :------------------------------- |
| **Next.js**       | 15.5+      | App Routerベースのフレームワーク |
| **React**         | 19.0       | UI構築・Server/Client Component  |
| **TypeScript**    | 5.8+       | 型安全な開発環境                 |
| **Tailwind CSS**  | 4.1+       | ユーティリティファーストCSS      |
| **Zustand**       | 5.0+       | 軽量グローバル状態管理           |
| **Tone.js**       | 15.1+      | Web Audio API抽象化・音声処理    |
| **Framer Motion** | 12.18+     | アニメーションライブラリ         |
| **shadcn/ui**     | 最新版     | アクセシブルなUIコンポーネント   |

### 開発ツール

| 技術            | 用途                             |
| :-------------- | :------------------------------- |
| **ESLint**      | コード品質チェック               |
| **Prettier**    | コードフォーマット               |
| **Vitest**      | 単体テストフレームワーク         |
| **Storybook**   | コンポーネント開発・ドキュメント |
| **Husky**       | Gitフック管理                    |
| **lint-staged** | ステージングファイルのLint       |

## プロジェクト構成 (Project Structure)

```
music-theory-app/
├── src/
│   ├── app/                      # Next.js App Router: ページとルーティング
│   ├── components/               # 共通UIコンポーネント
│   │   ├── ui/                   # shadcn/ui由来のプリミティブコンポーネント
│   │   └── layouts/              # レイアウトコンポーネント
│   ├── features/                 # 機能単位のモジュール
│   │   ├── circle-of-fifths/     # 五度圏表示機能
│   │   ├── chromatic-circle/     # クロマチックサークル機能
│   │   ├── key-controller/       # キー選択コントローラー
│   │   ├── layer-controller/     # レイヤー制御機能
│   │   ├── information-panel/    # 情報パネル
│   │   └── view-controller/      # ビュー切り替え機能
│   ├── domain/                   # ドメイン層: 音楽理論ロジック
│   │   ├── common/               # 値オブジェクト (PitchClass, Note, Interval等)
│   │   ├── scale/                # Scale集約
│   │   ├── chord/                # Chord集約
│   │   ├── key/                  # Key集約
│   │   ├── modal-context/        # ModalContext集約
│   │   └── services/             # ドメインサービス (AudioEngine, ChordAnalyzer等)
│   ├── shared/                   # 共通ユーティリティ・型定義
│   └── stores/                   # グローバル状態管理
├── docs/                         # プロジェクトドキュメント
│   ├── 00.project/               # プロジェクト基本情報・要件定義
│   ├── 10.domain/                # ドメイン知識・音楽理論ガイド
│   ├── 20.development/           # 開発ガイドライン・設計原則
│   ├── 30.quality/               # 品質管理・テスト戦略
│   ├── 70.knowledge/             # ナレッジベース
│   └── 80.dailyReport/           # 開発日報
├── .storybook/                   # Storybook設定
├── .github/                      # GitHub設定（Issue/PRテンプレート）
├── package.json                  # 依存関係とスクリプト
└── CLAUDE.md                     # AIアシスタント向けプロジェクトガイド
```

### アーキテクチャ (Architecture)

本プロジェクトは**クリーンアーキテクチャ**の原則に基づき、**DDD（ドメイン駆動設計）の戦術的パターン**と**Feature Sliced Design**を組み合わせた構成を採用しています：

```
[Presentation] app/, components/, features/
        ↓
[Application] features/内のhooks, stores/
        ↓
[Domain] domain/ (音楽理論ロジック)
        ↓
[Shared] shared/
```

**特徴**:

- 明確な責務分離（各層が独立してテスト可能）
- 依存性の一方向性（外側 → 内側）
- DDD戦術的パターン（値オブジェクト、集約、ドメインサービス）による複雑なドメインモデルの実装

---

## ドキュメント (Documentation)

プロジェクトの詳細なドキュメントは [`docs/`](docs/) ディレクトリに体系的に整理されています：

- **プロジェクト基本情報**: 要件定義、画面設計
- **ドメイン設計**: 音楽理論ガイドブック、ドメインモデル
- **開発ガイドライン**: コーディング規約、設計原則、アーキテクチャ
- **品質・プロセス**: テスト戦略、Git/PR運用

## リンク (Links)

- https://music-theory-app-phi.vercel.app/
