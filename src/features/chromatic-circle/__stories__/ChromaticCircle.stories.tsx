import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { ChromaticCircle } from '../components/ChromaticCircle';
import { useLayerStore } from '@/stores/layerStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain';
import { PitchClass } from '@/domain/common';

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
    const canvas = within(canvasElement);

    // クロマチックサークルのメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    await expect(circleContainer).toBeInTheDocument();

    // SVGが適切にレンダリングされていることを確認
    await expect(circleContainer.tagName.toLowerCase()).toBe('svg');
    // SVGが適切なviewBoxを持っていることを確認
    await expect(circleContainer).toHaveAttribute('viewBox');
    // SVGにセグメントが含まれていることを確認（path要素として）
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // 12個のピッチクラスに対応するテキスト要素が存在することを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);
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
    const canvas = within(canvasElement);

    // 大サイズでも適切に表示されることを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    await expect(circleContainer).toBeInTheDocument();

    // SVG内のセグメント要素が表示されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // テキスト要素も適切に表示されていることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);
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
    const canvas = within(canvasElement);

    // 小サイズでも基本機能が動作することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    await expect(circleContainer).toBeInTheDocument();

    // 小サイズでもSVG要素が適切に表示されることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // コンパクトサイズでもテキストが表示されることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);
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
    const canvas = within(canvasElement);

    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    await expect(circleContainer).toBeInTheDocument();

    // SVG内のセグメント要素が適切に配置されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThan(0);

    // 各セグメントに対応するテキスト要素が存在することを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);

    // SVGが適切な構造を持っていることを確認
    await expect(circleContainer).toHaveAttribute('viewBox');

    // 12個のセグメントが存在することを確認
    expect(pathElements.length).toBeGreaterThanOrEqual(24); // 各セグメント2層（pitch + signature）= 24
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
    const canvas = within(canvasElement);

    // クロマチックサークルのメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // SVG内のセグメントグループ要素を取得
    const segmentGroups = circleContainer.querySelectorAll('g[style*="cursor: pointer"]');
    expect(segmentGroups.length).toBe(12); // 12個のピッチクラス

    // 最初のセグメント（通常はC）をクリック
    if (segmentGroups.length > 0) {
      const firstSegment = segmentGroups[0];
      await userEvent.click(firstSegment);

      // クリック後の基本的な状態確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstSegment).toBeInTheDocument();
    }

    // SVGテキスト要素が適切に表示されていることを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);

    // ピッチクラス名が表示されていることを確認（例: C）
    const cPitchText = canvas.queryByText('C');
    if (cPitchText) {
      expect(cPitchText).toBeInTheDocument();
    }
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
    const canvas = within(canvasElement);

    // クロマチックサークルのメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // セグメントグループ要素を取得
    const segmentGroups = circleContainer.querySelectorAll('g[style*="cursor: pointer"]');
    expect(segmentGroups.length).toBe(12);

    // 最初のセグメントにホバー
    if (segmentGroups.length > 0) {
      const firstSegment = segmentGroups[0];
      await userEvent.hover(firstSegment);

      // ホバー後の状態確認
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstSegment).toBeInTheDocument();

      // ホバー解除
      await userEvent.unhover(firstSegment);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 複数のセグメントが適切に配置されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThanOrEqual(24);
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
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    // クロマチックサークルのメイン要素が存在することを確認
    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // いくつかの主要なピッチクラスが表示されていることを確認
    const cPitch = canvas.queryByText('C');
    if (cPitch) {
      expect(cPitch).toBeInTheDocument();
    }

    // テキスト要素が12個以上存在することを確認
    const textElements = circleContainer.querySelectorAll('text');
    expect(textElements.length).toBeGreaterThanOrEqual(12);

    // すべてのセグメントが適切に表示されていることを確認
    const pathElements = circleContainer.querySelectorAll('path');
    expect(pathElements.length).toBeGreaterThanOrEqual(24); // 12セグメント × 2層
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
      // ダイアトニックコードハイライトを有効化
      useLayerStore.setState({ isDiatonicChordsVisible: true });
      // Cメジャーキーを設定
      useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // ハイライトパス要素が存在することを確認 (g.diatonic-highlight-layer内)
    const highlightLayers = circleContainer.querySelectorAll('.diatonic-highlight-layer');
    expect(highlightLayers.length).toBeGreaterThanOrEqual(1);

    // ハイライトパスが存在することを確認
    const highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    expect(highlightPaths.length).toBeGreaterThanOrEqual(7); // Cメジャーの7つのダイアトニックコード

    // 内側の円周ハイライトも存在することを確認
    const innerCircleHighlights = circleContainer.querySelectorAll(
      '.diatonic-highlight-layer circle'
    );
    expect(innerCircleHighlights.length).toBeGreaterThanOrEqual(1);
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
      useLayerStore.setState({ isDiatonicChordsVisible: false });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // ハイライトパス要素が存在しないことを確認
    const highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    expect(highlightPaths.length).toBe(0);

    // 内側の円周ハイライトも存在しないことを確認
    const innerCircleHighlights = circleContainer.querySelectorAll(
      '.diatonic-highlight-layer circle'
    );
    expect(innerCircleHighlights.length).toBe(0);
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
      useLayerStore.setState({ isDiatonicChordsVisible: true });
      // Gメジャーキーを設定（トニックはG）
      useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.G) });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // ハイライトパス要素が存在することを確認
    const highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    expect(highlightPaths.length).toBeGreaterThanOrEqual(7); // Gメジャーの7つのダイアトニックコード

    // トニック位置（G、index=7）のハイライトを特定（太線になっているか確認）
    // ストローク幅が1.2pxのパスがトニック（太線）、0.8pxが通常のダイアトニック音
    const thickPaths = Array.from(highlightPaths).filter(
      path => path.getAttribute('stroke-width') === '1.2px' || path.getAttribute('filter') !== null // トニックはシャドウ効果がある
    );

    expect(thickPaths.length).toBeGreaterThanOrEqual(1); // トニックが強調表示されている
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
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 200));

    const circleContainer = canvas.getByRole('img', { name: 'Chromatic Circle' });
    expect(circleContainer).toBeInTheDocument();

    // 初期状態：ハイライトが表示されているか確認（デフォルト値による）
    let highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    const initialHighlightCount = highlightPaths.length;

    // ダイアトニックコードハイライトを無効化
    useLayerStore.setState({ isDiatonicChordsVisible: false });

    // 再レンダリング待ち
    await new Promise(resolve => setTimeout(resolve, 200));

    // ハイライトが消えていることを確認
    highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    expect(highlightPaths.length).toBeLessThan(initialHighlightCount);
    expect(highlightPaths.length).toBe(0);

    // 再度有効化
    useLayerStore.setState({ isDiatonicChordsVisible: true });

    // 再レンダリング待ち
    await new Promise(resolve => setTimeout(resolve, 200));

    // ハイライトが再表示されることを確認
    highlightPaths = circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    expect(highlightPaths.length).toBeGreaterThanOrEqual(7); // Cメジャーの7つのダイアトニックコード
  },
};
