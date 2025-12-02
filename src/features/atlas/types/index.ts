/**
 * ノードの種類（抽象度による分類）
 * - foundation: 基底概念 (Pitch, Interval, Degree)
 * - pattern: 抽象構造 (ScalePattern, ChordPattern)
 * - instance: 具体インスタンス (C Major Scale, Cmaj7)
 * - context: 文脈付き概念 (Key, Function)
 */
export type AtlasNodeType = 'foundation' | 'pattern' | 'instance' | 'context';

/**
 * 具体的なデータの種類
 */
export type AtlasDataType = 'pitch' | 'interval' | 'scale' | 'chord' | 'key' | 'function';

export interface AtlasNodeData {
  id: string;
  type: AtlasNodeType;
  dataType: AtlasDataType;
  label: string;
  // Atlas上の論理座標 (後で計算・調整可能)
  x?: number;
  y?: number;
  // 親ノードID (階層構造用)
  parentId?: string;
  /**
   * ドメイン固有データ (PitchClass, Key, ScalePattern, ChordPattern等)
   *
   * 各ノードタイプが異なるドメインオブジェクトを参照するため、
   * 型安全性を保ちながら統一的に扱うことが困難です。
   * ジェネリック型を使用すると、型パラメータの伝播により
   * コードベース全体に複雑性が波及します。
   *
   * 現状の `any` 型は、実装の柔軟性とコード可読性のバランスを考慮した
   * 意図的な設計判断です。各ノードの `dataType` フィールドと組み合わせることで、
   * 実行時に適切な型を判断できます。
   *
   * @see docs/2004.architecture.md - Type Strategy セクション
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // 検索用メタデータ
  tags: string[];
  // 初期表示フラグ（デフォルト true）
  // instance タイプのノードは初期非表示（情報過多防止）
  visible?: boolean;
}

export type AtlasEdgeType =
  | 'constituent' // 構成要素 (Scale -> Note)
  | 'structure' // 構造 (ScaleInstance -> ScalePattern)
  | 'diatonic' // ダイアトニック (Key -> Chord)
  | 'relative' // 平行調
  | 'parallel' // 同主調
  | 'dominant' // ドミナント関係
  | 'subdominant'; // サブドミナント関係

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  type: AtlasEdgeType;
  weight?: number;
}

export interface AtlasDataset {
  nodes: AtlasNodeData[];
  edges: AtlasEdge[];
}
