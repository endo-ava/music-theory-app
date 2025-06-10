# 五度圏コンポーネント

音楽理論の五度圏を視覚的に表現するReactコンポーネントです。

## 概要

このコンポーネントは、音楽理論における五度圏を円形のインタラクティブなビジュアライゼーションとして提供します。12個のセグメントに分割され、各セグメントは3つのエリア（マイナーキー、メジャーキー、調号）に分かれています。

## 特徴

- **24個のクリック可能なキー**: メジャーキーとマイナーキーを個別に選択可能
- **垂直テキスト表示**: 読みやすい垂直方向のテキスト配置
- **インタラクティブなホバー効果**: キー情報の動的表示
- **レスポンシブデザイン**: 様々な画面サイズに対応
- **アクセシビリティ対応**: ARIA属性とキーボードナビゲーション
- **パフォーマンス最適化**: メモ化とキャッシュ機能

## ファイル構造

```
src/components/CircleOfFifths/
├── README.md                 # このファイル
├── CircleOfFifths.tsx        # メインコンポーネント
├── animations.ts             # アニメーション定義
├── styles/
│   └── circleOfFifths.module.css    # スタイルシート
├── components/               # 子コンポーネント
│   ├── CircleSegment.tsx     # セグメントコンポーネント
│   ├── KeyArea.tsx          # キーエリアコンポーネント
│   └── KeyInfoDisplay.tsx   # キー情報表示コンポーネント
├── constants/                # 定数定義
│   └── index.ts             # すべての定数
├── utils/                    # ユーティリティ関数
│   └── index.ts             # すべてのユーティリティ
└── types/                    # コンポーネント固有の型定義
    └── index.ts             # コンポーネントProps型

src/types/
└── circleOfFifths.ts        # グローバル型定義
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
      <CircleOfFifths 
        className="custom-circle"
        style={{ width: '600px', height: '600px' }}
      />
    </div>
  );
}
```

## コンポーネント構成

### CircleOfFifths（メインコンポーネント）

五度圏のメインコンポーネント。全体のレイアウトとイベントハンドリングを管理します。

**Props:**
- `className?: string` - カスタムクラス名
- `style?: React.CSSProperties` - カスタムスタイル

### CircleSegment（セグメントコンポーネント）

各セグメントを表現するコンポーネント。3つのエリア（マイナーキー、メジャーキー、調号）を含みます。

### KeyArea（キーエリアコンポーネント）

個別のキーエリアを表現するコンポーネント。クリックとホバーイベントを処理します。

### KeyInfoDisplay（キー情報表示コンポーネント）

選択されたキーの詳細情報を表示するコンポーネント。

## 設計思想

### 1. 型安全性

TypeScriptを使用して型安全性を確保し、コンパイル時のエラー検出を可能にしています。

### 2. パフォーマンス最適化

- `React.memo`による不要な再レンダリングの防止
- `useMemo`と`useCallback`による計算結果のキャッシュ
- 角度計算のキャッシュ機能

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
  RADIUS: 300,           // 外側の半径
  INNER_RADIUS: 170,     // 内側の半径（マイナーキーエリア）
  MIDDLE_RADIUS: 250,    // 中間の半径（メジャーキーエリア）
} as const;
```

### 色定数

```typescript
export const COLORS = {
  MINOR: 'rgba(255, 255, 255, 0.1)',      // マイナーキーエリア
  MAJOR: 'rgba(255, 255, 255, 0.15)',     // メジャーキーエリア
  SIGNATURE: 'rgba(255, 255, 255, 0.2)',  // 調号エリア
  HOVER: 'rgba(255, 255, 255, 0.25)',     // ホバー時
  SELECTED: 'rgba(255, 255, 255, 0.3)',   // 選択時
  BORDER: 'rgba(255, 255, 255, 0.1)',     // 境界線
  TEXT: 'white',                          // テキスト
} as const;
```

### アニメーション定数

```typescript
export const ANIMATION = {
  BASE_DELAY: 0.05,      // 基本の遅延時間
  FADE_DURATION: 0.3,    // フェードイン時間
  HOVER_SCALE: 1.02,     // ホバー時のスケール
  TAP_SCALE: 0.98,       // タップ時のスケール
} as const;
```

## ユーティリティ関数

### 角度計算

- `calculateAngle(position: number): number` - 指定位置の角度を計算
- `normalizeAngle(angle: number): number` - 角度を正規化
- `calculateAngleCached(position: number): number` - キャッシュ付き角度計算

### 座標計算

- `polarToCartesian(radius: number, angle: number): Point` - 極座標から直交座標に変換
- `calculateTextPosition(position: number, radius: number): Point` - テキスト位置を計算

### SVGパス生成

- `generatePizzaSlicePath(position: number, innerRadius: number, outerRadius: number): string` - ピザ型パス生成
- `generateThreeSegmentPaths(position: number, innerRadius: number, middleRadius: number, outerRadius: number): SegmentPaths` - 3分割パス生成

## バリデーション

- `isValidPosition(position: number): boolean` - 位置の有効性チェック
- `isValidKey(key: Key): boolean` - キーの有効性チェック
- `isValidSegment(segment: CircleSegment): boolean` - セグメントの有効性チェック

## 今後の拡張予定

1. **SVG調号**: 文字列からSVG画像への変更
2. **テーマ対応**: ダーク/ライトテーマの切り替え
3. **アニメーション強化**: より豊富なアニメーション効果
4. **音声機能**: キーの音声再生機能
5. **国際化**: 多言語対応

## トラブルシューティング

### よくある問題

1. **インポートエラー**: パスが正しいことを確認してください
2. **型エラー**: TypeScriptの型定義が最新であることを確認してください
3. **パフォーマンス問題**: キャッシュ機能が有効になっていることを確認してください

### デバッグ

コンポーネントの表示名が設定されているため、React DevToolsでデバッグが容易です。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 