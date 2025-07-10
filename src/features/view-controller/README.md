# View Controller Feature

音楽理論アプリにおけるView Controller機能の実装。

## 概要

View Controllerは、Canvasに描画するHub（五度圏 vs クロマチック）を切り替える機能を提供します。
音楽を分析するための「世界観（レンズ）」を選択するコントロールとして機能します。

## 機能

- Hub種類の選択（五度圏、クロマチック）
- 選択されたHubの説明表示
- キーボードナビゲーション対応
- アクセシビリティ対応

## コンポーネント

### ViewController

メインのView Controllerコンポーネント。Hub切り替えUIを提供します。

### HubRadioGroup

Hub選択のためのラジオボタングループコンポーネント。

### HubOptionButton

個別のHub選択ボタンコンポーネント。

## フック

### useViewController

View Controller関連のロジックを管理するカスタムフック。

## 使用方法

```tsx
import { ViewController } from '@/features/view-controller';

function MyComponent() {
  return <ViewController title="View Controller" />;
}
```

## アーキテクチャ

このFeatureは以下の原則に基づいて設計されています：

- **単一責任原則**: Hub切り替えの機能のみに集中
- **コンポーネント分離**: 各コンポーネントが明確な役割を持つ
- **カスタムフック**: ロジックとUIの分離
- **アクセシビリティ**: キーボードナビゲーション、ARIA属性の適切な使用
- **型安全性**: TypeScriptによる型定義の徹底
