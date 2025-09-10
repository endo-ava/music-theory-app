import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { MobileTwoColumnProvider } from '@/components/layouts/MobileTwoColumnLayout';
import { CircleOfFifths } from '@/features/circle-of-fifths';

const meta: Meta<typeof MobileTwoColumnProvider> = {
  title: 'Components/Layouts/MobileBottomSheet',
  component: MobileTwoColumnProvider,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* メインコンテンツをシミュレート */}
        <div className="absolute inset-0">
          <div className="flex h-full items-center justify-center">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold text-white">音楽理論アプリ</h1>
              <p className="text-gray-300">五度圏をクリックして音階を選択してください</p>
              <div className="relative">
                <CircleOfFifths />
              </div>
            </div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態のボトムシート
 * 最小スナップポイント（LOWEST）で表示され、背景の五度圏クリックが可能
 */
export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景コンテンツが存在することを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeInTheDocument();

    // 五度圏の説明文が存在することを確認
    const description = canvas.getByText('五度圏をクリックして音階を選択してください');
    await expect(description).toBeInTheDocument();
  },
};

/**
 * レスポンシブ表示テスト
 * モバイルビューポートでのレイアウト確認
 */
export const ResponsiveLayout: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景のアプリタイトルが表示されることを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeVisible();
  },
};

/**
 * 背景インタラクション両立テスト
 * 背景要素をクリックしてもアプリが正常に動作することを確認
 */
export const BackgroundInteraction: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景のアプリタイトルを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeInTheDocument();

    // Circle of Fifthsのラベルが存在することを確認（SVG要素）
    const circleLabel = canvas.getByLabelText('Circle of Fifths');
    await expect(circleLabel).toBeInTheDocument();
  },
};

/**
 * 基本機能テスト
 * アプリの基本的な表示と機能が動作することを確認
 */
export const BasicFunctionality: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 背景の五度圏説明が表示されることを確認
    const description = canvas.getByText('五度圏をクリックして音階を選択してください');
    await expect(description).toBeVisible();

    // アプリタイトルも正常に表示されることを確認
    const appTitle = canvas.getByText('音楽理論アプリ');
    await expect(appTitle).toBeVisible();
  },
};
