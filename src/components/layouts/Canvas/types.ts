/**
 * Canvas コンポーネントの型定義
 */

import type { HubType } from '@/shared/types';

/**
 * Canvas の設定（将来の拡張用）
 */
export interface CanvasConfig {
  /** 現在のHub種類 */
  hubType: HubType;
}
