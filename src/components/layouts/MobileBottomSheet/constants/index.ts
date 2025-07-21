import { Tab } from '../types';

/** タブの定義 */
export const TABS: Tab[] = [
  { id: 'view', label: 'View' },
  { id: 'layer', label: 'Layer' },
];

/** シートのスナップポイント設定 */
export const SNAP_POINTS = {
  LOWEST: 0.06,
  HALF: 0.5,
  EXPANDED: 0.9,
} as const;
