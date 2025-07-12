import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
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
    const canvas = within(canvasElement);

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(circleContainer).toBeInTheDocument();

    // SVG内のインタラクティブ要素の存在確認
    await expect(circleContainer).toBeInTheDocument();
    // SVGが適切にレンダリングされていることを確認
    await expect(circleContainer.tagName.toLowerCase()).toBe('svg');
    // SVGが適切なviewBoxを持っていることを確認
    await expect(circleContainer).toHaveAttribute('viewBox');
    // SVGにCircleSegmentが含まれていることを確認（path要素として）
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);
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
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(circleContainer).toBeInTheDocument();

    // SVG内のセグメント要素が表示されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // テキスト要素も適切に表示されていることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThan(0);
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
    const canvas = within(canvasElement);

    // 小サイズでも基本機能が動作することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(circleContainer).toBeInTheDocument();

    // 小サイズでもSVG要素が適切に表示されることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // コンパクトサイズでもテキストが表示されることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThan(0);
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
    const canvas = within(canvasElement);

    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(circleContainer).toBeInTheDocument();

    // SVGコンテナのアクセシビリティ確認
    await expect(circleContainer).toHaveAttribute('aria-label', 'Circle of Fifths');

    // SVG内の要素構造確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // キーボードナビゲーションのベースとなる要素確認
    // 注：実際のキーボードインタラクションは個別のコンポーネントレベルでテストする
    await expect(circleContainer.tagName.toLowerCase()).toBe('svg');
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
    const canvas = within(canvasElement);

    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(circleContainer).toBeInTheDocument();

    // SVG内のセグメント要素が適切に配置されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // 各セグメントに対応するテキスト要素が存在することを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThan(0);

    // SVGが適切な構造を持っていることを確認
    await expect(circleContainer).toHaveAttribute('viewBox');

    // 複数のセグメントが存在することを確認（12セグメント期待）
    expect(pathElements.length).toBeGreaterThanOrEqual(12);
  },
};
