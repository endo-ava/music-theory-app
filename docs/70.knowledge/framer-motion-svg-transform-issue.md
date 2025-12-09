# Framer Motion と SVG Transform の競合問題

## 概要

五度圏の回転機能実装時に、Framer Motion が SVG 要素に対して自動的に `transform-box: fill-box` を適用し、バウンディングボックスの変化により回転軸がずれる問題が発生しました。この問題は、Framer Motion の transform ハンドリングを回避し、ネイティブ SVG transform 属性を直接制御することで解決しました。

## 問題の症状

### 発生していた現象

1. **位置ずれの問題**

   - A～E♭（円の下半分）の回転で、方向は正しいが最終位置がずれる
   - 円の上半分（C～G♯）は正常に動作

2. **「移動して戻る」挙動**
   - CurrentKey を変更すると、一瞬移動してから元の位置に戻る謎の挙動
   - 特に DegreeLayer や FunctionalHarmonyLayer が表示されている時に顕著

### 再現条件

- `motion.g` 要素を使用して SVG グループを回転
- 子要素に `AnimatePresence` を含むコンポーネント（DegreeLayer など）が存在
- `animate={{ rotate: angle }}` で回転をアニメーション

## 根本原因

### Framer Motion の自動適用スタイル

Framer Motion は `motion.g` 要素に対して以下を強制的に適用：

```css
transform-box: fill-box;
transform-origin: 50% 50%;
```

これにより：

1. **回転原点がバウンディングボックス依存になる**

   - `transform-box: fill-box` は要素のバウンディングボックスを基準にする
   - SVG の `viewBox` 座標系ではなく、描画されている要素の範囲が基準

2. **子要素の再レンダリングでバウンディングボックスが変化**

   - `AnimatePresence` による fade in/out
   - DegreeLayer や FunctionalHarmonyLayer の表示/非表示
   - これらが発生するたびにバウンディングボックスのサイズ・位置が変わる

3. **回転中心がフレームごとに移動**
   - バウンディングボックスが変わる → `transform-origin: 50% 50%` の実座標が変わる
   - 結果として回転軸が不安定になる

### Playwright での検証結果

DOM を直接確認したところ、以下が判明：

```javascript
// コード上で設定した値
style={{ transformOrigin: "0 0" }}

// 実際に適用された値（Framer Motion が上書き）
"inlineStyle": "transform-origin: 50% 50%; transform: rotate(-270deg); transform-box: fill-box;"
"transformOrigin": "200px 200px" // 計算後の座標
```

Framer Motion が意図的にスタイルを上書きしていることが確認できました。

## 解決方法

### 実装の変更点

Framer Motion の transform ハンドリングを完全に回避し、SVG ネイティブの `transform` 属性を直接制御する方式に変更しました。

#### 変更前（問題のあるコード）

```tsx
export const RotatingCircleGroup: React.FC<Props> = memo(({ segments, textRotation }) => {
  const { rotationIndex } = useCircleOfFifthsStore();
  const targetAngle = -(rotationIndex * 30);

  return (
    <motion.g
      animate={{ rotate: targetAngle }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
    >
      {/* 子要素 */}
    </motion.g>
  );
});
```

#### 変更後（修正版）

```tsx
import React, { memo, useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

export const RotatingCircleGroup: React.FC<Props> = memo(({ segments, textRotation }) => {
  const { rotationIndex } = useCircleOfFifthsStore();
  const targetAngle = -(rotationIndex * 30);

  // useMotionValue で回転角度を管理
  const rotation = useMotionValue(targetAngle);
  const smoothRotation = useSpring(rotation, { stiffness: 50, damping: 20 });

  // グループ要素への参照
  const groupRef = useRef<SVGGElement>(null);

  // rotationIndex が変わったら回転角度を更新
  useEffect(() => {
    rotation.set(targetAngle);
  }, [targetAngle, rotation]);

  // スプリング値の変化を購読して SVG の transform 属性を直接更新
  useEffect(() => {
    const unsubscribe = smoothRotation.on('change', (value: number) => {
      if (groupRef.current) {
        // SVG ネイティブの transform 属性を使用（原点は常に (0,0)）
        groupRef.current.setAttribute('transform', `rotate(${value})`);
      }
    });

    // 初期値を設定
    if (groupRef.current) {
      groupRef.current.setAttribute('transform', `rotate(${smoothRotation.get()})`);
    }

    return unsubscribe;
  }, [smoothRotation]);

  return <g ref={groupRef}>{/* 子要素 */}</g>;
});
```

### 技術的なポイント

1. **通常の `<g>` 要素を使用**

   - `motion.g` ではなく通常の SVG `<g>` 要素
   - Framer Motion の transform ハンドリングを完全に回避

2. **`useMotionValue` と `useSpring` でアニメーション**

   - Framer Motion のスプリングアニメーション機能は維持
   - DOM への反映だけを手動で制御

3. **`smoothRotation.on('change')` で購読**

   - スプリング値の変化をリアルタイムで監視
   - `setAttribute('transform', ...)` で SVG transform を直接更新

4. **SVG ネイティブの回転原点**
   - `rotate(angle)` は常に `(0, 0)` を中心に回転
   - `viewBox="-200 -200 400 400"` の設定により、(0,0) は円の中心
   - バウンディングボックスの変化に一切影響されない

## 検証結果

Playwright でのテスト結果：

- ✅ A～E♭ の範囲を含む全ての位置で正しく回転
- ✅ CurrentKey を変更しても「移動して戻る」挙動は発生しない
- ✅ rotationIndex（回転ボタン）と currentKey（キー選択）が独立して動作
- ✅ DegreeLayer と FunctionalHarmonyLayer の表示/非表示でも影響なし
- ✅ スプリングアニメーションのスムーズさは維持

## 教訓・ポイント

### 🎯 Framer Motion と SVG の相性問題

- Framer Motion は CSS Transform を前提に設計されている
- SVG は独自の座標系と transform 仕様を持つ
- この2つを組み合わせる場合、期待しない挙動が発生する可能性が高い

### 🔍 デバッグのアプローチ

1. **実際の DOM を確認する**

   - React DevTools や console.log では見えない問題がある
   - Playwright などで実際のブラウザの DOM を直接確認
   - `inlineStyle` や計算後の `transformOrigin` 座標を確認

2. **段階的な検証**

   - まず静的な状態で動作確認
   - 次にアニメーションを追加
   - 最後に子要素の動的変化を追加

3. **ライブラリの挙動を疑う**
   - 「設定したはずの値」と「実際の値」が異なる場合、ライブラリの自動処理を疑う
   - 特に transform 系のプロパティは多くのライブラリが介入する

### 💡 SVG アニメーションのベストプラクティス

1. **可能な限り SVG ネイティブの機能を使う**

   - `transform` 属性による変形
   - `viewBox` による座標系の制御
   - これらは最も予測可能で安定した挙動を示す

2. **Framer Motion は値の管理に徹する**

   - `useMotionValue` と `useSpring` でアニメーション値を管理
   - DOM への反映は手動で行う
   - これにより Framer Motion の強力なアニメーション機能を活用しつつ、SVG の制御を保つ

3. **`transform-box` と `transform-origin` に注意**
   - CSS の `transform-origin` は SVG では直感的でない挙動を示すことがある
   - 特に動的にサイズが変わる要素では予期しない結果になる
   - SVG では座標系を正しく設計し、`viewBox` を活用する

### ⚠️ 避けるべきパターン

```tsx
// ❌ 避けるべき：motion.g と CSS transform
<motion.g
  animate={{ rotate: angle }}
  style={{ transformOrigin: "..." }} // 上書きされる可能性
>

// ✅ 推奨：ネイティブ transform と手動制御
<g ref={ref}>
  {/* setAttribute('transform', ...) で制御 */}
</g>
```

## 参考資料

### 関連ドキュメント

- `docs/20.development/2003.frontend-design.md` - フロントエンド設計規約
- `docs/20.development/2004.architecture.md` - アーキテクチャ設計
- `src/features/circle-of-fifths/components/CircleOfFifthsClient.tsx` - 実装コード

### 外部リソース

- [Framer Motion - useMotionValue](https://www.framer.com/motion/use-motion-value/)
- [MDN - SVG transform attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform)
- [MDN - transform-box CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box)
- [SVG viewBox Coordinate System](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)

## 更新履歴

- 2025-12-07: 初版作成（五度圏回転機能の問題解決時の知見を記録）
