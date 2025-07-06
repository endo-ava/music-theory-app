# 状態管理の実装パターン

## 概要

Zustand を使用した状態管理の実装パターンを蓄積します。
軽量で型安全な状態管理を実現し、テスタビリティと保守性を両立する手法を記録します。

## Zustand 基本実装パターン

### 1. Store の基本構造

```typescript
// hubStore.ts
import { create } from 'zustand';
import type { HubType } from '../types';

interface HubState {
  hubType: HubType;
  setHubType: (hubType: HubType) => void;
}

export const useHubStore = create<HubState>(set => ({
  hubType: 'circle-of-fifths',
  setHubType: hubType => set({ hubType }),
}));
```

### 2. 型安全な状態管理

```typescript
// 型定義の分離
export type HubType = 'circle-of-fifths' | 'chromatic-circle';

// Record 型を使用したマッピング
const hubTitleMap: Record<HubType, string> = {
  'circle-of-fifths': '五度圏',
  'chromatic-circle': 'クロマチックサークル',
};

// コンポーネントでの使用
export const HubTitle: React.FC<ClassNameProps> = ({ className = '' }) => {
  const { hubType } = useHubStore();
  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
```

## テスト可能な状態管理

### 1. Storybook での状態管理

```typescript
// HubTitle.stories.tsx
import { useHubStore } from '../store/hubStore';

export const StateManagementTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 状態の明示的な初期化
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // 状態依存の要素をテスト
    const title = canvas.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('五度圏');

    // 状態変更のテスト
    useHubStore.setState({ hubType: 'chromatic-circle' });
    await waitFor(() => {
      expect(title).toHaveTextContent('クロマチックサークル');
    });
  },
};
```

### 2. テスト時の状態リセット

```typescript
// テスト前の状態クリア
beforeEach(() => {
  useHubStore.setState({ hubType: 'circle-of-fifths' });
});

// または Play 関数内での状態初期化
play: async ({ canvasElement }) => {
  // 確実な状態初期化
  useHubStore.setState({ hubType: 'circle-of-fifths' });

  const canvas = within(canvasElement);
  // テスト実行...
};
```

## 状態管理の設計原則

### 1. 最小限の状態管理

```typescript
// ❌ 過度に複雑な状態
interface ComplexHubState {
  hubType: HubType;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date;
  history: HubType[];
  // ... 多すぎる状態
}

// ✅ 必要最小限の状態
interface HubState {
  hubType: HubType;
  setHubType: (hubType: HubType) => void;
}
```

### 2. 単一責任の原則

```typescript
// Hub 状態管理（単一責任）
export const useHubStore = create<HubState>(set => ({
  hubType: 'circle-of-fifths',
  setHubType: hubType => set({ hubType }),
}));

// 別の関心事は別の Store で管理
export const useUIStore = create<UIState>(set => ({
  isMenuOpen: false,
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
}));
```

## 高度な状態管理パターン

### 1. 派生状態の計算

```typescript
// 派生状態をコンポーネント内で計算
export const HubTitle: React.FC<ClassNameProps> = ({ className = '' }) => {
  const { hubType } = useHubStore();

  // 派生状態：hubType から title を導出
  const hubTitle = useMemo(() => {
    return hubTitleMap[hubType] || '五度圏';
  }, [hubType]);

  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
```

### 2. 状態の永続化（将来の拡張）

```typescript
// localStorage への永続化
import { persist } from 'zustand/middleware';

export const useHubStore = create<HubState>()(
  persist(
    set => ({
      hubType: 'circle-of-fifths',
      setHubType: hubType => set({ hubType }),
    }),
    {
      name: 'hub-storage', // localStorage のキー
    }
  )
);
```

## パフォーマンス最適化

### 1. 選択的な状態購読

```typescript
// 必要な状態のみを購読
const hubType = useHubStore(state => state.hubType);
const setHubType = useHubStore(state => state.setHubType);

// 不要な再レンダリングを回避
const hubType = useHubStore(
  state => state.hubType,
  (oldType, newType) => oldType === newType // 比較関数
);
```

### 2. アクションの最適化

```typescript
// バッチ更新の活用
const updateHubState = useHubStore(state => state.updateHubState);

// 複数の状態変更を一度に実行
const handleHubChange = (newType: HubType) => {
  useHubStore.setState({
    hubType: newType,
    lastUpdated: new Date(),
  });
};
```

## 教訓・ポイント

### ✅ 成功パターン

- **明示的な状態初期化**: テスト時に状態を明示的に初期化することで、テストの信頼性向上
- **型安全性**: TypeScript による型定義で、実行時エラーの防止
- **単一責任**: 一つの Store は一つの関心事のみを管理
- **派生状態の計算**: Store に不要な状態を持たず、コンポーネント内で計算

### ❌ 避けるべきパターン

- **状態の持ちすぎ**: 不要な状態を Store に持たない
- **グローバル状態の乱用**: 本当にグローバルな状態のみを管理
- **テスト時の状態汚染**: テスト間での状態の影響を避ける
- **複雑な状態構造**: 可能な限りフラットな状態構造を維持

### 🔧 実装時の注意点

- **初期値の設定**: 適切な初期値を設定する
- **状態の不変性**: 状態の直接変更は避ける
- **デバッグの容易さ**: 状態の変更を追跡しやすい構造にする
- **テスタビリティ**: テスト時の状態操作を考慮した設計

## 参考資料

- [Zustand 公式ドキュメント](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React 状態管理ベストプラクティス](https://react.dev/learn/managing-state)
- [TypeScript State Management](https://www.typescriptlang.org/docs/)
- [開発規約](../../03.developmentAgreement.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 Hub Store 実装知見を基に）
