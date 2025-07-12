import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { CircleOfFifths } from '../components/CircleOfFifths';

const meta: Meta<typeof CircleOfFifths> = {
  title: 'Components/CircleOfFifths',
  component: CircleOfFifths,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'app-bg',
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの五度圏表示
 * 基本的な五度圏の表示とインタラクション機能のテスト
 */
export const Default: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('application');
    await expect(circleContainer).toBeInTheDocument();

    // キーエリア（ボタン）の存在確認
    const keyButtons = canvas.getAllByRole('button');
    await expect(keyButtons.length).toBeGreaterThan(0);

    // 最初のキーボタンをクリックしてインタラクション動作を確認
    if (keyButtons.length > 0) {
      const firstKeyButton = keyButtons[0];
      await user.click(firstKeyButton);

      // クリック後の状態変化を確認（例：選択状態のスタイル変更）
      // 実装に応じて適切な確認を行う
    }

    // ホバー効果のテスト
    if (keyButtons.length > 1) {
      const secondKeyButton = keyButtons[1];
      await user.hover(secondKeyButton);

      // ホバー状態の確認
      // 実装に応じて適切な確認を行う
    }
  },
};

/**
 * 大サイズでの五度圏表示
 * 大きなサイズでの表示品質とスケーラビリティの確認
 */
export const Large: Story = {
  args: {
    className: 'w-[700px] h-[700px]',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 大サイズでも適切に表示されることを確認
    const circleContainer = canvas.getByRole('application');
    await expect(circleContainer).toBeInTheDocument();

    // 全キーエリアが表示されていることを確認
    const keyButtons = canvas.getAllByRole('button');
    await expect(keyButtons.length).toBe(12); // 12の調（キー）が存在することを確認
  },
};

/**
 * 小サイズでの五度圏表示
 * コンパクトサイズでの可読性と操作性の確認
 */
export const Small: Story = {
  args: {
    className: 'w-[300px] h-[300px]',
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // 小サイズでも基本機能が動作することを確認
    const circleContainer = canvas.getByRole('application');
    await expect(circleContainer).toBeInTheDocument();

    const keyButtons = canvas.getAllByRole('button');
    await expect(keyButtons.length).toBeGreaterThan(0);

    // 小サイズでもクリック操作が可能であることを確認
    if (keyButtons.length > 0) {
      await user.click(keyButtons[0]);
    }
  },
};

/**
 * キーボードナビゲーションテスト
 * アクセシビリティとキーボード操作の確認
 */
export const KeyboardNavigation: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    const circleContainer = canvas.getByRole('application');
    await expect(circleContainer).toBeInTheDocument();

    // フォーカス管理のテスト
    const keyButtons = canvas.getAllByRole('button');

    if (keyButtons.length > 0) {
      // 最初のボタンにフォーカス
      keyButtons[0].focus();
      await expect(keyButtons[0]).toHaveFocus();

      // Enterキーでの操作確認
      await user.keyboard('{Enter}');

      // Tabキーでのナビゲーション
      await user.tab();

      // Arrowキーでのナビゲーション（実装されている場合）
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowLeft}');
    }
  },
};

/**
 * インタラクション状態テスト
 * 複数のキー選択とその状態管理の確認
 */
export const InteractionStates: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    const keyButtons = canvas.getAllByRole('button');

    if (keyButtons.length >= 3) {
      // 複数のキーを順次クリックして状態変化を確認
      await user.click(keyButtons[0]);

      // 少し待機してから次のキーをクリック
      await user.click(keyButtons[2]);

      await user.click(keyButtons[4]);

      // 各キーボタンが適切な状態を持っていることを確認
      for (const button of keyButtons.slice(0, 5)) {
        await expect(button).toBeInTheDocument();
        await expect(button).toBeEnabled();
      }
    }
  },
};
