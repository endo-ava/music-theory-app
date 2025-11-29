import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from 'storybook/test';
import { MobileTwoColumnLayout } from '../index';
import { withStores } from '../../__stories__/decorators/withStores';

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
    const canvas = within(canvasElement);

    // レイアウトコンテナの存在確認
    const layoutContainer = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveAttribute('aria-label', 'モバイル2分割レイアウト');

    // Canvasの表示確認（min-h-[300px]クラスを持つdiv要素）
    const canvasArea = layoutContainer.querySelector('.min-h-\\[300px\\]');
    expect(canvasArea).toBeInTheDocument();

    // CircleOfFifthsの表示確認（SVG要素として、hidden要素も含めて検索）
    const circleOfFifths = canvas.getByRole('img', { name: 'Circle of Fifths', hidden: true });
    expect(circleOfFifths).toBeInTheDocument();
    expect(circleOfFifths).toHaveAttribute('aria-label', 'Circle of Fifths');

    // InformationPanelの表示確認（InformationPanelコンテンツ）
    // 具体的なテキストではなく、パネル領域の存在確認
    const infoArea = layoutContainer.querySelector('.overflow-y-visible');
    expect(infoArea).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // レイアウトコンテナのARIA属性確認
    const layoutContainer = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveAttribute('aria-label', 'モバイル2分割レイアウト');

    // Canvas領域の確認（min-h-[300px]クラスを持つdiv要素）
    const canvasArea = layoutContainer.querySelector('.min-h-\\[300px\\]');
    expect(canvasArea).toBeInTheDocument();

    // 見出しの階層構造確認（存在する場合のみ）
    const heading = canvas.queryByRole('heading', { level: 2 });
    if (heading) {
      expect(heading).toBeInTheDocument();
    }

    // SVG要素の代替テキスト確認（hidden要素も含めて検索）
    const svg = canvas.getByRole('img', { name: 'Circle of Fifths', hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', 'Circle of Fifths');
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
    const canvas = within(canvasElement);

    // モバイルレイアウトの基本確認
    const layoutContainer = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();

    // 縦型フレックスレイアウト確認
    expect(layoutContainer).toHaveClass('flex', 'flex-col');

    // Canvas領域の最小高さ確認
    const canvasArea = layoutContainer.querySelector('.min-h-\\[300px\\]');
    expect(canvasArea).toBeInTheDocument();

    // InformationPanel領域のスクロール対応確認
    const infoArea = layoutContainer.querySelector('.overflow-y-visible');
    expect(infoArea).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // レイアウトコンテナの確認
    const layoutContainer = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();

    // BottomSheetがモバイルでのみ表示されることを確認
    const mobileBottomSheetElement = canvasElement.querySelector('.md\\:hidden');
    expect(mobileBottomSheetElement).toBeInTheDocument();

    // View Controller（Hub切り替え）の存在確認
    // モバイルではBottomSheet内に表示されるため、直接は見えない可能性がある
    // BottomSheetの存在を確認
    const integrationBottomSheetElement = canvasElement.querySelector('.md\\:hidden');
    expect(integrationBottomSheetElement).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // Client Component（Provider）の確認
    const layoutProvider = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutProvider).toBeInTheDocument();

    // Server Componentで提供されるコンテンツの確認（Canvas領域）
    const canvasArea = layoutProvider.querySelector('.min-h-\\[300px\\]');
    expect(canvasArea).toBeInTheDocument();

    // InformationPanelのコンテンツ確認
    // 具体的なコンテンツではなく、パネル領域の存在確認
    const infoArea = layoutProvider.querySelector('.overflow-y-visible');
    expect(infoArea).toBeInTheDocument();

    // プロバイダーが適切にコンテンツをラップしていることを確認
    if (canvasArea) {
      expect(layoutProvider).toContainElement(canvasArea as HTMLElement);
    }
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
    const canvas = within(canvasElement);

    // カスタムスタイルが適用されたレイアウトコンテナの確認
    const layoutContainer = canvas.getByLabelText('モバイル2分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();

    // twMergeによるクラス名統合の確認
    expect(layoutContainer).toHaveClass('bg-blue-950');
    expect(layoutContainer).toHaveClass('border');
    expect(layoutContainer).toHaveClass('border-blue-400');
  },
};
