# ARIA属性の使い分けガイド

> **作成日**: 2025-07-07  
> **更新日**: 2025-07-07  
> **カテゴリ**: アクセシビリティ・知識共有

## 概要

WebアクセシビリティにおけるARIA属性、特に`aria-label`と`aria-labelledby`の違いと適切な使い分けについて解説します。

## aria-label vs aria-labelledby の基本的な違い

### aria-label

**直接的なラベル**を提供する属性

```tsx
// ✅ 直接ラベルを指定
<button aria-label="メニューを開く">☰</button>
<section aria-label="コントロールパネル">...</section>
```

### aria-labelledby

**他の要素のIDを参照**してラベルとする属性

```tsx
// ✅ 他の要素を参照してラベル化
<h2 id="settings-title">設定</h2>
<section aria-labelledby="settings-title">...</section>
```

## 詳細比較表

| 属性                | 説明           | ラベルの場所 | 使用場面                         |
| ------------------- | -------------- | ------------ | -------------------------------- |
| **aria-label**      | 直接的なラベル | 属性値内     | シンプルなラベル、アイコンボタン |
| **aria-labelledby** | 他要素参照     | 他の要素     | 既存のテキストをラベルとして活用 |

## 使い分けガイドライン

### aria-label を使う場面

```tsx
// 1. アイコンのみのボタン
<button aria-label="検索">🔍</button>
<button aria-label="お気に入りに追加">❤️</button>

// 2. 視覚的なラベルがない要素
<input type="search" aria-label="商品を検索" />
<select aria-label="言語を選択">...</select>

// 3. シンプルで短いラベル
<nav aria-label="メインナビゲーション">...</nav>
<main aria-label="メインコンテンツ">...</main>

// 4. 要素が独立している場合
<section aria-label="サイドバー">...</section>
<aside aria-label="関連記事">...</aside>
```

### aria-labelledby を使う場面

```tsx
// 1. 既存の見出しをラベルとして活用
<h2 id="user-info">ユーザー情報</h2>
<form aria-labelledby="user-info">
  <input type="text" name="name" placeholder="名前" />
  <input type="email" name="email" placeholder="メールアドレス" />
</form>

// 2. 複数要素を組み合わせたラベル
<span id="billing">請求先</span>
<span id="name">田中太郎</span>
<fieldset aria-labelledby="billing name">
  <input type="text" name="address" />
</fieldset>

// 3. 動的なラベル（内容が変わる）
<h3 id="current-step">ステップ1: 基本情報</h3>
<div aria-labelledby="current-step">
  <!-- ステップの内容 -->
</div>

// 4. コンテキストが重要な場合
<h4 id="chart-title">2024年売上推移</h4>
<div role="img" aria-labelledby="chart-title">
  <!-- チャート要素 -->
</div>
```

## ARIA属性の優先順位

ARIA仕様では以下の優先順位があります：

1. **aria-labelledby** (最優先)
2. **aria-label**
3. **通常のラベル要素** (`<label>`, 見出しなど)
4. **title属性**

```tsx
// aria-labelledby が優先される例
<h2 id="title">重要なタイトル</h2>
<section
  aria-label="これは無視される"
  aria-labelledby="title"  // こちらが優先される
>
  <!-- 内容 -->
</section>
```

## アンチパターン（避けるべき例）

### 1. 同じ情報を重複

```tsx
// ❌ 悪い例：重複した情報
<h2 id="title">設定</h2>
<section aria-label="設定" aria-labelledby="title">

// ✅ 良い例：どちらか一つを使用
<h2 id="title">設定</h2>
<section aria-labelledby="title">
```

### 2. 存在しないIDを参照

```tsx
// ❌ 悪い例：存在しないIDを参照
<section aria-labelledby="non-existent-id">

// ✅ 良い例：存在するIDを参照、またはaria-labelを使用
<h2 id="existing-title">タイトル</h2>
<section aria-labelledby="existing-title">
```

### 3. コンポーネント間でのID依存

```tsx
// ❌ 悪い例：コンポーネント間でのID依存
// ParentComponent.tsx
<section aria-labelledby="child-title">
  <ChildComponent />
</section>

// ChildComponent.tsx
<h2 id="child-title">Title</h2>

// ✅ 良い例：各コンポーネントが独立
// ParentComponent.tsx
<section aria-label="コントロールパネル">
  <ChildComponent />
</section>

// ChildComponent.tsx
<h2>Title</h2>
```

## 実際のプロジェクトでの修正例

### 修正前（問題あり）

```tsx
// SidePanel.tsx
<section aria-labelledby="side-panel-title">
  <ViewController />
</section>

// ViewController.tsx (旧: side-panel内のコンポーネント)
<h2 id="side-panel-title">View controller</h2>
```

**問題点:**

- コンポーネント間でのID依存関係
- ViewControllerの再利用性が低下
- 保守性の悪化

### 修正後（推奨）

```tsx
// SidePanel.tsx (現: layouts/SidePanel)
<section aria-label="コントロールパネル">
  <ViewController />
</section>

// ViewController.tsx (現: features/view-controller)
<h2>View controller</h2>
<div role="radiogroup" aria-label="Hub種類の選択">
  <!-- ラジオボタン -->
</div>
```

**改善点:**

- 各コンポーネントが独立
- 明確なラベリング
- 再利用性の向上

## 実践的な選択指針

### 選択フローチャート

```
要素にラベルが必要
├─ 既存の見出しやテキストを活用したい？
│  ├─ Yes → aria-labelledby を検討
│  │  ├─ 同一コンポーネント内？
│  │  │  ├─ Yes → aria-labelledby
│  │  │  └─ No → aria-label（コンポーネント間依存を避ける）
│  │  └─ 複数要素を組み合わせる？
│  │     ├─ Yes → aria-labelledby="id1 id2 id3"
│  │     └─ No → aria-labelledby="single-id"
│  └─ No → aria-label
│     ├─ シンプルで短い？ → aria-label
│     ├─ アイコンのみ？ → aria-label
│     └─ 独立した要素？ → aria-label
```

### チェックリスト

- [ ] ラベルは分かりやすく、具体的か？
- [ ] コンポーネント間でのID依存はないか？
- [ ] 重複したラベル情報はないか？
- [ ] 参照するIDは確実に存在するか？
- [ ] スクリーンリーダーで読み上げて自然か？

## 参考資料

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN - aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
- [MDN - aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby)
- [WebAIM - ARIA](https://webaim.org/articles/aria/)

## まとめ

- **aria-label**: 直接的で独立したラベル。シンプルな場合に最適
- **aria-labelledby**: 既存要素の再利用。DRY原則に従いたい場合に最適
- **コンポーネント設計**: ID依存関係を避け、各コンポーネントの独立性を保つ
- **アクセシビリティ**: 常にスクリーンリーダーユーザーの体験を考慮する

適切なARIA属性の使用により、より包含的で使いやすいWebアプリケーションを構築できます。
