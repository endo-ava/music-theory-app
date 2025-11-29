import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout';
import { MobileTwoColumnLayout } from '@/components/layouts/MobileTwoColumnLayout';

/**
 * ホームページコンポーネント
 *
 * Circle画面のメインレイアウトを提供する。
 * レスポンシブ対応：
 * - デスクトップ：3分割レイアウト（Canvas中央 + Controller左 + Information右）
 * - モバイル：2分割レイアウト（Canvas上 + Information下） + BottomSheet（Controller）
 *
 * レイアウト設計：
 * - ヘッダー高さを除いた残り全領域を3カラムで使用
 * - --content-height-full CSS変数でヘッダーの実際の高さを動的に計算
 * - UI Container/Feature分離：モバイルレイアウトはlayouts配下で完全分離
 * - SSR活用：Push Client Components to the leaves
 *
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <>
      {/* デスクトップ：3分割レイアウト */}
      <ThreeColumnLayout className="hidden h-[var(--content-height-full)] p-6 md:flex" />

      {/* モバイル： 2分割レイアウト */}
      <MobileTwoColumnLayout className="h-dvh md:hidden" />
    </>
  );
}
