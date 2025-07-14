/**
 * BottomSheet状態の定義
 */
export type BottomSheetState = 'collapsed' | 'half' | 'expanded';

/**
 * タブの型定義
 */
export interface Tab {
  /**
   * タブの一意識別子
   */
  id: string;
  /**
   * タブに表示するラベル
   */
  label: string;
}
