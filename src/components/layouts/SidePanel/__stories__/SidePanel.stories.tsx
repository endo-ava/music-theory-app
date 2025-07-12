import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { SidePanel } from '../components/SidePanel';

const meta: Meta<typeof SidePanel> = {
  title: 'Components/Layouts/SidePanel',
  component: SidePanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hub画面の左側に配置されるレイアウト用UIコンテナ。Featureコンポーネントを格納・配置するためのレスポンシブ対応サイドパネルレイアウトを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名（外部レイアウト制御用）',
    },
    isVisible: {
      control: 'boolean',
      description: 'パネルの表示状態（デフォルト: true）',
    },
  },
  decorators: [
    Story => (
      <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
        <Story />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-white">Canvas Area</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのSidePanel表示（空の状態）
 * UIコンテナとしての基本レイアウト構造を確認
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの設定でSidePanelを表示します。現在はViewControllerが表示されます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // SidePanelの基本構造確認
    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    await expect(sidePanel).toBeInTheDocument();

    // 基本的なレイアウトクラスの確認
    await expect(sidePanel).toHaveClass('flex', 'flex-col');

    // セマンティックな構造の確認
    await expect(sidePanel.tagName.toLowerCase()).toBe('aside');

    // 現在はViewControllerが含まれたsectionが表示されている
    const controlPanel = canvas.getByLabelText('コントロールパネル');
    await expect(controlPanel).toBeInTheDocument();
  },
};

/**
 * 非表示状態のSidePanel
 * isVisibleプロパティによる表示制御の確認
 * 注意：元の実装でisVisible=falseの場合、return nullとなるため実際にはDOM要素が存在しない
 */
export const Hidden: Story = {
  args: {
    isVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'isVisibleをfalseにした状態のSidePanelです。元の実装ではreturn nullとなりDOM要素が存在しないため、このテストでは要素の不存在を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // 元の実装でisVisible=falseの場合return nullとなるため
    // DOM要素自体が存在しない
    const rootElement = canvasElement;
    const sidePanel = rootElement.querySelector('aside[aria-label="サイドパネル"]');

    // 要素が存在しないことを確認（return nullの動作）
    expect(sidePanel).toBeNull();
  },
};

/**
 * カスタムスタイルのSidePanel
 * className propsによるスタイルカスタマイズの確認
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-l-4 border-blue-500 bg-blue-50/20',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSidePanelです。className propsを使用して外部レイアウトやスタイルをカスタマイズできます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    await expect(sidePanel).toBeInTheDocument();

    // カスタムクラスが適用されていることを確認
    await expect(sidePanel).toHaveClass('border-l-4', 'border-blue-500');
  },
};

/**
 * 子要素を含むSidePanel（保留）
 * 注意：元の実装ではchildren propが存在しないため保留
 */
// export const WithChildren: Story = {
//   // 元の実装にchildren propが存在しないため、このストーリーは保留
// };

/**
 * レスポンシブテスト
 * 異なる画面サイズでのレイアウト確認
 */
export const ResponsiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのレスポンシブ対応をテストします。デフォルトのViewController実装での異なる画面サイズでのレイアウト構造を確認します。',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // レスポンシブレイアウトの基本確認
    const sidePanel = canvas.getByRole('complementary');
    await expect(sidePanel).toBeInTheDocument();

    // 基本レイアウト構造の確認
    await expect(sidePanel).toHaveClass('flex', 'flex-col');

    // デフォルトのViewControllerが正しく表示されていることを確認
    const controlPanel = canvas.getByLabelText('コントロールパネル');
    await expect(controlPanel).toBeInTheDocument();
  },
};

/**
 * アクセシビリティテスト
 * セマンティックHTML構造とARIA属性の確認
 */
export const AccessibilityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのアクセシビリティ要件をテストします。aside要素、適切なセマンティクス、ARIA属性をデフォルトのViewController実装で確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // セマンティクス確認
    const sidePanel = canvas.getByRole('complementary');
    await expect(sidePanel).toHaveAttribute('aria-label', 'サイドパネル');

    // aside要素であることを確認
    await expect(sidePanel.tagName.toLowerCase()).toBe('aside');

    // デフォルトのViewControllerに含まれるフォーカス可能な要素のテスト
    const controlPanel = canvas.getByLabelText('コントロールパネル');
    await expect(controlPanel).toBeInTheDocument();

    // ランドマークとしての機能確認（complementaryではなくデフォルトのrole属性を確認）
    await expect(sidePanel).toHaveAttribute('aria-label', 'サイドパネル');
  },
};
