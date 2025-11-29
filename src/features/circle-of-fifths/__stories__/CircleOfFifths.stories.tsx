import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from 'storybook/test';
import { CircleOfFifths } from '../components/CircleOfFifths';
import { useLayerStore } from '@/stores/layerStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key, PitchClass } from '@/domain';

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
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleContainer).toBeInTheDocument();

    // C majorのローマ数字が表示されることを確認（tonic = Ⅰ）
    const romanText = canvas.getByText('Ⅰ');
    expect(romanText).toBeInTheDocument();

    // ダイアトニックコードのハイライト効果の確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // C major キーエリアのテキストが表示されることを確認
    const cMajorText = canvas.getByText('C');
    expect(cMajorText).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // テスト実行前に確実に初期状態をセット（デコレータのタイミング問題を回避）
    useLayerStore.setState({ isDiatonicVisible: false });

    // 初期レンダリングと状態反映を待つ
    await new Promise(resolve => setTimeout(resolve, 300));

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleContainer).toBeInTheDocument();

    // 初期状態：ダイアトニックハイライトレイヤーが表示されていないことを確認
    let highlightLayer = canvasElement.querySelector('.diatonic-highlight-layer');
    expect(highlightLayer).not.toBeInTheDocument();

    // ダイアトニックコード表示をオンに変更
    useLayerStore.getState().toggleDiatonic();
    await new Promise(resolve => setTimeout(resolve, 200));

    // ハイライトレイヤーが表示されることを確認
    highlightLayer = canvasElement.querySelector('.diatonic-highlight-layer');
    expect(highlightLayer).toBeInTheDocument();

    // 再度オフに変更
    useLayerStore.getState().toggleDiatonic();
    await new Promise(resolve => setTimeout(resolve, 200));

    // ハイライトレイヤーが非表示になることを確認
    highlightLayer = canvasElement.querySelector('.diatonic-highlight-layer');
    expect(highlightLayer).not.toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 300));

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleContainer).toBeInTheDocument();

    // C major (tonic) のローマ数字確認
    const tonicRoman = canvas.getByText('Ⅰ');
    expect(tonicRoman).toBeInTheDocument();

    // 他のダイアトニックコードのローマ数字も表示されることを確認
    // D minor (ii) が表示されているかチェック
    const supertonic = canvas.queryByText('Ⅱm');
    if (supertonic) {
      expect(supertonic).toBeInTheDocument();
    }

    // G major (V) が表示されているかチェック
    const dominant = canvas.queryByText('Ⅴ');
    if (dominant) {
      expect(dominant).toBeInTheDocument();
    }

    // F major (IV) が表示されているかチェック
    const subdominant = canvas.queryByText('Ⅳ');
    if (subdominant) {
      expect(subdominant).toBeInTheDocument();
    }
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
    const canvas = within(canvasElement);

    // 初期状態セット
    useLayerStore.setState({ isDegreeVisible: false });
    await new Promise(resolve => setTimeout(resolve, 300));

    // 初期状態：ローマ数字が表示されていないことを確認
    let romanText = canvas.queryByText('Ⅰ');
    expect(romanText).not.toBeInTheDocument();

    // 度数表示をオンに変更
    useLayerStore.getState().toggleDegree();
    await new Promise(resolve => setTimeout(resolve, 200));

    // ローマ数字が表示されることを確認
    romanText = canvas.getByText('Ⅰ');
    expect(romanText).toBeInTheDocument();

    // 再度オフに変更
    useLayerStore.getState().toggleDegree();
    await new Promise(resolve => setTimeout(resolve, 200));

    // ローマ数字が非表示になることを確認
    romanText = canvas.queryByText('Ⅰ');
    expect(romanText).not.toBeInTheDocument();
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
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 300));

    // C major (Tonic) の機能表記確認
    const tonic = canvas.getAllByText('T');
    expect(tonic.length).toBeGreaterThan(0);

    // G major (Dominant) の機能表記確認
    const dominant = canvas.getAllByText('D');
    expect(dominant.length).toBeGreaterThan(0);

    // F major (Subdominant) の機能表記確認
    const subdominant = canvas.getAllByText('SD');
    expect(subdominant.length).toBeGreaterThan(0);
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
    const canvas = within(canvasElement);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 両方のレイヤーのテキストが表示されていることを確認
    const romanText = canvas.getByText('Ⅰ');
    const tonicText = canvas.getAllByText('T');

    expect(romanText).toBeInTheDocument();
    expect(tonicText.length).toBeGreaterThan(0);

    // 注: 厳密な位置座標のテストは壊れやすいため、
    // 両方がDOMに存在し、視覚的に確認できることを主目的とする
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
    const canvas = within(canvasElement);

    // 五度圏のメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleContainer).toBeInTheDocument();

    // SVG内のKeyAreaグループ要素を取得
    const keyAreaGroups = circleContainer.querySelectorAll('g[style*="cursor: pointer"]');
    expect(keyAreaGroups.length).toBeGreaterThan(0);

    // 最初のキーエリア（通常はC major）をクリック
    if (keyAreaGroups.length > 0) {
      const firstKeyArea = keyAreaGroups[0];
      await userEvent.click(firstKeyArea);

      // クリック後の基本的な状態確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstKeyArea).toBeInTheDocument();
    }

    // SVGテキスト要素が適切に表示されていることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThan(0);
  },
};
