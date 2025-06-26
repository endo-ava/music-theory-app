# [コンポーネント名] 設計書

> **作成日**: [YYYY-MM-DD]  
> **更新日**: [YYYY-MM-DD]  
> **バージョン**: [x.x.x]  
> **作成者**: [作成者名]

[<< 画面設計書に戻る](../screenDesigns/[関連画面].md)

[コンポーネントの1行概要説明]

## 📋 目次

- [概要](#概要)
- [アーキテクチャ](#アーキテクチャ)
- [技術仕様](#技術仕様)
- [使用方法](#使用方法)
- [設計思想](#設計思想)
- [パフォーマンス](#パフォーマンス)
- [アクセシビリティ](#アクセシビリティ)
- [テスト戦略](#テスト戦略)
- [開発・保守](#開発保守)

## 概要

### 目的・役割

[このコンポーネントが果たす役割と存在理由を記述]

### 主要機能

- **機能1**: 機能の説明
- **機能2**: 機能の説明
- **機能3**: 機能の説明

### ビジネス価値

[このコンポーネントが提供するビジネス価値を記述]

## アーキテクチャ

### コンポーネント構成図

```mermaid
graph TD
    A[メインコンポーネント] --> B[子コンポーネント1]
    A --> C[子コンポーネント2]
    B --> D[孫コンポーネント1]
    C --> E[孫コンポーネント2]
```

### データフロー図

```mermaid
flowchart LR
    A[親コンポーネント] -->|Props| B[メインコンポーネント]
    B -->|状態| C[状態管理Store]
    C -->|データ| D[子コンポーネント]
    D -->|イベント| B
```

### ファイル構造

```
src/components/[ComponentName]/
├── README.md                    # このファイル
├── [ComponentName].tsx          # メインコンポーネント
├── components/                  # 子コンポーネント
│   ├── [SubComponent1].tsx     # 子コンポーネント1
│   ├── [SubComponent2].tsx     # 子コンポーネント2
│   └── [SubComponent3].tsx     # 子コンポーネント3
├── hooks/                       # カスタムフック
│   ├── use[ComponentName].ts   # メインフック
│   └── use[Feature].ts         # 機能別フック
├── utils/                       # ユーティリティ関数
│   └── index.ts                # エクスポート用ファイル
├── constants/                   # 定数定義
│   └── index.ts                # 定数ファイル
├── types/                       # コンポーネント固有型定義
│   └── index.ts                # 型定義ファイル
└── __tests__/                   # テストファイル
    ├── [ComponentName].test.tsx
    └── [SubComponent].test.tsx
```

### 依存関係

#### 内部依存

- `@/components/[依存コンポーネント]` - [依存理由]
- `@/hooks/[依存フック]` - [依存理由]
- `@/utils/[依存ユーティリティ]` - [依存理由]

#### 外部依存

- `react` - Reactフレームワーク
- `next` - Next.jsフレームワーク
- `motion` - アニメーションライブラリ
- `clsx` - クラス名結合ユーティリティ
- `tailwind-merge` - Tailwindクラス最適化

## 技術仕様

### Props仕様

#### メインコンポーネント

```typescript
interface [ComponentName]Props {
  /** 必須プロパティの説明 */
  requiredProp: string;

  /** オプショナルプロパティの説明 */
  optionalProp?: number;

  /** カスタムクラス名 */
  className?: string;

  /** カスタムスタイル */
  style?: React.CSSProperties;

  /** イベントハンドラー */
  onEvent?: (value: string) => void;
}
```

#### 子コンポーネント

```typescript
interface [SubComponent]Props {
  /** 子コンポーネントのプロパティ */
  childProp: boolean;
}
```

### 状態管理

#### ローカル状態

```typescript
// useState使用例
const [localState, setLocalState] = useState<StateType>(initialValue);
```

#### グローバル状態 (Zustand)

```typescript
interface [ComponentName]Store {
  // 状態プロパティ
  state: StateType;

  // アクション
  setState: (state: StateType) => void;
  resetState: () => void;
}
```

### API仕様

#### 公開メソッド

| メソッド名 | 引数          | 戻り値       | 説明           |
| ---------- | ------------- | ------------ | -------------- |
| `method1`  | `param: Type` | `ReturnType` | メソッドの説明 |
| `method2`  | `param: Type` | `void`       | メソッドの説明 |

#### イベント

| イベント名 | ペイロード          | 説明           |
| ---------- | ------------------- | -------------- |
| `onEvent1` | `{ data: Type }`    | イベントの説明 |
| `onEvent2` | `{ value: string }` | イベントの説明 |

## 使用方法

### 基本的な使用

```tsx
import { [ComponentName] } from '@/components/[ComponentName]';

function App() {
  return (
    <div>
      <[ComponentName]
        requiredProp="value"
        optionalProp={42}
        onEvent={(value) => console.log(value)}
      />
    </div>
  );
}
```

### カスタマイズ例

```tsx
import { [ComponentName] } from '@/components/[ComponentName]';

function CustomExample() {
  return (
    <[ComponentName]
      requiredProp="custom-value"
      className="custom-styles"
      style={{
        width: '100%',
        height: '400px'
      }}
      onEvent={handleCustomEvent}
    />
  );
}
```

### 高度な使用例

```tsx
import { [ComponentName] } from '@/components/[ComponentName]';
import { use[ComponentName] } from '@/components/[ComponentName]/hooks';

function AdvancedExample() {
  const { state, actions } = use[ComponentName]();

  return (
    <[ComponentName]
      requiredProp={state.value}
      onEvent={actions.handleEvent}
    />
  );
}
```

## 設計思想

### 1. 単一責任原則

[このコンポーネントが持つ単一の責任について説明]

### 2. 再利用性

[再利用性を高めるための設計上の工夫について説明]

### 3. 保守性

[保守性を考慮した設計について説明]

### 4. パフォーマンス

[パフォーマンスを考慮した設計について説明]

### 5. アクセシビリティ

[アクセシビリティを考慮した設計について説明]

## パフォーマンス

### 最適化手法

- **`React.memo`**: 不要な再レンダリングを防止
- **`useMemo`**: 重い計算結果をメモ化
- **`useCallback`**: 関数参照の安定化
- **コード分割**: 動的インポートによる遅延読み込み

### パフォーマンス指標

| 指標                 | 目標値  | 現在値   | 測定方法                |
| -------------------- | ------- | -------- | ----------------------- |
| 初期レンダリング時間 | < 100ms | [測定値] | Performance API         |
| バンドルサイズ       | < 50KB  | [測定値] | webpack-bundle-analyzer |
| メモリ使用量         | < 10MB  | [測定値] | Chrome DevTools         |

### 大量データでの考慮事項

[大量のデータを扱う場合の性能考慮事項]

## アクセシビリティ

### WCAG準拠レベル

**レベル AA** に準拠

### 実装済み機能

- **キーボードナビゲーション**: Tab、Enter、Escapeキーでの操作
- **スクリーンリーダー対応**: 適切なARIA属性の設定
- **フォーカス管理**: 視覚的なフォーカスインジケーター
- **色覚障害対応**: 色以外の手段での情報伝達

### ARIA属性

| 属性            | 値           | 用途       |
| --------------- | ------------ | ---------- |
| `aria-label`    | "説明文"     | 要素の説明 |
| `aria-expanded` | `true/false` | 展開状態   |
| `aria-current`  | `page`       | 現在の状態 |

### キーボード操作

| キー          | 動作                       |
| ------------- | -------------------------- |
| `Tab`         | 次の要素にフォーカス移動   |
| `Shift + Tab` | 前の要素にフォーカス移動   |
| `Enter/Space` | 要素の実行                 |
| `Escape`      | モーダル・メニューを閉じる |

## テスト戦略

### ユニットテスト

```typescript
describe('[ComponentName]', () => {
  it('正常にレンダリングされること', () => {
    // テストコード
  });

  it('Propsが正しく反映されること', () => {
    // テストコード
  });

  it('イベントが正しく発火すること', () => {
    // テストコード
  });
});
```

### インテグレーションテスト

```typescript
describe('[ComponentName] Integration', () => {
  it('他のコンポーネントと正しく連携すること', () => {
    // テストコード
  });
});
```

### E2Eテスト

```typescript
describe('[ComponentName] E2E', () => {
  it('ユーザーが期待通りに操作できること', () => {
    // E2Eテストコード
  });
});
```

### 視覚回帰テスト

```typescript
describe('[ComponentName] Visual', () => {
  it('スクリーンショットが期待通りであること', () => {
    // 視覚回帰テスト
  });
});
```

### テストカバレッジ目標

| 種類              | 目標  | 現在      |
| ----------------- | ----- | --------- |
| Line Coverage     | > 90% | [現在値]% |
| Branch Coverage   | > 85% | [現在値]% |
| Function Coverage | > 95% | [現在値]% |

## 開発・保守

### 開発フロー

1. **要件定義**: 機能要件・非機能要件の明確化
2. **設計**: コンポーネント設計・API設計
3. **実装**: TDD/BDDでの実装
4. **テスト**: 各種テストの実行
5. **レビュー**: コードレビュー・デザインレビュー
6. **デプロイ**: Storybook・本番環境への反映

### デバッグ方法

#### 開発ツール

- **React Developer Tools**: コンポーネント状態の確認
- **Chrome DevTools**: パフォーマンス分析
- **Storybook**: 独立した環境でのテスト

#### ログ出力

```typescript
// デバッグ用ログ
console.group('[ComponentName] Debug');
console.log('Props:', props);
console.log('State:', state);
console.groupEnd();
```

### 既知の問題・制限事項

| 問題  | 影響度 | 対応予定 | 回避方法       |
| ----- | ------ | -------- | -------------- |
| 問題1 | 高     | v2.0.0   | 回避方法の説明 |
| 問題2 | 中     | 検討中   | 回避方法の説明 |

### 今後の拡張予定

#### 短期 (次バージョン)

- [ ] 機能A の追加
- [ ] パフォーマンス改善
- [ ] アクセシビリティ強化

#### 中期 (3ヶ月以内)

- [ ] 機能B の追加
- [ ] 他コンポーネントとの統合
- [ ] テストカバレッジ向上

#### 長期 (6ヶ月以内)

- [ ] 機能C の追加
- [ ] アーキテクチャ見直し
- [ ] 国際化対応

### 関連ドキュメント

- [要件定義書](../01.requirements.md)
- [画面設計書](../screenDesigns/[関連画面].md)
- [開発規約](../03.developmentAgreement.md)
- [API仕様書](./api-specification.md)
- [Storybook](http://localhost:6006/?path=/story/[component-name])

### 用語集

| 用語  | 定義  |
| ----- | ----- |
| 用語1 | 定義1 |
| 用語2 | 定義2 |

---

> 📝 **Note**: この設計書は [開発規約](../03.developmentAgreement.md) に従って作成されています。  
> 🔄 **Update**: 機能追加・変更時はこの設計書も合わせて更新してください。  
> 🤝 **Collaboration**: 不明な点があれば開発チームまでお問い合わせください。
