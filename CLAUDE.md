# プロジェクト概要

本アプリケーションは、複雑な音楽理論の概念と、その相互関係を探求するための**インタラクティブ・ビジュアライゼーションツール**である。視覚的なグラフィック表現と聴覚的なフィードバックを組み合わせることで、抽象的な理論を具体的で感覚的な体験へと転換。

# 技術スタック

- **フロントエンド**: Next.js 15.x (App Router) + React 19.x + TypeScript 5.x + Shadcn/ui
- **スタイリング**: Tailwind CSS 4.x + clsx + tailwind-merge
- **アニメーション**: Framer Motion (motion) 12.x
- **状態管理**: Zustand 5.x
- **音声処理**: Tone.js 15.x
- **コード品質**: ESLint + Prettier + Husky + lint-staged

# 主要な開発コマンド

```bash
npm run dev            # 開発サーバー起動
npm run build          # 本番ビルド
npm run lint           # リンター実行
npm run test:run       # 単体テスト実行
npm run test:storybook # Storybookテスト実行
npm run test:all       # 全テスト実行
npm run test:coverage  # 単体テストカバレッジ算出
npx vitest run path/to/file.test.ts # ファイルを指定してテスト実行
```

# ドキュメント体系

## ドキュメントの意義とAIへの指針

本プロジェクトにおいて、ドキュメントは単なる記録ではなく、\*\*プロジェクトの思想と決定を写す「生きた設計図」**である。コードが「どのように(How)」を表現するのに対し、ドキュメントは**「なぜ(Why)」**と**「何を(What)」\*\*を記録する。これにより、将来の意思決定の質を高め、開発の一貫性と保守性を担保する。

**AI開発パートナーへの指針:**
あなた（AI）は、このドキュメント体系の最も重要な利用者であり、同時に保守者でもある。以下の指針を常に念頭に置いて開発支援を行うこと。

1.  **参照の徹底 (Read Before Write):** コード生成、リファクタリング、設計提案など、いかなる提案を行う前にも、必ず関連するドキュメントを深く読み込み、その内容を完全に尊重すること。ドキュメントは、プロジェクトにおける\*\*信頼できる唯一の情報源（Single Source of Truth）\*\*である。
2.  **同期の維持 (Sync Code and Docs):** あなたの提案によって既存の設計や規約が変更される場合は、コードの変更提案と**同時にドキュメントの更新案を提示する**こと。コードとドキュメントの乖離は、プロジェクトの技術的負債となる。
3.  **知識の集約 (Accumulate Knowledge):** 開発過程で得られた新たな知見や解決策、議論の末に決定された事項は、単なるチャットログで終わらせず、`docs/70.knowledge/` や関連ドキュメントへの追記を積極的に提案すること。あなたの支援を通じて、このプロジェクトの知識ベースを共に成長させることを期待する。

## ドキュメント番号体系

各ドキュメントには4桁のドキュメント番号を付与し、カテゴリと内容を即座に識別できるようにしている。

**番号範囲**:

- **00xx**: プロジェクト基本情報 (0001-0099)
- **10xx**: ドメイン設計 (1001-1999)
- **20xx**: 開発ガイドライン (2001-2999)
- **30xx**: 品質・プロセス (3001-3999)
- **70xx**: ナレッジベース (サブディレクトリで管理)
- **80xx**: 日報 (日付ベース命名)
- **99xx**: テンプレート (サブディレクトリで管理)

例: `2003` = 開発ガイドライン分野の3番目のドキュメント

## ドキュメントインデックス（一覧）

| カテゴリ             | ファイル             | 相対パス                                                                                                                                                               |
| -------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| プロジェクト基本情報 | 要件定義             | [`docs/00.project/0001.requirements.md`](docs/00.project/0001.requirements.md)                                                                                         |
| プロジェクト基本情報 | 画面設計             | [`docs/00.project/0002.screenDesign.md`](docs/00.project/0002.screenDesign.md)                                                                                         |
| プロジェクト基本情報 | Hub画面設計          | [`docs/00.project/screenDesigns/0003.hub.md`](docs/00.project/screenDesigns/0003.hub.md)                                                                               |
| プロジェクト基本情報 | Library画面設計      | [`docs/00.project/screenDesigns/0004.library.md`](docs/00.project/screenDesigns/0004.library.md)                                                                       |
| プロジェクト基本情報 | Tutorial画面設計     | [`docs/00.project/screenDesigns/0005.tutorial.md`](docs/00.project/screenDesigns/0005.tutorial.md)                                                                     |
| ドメイン設計         | ドメインシステム     | [`docs/10.domain/1001.domainSystem.md`](docs/10.domain/1001.domainSystem.md)                                                                                           |
| ドメイン設計         | 音楽理論ガイドブック | [`docs/10.domain/1002.music-theory-guidebook.md`](docs/10.domain/1002.music-theory-guidebook.md)                                                                       |
| 開発ガイドライン     | 基本コーディング     | [`docs/20.development/2001.basic-coding.md`](docs/20.development/2001.basic-coding.md)                                                                                 |
| 開発ガイドライン     | 開発原則・思想       | [`docs/20.development/2002.development-principles.md`](docs/20.development/2002.development-principles.md)                                                             |
| 開発ガイドライン     | フロントエンド設計   | [`docs/20.development/2003.frontend-design.md`](docs/20.development/2003.frontend-design.md)                                                                           |
| 開発ガイドライン     | アーキテクチャ       | [`docs/20.development/2004.architecture.md`](docs/20.development/2004.architecture.md)                                                                                 |
| 品質・プロセス       | テスト               | [`docs/30.quality/3001.testing.md`](docs/30.quality/3001.testing.md)                                                                                                   |
| 品質・プロセス       | Git・PR              | [`docs/30.quality/3002.git-pr.md`](docs/30.quality/3002.git-pr.md)                                                                                                     |
| 品質・プロセス       | MCPツール活用        | [`docs/30.quality/3003.mcp-tools-usage.md`](docs/30.quality/3003.mcp-tools-usage.md)                                                                                   |
| ナレッジ             | ナレッジ             | [`docs/70.knowledge/`](docs/70.knowledge/)                                                                                                                             |
| 日誌                 | 日誌                 | [`docs/80.dailyReport/`](docs/80.dailyReport/)                                                                                                                         |
| テンプレート         | テンプレート         | [`docs/99.templates/`](docs/99.templates/), [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md), [`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE) |

# 開発ワークフローと参照ドキュメント

新規機能開発、リファクタリング、不具合修正など、すべての開発作業はこのフローに沿って進める。各フェーズで参照すべきドキュメントを必ず確認し、プロジェクト全体の一貫性を保つこと。

### **Phase 1: 企画・タスク着手**

**目的**: これから何を、なぜ作るのかを正確に理解し、開発の準備を整える。

作業を開始する前に、まずIssueやタスクの背景を完全に理解する。要件や仕様が不明瞭な場合は、実装に着手する前に必ず確認すること。

- **参照ドキュメント**:
  - **要件の理解**: `docs/00.project/0001.requirements.md`
  - **UI/UXの確認**: `docs/00.project/0002.screenDesign.md` と配下の各画面設計書
  - **ブランチ戦略**: `docs/30.quality/3002.git-pr.md`
  - **Issue起票**: `.github/ISSUE_TEMPLATE`

---

### **Phase 2: 設計**

**目的**: 実装に着手する前に、どのように作るかを決定する。システムの保守性と拡張性を担保するための最も重要なフェーズ。

アーキテクチャや設計原則に立ち返り、新しいコードが既存のシステムとどのように調和するかを考える。複雑な機能の場合は、設計内容をドキュメントにまとめること。

- **参照ドキュメント**:
  - **全体構造の確認**: `docs/20.development/2004.architecture.md`
  - **設計思想の遵守**: `docs/20.development/2002.development-principles.md`
  - **コンポーネント設計**: `docs/20.development/2003.frontend-design.md`
  - **ドメインロジックの確認**: `docs/10.domain/1001.domainSystem.md`
  - **音楽理論概念の確認**: `docs/10.domain/1002.music-theory-guidebook.md`

---

### **Phase 3: 実装**

**目的**: 設計に基づき、クリーンで保守性の高いコードを記述する。

コーディング規約を遵守し、一貫性のあるコードを作成する。実装中に設計上の問題に気づいた場合は、立ち止まってPhase 2に戻る勇気を持つこと。

- **参照ドキュメント**:
  - **コーディング規約**: `docs/20.development/2001.basic-coding.md`
  - **スタイリングとコンポーネント実装**: `docs/20.development/2003.frontend-design.md`
  - **開発効率化ツールの活用**: `docs/30.quality/3003.mcp-tools-usage.md`

---

### **Phase 4: 品質保証**

**目的**: 実装したコードが期待通りに動作し、既存の機能を破壊しないことを保証する。

「テストなきコードはレガシーコードである」という原則に基づき、必ずテストコードを記述する。

- **参照ドキュメント**:
  - **テスト方針の確認**: `docs/30.quality/3001.testing.md`

---

### **Phase 5: レビューとマージ**

**目的**: 第三者の視点からコードの品質を評価し、問題がなければメインブランチに統合する。

Github copilotからのレビューは必ずしも鵜呑みにするのではなく、本当に対応すべきかを考察する。

- **参照ドキュメント**:
  - **PR・マージ手順**: `docs/30.quality/3002.git-pr.md`
  - **PRテンプレート**: `.github/PULL_REQUEST_TEMPLATE.md`

---

### **Phase 6: ドキュメント更新と知識共有**

**目的**: プロジェクトを最新かつ健全な状態に保ち、得られた知見をチームの資産とする。

コードを書き終えたら、開発は終わりではない。変更に伴い古くなったドキュメントを更新する。

- **参照ドキュメント**:
  - **知見の蓄積**: `docs/70.knowledge/`
  - **作業記録**: `docs/80.dailyReport/`
  - **新規ドキュメント作成**: `docs/99.templates`

---

### **継続的プロセス: リファクタリング**

**目的**: コードベースの健全性を長期的に維持する。

リファクタリングは特定のフェーズではなく、開発プロセス全体を通じて継続的に行われるべき活動である。「動くコード」で満足せず、常によりクリーンなコードを目指すこと。リファクタリングを行う際は、上記のPhase 2〜5のサイクルを小規模に回す意識を持つ。
