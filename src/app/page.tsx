import { Canvas } from '@/features/canvas';
import { SidePanel } from '@/features/side-panel';

/**
 * ホームページコンポーネント
 *
 * Hub画面のメインレイアウトを提供する。
 * SidePanelとCanvasを2カラムレイアウトで配置。
 *
 * レイアウト設計：
 * - 責任分離の原則：親がレイアウト責任、子が描画責任
 * - レスポンシブ対応：PCでは2カラム、モバイルでは将来対応予定
 *
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* 2-column layout: Side Panel + Canvas */}
      <main className="flex flex-1">
        {/* Left: Side Panel - 幅自動調整（32rem〜42rem） */}
        <SidePanel className="w-fit max-w-[42rem] min-w-[32rem] pl-8" />

        {/* Right: Canvas - 残り領域を使用 */}
        <Canvas className="flex-1" />
      </main>
    </div>
  );
}
