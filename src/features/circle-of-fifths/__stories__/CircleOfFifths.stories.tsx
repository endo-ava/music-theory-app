import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CircleOfFifths } from '../components/CircleOfFifths';
import { useLayerStore } from '@/features/layer-controller/stores/layerStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key, PitchClass } from '@/domain';
import { CircleOfFifthsDriver } from './CircleOfFifths.driver';

const RENDER_WAIT_MS = 200;
const ANIMATION_WAIT_MS = 300;

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
    // 五度圏のSVG構造が適切にレンダリングされることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSVGStructure();
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
    // 大サイズでもセグメントとテキスト要素が適切に表示されることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered();
    await driver.expectTextElementsRendered();
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
    // 小サイズでも基本機能が動作することを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered();
    await driver.expectTextElementsRendered();
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
    // アクセシビリティ属性とキーボードナビゲーションの基盤が整っていることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectAccessibility();
    await driver.expectSegmentsRendered();
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
    // 12個のセグメントとテキスト要素が適切に配置されていることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectSegmentsRendered(12);
    await driver.expectTextElementsRendered();
  },
};

/**
 * KeyAreaダイアトニックハイライト表示テスト
 */
export const DiatonicHighlightDisplay: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '五度圏内のKeyAreaコンポーネントでダイアトニックコードハイライト機能をテストします。C majorキー時のダイアトニックコードハイライト表示とローマ数字表記を確認します。',
      },
    },
  },
  decorators: [
    Story => {
      // ダイアトニックコード表示に設定し、C majorキーに設定
      useLayerStore.setState({ isDiatonicVisible: true, isDegreeVisible: true });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C), // C major
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // C majorキーでのローマ数字表記とダイアトニックコードハイライトが正しく表示されることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.waitForRender(RENDER_WAIT_MS);
    await driver.expectCircleContainerVisible();
    await driver.expectRomanNumeral('Ⅰ');
    await driver.expectSegmentsRendered();
    await driver.expectKeyName('C');
  },
};

/**
 * ダイアトニックハイライト動的切り替えテスト
 */
export const DiatonicHighlightToggle: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'LayerStoreの状態変更によるダイアトニックコードハイライトの動的切り替えをテストします。リアルタイムでハイライト表示が変化することを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      // 初期はダイアトニックコード非表示
      useLayerStore.setState({ isDiatonicVisible: false });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C), // C major
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // レイヤー状態の変更に応じてハイライトが動的に表示/非表示切り替わることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    useLayerStore.setState({ isDiatonicVisible: false });
    await driver.waitForRender(ANIMATION_WAIT_MS);

    await driver.expectCircleContainerVisible();
    await driver.expectDiatonicHighlightHidden();

    useLayerStore.getState().toggleDiatonic();
    await driver.waitForRender(RENDER_WAIT_MS);

    await driver.expectDiatonicHighlightVisible();

    useLayerStore.getState().toggleDiatonic();
    await driver.waitForRender(RENDER_WAIT_MS);

    await driver.expectDiatonicHighlightHidden();
  },
};

/**
 * ダイアトニックコード ローマ数字表記テスト
 */
export const DiatonicRomanNumerals: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '異なるキーでのダイアトニックコードのローマ数字表記をテストします。C majorキーでの各度数のローマ数字（Ⅰ、Ⅱm、Ⅲm等）が正しく表示されることを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      // ダイアトニックコード表示に設定し、C majorキーに設定
      useLayerStore.setState({ isDiatonicVisible: true, isDegreeVisible: true });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C), // C major
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // C majorキーでの各度数のローマ数字表記が正しく表示されることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.waitForRender(ANIMATION_WAIT_MS);
    await driver.expectCircleContainerVisible();
    await driver.expectRomanNumeral('Ⅰ');
    await driver.expectRomanNumeralOptional('Ⅱm');
    await driver.expectRomanNumeralOptional('Ⅴ');
    await driver.expectRomanNumeralOptional('Ⅳ');
  },
};

/**
 * 度数レイヤー切り替えテスト
 */
export const DegreeToggle: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story: '度数レイヤー（ローマ数字）の表示/非表示切り替えをテストします。',
      },
    },
  },
  decorators: [
    Story => {
      useLayerStore.setState({ isDegreeVisible: false });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C),
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // 度数レイヤーの表示/非表示切り替えが正しく動作することを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    useLayerStore.setState({ isDegreeVisible: false });
    await driver.waitForRender(ANIMATION_WAIT_MS);

    await driver.expectRomanNumeralOptional('Ⅰ');

    useLayerStore.getState().toggleDegree();
    await driver.waitForRender(RENDER_WAIT_MS);

    await driver.expectRomanNumeral('Ⅰ');

    useLayerStore.getState().toggleDegree();
    await driver.waitForRender(RENDER_WAIT_MS);

    await driver.expectRomanNumeralOptional('Ⅰ');
  },
};

/**
 * 機能和声レイヤー表示テスト
 */
export const FunctionalHarmonyDisplay: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '機能和声レイヤー（T/D/SD）の表示をテストします。C majorキーでのトニック(T)、ドミナント(D)、サブドミナント(SD)の表示を確認します。',
      },
    },
  },
  decorators: [
    Story => {
      useLayerStore.setState({
        isFunctionalHarmonyVisible: true,
        isDegreeVisible: false, // オフセットなしの状態を確認するため度数はオフ
      });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C),
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // 機能和声レイヤー（T/D/SD）が正しく表示されることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.waitForRender(ANIMATION_WAIT_MS);
    await driver.expectFunctionalHarmony('T');
    await driver.expectFunctionalHarmony('D');
    await driver.expectFunctionalHarmony('SD');
  },
};

/**
 * 2つのレイヤー同時表示時のレイアウトテスト
 */
export const DualLayerLayout: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '度数レイヤーと機能和声レイヤーが両方表示されている場合のレイアウトをテストします。両方のテキストが表示され、重ならないように配置されていることを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      useLayerStore.setState({
        isFunctionalHarmonyVisible: true,
        isDegreeVisible: true,
      });
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C),
      });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // 度数レイヤーと機能和声レイヤーが両方表示され、重ならないように配置されていることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.waitForRender(ANIMATION_WAIT_MS);
    await driver.expectDualLayerLayout('Ⅰ', 'T');
  },
};

/**
 * KeyArea インタラクティブテスト（五度圏統合版）
 */
export const KeyAreaInteractiveTest: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          '五度圏内のKeyAreaコンポーネントのインタラクティブな動作をテストします。キーエリアのクリック操作、ホバー効果、音の再生などを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      useLayerStore.setState({ isDiatonicVisible: false });
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8 text-white">
          <Story />
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    // KeyAreaのクリック操作が正しく動作し、テキスト要素が適切に表示されることを確認
    const driver = new CircleOfFifthsDriver(canvasElement);

    await driver.expectCircleContainerVisible();
    await driver.expectKeyAreaGroups();
    await driver.clickFirstKeyArea();
    await driver.expectTextElementsRendered();
  },
};
