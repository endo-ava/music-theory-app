import { ThreeColumnLayout } from '@/components/layouts/ThreeColumnLayout';
import { MobileTabLayout } from '@/components/layouts/MobileTabLayout';

/**
 * ホームページコンポーネント
 *
 * Circle画面のメインレイアウトを提供する。
 * レスポンシブ対応：
 * - デスクトップ：3分割レイアウト（Canvas中央 + Controller左 + Information右）
 * - モバイル：タブ切り替えレイアウト（Canvas上 + Controller/Information切り替え）
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

      {/* モバイル： タブ切り替えレイアウト */}
      <MobileTabLayout className="h-dvh md:hidden" />
    </>
  );
}
