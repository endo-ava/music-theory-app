/**
 * Side Panel コンポーネントの型定義
 */

import type { ClassNameProps } from '@/shared/types';

/**
 * Side Panel 全体のProps
 */
export interface SidePanelProps extends ClassNameProps {
  /** パネルの表示状態 */
  isVisible?: boolean;
}

/**
 * View Controller (C-1) のProps
 */
export interface ViewControllerProps extends ClassNameProps {
  /** コンポーネントの見出し */
  title?: string;
}
