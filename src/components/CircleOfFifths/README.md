# 五度圏コンポーネント設計書

[<< 画面設計書に戻る](../../../docs/screenDesigns/01.hub.md)

音楽理論の五度圏を視覚的に表現するReactコンポーネントです。

## 概要

このコンポーネントは、音楽理論における五度圏を円形のインタラクティブなビジュアライゼーションとして提供します。12個のセグメントに分割され、各セグメントは3つのエリア（マイナーキー、メジャーキー、調号）に分かれています。

## 特徴

- **24個のクリック可能なキー**: メジャーキーとマイナーキーを個別に選択可能
- **3層構造**: 内側（マイナーキー）、中間（メジャーキー）、外側（調号）
- **インタラクティブなホバー効果**: キー情報の動的表示
- **レスポンシブデザイン**: 様々な画面サイズに対応
- **アクセシビリティ対応**: ARIA属性とキーボードナビゲーション
- **パフォーマンス最適化**: メモ化とキャッシュ機能
- **型安全性**: TypeScriptによる完全な型定義
- **Framer Motion**: スムーズなアニメーション効果
- **Tailwind CSS**: モダンなスタイリングシステム

## ファイル構造

```
src/components/CircleOfFifths/
├── README.md                 # このファイル
├── CircleOfFifths.tsx        # メインコンポーネント
├── animations.ts             # Framer Motionアニメーション定義
├── components/               # 子コンポーネント
│   ├── CircleSegment.tsx     # セグメントコンポーネント
│   ├── KeyArea.tsx          # キーエリアコンポーネント
│   └── KeyInfoDisplay.tsx   # キー情報表示コンポーネント
├── constants/                # 定数定義
│   └── index.ts             # すべての定数
├── hooks/                    # カスタムフック
│   ├── useCircleOfFifths.ts  # CircleOfFifths用フック
│   └── useKeyArea.ts         # KeyArea用フック
└── utils/                    # ユーティリティ関数
    ├── index.ts             # 統合エクスポート
    ├── validation.ts        # バリデーション
    ├── geometry.ts         # 幾何学計算
    ├── pathGeneration.ts   # パス生成
    └── dataOperations.ts   # データ操作

src/types/
└── circleOfFifths.ts        # グローバル型定義

src/store/
└── circleOfFifthsStore.ts   # Zustand状態管理
```

## 使用方法

### 基本的な使用

```tsx
import { CircleOfFifths } from '@/components/CircleOfFifths';

function App() {
  return (
    <div className="app">
      <CircleOfFifths />
    </div>
  );
}
```

### カスタマイズ

```tsx
import { CircleOfFifths } from '@/components/CircleOfFifths';

function App() {
  return (
    <div className="app">
      <CircleOfFifths className="custom-circle" style={{ width: '600px', height: '600px' }} />
    </div>
  );
}
```

## コンポーネント構成

### CircleOfFifths（メインコンポーネント）

五度圏のメインコンポーネント。全体のレイアウトとイベントハンドリングを管理します。

**Props（CircleOfFifthsProps）:**

- `className?: string` - カスタムクラス名
- `style?: React.CSSProperties` - カスタムスタイル

※ Props型定義はコンポーネントファイルの冒頭に定義されています

**特徴:**

- レスポンシブデザイン（70vw、最大700px）
- Tailwind CSSによるスタイリング
- SVGビューポートの自動計算

### CircleSegment（セグメントコンポーネント）

各セグメントを表現するコンポーネント。3つのエリア（マイナーキー、メジャーキー、調号）を含みます。

**Props（CircleSegmentProps）:** セグメント情報、SVGパス、テキスト位置、回転角度などを受け取ります。
※ Props型定義はコンポーネントファイルの冒頭に定義されています

### KeyArea（キーエリアコンポーネント）

個別のキーエリアを表現するコンポーネント。クリックとホバーイベントを処理します。

**Props（KeyAreaProps）:** キー名、調性、セグメント情報、SVGパス、テキスト位置、回転角度などを受け取ります。
※ Props型定義はコンポーネントファイルの冒頭に定義されています

### KeyInfoDisplay（キー情報表示コンポーネント）

選択されたキーの詳細情報を表示するコンポーネント。

## カスタムフック

### useCircleOfFifths

五度圏の描画に必要な計算ロジックを提供するカスタムフック。

### useKeyArea

KeyAreaの描画に必要な計算ロジックを提供するカスタムフック。

## 設計思想

### 1. 型安全性

TypeScriptを使用して型安全性を確保し、コンパイル時のエラー検出を可能にしています。

### 2. パフォーマンス最適化

- `React.memo`による不要な再レンダリングの防止
- `useMemo`と`useCallback`による計算結果のキャッシュ
- カスタムフックによる計算ロジックの分離

### 3. エラーハンドリング

カスタムエラークラス（`CircleOfFifthsError`）を使用して、適切なエラーメッセージとエラーコードを提供します。

### 4. アクセシビリティ

- ARIA属性の適切な設定
- キーボードナビゲーション対応
- セマンティックなHTML構造

### 5. 拡張性

- モジュラー設計による機能の追加・変更の容易さ
- 定数とユーティリティの分離
- 明確な責任分離

## 定数と設定

### レイアウト定数

```typescript
export const CIRCLE_LAYOUT = {
  RADIUS: 200, // 外側の半径
  INNER_RADIUS: 120, // 内側の半径（マイナーキーエリア）
  MIDDLE_RADIUS: 170, // 中間の半径（メジャーキーエリア）
  CENTER_RADIUS: 80, // 中心の半径（調号エリア）
} as const;
```

### アニメーション定数

```typescript
export const ANIMATION = {
  BASE_DELAY: 0.02, // 基本の遅延時間
  FADE_DURATION: 0.3, // フェードイン時間
  HOVER_SCALE: 1.03, // ホバー時のスケール
  TAP_SCALE: 0.9, // タップ時のスケール
} as const;
```

### 基本定数

```typescript
export const SEGMENT_COUNT = 12; // セグメント数
export const ANGLE_OFFSET = -105; // 角度オフセット
export const ANGLE_PER_SEGMENT = 30; // セグメントあたりの角度
```

## ユーティリティ関数

### 角度計算

- `calculateAngle(position: number): number` - 指定位置の角度を計算
- `normalizeAngle(angle: number): number` - 角度を正規化

### 座標計算

- `polarToCartesian(radius: number, angle: number): Point` - 極座標から直交座標に変換
- `calculateTextPosition(position: number, radius: number): Point` - テキスト位置を計算
- `calculateTextRotation(): number` - テキストの回転角度を計算（常に0度）

### SVGパス生成

- `generatePizzaSlicePath(position: number, innerRadius: number, outerRadius: number): string` - ピザ型パス生成
- `generateThreeSegmentPaths(position: number, innerRadius: number, middleRadius: number, outerRadius: number): SegmentPaths` - 3分割パス生成

### キー情報

- `getKeyInfo(key: Key)` - キーの詳細情報を取得

### バリデーション

- `isValidPosition(position: number): boolean` - 位置の有効性チェック
- `isValidKey(key: Key): boolean` - キーの有効性チェック

## 状態管理

Zustandを使用した状態管理を実装しています：

```typescript
interface CircleOfFifthsStore {
  selectedKey: Key | null;
  hoveredKey: Key | null;
  isPlaying: boolean;
  setSelectedKey: (key: Key | null) => void;
  setHoveredKey: (key: Key | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}
```

## アニメーション

Framer Motionを使用したアニメーションシステム：

### キー情報アニメーション

```typescript
export const keyInfoVariants: AnimationVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut', staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
```

### セグメントアニメーション

- 段階的なフェードイン
- ホバー時のスケール変更
- タップ時のフィードバック

## スタイリング

Tailwind CSSを使用したモダンなスタイリングシステム：

### カラーパレット

- `fill-key-area-major` - メジャーキーエリアの色
- `fill-key-area-minor` - マイナーキーエリアの色
- `fill-key-area-selected` - 選択されたキーの色
- `fill-key-area-hover` - ホバー時の色
- `fill-key-area-signature` - 調号エリアの色

### テキストスタイル

- `text-key-major` - メジャーキーテキスト
- `text-key-minor` - マイナーキーテキスト
- `text-key-signature` - 調号テキスト

## 今後の拡張予定

1. **音声機能**: Tone.jsによるキーの音声再生機能
2. **SVG調号**: 文字列からSVG画像への変更
3. **テーマ対応**: ダーク/ライトテーマの切り替え
4. **アニメーション強化**: より豊富なアニメーション効果
5. **国際化**: 多言語対応
6. **テスト実装**: ユニットテストとインタラクションテスト
7. **キーボードナビゲーション**: より詳細なキーボード操作対応
8. **スクリーンリーダー対応**: より詳細なアクセシビリティ改善
