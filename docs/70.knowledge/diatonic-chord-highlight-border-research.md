# ダイアトニックコード統合外枠ハイライト実装調査

## 📋 要求内容

**現在の問題**:

- ダイアトニックコード表示時（shouldHighlight=true）に個別KeyAreaごとにstroke枠線が表示
- 7つのKeyAreaそれぞれに内側・外側の枠線が存在
- 視覚的にノイズが多く、統一感に欠ける

**要求される改善**:

- ダイアトニックコード7つを統合した**外枠のみ**表示
- 個別KeyAreaの内側枠線は非表示
- 7つのKeyAreaを囲む統合された境界線でグループ化表現

## 🎯 技術実装方針

### 方針1: SVGパス統合アプローチ（推奨）

**概要**: 7つのKeyAreaの外周パスを解析し、統合された外枠パスを生成

```typescript
// 新しいコンポーネント設計
const DiatonicChordHighlightBorder: React.FC = () => {
  const { getHighlightedKeys } = useDiatonicChordHighlight();
  const highlightedKeys = getHighlightedKeys(); // KeyDTO[]を返す

  // 7つのKeyAreaパスを統合して外枠パス生成
  const combinedBorderPath = useMemo(() => {
    return generateCombinedBorderPath(highlightedKeys);
  }, [highlightedKeys]);

  if (highlightedKeys.length === 0) return null;

  return (
    <motion.path
      d={combinedBorderPath}
      fill="none"
      stroke={currentKeyColor}
      strokeWidth="2px"
      className="pointer-events-none"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};
```

**核心となる統合ロジック**:

```typescript
function generateCombinedBorderPath(keys: KeyDTO[]): string {
  // 1. 各KeyAreaの扇形パス座標を取得
  // 2. 隣接するエリアの内側境界を削除
  // 3. 外周のみを結ぶ統合パスを生成
  // 4. 滑らかな境界線として返す
}
```

**実装ステップ**:

1. **パス解析ユーティリティ作成**

   - 既存のpathGeneration.tsを拡張
   - KeyAreaの外周座標抽出機能
   - 隣接判定アルゴリズム

2. **パス統合ロジック実装**

   - 7つの扇形セグメントの外周統合
   - SVG arc pathの結合処理
   - クリッピング・マスク処理

3. **CircleOfFifthsへの組み込み**

   ```typescript
   <svg>
     {segments.map(...)} {/* 既存KeyArea */}
     <DiatonicChordHighlightBorder /> {/* 新しい統合外枠 */}
   </svg>
   ```

4. **個別KeyAreaのstroke調整**
   ```typescript
   // KeyAreaContent.tsx
   stroke: shouldHighlight ? 'transparent' : 'var(--color-border)';
   ```

### 方針2: オーバーレイマスクアプローチ（代替案）

**概要**: CSS mask-imageを使用した外枠のみ表示

```typescript
const DiatonicOverlay: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        border: `2px solid ${currentKeyColor}`,
        maskImage: 'polygon(外枠座標)',
        maskClip: 'border-box'
      }}
    />
  );
};
```

**メリット**: 実装が比較的容易
**デメリット**: 視覚効果が限定的、細かい制御が困難

## 🔧 技術的課題と解決策

### 高難易度課題

1. **複雑な幾何学計算**

   - **課題**: 7つの扇形セグメントの正確な外周座標計算
   - **解決策**: 既存のCIRCLE_LAYOUTとgeometry.tsを活用、段階的な座標計算

2. **SVGパス操作の複雑さ**

   - **課題**: 複数arcパスの結合、パス方向統一
   - **解決策**: D3.js pathライブラリまたはカスタムSVGパスビルダー

3. **動的パス再計算**
   - **課題**: 異なるキー変更時のリアルタイム外枠更新
   - **解決策**: useMemoによるメモ化とパフォーマンス最適化

### 実装上の注意点

**既存コードとの連携**:

- `src/features/circle-of-fifths/utils/pathGeneration.ts`の拡張
- `src/features/circle-of-fifths/utils/geometry.ts`の活用
- `useDiatonicChordHighlight`との密な連携

**パフォーマンス考慮**:

- 複雑な計算のメモ化
- SVGパス文字列の最適化
- 不要な再レンダリング防止

## 📊 実装可能性評価

| 項目             | 評価               | 詳細                             |
| ---------------- | ------------------ | -------------------------------- |
| **実装可能性**   | ✅ **Possible**    | 技術的には実現可能               |
| **複雑度**       | 🔴 **Very High**   | 高度な幾何学計算とSVG操作が必要  |
| **工数見積もり** | 📅 **3-5日**       | 設計1日 + 実装2-3日 + テスト1日  |
| **技術リスク**   | ⚠️ **Medium-High** | 計算精度とパフォーマンスに注意   |
| **保守性**       | 🔶 **Medium**      | 複雑だが、適切な抽象化で管理可能 |

## 🚀 推奨実装アプローチ

### Phase 1: プロトタイプ検証（1日）

1. 単一キーセット（C Major）での外枠生成検証
2. 基本的なパス統合ロジックの動作確認
3. パフォーマンステスト

### Phase 2: 完全実装（2-3日）

1. 全12キーでの動作検証
2. エッジケース処理（隣接判定、境界処理）
3. 既存UIとの統合

### Phase 3: 最適化とテスト（1日）

1. パフォーマンス最適化
2. 単体テスト作成
3. 視覚的回帰テスト

## 🔗 関連ファイル

**核心ファイル**:

- `src/features/circle-of-fifths/components/CircleOfFifths.tsx`
- `src/features/circle-of-fifths/hooks/useDiatonicChordHighlight.ts`
- `src/features/circle-of-fifths/utils/pathGeneration.ts`
- `src/features/circle-of-fifths/utils/geometry.ts`

**新規作成予定**:

- `src/features/circle-of-fifths/components/DiatonicChordHighlightBorder.tsx`
- `src/features/circle-of-fifths/utils/pathIntegration.ts`
- テストファイル群

## 💡 将来の拡張可能性

1. **アニメーション強化**: 外枠の表示/非表示アニメーション
2. **カスタマイズ**: 外枠スタイルの設定可能化
3. **他機能への応用**: 同様の統合外枠を他の機能にも適用

---

**結論**: 技術的に実現可能だが、相当な複雑さを伴う機能。段階的なアプローチと十分なプロトタイプ検証を推奨。
