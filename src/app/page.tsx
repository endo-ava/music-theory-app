import { Canvas } from '@/components/layouts/Canvas';
import { SidePanel } from '@/components/layouts/SidePanel';
import { MobileBottomSheet } from '@/components/layouts/MobileBottomSheet';

/**
 * ホームページコンポーネント
 *
 * Hub画面のメインレイアウトを提供する。
 * レスポンシブ対応：
 * - デスクトップ：SidePanelとCanvasの2カラムレイアウト（Tailwindで制御）
 * - モバイル：Canvas全画面 + MobileBottomSheet（BottomSheet + トリガーボタン）
 *
 * アーキテクチャ設計：
 * - UI Container/Feature分離：MobileBottomSheetはlayouts配下で完全分離
 * - SSR活用：Push Client Components to the leaves
 *
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* 2-column layout: Side Panel + Canvas */}
      <main className="flex flex-1">
        {/* Left: Side Panel - デスクトップ（md以上）のみ表示 */}
        <SidePanel className="hidden w-fit max-w-[42rem] min-w-[32rem] pl-8 md:block" />

        {/* Right: Canvas - 残り領域を使用 */}
        <Canvas className="flex-1" />
      </main>

      {/* モバイル専用レイアウト - モバイル（md未満）のみ表示 */}
      <MobileBottomSheet className="md:hidden" />
    </div>
  );
}
