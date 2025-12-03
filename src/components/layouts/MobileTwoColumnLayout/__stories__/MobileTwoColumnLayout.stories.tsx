import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileTwoColumnLayout } from '../index';
import { withStores } from '../../__stories__/decorators/withStores';
import { MobileTwoColumnLayoutDriver } from './MobileTwoColumnLayout.driver';

const meta: Meta<typeof MobileTwoColumnLayout> = {
  title: 'Components/Layouts/MobileTwoColumnLayout',
  component: MobileTwoColumnLayout,
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
          'モバイル端末向けの2分割レイアウトコンポーネント。Canvas（上部）とInformationPanel（下部）を縦配置し、BottomSheetでController機能を提供。Server/Client Componentの境界を最適化したComposition Patternを採用。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // 色のコントラスト問題を一時的に無効化（デザイントークンで管理）
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名',
    },
  },
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
 * デフォルトのMobileTwoColumnLayout表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でMobileTwoColumnLayoutを表示します。上部にCanvas（五度圏）、下部にInformationPanel、BottomSheetでController機能を提供します。',
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
          'MobileTwoColumnLayoutの基本的なインタラクション動作をテストします。レイアウトコンテナの存在確認、Canvas・InformationPanelの表示確認を行います。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // レイアウトコンテナ、Canvas、InformationPanelが正しく表示されることを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

    await driver.expectLayoutContainerVisible();
    await driver.expectCanvasAreaVisible();
    await driver.expectCircleOfFifthsVisible();
    await driver.expectInformationPanelVisible();
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
          'MobileTwoColumnLayoutのアクセシビリティ要件をテストします。適切なセマンティクス、ARIA属性、キーボードナビゲーションを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // ARIA属性とアクセシビリティ要件が適切に設定されていることを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

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
          'MobileTwoColumnLayoutのレスポンシブ対応をテストします。モバイル端末での縦型レイアウト表示を確認します。',
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
        tablet: {
          name: 'Tablet Portrait',
          styles: { width: '768px', height: '1024px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    // モバイル端末での縦型レイアウトが正しく動作することを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

    await driver.expectResponsiveLayout();
  },
};

/**
 * BottomSheet連携テスト
 */
export const BottomSheetIntegrationTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'MobileTwoColumnLayoutとBottomSheetの連携動作をテストします。Controller機能がBottomSheetで適切に表示されることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // BottomSheetがモバイルで適切に表示されることを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

    await driver.expectLayoutContainerVisible();
    await driver.expectBottomSheetVisible();
  },
};

/**
 * Server/Client Component境界テスト
 */
export const ComponentBoundaryTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Server ComponentとClient Componentの境界が適切に分離されていることをテストします。Composition Patternの実装確認を行います。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Server ComponentとClient Componentの境界が適切に分離されていることを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

    await driver.expectComponentBoundary();
  },
};

/**
 * カスタムスタイルのMobileTwoColumnLayout
 */
export const CustomStyle: Story = {
  args: {
    className: 'bg-blue-950 border border-blue-400',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したMobileTwoColumnLayoutです。背景色やボーダーをカスタマイズできます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // カスタムスタイルが正しく適用されることを確認
    const driver = new MobileTwoColumnLayoutDriver(canvasElement);

    await driver.expectLayoutContainerVisible();
    await driver.expectCustomStyles(['bg-blue-950', 'border', 'border-blue-400']);
  },
};
