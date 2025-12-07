/**
 * Canvas UI Container のエクスポート統合
 *
 * レイアウト用UIコンテナとしてのCanvasコンポーネントを提供します。
 * 機能（Feature）コンポーネントを描画するための責任を持ちます。
 */

export { Canvas } from './components/Canvas';
export { CurrentKeyDisplay } from './components/CurrentKeyDisplay';

export type { CanvasConfig } from './types';
export type { HubType } from '@/types';
export { useHubStore } from '@/features/view-controller/stores/hubStore';
export type { HubState } from '@/features/view-controller/stores/hubStore';
