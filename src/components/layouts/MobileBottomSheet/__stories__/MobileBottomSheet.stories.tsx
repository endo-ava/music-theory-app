import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent, waitFor } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景コンテンツが存在することを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeInTheDocument();

    // 五度圏の説明文が存在することを確認
    const description = canvas.getByText('五度圏をクリックして音階を選択してください');
    await expect(description).toBeInTheDocument();

    // 現在のスナップポイント表示を確認
    const snapPointDisplay = canvas.getByText(/現在のスナップポイント: LOWEST/);
    await expect(snapPointDisplay).toBeInTheDocument();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態はLOWESTであることを確認
    const initialSnapPoint = canvas.getByText(/現在のスナップポイント: LOWEST/);
    await expect(initialSnapPoint).toBeInTheDocument();

    // HALFボタンをクリック
    const halfButton = canvas.getByRole('button', { name: 'HALF', hidden: true });

    // Vaulのアニメーション完了を待機（CI環境での安定性向上）
    await waitFor(
      () => {
        const computedStyle = window.getComputedStyle(halfButton);
        expect(computedStyle.pointerEvents).not.toBe('none');
      },
      { timeout: 3000 }
    );

    await userEvent.click(halfButton);

    // スナップポイントがHALFに変更されることを確認
    const halfSnapPoint = canvas.getByText(/現在のスナップポイント: HALF/);
    await expect(halfSnapPoint).toBeInTheDocument();

    // EXPANDEDボタンをクリック
    const expandedButton = canvas.getByRole('button', { name: 'EXPANDED', hidden: true });
    await userEvent.click(expandedButton);

    // スナップポイントがEXPANDEDに変更されることを確認
    const expandedSnapPoint = canvas.getByText(/現在のスナップポイント: EXPANDED/);
    await expect(expandedSnapPoint).toBeInTheDocument();

    // LOWESTボタンをクリックして元に戻す
    const lowestButton = canvas.getByRole('button', { name: 'LOWEST', hidden: true });
    await userEvent.click(lowestButton);

    // スナップポイントがLOWESTに戻ることを確認
    const backToLowestSnapPoint = canvas.getByText(/現在のスナップポイント: LOWEST/);
    await expect(backToLowestSnapPoint).toBeInTheDocument();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景のアプリタイトルを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeInTheDocument();

    // Circle of Fifthsのラベルが存在することを確認（SVG要素）
    const circleLabel = canvas.getByLabelText('Circle of Fifths');
    await expect(circleLabel).toBeInTheDocument();

    // 背景のボタンがクリック可能であることを確認
    const lowestButton = canvas.getByRole('button', { name: 'LOWEST', hidden: true });
    await expect(lowestButton).toBeInTheDocument();
    await expect(lowestButton).toBeEnabled();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フックによる初期状態の確認
    const initialDisplay = canvas.getByText(/現在のスナップポイント: LOWEST/);
    await expect(initialDisplay).toBeInTheDocument();

    // 状態変更関数の動作確認（HALF → EXPANDED → LOWEST）
    const halfButton = canvas.getByRole('button', { name: 'HALF', hidden: true });
    const expandedButton = canvas.getByRole('button', { name: 'EXPANDED', hidden: true });
    const lowestButton = canvas.getByRole('button', { name: 'LOWEST', hidden: true });

    // Vaulのアニメーション完了を待機（CI環境での安定性向上）
    await waitFor(
      () => {
        const computedStyle = window.getComputedStyle(halfButton);
        expect(computedStyle.pointerEvents).not.toBe('none');
      },
      { timeout: 3000 }
    );

    // HALF状態への変更
    await userEvent.click(halfButton);
    const halfState = canvas.getByText(/現在のスナップポイント: HALF/);
    await expect(halfState).toBeInTheDocument();

    // EXPANDED状態への変更
    await userEvent.click(expandedButton);
    const expandedState = canvas.getByText(/現在のスナップポイント: EXPANDED/);
    await expect(expandedState).toBeInTheDocument();

    // LOWEST状態への戻り
    await userEvent.click(lowestButton);
    const backToLowestState = canvas.getByText(/現在のスナップポイント: LOWEST/);
    await expect(backToLowestState).toBeInTheDocument();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景のアプリタイトルが表示されることを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeVisible();

    // スナップポイントコントロールが正常に表示されることを確認
    const lowestButton = canvas.getByRole('button', { name: 'LOWEST', hidden: true });
    const halfButton = canvas.getByRole('button', { name: 'HALF', hidden: true });
    const expandedButton = canvas.getByRole('button', { name: 'EXPANDED', hidden: true });

    await expect(lowestButton).toBeInTheDocument();
    await expect(halfButton).toBeInTheDocument();
    await expect(expandedButton).toBeInTheDocument();
  },
};
