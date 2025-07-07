import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { SidePanel } from '../components/SidePanel';
import { useHubStore } from '@/stores/hubStore';

const meta: Meta<typeof SidePanel> = {
  title: 'Components/SidePanel',
  component: SidePanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hub画面のサイドパネルメインコンテナコンポーネント。統一されたセクション構造でViewController（C-1）を含み、共通データ構造（@/shared/constants/hubs）を活用してHub種類の切り替えを提供します。将来的にLayerController（C-2）、InformationPanel（C-3）が追加される予定です。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名',
    },
    isVisible: {
      control: 'boolean',
      description: 'パネルの表示状態',
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
 * デフォルトのSidePanel表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でSidePanelを表示します。統一されたセクション内にViewControllerが含まれ、ダークテーマで統一されたデザインです。',
      },
    },
  },
};

/**
 * 非表示状態のSidePanel
 */
export const Hidden: Story = {
  args: {
    isVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'isVisibleをfalseにした状態のSidePanelです。モバイル対応などで一時的に非表示にする場合に使用します。',
      },
    },
  },
};

/**
 * インタラクションテスト
 */
export const InteractiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントの基本的なインタラクション動作をテストします。統一されたセクション構造と内包するViewControllerの動作を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // SidePanelの表示確認
    const sidePanel = canvas.getByRole('complementary', { name: 'サイドパネル' });
    expect(sidePanel).toBeInTheDocument();

    // 統一セクションの確認
    const section = sidePanel.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'side-panel-title');

    // ViewControllerの存在確認
    const viewController = canvas.getByRole('heading', { level: 2, name: 'View controller' });
    expect(viewController).toBeInTheDocument();

    // Hub切り替えボタンの確認
    const radioGroup = canvas.getByRole('radiogroup', { name: 'Hub種類の選択' });
    expect(radioGroup).toBeInTheDocument();

    // 共通データ構造からの情報が表示されていることを確認
    expect(canvas.getByText('五度関係で配置された調の輪')).toBeInTheDocument();
  },
};

/**
 * レスポンシブテスト
 */
export const ResponsiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのレスポンシブ対応をテストします。固定幅320px（w-80）での表示確認を行います。',
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
    expect(sidePanel).toBeInTheDocument();
    expect(sidePanel).toHaveClass('w-100'); // 400px固定

    // 縦スクロール対応の確認
    expect(sidePanel).toHaveClass('flex-col');

    // 内部コンテンツエリアのスクロール確認
    const contentArea = sidePanel.querySelector('.overflow-y-auto');
    expect(contentArea).toBeInTheDocument();
  },
};

/**
 * アクセシビリティテスト
 */
export const AccessibilityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelコンポーネントのアクセシビリティ要件をテストします。適切なセマンティクス、ARIA属性、見出し階層を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // セマンティクス確認
    const sidePanel = canvas.getByRole('complementary');
    expect(sidePanel).toHaveAttribute('aria-label', 'サイドパネル');

    // 見出し階層の確認
    const h2 = canvas.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('View controller');

    // ViewControllerのアクセシビリティ確認
    const radioGroup = canvas.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'Hub種類の選択');

    // キーボードナビゲーション確認
    const firstButton = canvas.getByRole('radio', { name: '五度圏' });
    firstButton.focus();
    expect(firstButton).toHaveFocus();
  },
};

/**
 * ViewControllerとの統合テスト
 */
export const ViewControllerIntegrationTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'SidePanelに統合されたViewControllerの動作確認テストです。共通データ構造とHub状態管理との連携を確認します。',
      },
    },
  },
  decorators: [
    Story => {
      const { hubType } = useHubStore();

      return (
        <div className="flex h-screen bg-gradient-to-b from-gray-900 to-black">
          <Story />
          <div className="flex flex-1 flex-col items-center justify-center text-white">
            <p className="mb-4 text-xl">Canvas Area</p>
            <p className="bg-background-muted rounded px-4 py-2 text-sm">
              Current Hub: <span className="font-mono font-bold">{hubType}</span>
            </p>
          </div>
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態確認
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    expect(circleButton).toHaveAttribute('aria-checked', 'true');

    // 状態変更テスト（共通データ構造からの情報使用）
    await canvas.getByRole('radio', { name: 'クロマチック' }).click();
    expect(chromaticButton).toHaveAttribute('aria-checked', 'true');
    expect(circleButton).toHaveAttribute('aria-checked', 'false');

    // 共通データ構造からの説明が切り替わったことを確認
    expect(canvas.getByText('半音階で配置された音の輪')).toBeInTheDocument();
  },
};

/**
 * カスタムスタイルのSidePanel
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-l-4 border-blue-500 bg-blue-50',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムスタイルを適用したSidePanelです。ボーダーと背景色をカスタマイズできます。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false, // カスタムスタイルでのコントラスト検証を無効化
          },
        ],
      },
    },
  },
};
