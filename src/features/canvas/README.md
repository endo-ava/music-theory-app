# Canvas コンポーネント設計書

[<< 画面設計書に戻る](../../../docs/screenDesigns/01.hub.md)

インタラクティブ・ハブ画面のメイン表示エリア（Canvas）を提供するReactコンポーネントです。

## 概要

このコンポーネントは、音楽理論学習アプリの中核となるメイン表示エリアを提供します。HubTitleコンポーネントと統合してHub状態管理（useHubStore）に対応し、動的なタイトル表示機能を実装しています。現在は五度圏を表示し、将来的にはクロマチックサークルとの切り替え機能にも対応する拡張可能な設計となっています。

## 特徴

- **Hub状態管理統合**: useHubStoreによる動的なHub種類管理
- **動的タイトル表示**: HubTitleコンポーネントによるHub種類に応じたタイトル表示
- **既存コンポーネントの統合**: CircleOfFifthsコンポーネントをラップして表示
- **将来の拡張性**: クロマチックサークルなどの他のHubとの切り替えに対応
- **サーバーコンポーネント**: パフォーマンス最適化のためサーバーサイド実行
- **レスポンシブデザイン**: 様々な画面サイズに対応
- **アクセシビリティ対応**: ARIA属性とセマンティックなHTML構造
- **型安全性**: TypeScriptによる完全な型定義
- **Tailwind CSS**: モダンなスタイリングシステム

## ファイル構造

```
src/features/canvas/
├── README.md                 # このファイル
├── index.ts                  # エクスポート統合
├── components/               # コンポーネント
│   ├── Canvas.tsx           # メインコンポーネント（サーバーコンポーネント）
│   └── HubTitle.tsx         # タイトル表示コンポーネント（クライアントコンポーネント）
├── __stories__/              # Storybookストーリー
│   ├── Canvas.stories.tsx   # Canvasのストーリー
│   └── HubTitle.stories.tsx # HubTitleのストーリー
├── store/                    # 状態管理
│   └── hubStore.ts          # Hub状態管理（Zustand）
└── types.ts                  # ローカル型定義
```

## 使用方法

### 基本的な使用

```tsx
import { Canvas } from '@/features/canvas';

function App() {
  return (
    <div className="app">
      <Canvas />
    </div>
  );
}
```

### カスタマイズ

```tsx
import { Canvas } from '@/features/canvas';

function App() {
  return (
    <div className="app">
      <Canvas className="custom-canvas" style={{ width: '800px', height: '600px' }} />
    </div>
  );
}
```

### Hub状態管理の使用

```tsx
import { Canvas, useHubStore } from '@/features/canvas';

function AppWithHubControl() {
  const { hubType, setHubType } = useHubStore();

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => setHubType('circle-of-fifths')}>五度圏</button>
        <button onClick={() => setHubType('chromatic-circle')}>クロマチックサークル</button>
      </div>
      <Canvas />
    </div>
  );
}
```

### HubTitleの個別使用

```tsx
import { HubTitle } from '@/features/canvas';

function CustomLayout() {
  return (
    <div className="custom-layout">
      <HubTitle className="custom-title" />
      {/* 他のコンテンツ */}
    </div>
  );
}
```

## コンポーネント構成

### Canvas（メインコンポーネント）

メイン表示エリアのコンテナコンポーネント。HubTitleコンポーネントとCircleOfFifthsコンポーネントを統合して表示します。サーバーコンポーネントとして実装され、パフォーマンス最適化を図っています。

### HubTitle（タイトル表示コンポーネント）

Hub種類に応じたタイトルを動的に表示するクライアントコンポーネント。useHubStoreを使用してHub状態管理と連携します。

**Props（CanvasProps）:**

- `className?: string` - カスタムクラス名
- `style?: React.CSSProperties` - カスタムスタイル

**特徴:**

- HubTitleとの統合によるタイトル表示
- サーバーコンポーネントによるパフォーマンス最適化
- レスポンシブデザイン（パディング調整）
- Tailwind CSSによるスタイリング
- ARIA属性によるアクセシビリティ対応
- 最小高さ400pxの確保

## 型定義

### CanvasProps

```typescript
export interface CanvasProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}
```

### HubTitleProps

```typescript
export interface HubTitleProps {
  /** カスタムクラス名 */
  className?: string;
}
```

### HubType

```typescript
export type HubType = 'circle-of-fifths' | 'chromatic-circle';
```

### HubState

```typescript
export interface HubState {
  /** 現在のHub種類 */
  hubType: HubType;
  /** Hub種類を設定する */
  setHubType: (hubType: HubType) => void;
}
```

### CanvasConfig（将来の拡張用）

```typescript
export interface CanvasConfig {
  /** 現在のHub種類 */
  hubType: HubType;
}
```

## 設計思想

### 1. 単一責任原則

Canvasコンポーネントは「メイン表示エリアの提供」という単一の責任を持ちます。タイトル表示はHubTitle、コンテンツ表示はCircleOfFifthsに委譲し、関心の分離を徹底しています。

### 2. サーバー・クライアントコンポーネントの最適な分離

設計規約に従い「クライアントコンポーネントはインタラクションの末端に限定」の原則を実践。状態管理が必要なHubTitleのみをクライアントコンポーネントとし、Canvasはサーバーコンポーネントでパフォーマンス最適化を実現しています。

### 3. 拡張性

将来的な機能拡張（クロマチックサークルとの切り替えなど）を考慮した型定義と構造を提供しています。Hub状態管理により、新しいHub種類の追加が容易です。

### 4. 既存実装の再利用

既存のCircleOfFifthsコンポーネントを変更することなく、ラッパーとして活用することで開発コストを最小化しています。

### 4. アクセシビリティ

- `role="main"`によるランドマーク設定
- `aria-label`による適切な説明

### 5. レスポンシブ対応

- Tailwind CSSのレスポンシブクラスによる画面サイズ対応
- パディングの段階的調整（p-4 → md:p-6 → lg:p-8）

## スタイリング

Tailwind CSSを使用したモダンなスタイリングシステム：

### Canvas レイアウト

- `flex flex-col items-center justify-center` - 縦並び中央配置
- `w-full h-full min-h-[400px]` - サイズ設定
- `p-4 md:p-4 lg:p-8` - レスポンシブパディング
- `bg-transparent` - 背景は透明（継承）

### HubTitle スタイル

- `text-title text-center mb-4` - タイトルスタイルと中央配置、下マージン

## Storybookストーリー

### Canvas ストーリー

1. **Default**: デフォルト設定でのCanvas表示（HubTitle + CircleOfFifths）
2. **CustomSize**: カスタムサイズでの表示
3. **CustomStyle**: カスタムスタイルの適用
4. **Compact**: コンパクトサイズでの表示
5. **HubStateDemo**: Hub状態管理機能のデモンストレーション

### HubTitle ストーリー

1. **Default**: デフォルトのHubTitle表示
2. **CustomStyle**: カスタムスタイルの適用
3. **HubTypeDemo**: Hub種類切り替えのデモンストレーション
4. **HubTypeSwitchTest**: Hub切り替え機能のインタラクションテスト

## 将来の拡張予定

1. **Hub切り替え機能**: 五度圏とクロマチックサークルの動的切り替え
2. **レイヤー表示**: 音楽理論のレイヤー情報のオーバーレイ表示
3. **アニメーション**: Hub切り替え時のトランジションアニメーション
4. **テーマ対応**: ダーク/ライトテーマの切り替え
5. **キーボードナビゲーション**: より詳細なキーボード操作対応

## 依存関係

### Canvas コンポーネント

- `@/features/circle-of-fifths` - 五度圏コンポーネント
- `./HubTitle` - タイトル表示コンポーネント
- `tailwind-merge` - Tailwindクラスのマージ

### HubTitle コンポーネント

- `../store/hubStore` - Hub状態管理（Zustand）

### 状態管理

- `zustand` - 軽量状態管理ライブラリ

## 開発・テスト

### Storybookでの確認

```bash
npm run storybook
```

Canvas > Components セクションで各ストーリーを確認できます。

### 使用例の確認

`src/app/page.tsx`でCanvasコンポーネントの実際の使用例を確認できます。
