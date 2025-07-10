/**
 * Canvas UI Container のエクスポート統合
 *
 * レイアウト用UIコンテナとしてのCanvasコンポーネントを提供します。
 * 機能（Feature）コンポーネントを描画するための責任を持ちます。
 */

export { Canvas } from './components/Canvas';
export { HubTitle } from './components/HubTitle';
export type { CanvasConfig } from './types';
export type { HubType } from '@/shared/types';
export { useHubStore } from '@/stores/hubStore';
export type { HubState } from '@/stores/hubStore';
