import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout';
import { MobileTwoColumnLayout } from '@/components/layouts/MobileTwoColumnLayout';

/**
 * ホームページコンポーネント
 *
 * Hub画面のメインレイアウトを提供する。
 * レスポンシブ対応：
 * - デスクトップ：3分割レイアウト（Canvas中央 + Controller左 + Information右）
 * - モバイル：2分割レイアウト（Canvas上 + Information下） + BottomSheet（Controller）
 *
 * アーキテクチャ設計：
 * - UI Container/Feature分離：モバイルレイアウトはlayouts配下で完全分離
 * - SSR活用：Push Client Components to the leaves
 *
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height-min))] flex-col">
      <main className="flex-1">
        {/* デスクトップ：3分割レイアウト */}
        <ThreeColumnLayout className="hidden p-6 md:flex" />

        {/* モバイル： 2分割レイアウト */}
        <MobileTwoColumnLayout className="md:hidden" />
      </main>
    </div>
  );
}
