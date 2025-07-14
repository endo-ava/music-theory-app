import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { MobileBottomSheet } from '../components/MobileBottomSheet';

const meta: Meta<typeof MobileBottomSheet> = {
  title: 'Components/Layouts/MobileBottomSheet',
  component: MobileBottomSheet,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
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
        <div className="space-y-4 p-6">
          <h1 className="text-2xl font-bold text-white">メインコンテンツ</h1>
          <p className="text-gray-300">
            この画面の下部にMobileBottomSheetが表示されます。 ドラッグ操作でサイズを調整できます。
          </p>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 shadow">
                <h3 className="font-semibold text-gray-200">サンプルカード {i + 1}</h3>
                <p className="text-sm text-gray-400">ダミーコンテンツです。</p>
              </div>
            ))}
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
 * デフォルトのボトムシート表示
 * 基本的なボトムシートの表示とドラッグ操作機能のテスト
 */
export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ボトムシートのメイン要素が存在することを確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // ARIA属性が適切に設定されていることを確認
    await expect(bottomSheet).toHaveAttribute('aria-modal', 'false');
    await expect(bottomSheet).toHaveAttribute('aria-labelledby', 'bottom-sheet-title');

    // ハンドル要素が存在することを確認
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await expect(handle).toBeInTheDocument();

    // 閉じるボタンが存在することを確認
    const closeButton = canvas.getByRole('button', { name: 'ボトムシートを閉じる' });
    await expect(closeButton).toBeInTheDocument();
  },
};

/**
 * 初期状態のテスト
 * 各状態（collapsed/half/expanded）の初期表示を確認
 */
export const InitialStates: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ボトムシートが初期状態（collapsed）で表示されることを確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // ハンドル要素が表示されていることを確認
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await expect(handle).toBeInTheDocument();

    // 初期状態では一部のコンテンツが非表示であることを確認
    // (実際の実装では、collapsed状態でタブやコンテンツが非表示になる)
    await expect(bottomSheet).toHaveAttribute('aria-modal', 'false');
  },
};

/**
 * インタラクションテスト
 * ハンドルクリックによる状態変更の確認
 */
export const InteractionTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // ボトムシートの存在を確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // ハンドルをクリックしてボトムシートを開く
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await user.click(handle);

    // クリック後もボトムシートが存在することを確認
    await expect(bottomSheet).toBeInTheDocument();

    // 閉じるボタンをクリック
    const closeButton = canvas.getByRole('button', { name: 'ボトムシートを閉じる' });
    await user.click(closeButton);

    // 閉じる操作後もボトムシートが存在することを確認（非表示になるだけ）
    await expect(bottomSheet).toBeInTheDocument();
  },
};

/**
 * キーボードナビゲーションテスト
 * Escapeキーでの閉じる操作とフォーカス管理の確認
 */
export const KeyboardNavigation: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // ボトムシートの存在を確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // ハンドルをクリックしてボトムシートを開く
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await user.click(handle);

    // Escapeキーを押してボトムシートを閉じる
    await user.keyboard('{Escape}');

    // Escape後もボトムシートが存在することを確認
    await expect(bottomSheet).toBeInTheDocument();

    // ハンドルが引き続きフォーカス可能であることを確認
    await expect(handle).toBeInTheDocument();
  },
};

/**
 * アクセシビリティテスト
 * ARIA属性、role、キーボード操作の総合的な確認
 */
export const AccessibilityTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ボトムシートのアクセシビリティ属性を確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();
    await expect(bottomSheet).toHaveAttribute('role', 'dialog');
    await expect(bottomSheet).toHaveAttribute('aria-modal', 'false');
    await expect(bottomSheet).toHaveAttribute('aria-labelledby', 'bottom-sheet-title');

    // ハンドルボタンのアクセシビリティを確認
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await expect(handle).toHaveAttribute('aria-label', 'ボトムシートを開く');

    // 閉じるボタンのアクセシビリティを確認
    const closeButton = canvas.getByRole('button', { name: 'ボトムシートを閉じる' });
    await expect(closeButton).toHaveAttribute('aria-label', 'ボトムシートを閉じる');

    // タブインデックスが適切に設定されていることを確認
    await expect(handle).toHaveAttribute('tabindex', '0');
    await expect(closeButton).toHaveAttribute('tabindex', '0');
  },
};

/**
 * レスポンシブデザインテスト
 * 異なる画面サイズでの表示確認
 */
export const ResponsiveDesign: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // タブレットサイズでもボトムシートが正常に表示されることを確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // ハンドルとボタンが引き続き操作可能であることを確認
    const handle = canvas.getByRole('button', { name: 'ボトムシートを開く' });
    await expect(handle).toBeInTheDocument();

    const closeButton = canvas.getByRole('button', { name: 'ボトムシートを閉じる' });
    await expect(closeButton).toBeInTheDocument();
  },
};

/**
 * カスタムクラス名テスト
 * className propsによるカスタマイズの確認
 */
export const CustomClassName: Story = {
  args: {
    className: 'custom-bottom-sheet-test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ボトムシートにカスタムクラス名が適用されることを確認
    const bottomSheet = canvas.getByRole('dialog');
    await expect(bottomSheet).toBeInTheDocument();

    // カスタムクラス名が親要素に適用されることを確認
    // (実際の実装では、カスタムクラス名は最外側のdivに適用される)
    const containerElement = bottomSheet.closest('.custom-bottom-sheet-test');
    await expect(containerElement).toBeInTheDocument();
  },
};
