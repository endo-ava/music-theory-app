/**
 * Canvas コンポーネントの型定義
 */

/**
 * Hub の種類（将来の拡張用）
 */
export type HubType = 'circle-of-fifths' | 'chromatic-circle';

/**
 * Canvas の設定（将来の拡張用）
 */
export interface CanvasConfig {
  /** 現在のHub種類 */
  hubType: HubType;
}
