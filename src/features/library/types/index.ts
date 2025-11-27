/**
 * ノードの種類（抽象度による分類）
 * - foundation: 基底概念 (Pitch, Interval, Degree)
 * - pattern: 抽象構造 (ScalePattern, ChordPattern)
 * - instance: 具体インスタンス (C Major Scale, Cmaj7)
 * - context: 文脈付き概念 (Key, Function)
 */
export type LibraryNodeType = 'foundation' | 'pattern' | 'instance' | 'context';

/**
 * 具体的なデータの種類
 */
export type LibraryDataType = 'pitch' | 'interval' | 'scale' | 'chord' | 'key' | 'function';

export interface LibraryNode {
  id: string;
  type: LibraryNodeType;
  dataType: LibraryDataType;
  label: string;
  // Atlas上の論理座標 (後で計算・調整可能)
  x?: number;
  y?: number;
  // 親ノードID (階層構造用)
  parentId?: string;
  // ドメイン固有データ (Domainオブジェクトへの参照やシリアライズデータ)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // 検索用メタデータ
  tags: string[];
}

export type LibraryEdgeType =
  | 'constituent' // 構成要素 (Scale -> Note)
  | 'structure' // 構造 (ScaleInstance -> ScalePattern)
  | 'diatonic' // ダイアトニック (Key -> Chord)
  | 'relative' // 平行調
  | 'parallel' // 同主調
  | 'dominant' // ドミナント関係
  | 'subdominant'; // サブドミナント関係

export interface LibraryEdge {
  id: string;
  source: string;
  target: string;
  type: LibraryEdgeType;
  weight?: number;
}

export interface LibraryDataset {
  nodes: LibraryNode[];
  edges: LibraryEdge[];
}
