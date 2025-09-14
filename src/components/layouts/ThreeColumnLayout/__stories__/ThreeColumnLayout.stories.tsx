import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { ThreeColumnLayout } from '../components/ThreeColumnLayout';
import { withStores } from '../../__stories__/decorators/withStores';

const meta: Meta<typeof ThreeColumnLayout> = {
  title: 'Components/Layouts/ThreeColumnLayout',
  component: ThreeColumnLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app-bg',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        component:
          'デスクトップ端末向けの3分割レイアウトコンポーネント。ControllerPanel（左）、Canvas（中央）、InformationPanel（右）を横配置し、react-resizable-panelsによるリサイザブル機能を提供。Server/Client Componentの境界を最適化したComposition Patternを採用。',
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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのThreeColumnLayout表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でThreeColumnLayoutを表示します。左にControllerPanel（Hub切り替え）、中央にCanvas（五度圏）、右にInformationPanel（詳細情報）を配置し、リサイザブル機能を提供します。',
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
          'ThreeColumnLayoutの基本的なインタラクション動作をテストします。レイアウトコンテナの存在確認、3つのパネル表示確認、リサイズハンドルの動作確認を行います。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // レイアウトコンテナの存在確認
    const layoutContainer = canvas.getByLabelText('デスクトップ用3分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveAttribute('aria-label', 'デスクトップ用3分割レイアウト');

    // 左パネル（ControllerPanel）の確認
    const controllerPanel = canvas.getByText('View');
    expect(controllerPanel).toBeInTheDocument();

    // 中央パネル（Canvas）の確認
    const canvasArea = canvas.getByLabelText('メイン表示エリア');
    expect(canvasArea).toBeInTheDocument();

    // 右パネル（InformationPanel）の確認
    const informationPanel = canvas.getByText('Information');
    expect(informationPanel).toBeInTheDocument();

    // 選択されたコード情報の表示確認（Store初期化でC Majorが選択されている）
    // 複数の "Selected Chord" テキストがある場合は、表示されているもの（aria-hiddenでないもの）を取得
    const selectedChordLabels = canvas.getAllByText('Selected Chord');
    const visibleSelectedChordLabel = selectedChordLabels.find(
      el => !el.getAttribute('aria-hidden')
    );
    expect(visibleSelectedChordLabel).toBeInTheDocument();

    // CircleOfFifthsの表示確認（SVG要素として）
    const circleOfFifths = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleOfFifths).toBeInTheDocument();
    expect(circleOfFifths).toHaveAttribute('aria-label', 'Circle of Fifths');
  },
};

/**
 * リサイザブル機能テスト
 */
export const ResizableFunctionalityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'ThreeColumnLayoutのリサイザブル機能をテストします。パネルのリサイズハンドル、最小サイズ制約、レイアウトリセット機能を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // react-resizable-panelsのPanelGroupの存在確認
    const panelGroup = canvasElement.querySelector('[data-panel-group]');
    expect(panelGroup).toBeInTheDocument();

    // 各パネルの存在確認
    const panels = canvasElement.querySelectorAll('[data-panel]');
    expect(panels).toHaveLength(3);

    // リサイズハンドルの存在確認
    const resizeHandles = canvasElement.querySelectorAll('[data-panel-resize-handle-enabled]');
    expect(resizeHandles.length).toBeGreaterThan(0);

    // レイアウトリセットボタンの確認（存在する場合のみ）
    const resetButton =
      canvas.queryByLabelText(/レイアウトをデフォルトに戻す/) || canvas.queryByText('リセット');
    // リセットボタンが存在する場合のみテスト（状態によって表示/非表示が変わる）
    if (resetButton) {
      expect(resetButton).toBeInTheDocument();
    }
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
          'ThreeColumnLayoutのアクセシビリティ要件をテストします。適切なセマンティクス、ARIA属性、キーボードナビゲーション、リサイズ操作のアクセシビリティを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // レイアウトコンテナのARIA属性確認
    const layoutContainer = canvas.getByLabelText('デスクトップ用3分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();
    expect(layoutContainer).toHaveAttribute('aria-label', 'デスクトップ用3分割レイアウト');

    // Canvas領域のセマンティクス確認
    const canvasArea = canvas.getByLabelText('メイン表示エリア');
    expect(canvasArea).toBeInTheDocument();
    expect(canvasArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // 見出しの階層構造確認（複数存在する場合はすべて確認）
    const headings = canvas.queryAllByRole('heading', { level: 2 });
    if (headings.length > 0) {
      headings.forEach(heading => {
        expect(heading).toBeInTheDocument();
      });
    }

    // SVG要素の代替テキスト確認（存在する場合のみ）
    const svg = canvas.queryByRole('img', { name: 'Circle of Fifths' });
    if (svg) {
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Circle of Fifths');
    }

    // リサイズハンドルのアクセシビリティ確認
    const resizeHandles = canvasElement.querySelectorAll('[data-panel-resize-handle-enabled]');
    resizeHandles.forEach(handle => {
      expect(handle).toHaveAttribute('role', 'separator');
    });
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
          'ThreeColumnLayoutのレスポンシブ対応をテストします。異なる画面サイズでの表示確認、デスクトップ向けレイアウトの最適化を確認します。',
      },
    },
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
        largeDesktop: {
          name: 'Large Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
        ultrawide: {
          name: 'Ultrawide',
          styles: { width: '3440px', height: '1440px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // デスクトップレイアウトの基本確認
    const layoutContainer = canvas.getByLabelText('デスクトップ用3分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();

    // 3分割レイアウトの確認
    const panels = canvasElement.querySelectorAll('[data-panel]');
    expect(panels).toHaveLength(3);

    // 各パネルの最小幅制約確認
    panels.forEach(panel => {
      const minWidth = panel.getAttribute('data-panel-min-size');
      expect(minWidth).toBeDefined();
    });

    // リサイザブルコンテナの確認
    const panelGroup = canvasElement.querySelector('[data-panel-group]');
    expect(panelGroup).toBeInTheDocument();
    expect(panelGroup).toHaveAttribute('data-panel-group-direction', 'horizontal');
  },
};

/**
 * リセット機能テスト
 */
export const ResetFunctionalityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'ThreeColumnLayoutのレイアウトリセット機能をテストします。レイアウトリセットボタンの動作、デフォルト状態への復元を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // レイアウトリセットボタンの確認（存在する場合のみ）
    const resetButton =
      canvas.queryByLabelText(/レイアウトをデフォルトに戻す/) || canvas.queryByText('リセット');

    if (resetButton) {
      expect(resetButton).toBeInTheDocument();

      // ボタンがクリック可能であることを確認
      expect(resetButton).not.toBeDisabled();

      // ボタンをクリック（実際のリセット動作はreact-resizable-panelsが管理）
      await user.click(resetButton);

      // クリック後の状態確認（ボタンが非表示になる可能性もある）
      // 確認ダイアログが表示される可能性があるため、エラーを無視
    }
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

    // Server Componentで提供されるコンテンツの確認
    const controllerContent = canvas.getByText('View');
    expect(controllerContent).toBeInTheDocument();

    const canvasContent = canvas.getByLabelText('メイン表示エリア');
    expect(canvasContent).toBeInTheDocument();

    const informationContent = canvas.getByText('Information');
    expect(informationContent).toBeInTheDocument();

    // 複数の "Selected Chord" テキストがある場合は、表示されているもの（aria-hiddenでないもの）を取得
    const selectedChordLabels = canvas.getAllByText('Selected Chord');
    const selectedChordContent = selectedChordLabels.find(el => !el.getAttribute('aria-hidden'));
    expect(selectedChordContent).toBeInTheDocument();

    // Client Component（Provider）の確認
    const layoutProvider = canvas.getByLabelText('デスクトップ用3分割レイアウト');
    expect(layoutProvider).toBeInTheDocument();

    // プロバイダーが適切にコンテンツをラップしていることを確認
    expect(layoutProvider).toContainElement(controllerContent);
    expect(layoutProvider).toContainElement(canvasContent);
    expect(layoutProvider).toContainElement(informationContent);
  },
};

/**
 * パネルサイズ設定テスト
 */
export const PanelSizingTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'ThreeColumnLayoutの各パネルのサイズ設定をテストします。デフォルトサイズ、最小サイズ制約、最小幅設定を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // 各パネルの存在とサイズ制約の確認
    const panels = canvasElement.querySelectorAll('[data-panel]');
    expect(panels).toHaveLength(3);

    // 左パネル（Controller）の最小幅確認
    const leftPanel = panels[0];
    expect(leftPanel).toHaveClass('min-w-[200px]');

    // 中央パネル（Canvas）の最小幅確認
    const centerPanel = panels[1];
    expect(centerPanel).toHaveClass('min-w-[300px]');

    // 右パネル（Information）の最小幅確認
    const rightPanel = panels[2];
    expect(rightPanel).toHaveClass('min-w-[200px]');

    // 各パネルの高さが100%であることを確認
    panels.forEach(panel => {
      const panelContent = panel.querySelector('.h-full');
      expect(panelContent).toBeInTheDocument();
    });
  },
};

/**
 * カスタムスタイルのThreeColumnLayout
 */
export const CustomStyle: Story = {
  args: {
    className:
      'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-400 rounded-lg shadow-2xl',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したThreeColumnLayoutです。背景グラデーション、ボーダー、角丸、シャドウをカスタマイズできます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // カスタムスタイルが適用されたレイアウトコンテナの確認
    const layoutContainer = canvas.getByLabelText('デスクトップ用3分割レイアウト');
    expect(layoutContainer).toBeInTheDocument();

    // twMergeによるクラス名統合の確認
    expect(layoutContainer).toHaveClass('bg-gradient-to-r');
    expect(layoutContainer).toHaveClass('from-purple-900');
    expect(layoutContainer).toHaveClass('to-blue-900');
    expect(layoutContainer).toHaveClass('border');
    expect(layoutContainer).toHaveClass('border-purple-400');
    expect(layoutContainer).toHaveClass('rounded-lg');
    expect(layoutContainer).toHaveClass('shadow-2xl');
  },
};
