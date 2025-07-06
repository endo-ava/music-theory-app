# コンポーネント設計パターン

## 概要

React コンポーネントの設計において、保守性・拡張性・パフォーマンスを考慮した設計パターンを蓄積します。
特に Next.js App Router における Server/Client コンポーネントの適切な境界設計に焦点を当てています。

## Server/Client コンポーネント境界設計

### 基本原則

#### 1. パフォーマンス最適化の原則

- **Server Component 優先**: デフォルトでは Server Component を使用
- **Client Component は最小限**: インタラクションが必要な部分のみ
- **境界の明確化**: 依存関係を明確にし、境界を最小化

#### 2. 実装例：Canvas コンポーネント

```typescript
// Canvas.tsx (Server Component)
export const Canvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center',
        'bg-transparent w-full h-full min-h-[400px]',
        'p-4 lg:p-8',
        className
      )}
      role="main"
      aria-label="メイン表示エリア"
    >
      <HubTitle /> {/* Client Component */}
      <div className="w-full h-full flex items-center justify-center">
        <CircleOfFifths /> {/* Server Component */}
      </div>
    </div>
  );
};
```

```typescript
// HubTitle.tsx (Client Component)
'use client';
import { useHubStore } from '../store/hubStore';

export const HubTitle: React.FC<ClassNameProps> = ({ className = '' }) => {
  const { hubType } = useHubStore(); // 状態管理が必要なためClient Component

  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
```

### 設計判断基準

#### Server Component を選択する場合

- 静的なレイアウト・構造を提供
- データフェッチングが必要
- SEO対応が重要
- 初期読み込み速度を重視

#### Client Component を選択する場合

- 状態管理が必要（useState, useEffect など）
- ユーザーインタラクションが必要
- ブラウザ API を使用
- リアルタイム更新が必要

## 構成パターン

### 1. Wrapper パターン

```typescript
// 親コンポーネント（Server Component）
export const Canvas: React.FC<ClassNameProps> = (props) => {
  return (
    <div className="layout-wrapper">
      <StaticHeader />
      <DynamicContent {...props} /> {/* Client Component */}
      <StaticFooter />
    </div>
  );
};
```

**利点：**

- 静的部分は Server Component で高速化
- 動的部分のみ Client Component で必要最小限

### 2. 合成パターン

```typescript
// 型安全な合成パターン
const hubTitleMap: Record<HubType, string> = {
  'circle-of-fifths': '五度圏',
  'chromatic-circle': 'クロマチックサークル',
};

export const HubTitle: React.FC<ClassNameProps> = ({ className = '' }) => {
  const { hubType } = useHubStore();
  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
```

**利点：**

- 型安全性の確保
- 拡張性の向上
- パフォーマンスの最適化

## TypeScript 型設計

### 1. Props インターフェース設計

```typescript
// 基本的な Props 設計
export interface ClassNameProps {
  /** カスタムクラス名 */
  className?: string;
}

// 拡張可能な Props 設計
export interface ClassNameProps {
  /** カスタムクラス名 */
  className?: string;
  /** Hub タイプ（オプション：将来の拡張用） */
  hubType?: HubType;
}
```

### 2. 型定義の階層化

```typescript
// 基本型定義
export type HubType = 'circle-of-fifths' | 'chromatic-circle';

// 設定型定義
export interface CanvasConfig {
  /** 現在のHub種類 */
  hubType: HubType;
}

// コンポーネント固有の型定義
export interface ClassNameProps {
  className?: string;
}
```

## 教訓・ポイント

### ✅ 成功パターン

- **境界の明確化**: Server/Client の境界を明確にすることで、パフォーマンスが向上
- **型安全性**: TypeScript による型定義で、バグの事前防止
- **構成の分離**: 静的・動的要素を適切に分離することで、保守性が向上
- **最小権限の原則**: 必要最小限の部分のみを Client Component に

### ❌ 避けるべきパターン

- **過度な Client Component**: 不要な部分まで Client Component にしない
- **型定義の不一致**: インターフェースと実装の不整合
- **境界の曖昧さ**: Server/Client の境界が不明確
- **Props の過度な複雑化**: 単純な Props 設計を心がける

### 🔧 実装時の注意点

- **'use client' ディレクティブ**: Client Component には必ず記述
- **状態管理の最適化**: 状態は必要最小限に抑制
- **アクセシビリティ**: role 属性や aria-label の適切な設定
- **レスポンシブ対応**: モバイルファーストアプローチ

## 参考資料

- [Next.js App Router 公式ドキュメント](https://nextjs.org/docs/app)
- [React Server Components 解説](https://react.dev/reference/react/use-client)
- [開発規約](../../03.developmentAgreement.md)
- [Canvas コンポーネント設計書](../../src/features/canvas/README.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 Canvas 実装知見を基に）
