import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileBottomSheet, useMobileBottomSheet, SNAP_POINTS } from '../index';
import { CircleOfFifths } from '@/features/circle-of-fifths';

// デモ用のラッパーコンポーネント
function MobileBottomSheetDemo() {
  const { activeSnapPoint, setActiveSnapPoint } = useMobileBottomSheet();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* 背景コンテンツ */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
        <div className="flex h-full items-center justify-center">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-white">音楽理論アプリ</h1>
            <p className="text-gray-300">五度圏をクリックして音階を選択してください</p>
            <div className="relative">
              <CircleOfFifths />
            </div>
            <div className="mt-4 text-sm text-gray-400">
              現在のスナップポイント:{' '}
              {activeSnapPoint === SNAP_POINTS.LOWEST
                ? 'LOWEST'
                : activeSnapPoint === SNAP_POINTS.HALF
                  ? 'HALF'
                  : 'EXPANDED'}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setActiveSnapPoint(SNAP_POINTS.LOWEST)}
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                LOWEST
              </button>
              <button
                onClick={() => setActiveSnapPoint(SNAP_POINTS.HALF)}
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                HALF
              </button>
              <button
                onClick={() => setActiveSnapPoint(SNAP_POINTS.EXPANDED)}
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                EXPANDED
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MobileBottomSheet */}
      <MobileBottomSheet
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
      />
    </div>
  );
}

const meta: Meta<typeof MobileBottomSheetDemo> = {
  title: 'Components/Layouts/MobileBottomSheet',
  component: MobileBottomSheetDemo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        component:
          'モバイル環境における画面下部からのスライドアップ式UIコンテナコンポーネント。Vaulライブラリベースでスナップポイント機能による3段階の高さ調整機能を提供します。',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態のMobileBottomSheet
 * 最小スナップポイント（LOWEST）で表示され、背景の五度圏クリックが可能
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でMobileBottomSheetを表示します。最小スナップポイント（LOWEST: 6%）で初期化され、背景コンテンツとのインタラクションが可能です。',
      },
    },
  },
  // TODO: MobileBottomSheet廃止予定のため、テストを一時的にコメントアウト
  // play: async ({ canvasElement }) => {
  //   const driver = new MobileBottomSheetDriver(canvasElement);

  //   // 背景コンテンツが存在することを確認
  //   await driver.expectBackgroundContentVisible();

  //   // 現在のスナップポイント表示を確認
  //   await driver.expectSnapPointDisplay('LOWEST');
  // },
};

/**
 * スナップポイント操作テスト
 * ボタンクリックによるスナップポイント変更の動作確認
 */
export const SnapPointInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'スナップポイント制御ボタンを使用してBottomSheetの高さを変更する機能をテストします。LOWEST（6%）、HALF（50%）、EXPANDED（90%）の3段階に切り替え可能です。',
      },
    },
  },
  // TODO: MobileBottomSheet廃止予定のため、テストを一時的にコメントアウト
  // play: async ({ canvasElement }) => {
  //   const driver = new MobileBottomSheetDriver(canvasElement);

  //   // 初期状態はLOWESTであることを確認
  //   await driver.expectSnapPointDisplay('LOWEST');

  //   // HALFボタンをクリック
  //   await driver.clickSnapPointButton('HALF');

  //   // スナップポイントがHALFに変更されることを確認
  //   await driver.expectSnapPointDisplay('HALF');

  //   // EXPANDEDボタンをクリック
  //   await driver.clickSnapPointButton('EXPANDED');

  //   // スナップポイントがEXPANDEDに変更されることを確認
  //   await driver.expectSnapPointDisplay('EXPANDED');

  //   // LOWESTボタンをクリックして元に戻す
  //   await driver.clickSnapPointButton('LOWEST');

  //   // スナップポイントがLOWESTに戻ることを確認
  //   await driver.expectSnapPointDisplay('LOWEST');
  // },
};

/**
 * 背景インタラクション両立テスト
 * 背景要素をクリックしてもアプリが正常に動作することを確認
 */
export const BackgroundInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '非モーダル設計により、BottomSheetが表示されている状態でも背景コンテンツのクリックが可能であることを確認します。',
      },
    },
  },
  // TODO: MobileBottomSheet廃止予定のため、テストを一時的にコメントアウト
  // play: async ({ canvasElement }) => {
  //   const driver = new MobileBottomSheetDriver(canvasElement);

  //   // 背景のアプリタイトルを確認
  //   await driver.expectBackgroundContentVisible();

  //   // Circle of Fifthsのラベルが存在することを確認（SVG要素）
  //   await driver.expectCircleOfFifthsVisible();

  //   // 背景のボタンがクリック可能であることを確認
  //   await driver.expectSnapPointButtonVisible('LOWEST');
  // },
};

/**
 * useMobileBottomSheetフックテスト
 * カスタムフックの基本機能動作確認
 */
export const HookFunctionality: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'useMobileBottomSheetフックが適切にスナップポイント状態を管理し、状態変更関数が正常に動作することを確認します。',
      },
    },
  },
  // TODO: MobileBottomSheet廃止予定のため、テストを一時的にコメントアウト
  // play: async ({ canvasElement }) => {
  //   const driver = new MobileBottomSheetDriver(canvasElement);

  //   // フックによる初期状態の確認
  //   await driver.expectSnapPointDisplay('LOWEST');

  //   // 状態変更関数の動作確認（HALF → EXPANDED → LOWEST）
  //   // HALF状態への変更
  //   await driver.clickSnapPointButton('HALF');
  //   await driver.expectSnapPointDisplay('HALF');

  //   // EXPANDED状態への変更
  //   await driver.clickSnapPointButton('EXPANDED');
  //   await driver.expectSnapPointDisplay('EXPANDED');

  //   // LOWEST状態への戻り
  //   await driver.clickSnapPointButton('LOWEST');
  //   await driver.expectSnapPointDisplay('LOWEST');
  // },
};

/**
 * レスポンシブ表示テスト
 * モバイルビューポートでのレイアウト確認
 */
export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'モバイル端末でのレスポンシブ表示をテストします。BottomSheetがモバイル環境に最適化された表示になることを確認します。',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile Portrait',
          styles: { width: '375px', height: '667px' },
        },
        mobileLandscape: {
          name: 'Mobile Landscape',
          styles: { width: '667px', height: '375px' },
        },
      },
    },
  },
  // TODO: MobileBottomSheet廃止予定のため、テストを一時的にコメントアウト
  // play: async ({ canvasElement }) => {
  //   const driver = new MobileBottomSheetDriver(canvasElement);

  //   // 背景のアプリタイトルが表示されることを確認
  //   await driver.expectBackgroundContentVisible();

  //   // スナップポイントコントロールが正常に表示されることを確認
  //   await driver.expectSnapPointButtonVisible('LOWEST');
  //   await driver.expectSnapPointButtonVisible('HALF');
  //   await driver.expectSnapPointButtonVisible('EXPANDED');
  // },
};
