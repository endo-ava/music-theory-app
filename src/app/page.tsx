import { Canvas } from '@/components/layouts/Canvas';
import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout';

import { MobileInteractionWrapper } from '@/components/layouts/MobileBottomSheet';

/**
 * ホームページコンポーネント
 *
 * Hub画面のメインレイアウトを提供する。
 * レスポンシブ対応：
 * - デスクトップ：3分割レイアウト（ThreeColumnLayout）
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
    <div className="flex h-[calc(100dvh-var(--header-height-min))] flex-col">
      <main className="flex-1 p-6">
        {/* デスクトップ：3分割レイアウト */}
        <ThreeColumnLayout className="hidden md:flex" />

        {/* モバイル：既存の実装を維持 */}
        <div className="flex-1 md:hidden">
          <MobileInteractionWrapper>
            <Canvas className="flex-1" />
          </MobileInteractionWrapper>
        </div>
      </main>
    </div>
  );
}
