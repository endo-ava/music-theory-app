/**
 * グローバル状態管理ストア
 *
 * アプリケーション全体で横断的に使用される状態のみをここに配置します。
 * 各機能に閉じた状態は、それぞれのfeature内のstoresディレクトリに配置してください。
 *
 * 例:
 * - currentKeyStore: 複数のfeatureで参照される現在のキー状態
 *
 * 機能固有のストアの場所:
 * - circle-of-fifths: @/features/circle-of-fifths/stores
 * - chromatic-circle: @/features/chromatic-circle/stores
 * - layer-controller: @/features/layer-controller/stores
 * - view-controller: @/features/view-controller/stores
 */
export { useCurrentKeyStore } from './currentKeyStore';
export type { CurrentKeyState } from './currentKeyStore';
