# Issue #34 Canvas 実装の知見

## 概要

Issue #34「Canvas コンポーネントの実装」で得た総合的な知見を記録します。
アーキテクチャ設計、実装、テスト、レビュー対応の全工程を通して学んだ教訓を体系的に整理します。

## プロジェクト概要

### 目標

- Interactive Hub 画面のメイン表示エリア（Canvas）コンポーネントを実装
- 既存の CircleOfFifths コンポーネントをラップし、将来的な Hub 切り替え機能に対応
- 包括的な Storybook テストの実装

### 成果物

- `src/components/layouts/Canvas/` 配下のコンポーネント実装
- Storybook stories による包括的なテスト
- 276行の詳細な設計書（README.md）
- PR #35 による完全な実装

## 主要な技術的決定

### 1. アーキテクチャ設計

#### Server/Client コンポーネント境界

```typescript
// Canvas.tsx (Server Component)
export const Canvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div role="main" aria-label="メイン表示エリア">
      <HubTitle />           {/* Client Component */}
      <div>
        <CircleOfFifths />   {/* Server Component */}
      </div>
    </div>
  );
};

// HubTitle.tsx (Client Component)
'use client';
export const HubTitle: React.FC<ClassNameProps> = ({ className = '' }) => {
  const { hubType } = useHubStore(); // 状態管理が必要
  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1>{hubTitle}</h1>;
};
```

**学習ポイント：**

- Static な部分は Server Component で高速化
- 状態管理が必要な部分のみ Client Component に分離
- 境界の理由を明確に設計文書で記録

#### 状態管理設計

```typescript
// hubStore.ts
export const useHubStore = create<HubState>(set => ({
  hubType: 'circle-of-fifths',
  setHubType: hubType => set({ hubType }),
}));

// 型安全なマッピング
const hubTitleMap: Record<HubType, string> = {
  'circle-of-fifths': '五度圏',
  'chromatic-circle': 'クロマチックサークル',
};
```

**学習ポイント：**

- 最小限の状態管理で必要十分な機能を実現
- 型安全性を重視した設計
- 将来拡張を見据えた構造

### 2. テスト戦略

#### CSF 3.0 による包括的テスト

```typescript
// インタラクションテスト
export const InteractiveTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 明示的な状態初期化
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // DOM 要素の存在確認
    const mainArea = canvas.getByRole('main');
    expect(mainArea).toBeInTheDocument();

    // アクセシビリティ確認
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');
  },
};
```

**学習ポイント：**

- Storybook をビジュアル開発とテストの両方で活用
- 状態管理テストでは明示的な初期化が必要
- セマンティックなセレクターを使用した信頼性の高いテスト

#### 多層的なテスト設計

- **基本表示テスト**: Default Story
- **インタラクションテスト**: play 関数による自動化
- **アクセシビリティテスト**: a11y addon との連携
- **レスポンシブテスト**: 複数viewport での確認

## 遭遇した課題と解決策

### 1. Storybook 表示問題

**問題**: ダークテーマコンポーネントが Storybook で白く表示される

**原因**: Storybook のデフォルト背景が白色のため、ダークテーマコンポーネントが見えない

**解決策**:

```typescript
// .storybook/preview.ts
export const parameters = {
  backgrounds: {
    default: 'app-bg',
    values: [
      { name: 'app-bg', value: 'linear-gradient(to bottom, #111827, #000000)' },
    ],
  },
};

// Canvas.stories.tsx
decorators: [
  Story => (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
      <Story />
    </div>
  ),
],
```

**学習ポイント**: 視覚的な一貫性のため、適切な背景設定が重要

### 2. 状態管理のテスト問題

**問題**: Storybook での状態がテスト間で持続し、テストが不安定

**最初の対応（誤った方向）**:

```typescript
// ❌ 実装側での修正を試みた
export const useHubStore = create<HubState>(set => ({
  hubType: 'circle-of-fifths',
  setHubType: hubType => set({ hubType }),
  resetState: () => set({ hubType: 'circle-of-fifths' }), // 不要な機能
}));
```

**ユーザーフィードバック**:

> "Storybook側の問題なのに、実装側の修正で対応しようとしていることに違和感を感じます"

**正しい解決策**:

```typescript
// ✅ テスト側での修正
export const StateTest: Story = {
  play: async ({ canvasElement }) => {
    // テスト開始時に状態を初期化
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    const canvas = within(canvasElement);
    // テスト実行...
  },
};
```

**学習ポイント**:

- 問題の根本原因を正確に特定することが重要
- 実装側とテスト側の責任を明確に分離
- ユーザーフィードバックを真摯に受け止める

### 3. アクセシビリティの問題

**問題**: 重複する main ランドマーク

**原因**: `page.tsx` の `<main>` 要素と Canvas の `role="main"` が競合

**解決策**:

```typescript
// page.tsx - main 要素を削除
export default function Home() {
  return (
    <div>  {/* main から div に変更 */}
      <Canvas />
    </div>
  );
}

// Canvas.tsx - role="main" を維持
export const Canvas: React.FC<ClassNameProps> = (props) => {
  return (
    <div role="main" aria-label="メイン表示エリア">
      {/* ... */}
    </div>
  );
};
```

**学習ポイント**: アクセシビリティの要件を正確に理解し、適切な構造を設計

## レビュー対応の学び

### GitHub Copilot レビューの活用

#### 第1回レビュー（4件）

1. **Zustand 状態の持続問題** → テスト側で状態初期化
2. **CSS 冗長性** → 不要なクラスの削除
3. **パフォーマンス最適化** → Record 型マッピングの使用
4. **アクセシビリティ** → main ランドマークの重複解消

#### 第2回レビュー（3件）

1. **型安全性** → 型定義の一貫性確保
2. **未使用依存関係** → 不要なimportの削除
3. **未使用フィールド** → インターフェースの整理

#### 第3回レビュー（2件）

1. **冗長なTailwindクラス** → `md:p-4` の削除
2. **テスト信頼性** → `getByRole('img')` → `getByLabelText()` への変更

### レビュー対応の優先順位

1. **高優先度**: セキュリティ、アクセシビリティ
2. **中優先度**: パフォーマンス、型安全性
3. **低優先度**: コードスタイル、最適化

### 効果的な対応パターン

```typescript
// 段階的な修正による品質向上
// Commit 1: 緊急性の高い修正（アクセシビリティ）
// Commit 2: パフォーマンス最適化
// Commit 3: 細かな改善（クラス最適化）
```

## プロセス改善の学び

### 1. 文書化の重要性

**成功要因**:

- 276行の詳細な設計書（README.md）
- コンポーネントの責任範囲を明確に記録
- 将来の拡張方針を明示

**効果**:

- 実装中の判断迷いが減少
- レビュー時の背景理解が向上
- 後続開発者のオンボーディング支援

### 2. 開発プロセスの最適化

**効果的だった手法**:

- Storybook ファーストアプローチ
- 包括的なテストの事前設計
- 継続的なレビューフィードバック対応

**改善点**:

- 型定義の一貫性チェック
- 状態管理のユニットテスト
- パフォーマンス指標の測定

### 3. コミット戦略

**実装したコミット分割**:

1. **基本実装**: コンポーネント構造の作成
2. **テスト実装**: Storybook stories の追加
3. **統合修正**: メインページとの統合
4. **レビュー対応**: 段階的な品質向上

**学習ポイント**: 論理的な単位でのコミット分割により、履歴の可読性が向上

## 技術的負債と今後の改善

### 識別された技術的負債

1. **CanvasConfig インターフェース**: 実装との不整合
2. **HubStore のユニットテスト**: Vitest による単体テスト不足
3. **型定義の分散**: 一部の型定義が分散配置

### 今後の改善計画

1. **型定義の統一**: インターフェースと実装の同期
2. **テストカバレッジ**: 状態管理のユニットテスト追加
3. **パフォーマンス測定**: 実際のメトリクス取得

## 総合的な教訓

### ✅ 成功要因

1. **明確な設計**: 詳細な設計書による方針統一
2. **適切な境界**: Server/Client の責任分離
3. **包括的テスト**: 多層的なテスト戦略
4. **継続的改善**: レビューフィードバックへの迅速対応
5. **文書化**: 知見の体系的な記録

### ❌ 改善点

1. **初期の判断ミス**: 実装側とテスト側の責任混同
2. **型定義の不一致**: 設計と実装の同期不足
3. **パフォーマンス測定**: 定量的な評価の不足

### 🎯 今後の指針

1. **問題の根本原因**: 表面的な症状でなく根本原因を特定
2. **適切な責任範囲**: 実装・テスト・設定の明確な分離
3. **継続的学習**: レビューフィードバックの積極的活用
4. **知見の共有**: チーム全体での知識ベース構築

## 影響とメトリクス

### 開発効率

- **実装期間**: 1日で完全実装
- **レビュー対応**: 3回のイテレーションで完了
- **コード品質**: 全レビューポイントの解消

### コードメトリクス

- **追加行数**: 973行（新機能実装）
- **削除行数**: 23行（リファクタリング）
- **ファイル数**: 8つの新規ファイル
- **テストカバレッジ**: 包括的なStorybook テスト

### 知見の蓄積

- **設計書**: 276行の詳細ドキュメント
- **知見文書**: 8つの体系的な知見ファイル
- **ベストプラクティス**: 再利用可能な実装パターン

## 参考資料

- [Issue #34](https://github.com/endo-ava/harmonic-orbit/issues/34)
- [PR #35](https://github.com/endo-ava/harmonic-orbit/pull/35)
- [Canvas コンポーネント設計書](../../src/features/canvas/README.md)
- [開発規約](../../03.developmentAgreement.md)
- [アーキテクチャ知見](../architecture/component-design.md)
- [テスト戦略知見](../development-process/storybook-testing.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 完了時の総合知見として）
