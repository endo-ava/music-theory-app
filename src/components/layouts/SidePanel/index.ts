/**
 * Side Panel UI Container のエクスポート統合
 *
 * レイアウト用UIコンテナとしてのSidePanelコンポーネントを提供します。
 * 機能（Feature）コンポーネントをレイアウトするための責任を持ちます。
 *
 * 使用例：
 * ```typescript
 * import { SidePanel } from '@/components/layouts/SidePanel';
 * import type { SidePanelProps } from '@/components/layouts/SidePanel';
 * ```
 */

// メインコンポーネントのエクスポート
export { SidePanel } from './components/SidePanel';

// 型定義のエクスポート
export type { SidePanelProps } from './components/SidePanel';
