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
    children: {
      control: false,
      description: '子要素（Featureコンポーネント）',
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
        story:
          'デフォルトの設定でSidePanelを表示します。子要素がない空の状態で、aside要素とセマンティックHTML構造を確認できます。',
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
  },
};

/**
 * 非表示状態のSidePanel
 * isVisibleプロパティによる表示制御の確認
 */
export const Hidden: Story = {
  args: {
    isVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'isVisibleをfalseにした状態のSidePanelです。モバイル対応やレスポンシブデザインで一時的に非表示にする場合に使用します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 非表示状態でも要素は存在するが、hiddenクラスが適用される
    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    await expect(sidePanel).toBeInTheDocument();

    // 非表示状態のスタイル確認
    await expect(sidePanel).toHaveClass('hidden');
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
 * 子要素を含むSidePanel
 * Featureコンポーネントを格納した状態の確認
 */
export const WithChildren: Story = {
  args: {
    children: (
      <div className="space-y-4 p-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Sample Feature 1</h2>
          <p className="text-gray-300">これはサンプルのFeatureコンポーネントです。</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Sample Feature 2</h2>
          <p className="text-gray-300">複数のFeatureを格納できます。</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelに子要素（Featureコンポーネント）を含めた状態です。実際の使用例に近い形での表示確認ができます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    await expect(sidePanel).toBeInTheDocument();

    // 子要素が正しく表示されていることを確認
    await expect(canvas.getByText('Sample Feature 1')).toBeInTheDocument();
    await expect(canvas.getByText('Sample Feature 2')).toBeInTheDocument();

    // レイアウト構造の確認
    const features = canvas.getAllByText(/Sample Feature/);
    await expect(features).toHaveLength(2);
  },
};

/**
 * レスポンシブテスト
 * 異なる画面サイズでのレイアウト確認
 */
export const ResponsiveTest: Story = {
  args: {
    children: (
      <div className="p-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-lg font-semibold text-white">Responsive Content</h2>
          <p className="text-gray-300">レスポンシブ対応のテストコンテンツです。</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのレスポンシブ対応をテストします。異なる画面サイズでのレイアウト構造を確認します。',
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

    // コンテンツが正しく表示されていることを確認
    await expect(canvas.getByText('Responsive Content')).toBeInTheDocument();
  },
};

/**
 * アクセシビリティテスト
 * セマンティックHTML構造とARIA属性の確認
 */
export const AccessibilityTest: Story = {
  args: {
    children: (
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">Accessibility Test</h2>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Sample Button
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのアクセシビリティ要件をテストします。aside要素、適切なセマンティクス、ARIA属性を確認します。',
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

    // フォーカス可能な要素のテスト
    const button = canvas.getByRole('button', { name: 'Sample Button' });
    button.focus();
    await expect(button).toHaveFocus();

    // ランドマークとしての機能確認
    await expect(sidePanel).toHaveAttribute('role', 'complementary');
  },
};

/**
 * 空の状態のSidePanel
 * 子要素なしでの最小構成の確認
 */
export const Empty: Story = {
  args: {
    children: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          '子要素が明示的にundefinedの状態のSidePanelです。UIコンテナとしての最小構成での動作を確認できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    await expect(sidePanel).toBeInTheDocument();

    // 基本構造は保持されていることを確認
    await expect(sidePanel).toHaveClass('flex', 'flex-col');

    // 内容が空であることを確認
    await expect(sidePanel).toBeEmptyDOMElement();
  },
};
