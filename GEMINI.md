# Harmonic Orbit

# 概要

- **目的**: 複雑な音楽理論の概念と、その相互関係を探求するための**インタラクティブ・ビジュアライゼーションツール**。
- **機能**: 視覚的なグラフィック表現と聴覚的なフィードバックを組み合わせ、抽象的な理論を具体的で感覚的な体験へと転換。
- **思想**: 音楽理論を、単なる知識ではなく、体感できる対象として提供する探求装置。
- 詳しくは要件定義書(`docs/00.project/0001.requirements.md`)を参照

# 現状機能

- **Circle画面（実装途中）**:
  - 五度圏（Circle of Fifths）とクロマチックサークルの切り替え表示
  - レイヤーシステム: ダイアトニックコード、スケール構成音、近親調などを重ね合わせ表示
  - ベースキー選択とディグリーネーム表示
  - コントローラーパネルとインフォメーションパネル
  - 基本和音の音声再生（Tone.js）
- **Atlas画面（仮実装）**: 用語辞書
- **About画面**: 設計思想と世界観（Philosophy）

# 技術スタック

- **フロントエンド**: Next.js 15.x (App Router), React 19.x, TypeScript 5.x
- **UI**: Shadcn/ui (Radix UI), Tailwind CSS 4.x, Framer Motion 12.x
- **状態管理**: Zustand 5.x
- **音声処理**: Tone.js 15.x
- **開発ツール**: ESLint, Prettier, Husky, lint-staged, Vitest, Storybook

# 主要開発コマンド

| 目的                   | コマンド                              |
| :--------------------- | :------------------------------------ |
| **開発サーバ起動**     | `npm run dev`                         |
| **本番ビルド**         | `npm run build`                       |
| **リント**             | `npm run lint`                        |
| **型チェック**         | `npm run typecheck`                   |
| **フォーマット**       | `npm run format`                      |
| **単体テスト**         | `npm run test:run`                    |
| **Storybook テスト**   | `npm run test:storybook`              |
| **全テスト**           | `npm run test:all`                    |
| **カバレッジ算出**     | `npm run test:coverage`               |
| **特定ファイルテスト** | `npx vitest run path/to/file.test.ts` |

# ディレクトリ構造

```
src/
├── app/              # ルーティング・ページ構成
├── components/       # 共通UI
│   ├── ui/           # shadcn/ui プリミティブ
│   ├── common/       # 汎用共通コンポーネント (Divider, icons等)
│   └── layouts/      # レイアウトコンポーネント
├── features/         # 機能単位（components/, hooks/, stores/, index.ts）
│   ├── circle-of-fifths/
│   │   └── stores/   # 五度圏専用状態 (circleOfFifthsStore, rippleStore, animationStore)
│   ├── chromatic-circle/
│   │   └── stores/   # クロマチック専用状態 (chromaticCircleStore)
│   ├── layer-controller/
│   │   └── stores/   # レイヤー専用状態 (layerStore)
│   └── view-controller/
│       └── stores/   # ビュー切り替え専用状態 (hubStore)
├── domain/           # 音楽理論ロジック（DDD戦術的パターン）
│   ├── common/       # 値オブジェクト（PitchClass, Note, Interval等）
│   ├── scale/        # Scale集約
│   ├── chord/        # Chord集約
│   ├── key/          # Key集約
│   └── services/     # ドメインサービス（AudioEngine, ChordAnalyzer等）
├── hooks/            # 汎用カスタムフック
├── utils/            # 汎用ユーティリティ関数
├── constants/        # アプリ全体の定数
├── types/            # 全体で共有する型定義
├── lib/              # 外部ライブラリ設定 (Shadcn utils等)
└── stores/           # グローバル状態管理（複数feature横断のみ: currentKeyStore）
```

# ドキュメント駆動開発

**重要原則: ドキュメントは、信頼できる唯一の情報源 (Single Source of Truth) です。**

1. **参照の徹底 (Read Before Write)**: 何かを作成・変更する前には、関連ドキュメントを読み、その内容を尊重。Serena memory読み込みも可。
2. **同期の維持 (Sync Code and Docs)**: コード変更が設計や規約に影響する場合、**必ず**ドキュメントの更新も同時に提案。Serena memoryとの同期も同様。
3. **知識の集約 (Accumulate Knowledge)**: 開発で得た新たな知見は、`docs/70.knowledge/` に追記することを積極的に提案。

## ドキュメント体系

- **番号体系**: `00xx`:プロジェクト基本情報, `10xx`:ドメイン設計, `20xx`:開発ガイドライン, `30xx`:品質・プロセス, `70xx`:ナレッジベース, `80xx`:日報, `99xx`:テンプレート
- **主要ドキュメント**:
  - `0001.requirements.md`: 要件定義書
  - `0002.screenDesign.md`: 画面設計書
  - `1001.domainSystem.md`: ドメインシステム設計
  - `1002.music-theory-guidebook.md`: 音楽理論ガイドブック
  - `2002.development-principles.md`: 開発原則・思想
  - `2003.frontend-design.md`: フロントエンド設計規約
  - `2004.architecture.md`: アーキテクチャ設計
  - `3001.testing.md`: テスト方針
  - `3003.mcp-tools-usage.md`: MCPツール活用ガイドライン

# コーディングスタイル

本プロジェクトは、一貫性と可読性を維持するため、以下の規約に基づく。

- **フォーマッター**: Prettier (`.prettierrc.json` に従う)
- **リンター**: ESLint (`eslint.config.mjs` に従う)
- **自動化**: コミット前に `husky` と `lint-staged` により自動実行
- **命名規則**:
  - `PascalCase`: コンポーネント、型定義、ファイル名 (コンポーネント)
  - `camelCase`: 変数、関数、フック、ファイル名 (コンポーネント以外)
  - `UPPER_SNAKE_CASE`: 定数
- **構文規約**:
  - **変数宣言**: 再代入のない変数は `const`、再代入が必要な場合のみ `let`。`var` は使用禁止
  - **関数**: アロー関数 (`=>`) を基本とする
  - **モジュール**: ES Modules (`import`/`export`) を使用。CommonJS (`require`/`module.exports`) は使用禁止
- **TypeScript**:
  - `any` 型の使用は原則禁止。型推論が困難な場合は理由をコメントで明記
  - コンポーネントの `Props` や関数の引数・返り値には、明確な型定義を付与
  - 型定義の配置: コンポーネント固有のProps型は各ファイル冒頭、グローバルな型は `src/types`
- **JSDoc**: 再利用される関数、コンポーネント、型定義には、役割、引数 (`@param`)、返り値 (`@returns`) を示すJSDocを記述
- **コメント**: 「なぜ (Why)」その実装になっているのか、という設計意図や背景をコメントで残すことを推奨

# Git & Pull Request 規約

- **ブランチ**:
  - **戦略**: GitHub Flow (`main`への直接コミット禁止)
  - **命名**: `<type>/<short-description>` (例: `feat/add-sound-playback`, `refactor/optimize-svg-rendering`)
- **コミット**:
  - **規約**: Conventional Commits (`<type>: <subject>`)
  - **主な `<type>`**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - **言語**: **英語**
- **Pull Request (PR)**:
  - **単位**: 1 PR = 1関心事。巨大化させない
  - **記述**: テンプレート (`.github/PULL_REQUEST_TEMPLATE.md`) を必ず使用。Descriptionにはそのブランチの変更内容を全て網羅
- **レビュー**:
  - GitHub Copilot等からのレビューは鵜呑みにせず、対応要否を自身で判断。不要な場合は理由を伝える
- **言語**:
  - **日本語**: コードコメント、PR/Issue、レビュー
  - **英語**: コミットメッセージ

# MCP (Model Context Protocol) Servers

プロジェクトの開発を支援するために、以下のMCPサーバーが設定されている。

| MCPサーバー名           | 目的                                                         | 主な利用シーン                                                                                 |
| :---------------------- | :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **playwright**          | ブラウザ操作の自動化                                         | 画面の動作確認、高難度バグの原因調査、エビデンススクリーンショット撮影                         |
| **serena**              | コードの静的解析・操作、<br>プロジェクト知識の管理           | シンボル検索等の高度なコード理解。常時使用推奨<br>過去の設計判断やドキュメント (memory) の参照 |
| **shadcn**              | shadcn/uiコンポーネントの検索・追加                          | UIコンポーネントの追加、サンプルコード検索                                                     |
| **context7**            | 外部技術情報の検索                                           | ライブラリのバージョン違いによる仕様の検索など                                                 |
| **github**              | GitHubリポジトリとの連携                                     | Issue/PR/PR Reviewの作成・管理                                                                 |
| **sequential-thinking** | 計画的な問題解決の支援                                       | 複雑な思考が必要と判断した際の体系的な思考サポート                                             |
| **chrome-devtools**     | Chromeブラウザの自動操作・デバッグ                           | ブラウザのインタラクション、パフォーマンス測定、スクリーンショット取得                         |
| **ide**                 | IDE (VS Code) の診断情報取得、<br>Jupyter Notebookコード実行 | 言語診断エラーの確認、Notebookでのコード実行                                                   |

詳細な活用方法は `docs/30.quality/3003.mcp-tools-usage.md` を参照。
