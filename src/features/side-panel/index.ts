/**
 * Side Panel 機能のエクスポート統合
 *
 * 開発規約 4.4 に従い、機能の公開APIのみをエクスポートします。
 * 内部実装（子コンポーネント、フック）は非公開とし、メインAPIの安定性を保ちます。
 *
 * 使用例：
 * ```typescript
 * import { SidePanel, ViewController } from '@/features/side-panel';
 * import type { SidePanelProps, ViewControllerProps } from '@/features/side-panel';
 * ```
 *
 * 内部コンポーネント（非公開）:
 * - HubOptionButton
 * - HubRadioGroup
 * - useViewController フック
 */

// メインコンポーネントのエクスポート
export { SidePanel } from './components/SidePanel';
export { ViewController } from './components/ViewController';

// 型定義のエクスポート（外部利用可能なもののみ）
export type { SidePanelProps } from './components/SidePanel';
export type { ViewControllerProps } from './components/ViewController';

// 注意: 内部実装（HubOptionButton, HubRadioGroup, useViewController）は
// 意図的に非公開とし、安定したAPIを提供します。
