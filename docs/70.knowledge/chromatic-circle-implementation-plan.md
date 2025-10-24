# クロマチックサークル コンポーネント実装方針書

## 1. 概要と目的

### 1.1. クロマチックサークルとは

クロマチックサークルは、12個のピッチクラス（C, C♯, D, D♯...）を**半音階順**に円形配置したビジュアライゼーションです。音楽理論において、スケールやコードの**内部構造（インターバル）を幾何学的に分析**するための重要なツールです。

### 1.2. 五度圏との違い

| 項目             | 五度圏 (Circle of Fifths)                   | クロマチックサークル (Chromatic Circle)               |
| :--------------- | :------------------------------------------ | :---------------------------------------------------- |
| **目的**         | キー同士の関係性、コード進行の分析          | スケール/コードの内部構造、インターバルの幾何学的分析 |
| **配置順序**     | 五度の関係性（C→G→D→A...）                  | 半音階順（C→C♯→D→D♯...）                              |
| **構造**         | ドーナツ型（3層：マイナー、メジャー、調号） | ピザ型（1層：ピッチクラスのみ）                       |
| **表示内容**     | キー名（メジャー/マイナー）、調号           | ピッチクラス名（C, C♯/D♭等）                          |
| **レイヤー表示** | ダイアトニックコード、近親調など            | スケール構成音の多角形、コード構成音の幾何学図形      |

### 1.3. Phase 1のスコープ

今回の実装は、**Phase 1: 静的な見た目のみ**に限定します。

**実装する内容:**

- 12個のピッチクラスを半音階順に円形配置
- ピザ型セグメントのSVG描画
- ピッチクラス名の表示（C♯/D♭のように併記）
- 基本的なスタイリング（中性的な色、境界線）

**Phase 2以降に実装する内容:**

- ホバー・クリックのインタラクション
- 音声再生（単音）
- レイヤー表示（スケール構成音の多角形、コード構成音のハイライト）
- 異名同音の文脈依存切り替え（C♯ ⇔ D♭）

---

## 2. 設計思想

### 2.1. 独立性の原則

五度圏とクロマチックサークルは、その目的と構造が本質的に異なります。そのため、以下の方針で実装します：

- **完全に独立したfeature**として実装（`src/features/chromatic-circle/`）
- コードの重複を恐れず、まずは動くものを作る（YAGNI原則）
- 将来的に共通化が必要になった場合は、その時点でリファクタリング

**利点:**

- 関心の分離による保守性向上
- 変更の影響範囲が明確
- テストが書きやすい

### 2.2. 段階的実装

Phase 1で基礎（静的な見た目）を固め、Phase 2以降で機能を積み上げる戦略です。

**理由:**

- 早期にビジュアルフィードバックを得られる
- 基本構造の妥当性を検証してから複雑な機能を追加
- レビューや調整がしやすい

### 2.3. Domain層の完全な独立性（最重要原則）

**本プロジェクトの核心ルール:**

> 「音楽理論ロジックは Domain層に完全に独立させ、UI/フレームワークから一切の依存を排除する」

**クロマチックサークルにおける適用:**

- **ピッチクラスの定義**: C, C♯, D... の12音の並び順は音楽理論の知識 → Domain層に配置
- **ChromaticCircleService**: 五度圏の`CircleOfFifthsService`と同様に、Domain層にサービスを作成
- **Feature層の責務**: Domain層が提供するデータ（DTO）を受け取り、SVGとして描画するのみ

**依存の方向:**

```
Feature層 (chromatic-circle) ──依存→ Domain層 (services/ChromaticCircle)
     ↑                                       ↑
     └──────── 依存しない ──────────────────┘
```

**メリット:**

- 音楽理論ロジックのテストが容易（UI不要）
- 音楽理論の変更がUI層に影響しない
- 将来的なフレームワーク変更に強い

### 2.4. 視覚的シンプルさ

クロマチックサークルは「インターバルの幾何学」を表現するため、**シンプルで明瞭な見た目**が重要です。

**設計判断:**

- ピザ型の単層構造（五度圏のようなドーナツ型は不要）
- 中心に小さな円形の空白を作り、視覚的バランスを保つ
- 中性的な色（グレー系）で統一し、レイヤー表示時のハイライトを際立たせる

### 2.5. Server Component優先

**Next.js 15のベストプラクティス:**

- Phase 1では静的な見た目のみなので、**Server Componentとして実装**
- インタラクション（ホバー、クリック）が必要になるPhase 2で初めて`'use client'`を追加
- データフェッチはServer Componentで行い、描画のみをClient Componentに委譲

---

## 3. ファイル構成

### 3.1. Domain層（音楽理論ロジック）

```
src/domain/services/
└── ChromaticCircle.ts               # クロマチックサークルのドメインサービス
                                     # - ピッチクラスの定義（12音）
                                     # - セグメントデータの生成
                                     # - DTO（Data Transfer Object）の提供
```

**重要:** この層は完全に独立しており、React/Next.js/SVGなどのUI技術を一切知らない。

### 3.2. Feature層（UI/表示層）

```
src/features/chromatic-circle/
├── components/
│   ├── ChromaticCircle.tsx          # メインコンポーネント（12セグメントをレンダリング）
│   └── ChromaticSegment.tsx         # 単一セグメント（ピザ型1つ + テキスト）
├── utils/
│   ├── chromaticCircleData.ts       # セグメントデータの生成・事前計算（Domain層を呼び出す）
│   ├── geometry.ts                  # 幾何計算（極座標変換、角度計算）
│   ├── pathGeneration.ts            # SVGパス生成（ピザ型セグメント）
│   └── validation.ts                # バリデーション（position範囲チェック等）
├── constants/
│   └── index.ts                     # レイアウト定数（RADIUS, CENTER_RADIUS等）
├── types.ts                         # 型定義（SegmentData等、UI特化型）
├── index.ts                         # 公開API（外部からのエクスポート）
├── README.md                        # フィーチャーのドキュメント
└── __stories__/
    └── ChromaticCircle.stories.tsx  # Storybook（ビジュアル確認用）
```

**役割:** Domain層が提供するDTOを受け取り、SVGグラフィックスとして描画する。

**テストファイル（別途作成）:**

```
src/features/chromatic-circle/
├── utils/test/
│   ├── geometry.test.ts
│   ├── pathGeneration.test.ts
│   └── chromaticCircleData.test.ts
└── components/test/
    └── ChromaticCircle.test.tsx
```

---

## 4. 技術仕様

### 4.1. レイアウト定数

```typescript
// constants/index.ts
export const CIRCLE_LAYOUT = {
  /** 最外側の半径（200px）- 五度圏と同じサイズ */
  RADIUS: 200,
  /** 中心の空白エリア（40px）- 五度圏より小さめ */
  CENTER_RADIUS: 40,
} as const;

export const TEXT_RADIUS = {
  /** ピッチクラス名の配置半径（120px）- 中点 */
  PITCH: (CIRCLE_LAYOUT.CENTER_RADIUS + CIRCLE_LAYOUT.RADIUS) / 2, // = 120
} as const;
```

**設計判断:**

- `RADIUS: 200px`: 五度圏と同じサイズにすることで、切り替え時に違和感がない
- `CENTER_RADIUS: 40px`: 五度圏（90px）より小さくし、ピザ型の扇形を広く取る
- `TEXT_RADIUS: 120px`: 中心と外側の中点に配置し、視認性を確保

### 4.2. 角度計算

```typescript
// constants/index.ts
/** Cが真上（12時の位置）に来るように調整 */
export const ANGLE_OFFSET = -90;

/** 1セグメントあたりの角度（度） */
export const ANGLE_PER_SEGMENT = 360 / 12; // = 30度
```

**位置とピッチクラスの対応:**
| position | angle (度) | ピッチクラス |
|:---------|:-----------|:------------|
| 0 | -90 | C |
| 1 | -60 | C♯/D♭ |
| 2 | -30 | D |
| 3 | 0 | D♯/E♭ |
| 4 | 30 | E |
| 5 | 60 | F |
| 6 | 90 | F♯/G♭ |
| 7 | 120 | G |
| 8 | 150 | G♯/A♭ |
| 9 | 180 | A |
| 10 | 210 | A♯/B♭ |
| 11 | 240 | B |

### 4.3. Domain層: ChromaticCircleService

**配置:** `src/domain/services/ChromaticCircle.ts`

**責務:**

- 12個のピッチクラスの定義と順序管理
- クロマチックサークルのセグメントデータ生成
- UI層へのDTO提供

**実装内容:**

```typescript
// src/domain/services/ChromaticCircle.ts
import { PitchClass } from '../common/PitchClass';

/**
 * クロマチックサークルのセグメント情報（ドメインモデル）
 */
export interface ChromaticSegmentData {
  position: number; // 0-11の位置
  pitchClass: PitchClass; // ピッチクラスのドメインオブジェクト
}

/**
 * UI層に渡すDTO（シリアライズ可能）
 */
export interface ChromaticSegmentDTO {
  position: number;
  pitchClassName: string; // 例: 'C', 'C♯/D♭' など
}

/**
 * クロマチックサークルに関する情報を提供するドメインサービス
 */
export class ChromaticCircleService {
  /** セグメント数（常に12） */
  public static readonly SEGMENT_COUNT = 12;

  private static segments: readonly ChromaticSegmentData[];

  /**
   * 12個のクロマチックサークルセグメント情報を生成
   */
  static getSegments(): readonly ChromaticSegmentData[] {
    if (this.segments) {
      return this.segments;
    }

    const generatedSegments: ChromaticSegmentData[] = [];
    for (let i = 0; i < this.SEGMENT_COUNT; i++) {
      // 半音階順: C=0, C#=1, D=2, ...
      const pitchClass = PitchClass.fromNumber(i);
      generatedSegments.push({
        position: i,
        pitchClass,
      });
    }

    this.segments = Object.freeze(generatedSegments);
    return this.segments;
  }

  /**
   * UI層に渡すためのDTO配列を生成
   * Phase 1では異名同音を併記表記（例: C♯/D♭）
   */
  static getSegmentDTOs(): readonly ChromaticSegmentDTO[] {
    const segments = this.getSegments();
    return segments.map(segment => ({
      position: segment.position,
      pitchClassName: this.formatPitchClassName(segment.pitchClass),
    }));
  }

  /**
   * ピッチクラスを表示用文字列にフォーマット
   * Phase 1: 異名同音を併記（C♯/D♭）
   * Phase 4以降: 調号に応じた切り替えを実装予定
   */
  private static formatPitchClassName(pitchClass: PitchClass): string {
    // 実装例（詳細は実装時に調整）
    const sharpName = pitchClass.toString('sharp');
    const flatName = pitchClass.toString('flat');
    if (sharpName !== flatName) {
      return `${sharpName}/${flatName}`;
    }
    return sharpName;
  }
}
```

**重要な設計判断:**

- `PitchClass`は既存のドメインモデルを使用
- 異名同音の表記ロジックはDomain層に閉じ込める
- UI層は`pitchClassName`文字列を受け取って描画するだけ

### 4.4. Feature層: データ構造

```typescript
// types.ts
import type { Point } from '@/shared/types/graphics';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

/**
 * 描画用のセグメントデータ
 * Domain層のDTOにSVG描画情報を追加したもの
 */
export interface SegmentData {
  /** Domain層から取得したセグメント情報 */
  segment: ChromaticSegmentDTO;
  /** SVGパス（ピザ型） */
  path: string;
  /** テキストの配置座標 */
  textPosition: Point;
}
```

### 4.5. スタイリング

**Tailwind CSSクラス（新規定義が必要）:**

```typescript
// グローバルスタイル（app/globals.css または tailwind.config.ts）に追加
.fill-pitch-area {
  fill: theme('colors.muted'); // 中性的なグレー系
}

.fill-pitch-area:hover {
  fill: theme('colors.muted.foreground');
}

.text-pitch {
  fill: theme('colors.foreground');
  font-size: 14px;
  font-weight: 500;
}

.stroke-border {
  stroke: theme('colors.border');
  stroke-width: 1;
}
```

**アクセシビリティ属性:**

```tsx
<svg
  viewBox={viewBox}
  aria-label="Chromatic Circle"
  role="img"
  className="block"
  style={{ overflow: 'visible' }}
>
```

---

## 5. 実装の詳細

**実装の順序:**

1. **Domain層を最初に実装** → 音楽理論ロジックを確立
2. **Feature層を実装** → Domain層を利用してUIを構築

### 5.1. Domain層: ChromaticCircle.ts

**配置:** `src/domain/services/ChromaticCircle.ts`

**参考:** `src/domain/services/CircleOfFifths.ts`

**実装手順:**

1. `ChromaticSegmentData`, `ChromaticSegmentDTO` インターフェースを定義
2. `ChromaticCircleService` クラスを実装
   - `SEGMENT_COUNT = 12` 定数
   - `getSegments()`: ドメインモデルを生成（`PitchClass.fromNumber(i)`を使用）
   - `getSegmentDTOs()`: UI層用のDTOを生成
   - `formatPitchClassName()`: 異名同音の併記ロジック（private）
3. テストを作成: `src/domain/services/__tests__/ChromaticCircle.test.ts`

**重要:** この実装は`PitchClass`ドメインモデルに依存しますが、UIフレームワークには一切依存しません。

### 5.2. Feature層: constants/index.ts

レイアウト定数、角度定数を定義します。

**参考:** `src/features/circle-of-fifths/constants/index.ts`

**実装内容:**

- `CIRCLE_LAYOUT`: RADIUS, CENTER_RADIUS
- `TEXT_RADIUS`: PITCH
- `ANGLE_OFFSET`, `ANGLE_PER_SEGMENT`

**注意:** ピッチクラスの配列は削除（Domain層に移動したため）

### 5.3. Feature層: utils/geometry.ts

幾何計算ユーティリティ関数を実装します。

**参考:** `src/features/circle-of-fifths/utils/geometry.ts`

**実装する関数:**

```typescript
/**
 * 指定された位置の角度を計算（ラジアン）
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 */
export const calculateAngle = (position: number): number => {
  // position * 30度 + (-90度オフセット) をラジアンに変換
};

/**
 * 極座標から直交座標に変換
 * @param radius 半径
 * @param angle 角度（ラジアン）
 * @returns 直交座標 {x, y}
 */
export const polarToCartesian = (radius: number, angle: number): Point => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

/**
 * テキストの位置を計算（セグメントの中心）
 * @param position 0-11の位置
 * @param radius 配置半径
 * @returns テキストの座標
 */
export const calculateTextPosition = (position: number, radius: number): Point => {
  // セグメントの中心角度 = position角度 + 15度（半分）
};
```

### 5.4. Feature層: utils/pathGeneration.ts

SVGパス生成関数を実装します。

**参考:** `src/features/circle-of-fifths/utils/pathGeneration.ts` の `generatePizzaSlicePath`

**実装する関数:**

```typescript
/**
 * ピザ型セグメントのSVGパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径（CENTER_RADIUS）
 * @param outerRadius 外側の半径（RADIUS）
 * @returns SVGパス文字列
 */
export const generatePizzaSlicePath = (
  position: number,
  innerRadius: number,
  outerRadius: number
): string => {
  // 五度圏のgeneratePizzaSlicePathとほぼ同じロジック
  // 1. 開始角度・終了角度を計算
  // 2. 内側・外側の円弧の開始点・終了点を極座標→直交座標変換
  // 3. SVGパスコマンドを組み立て
  // M (move) → L (line) → A (arc) → L → A → Z (close)
};
```

### 5.5. Feature層: utils/chromaticCircleData.ts

**Domain層を呼び出し**、SVG描画情報を追加してセグメントデータを生成します。

**参考:** `src/features/circle-of-fifths/utils/circleOfFifthsData.ts`

**実装内容:**

```typescript
import { ChromaticCircleService } from '@/domain/services/ChromaticCircle';
import { CIRCLE_LAYOUT, TEXT_RADIUS } from '../constants';
import { generatePizzaSlicePath } from './pathGeneration';
import { calculateTextPosition } from './geometry';
import type { SegmentData } from '../types';

/**
 * クロマチックサークルの描画データを生成
 * Domain層のDTOを受け取り、SVG描画情報を追加する
 */
export const getChromaticCircleData = () => {
  const viewBox = `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${CIRCLE_LAYOUT.RADIUS * 2} ${CIRCLE_LAYOUT.RADIUS * 2}`;

  // Domain層からセグメント情報を取得
  const segmentDTOs = ChromaticCircleService.getSegmentDTOs();

  // SVG描画情報を追加
  const segments: SegmentData[] = segmentDTOs.map(segmentDTO => {
    const path = generatePizzaSlicePath(
      segmentDTO.position,
      CIRCLE_LAYOUT.CENTER_RADIUS,
      CIRCLE_LAYOUT.RADIUS
    );

    const textPosition = calculateTextPosition(segmentDTO.position, TEXT_RADIUS.PITCH);

    return {
      segment: segmentDTO, // Domain層のDTO
      path, // SVG描画情報
      textPosition, // SVG描画情報
    };
  });

  return { viewBox, segments };
};
```

**設計のポイント:**

- Domain層の`ChromaticCircleService`を呼び出してピッチクラス情報を取得
- Feature層はSVG描画に必要な情報（path, textPosition）のみを追加
- 音楽理論ロジックは一切含まない（Domain層に委譲）

**最適化:**

- 五度圏と同様に、モジュールレベルで事前計算して定数化することも検討

### 5.6. Feature層: utils/validation.ts

バリデーション関数を実装します。

**実装する関数:**

```typescript
/**
 * positionが有効な範囲（0-11）かチェック
 */
export const isValidPosition = (position: number): boolean => {
  return Number.isInteger(position) && position >= 0 && position < 12;
};
```

### 5.7. Feature層: types.ts

型定義を記述します。**Domain層のDTOを再エクスポート**します。

**実装内容:**

```typescript
// 共通型
export type { Point } from '@/shared/types/graphics';

// Domain層のDTOを再エクスポート
export type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

// Feature層固有の型（SVG描画用）
export interface SegmentData {
  /** Domain層のDTO */
  segment: ChromaticSegmentDTO;
  /** SVGパス文字列 */
  path: string;
  /** テキスト配置座標 */
  textPosition: Point;
}

// エラー型
export class ChromaticCircleError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'ChromaticCircleError';
  }
}
```

**設計のポイント:**

- Domain層の`ChromaticSegmentDTO`を再エクスポートし、Feature層内で直接使用
- `SegmentData`はFeature層固有の型（SVG描画情報を含む）

### 5.8. Feature層: components/ChromaticSegment.tsx

単一セグメントをレンダリングします。

**参考:** `src/features/circle-of-fifths/components/CircleSegment.tsx`

**実装内容:**

```tsx
import { memo } from 'react';
import type { Point } from '@/shared/types/graphics';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

export interface ChromaticSegmentProps {
  /** Domain層のDTO */
  segment: ChromaticSegmentDTO;
  /** SVGパス */
  path: string;
  /** テキスト位置 */
  textPosition: Point;
}

export const ChromaticSegment = memo<ChromaticSegmentProps>(({ segment, path, textPosition }) => {
  return (
    <g>
      {/* ピザ型セグメント */}
      <path d={path} className="fill-pitch-area stroke-border" />

      {/* ピッチクラス名（Domain層がフォーマットした文字列） */}
      <text
        className="text-pitch"
        x={textPosition.x}
        y={textPosition.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ pointerEvents: 'none' }}
      >
        {segment.pitchClassName}
      </text>
    </g>
  );
});

ChromaticSegment.displayName = 'ChromaticSegment';
```

**設計のポイント:**

- `segment.pitchClassName`を表示（Domain層がフォーマット済み）
- UI層は文字列を受け取って描画するだけ

### 5.9. Feature層: components/ChromaticCircle.tsx

メインコンポーネントを実装します。

**参考:** `src/features/circle-of-fifths/components/CircleOfFifths.tsx`

**実装内容:**

```tsx
import { ChromaticSegment } from './ChromaticSegment';
import { getChromaticCircleData } from '../utils/chromaticCircleData';
import type { ClassNameProps } from '@/shared/types';

/**
 * クロマチックサークル表示コンポーネント
 *
 * 12個のピッチクラス（C, C♯, D...）を半音階順に円形配置します。
 * ピザ型のセグメントで構成され、各セグメントにはピッチクラス名が表示されます。
 */
export const ChromaticCircle: React.FC<ClassNameProps> = ({ className }) => {
  const { viewBox, segments } = getChromaticCircleData();

  return (
    <div className={className}>
      <svg
        viewBox={viewBox}
        className="block"
        aria-label="Chromatic Circle"
        role="img"
        style={{ overflow: 'visible' }}
      >
        {segments.map(({ segment, path, textPosition }) => (
          <ChromaticSegment
            key={segment.position}
            segment={segment}
            path={path}
            textPosition={textPosition}
          />
        ))}
      </svg>
    </div>
  );
};
```

**設計のポイント:**

- Server Component（`'use client'`なし）として実装
- Phase 2でインタラクションが必要になるまでは静的なコンポーネント

### 5.10. Feature層: index.ts

**公開API**を定義します。外部からはこのファイルを通じてのみアクセス可能にします。

```typescript
// コンポーネントのエクスポート
export { ChromaticCircle } from './components/ChromaticCircle';

// 型のエクスポート（必要に応じて）
export type { SegmentData, ChromaticSegmentDTO } from './types';
```

**重要:** 内部実装（utils, constants等）は公開しない。

### 5.11. Feature層: README.md

フィーチャーのドキュメントを作成します。

**参考:** `src/features/circle-of-fifths/README.md`

**記載内容:**

- クロマチックサークルの概要
- 使用方法（コンポーネントのインポートと使用例）
- ファイル構成の説明
- 実装フェーズ（Phase 1〜4）
- 今後の拡張予定

---

## 6. テスト戦略

**テストの優先順位:**

1. **Domain層のテスト**: 音楽理論ロジックの正確性を最優先で検証
2. **Feature層のユニットテスト**: SVG描画ロジックの検証
3. **コンポーネントテスト**: レンダリングの検証

### 6.1. Domain層のテスト

**src/domain/services/**tests**/ChromaticCircle.test.ts:**

```typescript
describe('ChromaticCircleService', () => {
  describe('getSegments', () => {
    it('12個のセグメントを返す', () => {
      const segments = ChromaticCircleService.getSegments();
      expect(segments).toHaveLength(12);
    });

    it('position 0 はCのピッチクラスである', () => {
      const segments = ChromaticCircleService.getSegments();
      const cSegment = segments[0];
      expect(cSegment.position).toBe(0);
      expect(cSegment.pitchClass.toNumber()).toBe(0); // C = 0
    });

    it('半音階順（C, C#, D...）に並んでいる', () => {
      const segments = ChromaticCircleService.getSegments();
      segments.forEach((segment, index) => {
        expect(segment.position).toBe(index);
        expect(segment.pitchClass.toNumber()).toBe(index);
      });
    });
  });

  describe('getSegmentDTOs', () => {
    it('12個のDTOを返す', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      expect(dtos).toHaveLength(12);
    });

    it('DTOはシリアライズ可能な形式である', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      const dto = dtos[0];
      expect(dto).toHaveProperty('position');
      expect(dto).toHaveProperty('pitchClassName');
      expect(typeof dto.pitchClassName).toBe('string');
    });

    it('異名同音が併記されている（例: C♯/D♭）', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      const cSharpDto = dtos[1]; // position 1 = C#/Db
      expect(cSharpDto.pitchClassName).toMatch(/[♯#].*\//); // シャープとスラッシュを含む
    });
  });
});
```

**重要:** Domain層のテストはUIに依存しないため、非常に高速に実行可能。

### 6.2. Feature層のユニットテスト

**utils/test/geometry.test.ts:**

```typescript
describe('geometry', () => {
  describe('calculateAngle', () => {
    it('position 0 (C) の角度は -90度（-π/2 ラジアン）', () => {
      expect(calculateAngle(0)).toBe(-Math.PI / 2);
    });

    it('position 3 (D♯/E♭) の角度は 0度', () => {
      expect(calculateAngle(3)).toBe(0);
    });
  });

  describe('polarToCartesian', () => {
    it('半径100、角度0でx=100, y=0を返す', () => {
      const point = polarToCartesian(100, 0);
      expect(point.x).toBeCloseTo(100);
      expect(point.y).toBeCloseTo(0);
    });
  });
});
```

**utils/test/pathGeneration.test.ts:**

```typescript
describe('pathGeneration', () => {
  describe('generatePizzaSlicePath', () => {
    it('有効なSVGパス文字列を生成', () => {
      const path = generatePizzaSlicePath(0, 40, 200);
      expect(path).toMatch(/^M .+ L .+ A .+ Z$/);
    });

    it('無効なposition（-1）でエラーをthrow', () => {
      expect(() => generatePizzaSlicePath(-1, 40, 200)).toThrow(ChromaticCircleError);
    });
  });
});
```

**utils/test/chromaticCircleData.test.ts:**

```typescript
describe('chromaticCircleData', () => {
  it('12個のセグメントデータを返す', () => {
    const { segments } = getChromaticCircleData();
    expect(segments).toHaveLength(12);
  });

  it('最初のセグメントはCである', () => {
    const { segments } = getChromaticCircleData();
    expect(segments[0].segment.pitchClassName).toBe('C');
  });
});
```

### 6.3. Feature層のコンポーネントテスト

**components/test/ChromaticCircle.test.tsx:**

```typescript
describe('ChromaticCircle', () => {
  it('正常にレンダリングされる', () => {
    render(<ChromaticCircle />);
    expect(screen.getByLabelText('Chromatic Circle')).toBeInTheDocument();
  });

  it('12個のセグメントが描画される', () => {
    const { container } = render(<ChromaticCircle />);
    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(12);
  });

  it('Cのテキストが表示される', () => {
    render(<ChromaticCircle />);
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
```

### 6.4. Storybook

****stories**/ChromaticCircle.stories.tsx:**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ChromaticCircle } from '../components/ChromaticCircle';

const meta: Meta<typeof ChromaticCircle> = {
  title: 'Features/ChromaticCircle',
  component: ChromaticCircle,
};

export default meta;
type Story = StoryObj<typeof ChromaticCircle>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    className: 'w-[600px] h-[600px]',
  },
};
```

---

## 7. 実装順序

**核心原則: Domain層を最初に実装し、Feature層はその後に構築する**

Phase 1の実装は、以下の順序で進めることを推奨します：

### Phase 1A: Domain層（音楽理論ロジック）

1. **src/domain/services/ChromaticCircle.ts**: ドメインサービス実装
   - `ChromaticSegmentData`, `ChromaticSegmentDTO` インターフェース
   - `ChromaticCircleService` クラス実装
2. **src/domain/services/**tests**/ChromaticCircle.test.ts**: Domain層のテスト
   - ピッチクラスの正確性検証
   - DTOのシリアライズ検証

### Phase 1B: Feature層（UI/表示層）

3. **src/features/chromatic-circle/constants/index.ts**: レイアウト定数
4. **src/features/chromatic-circle/types.ts**: Feature層の型定義
5. **src/features/chromatic-circle/utils/validation.ts**: バリデーション関数
6. **src/features/chromatic-circle/utils/geometry.ts**: 幾何計算（+ テスト）
7. **src/features/chromatic-circle/utils/pathGeneration.ts**: SVGパス生成（+ テスト）
8. **src/features/chromatic-circle/utils/chromaticCircleData.ts**: データ生成（Domain層を呼び出す）（+ テスト）
9. **src/features/chromatic-circle/components/ChromaticSegment.tsx**: セグメントコンポーネント
10. **src/features/chromatic-circle/components/ChromaticCircle.tsx**: メインコンポーネント（+ テスト）
11. **src/features/chromatic-circle/**stories**/ChromaticCircle.stories.tsx**: Storybook
12. **src/features/chromatic-circle/index.ts**: 公開APIのエクスポート
13. **src/features/chromatic-circle/README.md**: フィーチャードキュメント

**重要な注意点:**

- Domain層のテストが全てパスしてから、Feature層の実装に進む
- Domain層の変更がFeature層に影響しないよう、DTOのインターフェースを安定させる

---

## 8. 参考資料

### 8.1. 設計原則（最重要）

**この実装方針書は、以下の設計原則に厳密に従っています:**

- **開発原則**: `docs/20.guidelines/2002.development-principles.md`
  - YAGNI, KISS, 音楽理論の正確性、SOLID原則
- **アーキテクチャ設計**: `docs/20.guidelines/2004.architecture.md`
  - Domain層の完全な独立性、依存の方向
- **フロントエンド設計**: `docs/20.guidelines/2003.frontend-design.md`
  - Server Component優先、className設計の責任分離

**実装時は必ずこれらのドキュメントを参照し、原則から逸脱しないようにしてください。**

### 8.2. 既存コード

- **五度圏実装**: `src/features/circle-of-fifths/`
  - `src/domain/services/CircleOfFifths.ts`: ドメインサービスの参考実装
  - `utils/pathGeneration.ts` の `generatePizzaSlicePath`: SVGパス生成ロジックを流用可能
  - コンポーネント構造とテスト戦略も参考になる

### 8.3. 設計ドキュメント

- **Hub画面設計**: `docs/00.project/screenDesigns/hub/`
  - `0003-1.overview.md`: Hub & Layerモデルの思想
  - `0003-2.layout.md`: レイアウト仕様
  - `0003-3.canvas.md`: Canvasの責務
  - `0003-4.controller-panel.md`: ビュー切り替えの仕様

### 8.4. ドメイン設計

- **ドメインシステム設計**: `docs/10.domain/1001.domainSystem.md`
- **音楽理論ガイド**: `docs/10.domain/1002.music-theory-guidebook.md`
- **既存のPitchClassドメインモデル**: `src/domain/common/PitchClass.ts`

---

## 9. 今後の拡張（Phase 2以降）

### Phase 2: インタラクション

- ホバー時のハイライト
- クリック時の選択状態
- インフォメーションパネルへの情報表示
- `usePitchState`, `usePitchInteraction` フックの実装

### Phase 3: 音声再生

- 単音（ピッチクラス）の再生
- `useAudio` フックの実装
- Tone.js との連携

### Phase 4: レイヤー表示

- スケール構成音の多角形描画
- コード構成音のハイライト
- レイヤーコントローラーとの連携
- 異名同音の文脈依存切り替え（C♯ ⇔ D♭）

---

## 10. まとめ

クロマチックサークルは、音楽理論の「幾何学的な美しさ」を可視化する重要なツールです。Phase 1では、その基礎となる静的な見た目を丁寧に実装することで、今後の機能拡張のための堅牢な土台を築きます。

五度圏の実装から学んだベストプラクティスを活かしつつ、クロマチックサークル独自の特性（半音階順、ピザ型、インターバル分析）を考慮した設計を行うことで、保守性と拡張性に優れたコンポーネントを実現します。
