# Tailwind CSS className最適化ナレッジ

## 本質的な最適化原則

className重複を効率的に排除するための基本的思考法と判断基準。

## 1. 階層分析アプローチ

### Step 1: 重複検出

同じclassName文字列が複数の要素で使用されているかを確認する

### Step 2: 適用範囲分析

重複するclassNameが「同じ親要素内の全ての子要素」で使用されているかを確認する

### Step 3: 階層最適化

適用範囲が一致する場合、最も上位の共通親要素にclassNameを移動する

## 2. 移動可能性の判断基準

### ✅ 移動可能（CSS継承プロパティ）

- **フォント系**: `text-xs`, `text-sm`, `font-bold`, `font-medium`
- **色系**: `text-foreground`, `text-muted-foreground`
- **配置系（条件付き）**: 全子要素が同じ配置の場合の `text-center`, `text-left`

### ❌ 移動不可（要素固有プロパティ）

- **レイアウト系**: `flex`, `grid`, `w-full`, `h-auto`
- **スペーシング系**: `p-4`, `m-2`, `space-y-4`
- **インタラクション系**: `hover:`, `focus:`, `active:`
- **ポジション系**: `absolute`, `relative`, `fixed`

## 3. 実践的判断フロー

```
1. 同じclassNameが3回以上出現している？
   └─ Yes → Step 2へ
   └─ No → 最適化不要

2. 全て同じ親要素の直接の子要素？
   └─ Yes → Step 3へ
   └─ No → 変数化を検討

3. CSS継承可能なプロパティ？
   └─ Yes → 親要素に移動
   └─ No → 変数化を検討

4. 複雑なスタイル組み合わせ？
   └─ Yes → const定義で変数化
   └─ No → そのまま
```

## 4. 最適化パターン

### パターンA: 階層移動

全子要素で共通 → 親要素に集約

```tsx
// Before
<Table>
  <TableRow>
    <TableCell className="text-xs text-center">A</TableCell>
    <TableCell className="text-xs text-center">B</TableCell>
  </TableRow>
</Table>

// After
<Table className="text-xs text-center">
  <TableRow>
    <TableCell>A</TableCell>
    <TableCell>B</TableCell>
  </TableRow>
</Table>
```

### パターンB: 変数化

複雑な組み合わせ → const定義

```tsx
// Before
<button className="hover:bg-accent transition-colors rounded px-2 py-1 w-full">
<button className="hover:bg-accent transition-colors rounded px-2 py-1 w-full">

// After
const buttonClassName = "hover:bg-accent transition-colors rounded px-2 py-1 w-full";
<button className={buttonClassName}>
<button className={buttonClassName}>
```

## 5. 最適化の限界

### 意味の保持

要素の意味的役割を損なってはならない

### 過度な抽象化の回避

将来の変更を困難にする過度な共通化は避ける

### 可読性優先

最適化により可読性が著しく低下する場合は現状維持

## 6. 効果測定

### 定量的指標

- className文字列の重複回数減少
- ファイルサイズ削減
- 修正箇所数の削減

### 定性的指標

- コードの保守性向上
- スタイル変更の容易性
- 開発者体験の改善
