import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileTabLayout } from '../components/MobileTabLayout';
import { withStores } from '../../__stories__/decorators/withStores';
import { MobileTabLayoutDriver } from './MobileTabLayout.driver';

const meta: Meta<typeof MobileTabLayout> = {
  title: 'Components/Layouts/MobileTabLayout',
  component: MobileTabLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app-bg',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        component:
          'モバイル端末向けの統合タブレイアウトコンポーネント。Canvas（上部固定）、タブコンテンツ（スクロール可能）、タブバー（下部固定）の3層構造を提供します。実際のアプリケーションコンポーネント（Canvas、ControllerPanel、InformationPanel）を統合した完全な実装です。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    withStores,
    Story => (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのMobileTabLayout表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でMobileTabLayoutを表示します。実際のCanvas、ControllerPanel、InformationPanelが統合されています。',
      },
    },
  },
};

/**
 * レイアウト構造テスト
 */
export const LayoutStructureTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'MobileTabLayoutの基本構造をテストします。Canvas、タブリスト、タブボタンの表示を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const driver = new MobileTabLayoutDriver(canvasElement);

    // レイアウトが正しく表示される
    await driver.expectLayoutVisible();

    // Canvas が表示される
    await driver.expectCanvasVisible();

    // タブが表示される
    await driver.expectTabsVisible();

    // 初期状態で Controller タブがアクティブ
    await driver.expectTabActive('controller');
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
          'MobileTabLayoutのアクセシビリティ要件をテストします。適切なARIA属性とセマンティクスを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const driver = new MobileTabLayoutDriver(canvasElement);

    // アクセシビリティ属性の確認
    await driver.expectAccessibilityAttributes();
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
          'MobileTabLayoutのレスポンシブ対応をテストします。モバイル端末でのタブレイアウト構造を確認します。',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile Portrait',
          styles: { width: '375px', height: '667px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const driver = new MobileTabLayoutDriver(canvasElement);

    // レスポンシブレイアウト構造の確認
    await driver.expectResponsiveLayout();
  },
};
