/**
 * クロマチックサークル専用の型定義
 */

import type { Point as GraphicsPoint } from '@/shared/types/graphics';
import type { ChromaticSegmentDTO as DomainDTO } from '@/domain/services/ChromaticCircle';

// 共通型定義はsharedから再エクスポート
export type { Point } from '@/shared/types/graphics';

// Domain層のDTOを再エクスポート
export type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

/**
 * 2層構造のセグメントパス
 * 五度圏との統一レイアウトに対応
 */
export interface ChromaticSegmentPaths {
  /** ピッチクラス表示エリアのパス（90px～175px）- INNER_RADIUSとMIDDLE_RADIUSを統合 */
  pitchPath: string;
  /** 調号エリアのパス（175px～200px） */
  signaturePath: string;
}

/**
 * 描画用のセグメントデータ
 * Domain層のDTOにSVG描画情報を追加したもの
 */
export interface SegmentData {
  /** Domain層から取得したセグメント情報 */
  segment: DomainDTO;
  /** 2層構造のSVGパス */
  paths: ChromaticSegmentPaths;
  /** テキストの配置座標 */
  textPosition: GraphicsPoint;
}
