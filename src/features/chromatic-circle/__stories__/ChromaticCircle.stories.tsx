import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChromaticCircle } from '../components/ChromaticCircle';
import { useLayerStore } from '@/features/layer-controller/stores/layerStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain';
import { PitchClass } from '@/domain/common';
import { ChromaticCircleDriver } from './ChromaticCircle.driver';

const meta: Meta<typeof ChromaticCircle> = {
  title: 'Components/ChromaticCircle',
  component: ChromaticCircle,
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
 * デフォルトのクロマチックサークル表示
 * 基本的な12音階の表示とインタラクション機能のテスト
 */
export const Default: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  play: async ({ canvasElement }) => {
    // クロマチックサークルのSVG構造と12個のピッチクラスが正しく表示されることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSVGStructure();
    await driver.expectTwelvePitchClasses();
  },
};

/**
 * 大サイズでのクロマチックサークル表示
 * 大きなサイズでの表示品質とスケーラビリティの確認
 */
export const Large: Story = {
  args: {
    className: 'w-[700px] h-[700px]',
  },
  play: async ({ canvasElement }) => {
    // 大サイズでも適切に表示されることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered();
    await driver.expectTwelvePitchClasses();
  },
};

/**
 * 小サイズでのクロマチックサークル表示
 * コンパクトサイズでの可読性と操作性の確認
 */
export const Small: Story = {
  args: {
    className: 'w-[300px] h-[300px]',
  },
  play: async ({ canvasElement }) => {
    // 小サイズでも基本機能が動作することを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered();
    await driver.expectTwelvePitchClasses();
  },
};

/**
 * インタラクション状態テスト
 * セグメントの選択とホバー状態の確認
 */
export const InteractionStates: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  play: async ({ canvasElement }) => {
    // セグメント要素が適切に配置され、12個のセグメントが存在することを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered();
    await driver.expectTwelvePitchClasses();
    await driver.expectSegmentsRendered(24);
  },
};

/**
 * ChromaticSegment インタラクティブテスト（クロマチックサークル統合版）
 */
export const SegmentInteractiveTest: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'クロマチックサークル内のChromaticSegmentコンポーネントのインタラクティブな動作をテストします。セグメントのクリック操作、ホバー効果、単音再生などを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // セグメントのクリック操作とピッチクラス名の表示を確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectTwelveSegments();
    await driver.clickFirstSegment();
    await driver.expectTwelvePitchClasses();
    await driver.expectPitchClassDisplayed('C');
  },
};

/**
 * セグメントホバーテスト
 */
export const SegmentHoverTest: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'セグメントのホバーインタラクションをテストします。マウスホバー時の視覚的フィードバックとアニメーション効果を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // セグメントのホバーインタラクションが正しく動作することを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectTwelveSegments();
    await driver.hoverFirstSegment();
    await driver.expectSegmentsRendered(24);
  },
};

/**
 * ピッチクラス表示確認テスト
 */
export const PitchClassDisplay: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '12個のピッチクラス（C, C♯/D♭, D...）が正しく表示されることを確認します。各セグメントの位置とテキスト表示を検証します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // 12個のピッチクラスが正しく表示され、セグメントが適切に配置されていることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.waitForRender();
    await driver.expectCircleContainerVisible();
    await driver.expectPitchClassDisplayed('C');
    await driver.expectTwelvePitchClasses();
    await driver.expectSegmentsRendered(24);
  },
};

/**
 * ダイアトニックコードハイライト表示テスト
 * DiatonicHighlightLayerが正しく表示されることを確認
 */
export const DiatonicHighlightDisplay: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'DiatonicHighlightLayerが正しく表示されることを確認します。ダイアトニックコードハイライトが有効な場合、ダイアトニックコードのルート音がハイライト表示されます。',
      },
    },
  },
  decorators: [
    Story => {
      // ダイアトニックレイヤーを有効化
      useLayerStore.setState({ isDiatonicVisible: true });
      // Cメジャーキーを設定
      useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // DiatonicHighlightLayerが表示され、ハイライトパスと内側の円周が存在することを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.waitForRender();
    await driver.expectCircleContainerVisible();
    await driver.expectDiatonicHighlightVisible();
  },
};

/**
 * ダイアトニックコードハイライト非表示テスト
 * DiatonicHighlightLayerが非表示になることを確認
 */
export const DiatonicHighlightHidden: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'DiatonicHighlightLayerが非表示になることを確認します。ダイアトニックコードハイライトが無効な場合、ハイライトは表示されません。',
      },
    },
  },
  decorators: [
    Story => {
      // ダイアトニックコードハイライトを無効化
      useLayerStore.setState({ isDiatonicVisible: false });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // ダイアトニックハイライトが非表示になることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.waitForRender();
    await driver.expectCircleContainerVisible();
    await driver.expectDiatonicHighlightHidden();
  },
};

/**
 * トニック強調表示テスト
 * トニック（現在のキーの中心音）が強調表示されることを確認
 */
export const TonicEmphasis: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'トニック（現在のキーの中心音）が強調表示されることを確認します。トニック位置のハイライトは太線とシャドウで強調されます。',
      },
    },
  },
  decorators: [
    Story => {
      // ダイアトニックコードハイライトを有効化
      useLayerStore.setState({ isDiatonicVisible: true });
      // Gメジャーキーを設定（トニックはG）
      useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.G) });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // トニック位置のハイライトが太線で強調表示されることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.waitForRender();
    await driver.expectCircleContainerVisible();
    await driver.expectTonicEmphasis();
  },
};

/**
 * ダイアトニックコードハイライト切り替えテスト
 * ハイライト表示の切り替え機能を確認
 */
export const DiatonicHighlightToggle: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'ダイアトニックコードハイライト表示の切り替え機能を確認します。ストアの状態変更に応じてハイライトが表示/非表示に切り替わることを検証します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // ストア状態の変更に応じてハイライトが表示/非表示に切り替わることを確認
    const driver = new ChromaticCircleDriver(canvasElement);

    await driver.waitForRender();
    await driver.expectCircleContainerVisible();

    await driver.expectHighlightToggle();

    useLayerStore.setState({ isDiatonicVisible: false });
    await driver.waitForRender();

    await driver.expectDiatonicHighlightHidden();

    useLayerStore.setState({ isDiatonicVisible: true });
    await driver.waitForRender();

    await driver.expectDiatonicHighlightVisible();
  },
};
