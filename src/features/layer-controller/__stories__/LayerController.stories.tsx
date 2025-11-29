import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from 'storybook/test';
import { LayerController } from '../components/LayerController';
import { useLayerStore } from '@/stores/layerStore';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key, PitchClass } from '@/domain';

const meta: Meta<typeof LayerController> = {
  title: 'Components/LayerController',
  component: LayerController,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'レイヤーコントローラーコンポーネント。音楽理論の視覚的レイヤー（ダイアトニックコードなど）の表示制御を行います。ChordLayerAccordionコンポーネントを含み、レスポンシブ対応のタイトル表示機能を持ちます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名（外部レイアウト制御用）',
    },
  },
  decorators: [
    Story => (
      <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="w-80">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのLayerController表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルト設定でLayerControllerを表示します。"Layer"タイトル（md以上で表示）とChordLayerAccordionコンポーネントが含まれます。',
      },
    },
  },
};

/**
 * カスタムクラス名でのLayerController
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-2 border-purple-500 rounded-lg p-4 bg-purple-50/10',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムクラス名を適用したLayerControllerです。外部レイアウトでのスタイル制御が可能です。',
      },
    },
  },
};

/**
 * レスポンシブ表示テスト
 */
export const ResponsiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'LayerControllerのレスポンシブ表示動作をテストします。"Layer"タイトルがmd以上の画面サイズでのみ表示されることを確認します。',
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
          styles: { width: '1024px', height: '768px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // LayerControllerの基本構造を確認
    const layerContainer = canvas.getByText('Layer').closest('div');
    expect(layerContainer).toBeInTheDocument();

    // ChordLayerAccordionが含まれていることを確認
    const accordionTrigger = canvas.getByRole('button', { name: 'Chord Layers' });
    expect(accordionTrigger).toBeInTheDocument();

    // h2タイトルの存在確認（レスポンシブクラスは実際のブラウザで動作）
    const title = canvas.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Layer');
    expect(title).toHaveClass('hidden', 'md:block');
  },
};

/**
 * 基本構造確認テスト
 */
export const StructureTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'LayerControllerコンポーネントの基本構造をテストします。タイトル要素とChordLayerAccordionの包含関係を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // h2レベルのタイトル確認
    const title = canvas.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Layer');
    expect(title).toHaveClass('text-foreground', 'text-lg');

    // アコーディオンコンポーネントの存在確認
    const accordion = canvas.getByRole('button', { name: 'Chord Layers' });
    expect(accordion).toBeInTheDocument();

    // アコーディオンがExpandableUIとして機能することを確認
    expect(accordion).toHaveAttribute('aria-expanded');

    // 基本的なレイアウト構造の確認
    const container = title.parentElement;
    expect(container).toBeInTheDocument();
  },
};

/**
 * ChordLayerAccordion アコーディオン開閉テスト
 */
export const AccordionToggleTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'LayerController内のChordLayerAccordionの開閉動作をテストします。デフォルトで開いている状態から、クリックによる閉じる/開く動作を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accordionTrigger = canvas.getByRole('button', { name: 'Chord Layers' });

    // 初期状態では開いている（defaultValue="chord-layer"）
    expect(accordionTrigger).toHaveAttribute('aria-expanded', 'true');

    // スイッチが表示されていることを確認
    const diatonicSwitch = canvas.getByRole('switch', { name: 'Diatonic' });
    expect(diatonicSwitch).toBeInTheDocument();

    // アコーディオンを閉じる
    await userEvent.click(accordionTrigger);
    expect(accordionTrigger).toHaveAttribute('aria-expanded', 'false');

    // 再度開く
    await userEvent.click(accordionTrigger);
    expect(accordionTrigger).toHaveAttribute('aria-expanded', 'true');

    // スイッチが再び表示されることを確認
    expect(canvas.getByRole('switch', { name: 'Diatonic' })).toBeInTheDocument();
  },
};

/**
 * ダイアトニックコードスイッチのトグル動作テスト
 */
export const DiatonicToggleTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'LayerController内のダイアトニックコード表示スイッチのトグル動作をテストします。useLayerStoreとの連携によるstate管理と、UI操作による状態変更を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const diatonicSwitch = canvas.getByRole('switch', { name: 'Diatonic' });

    // 初期状態の確認（表示）
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isDiatonicVisible).toBe(true);

    // スイッチをオフにする
    await userEvent.click(diatonicSwitch);
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'false');
    expect(useLayerStore.getState().isDiatonicVisible).toBe(false);

    // スイッチをオンにする
    await userEvent.click(diatonicSwitch);
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isDiatonicVisible).toBe(true);
  },
};

/**
 * 度数表記スイッチのトグル動作テスト
 */
export const DegreeToggleTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'LayerController内の度数表記スイッチのトグル動作をテストします。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 度数表記スイッチを取得（ラベルの一部で検索）
    const degreeSwitch = canvas.getByRole('switch', { name: /Degree/ });

    // 初期状態の確認（表示）
    expect(degreeSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isDegreeVisible).toBe(true);

    // スイッチをオフにする
    await userEvent.click(degreeSwitch);
    expect(degreeSwitch).toHaveAttribute('aria-checked', 'false');
    expect(useLayerStore.getState().isDegreeVisible).toBe(false);

    // スイッチをオンにする
    await userEvent.click(degreeSwitch);
    expect(degreeSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isDegreeVisible).toBe(true);
  },
};

/**
 * 機能和声スイッチのトグル動作テスト
 */
export const FunctionalHarmonyToggleTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'LayerController内の機能和声スイッチのトグル動作をテストします。',
      },
    },
  },
  decorators: [
    Story => {
      // 機能和声スイッチを表示させるためにメジャーキーを設定
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C),
      });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 機能和声スイッチを取得（ラベルの一部で検索）
    const functionalSwitch = canvas.getByRole('switch', { name: /Functional harmony/ });

    // 初期状態の確認（非表示）
    expect(functionalSwitch).toHaveAttribute('aria-checked', 'false');
    expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(false);

    // スイッチをオンにする
    await userEvent.click(functionalSwitch);
    expect(functionalSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(true);

    // スイッチをオフにする
    await userEvent.click(functionalSwitch);
    expect(functionalSwitch).toHaveAttribute('aria-checked', 'false');
    expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(false);
  },
};

/**
 * 初期状態がオンの場合のテスト
 */
export const InitialOnStateTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'useLayerStoreの初期状態がダイアトニックコード表示オンの場合のUIテストです。LayerController内で適切に状態が反映されることを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      // テスト開始時にストア状態を設定
      useLayerStore.setState({ isDiatonicVisible: true });
      return (
        <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
          <div className="w-80">
            <Story />
          </div>
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期レンダリング完了を待つ
    await new Promise(resolve => setTimeout(resolve, 100));

    const diatonicSwitch = canvas.getByRole('switch', { name: 'Diatonic' });

    // 初期状態がオンであることを確認
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');
    expect(useLayerStore.getState().isDiatonicVisible).toBe(true);

    // ストア操作によるUI更新を確認
    useLayerStore.getState().toggleDiatonic();

    // UI更新を待つ
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'false');
    expect(useLayerStore.getState().isDiatonicVisible).toBe(false);
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
          'LayerControllerコンポーネントのアクセシビリティ要件をテストします。適切なARIA属性、ラベル関連付け、キーボード操作対応を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態をリセット
    useLayerStore.setState({ isDiatonicVisible: false });

    // 初期レンダリング待ち
    await new Promise(resolve => setTimeout(resolve, 100));

    // アコーディオントリガーのアクセシビリティ
    const accordionTrigger = canvas.getByRole('button', { name: 'Chord Layers' });
    expect(accordionTrigger).toHaveAttribute('aria-expanded');
    expect(accordionTrigger).toHaveAttribute('aria-controls');

    // スイッチのアクセシビリティ
    const diatonicSwitch = canvas.getByRole('switch', { name: 'Diatonic' });
    expect(diatonicSwitch).toHaveAttribute('aria-checked');
    expect(diatonicSwitch).toHaveAttribute('id', 'diatonic');

    // ラベルとスイッチの関連付け確認
    const label = canvas.getByText('Diatonic');
    expect(label).toHaveAttribute('for', 'diatonic');

    // 基本的なインタラクション確認（クリックによるスイッチ操作）
    const initialState = useLayerStore.getState().isDiatonicVisible;
    await userEvent.click(diatonicSwitch);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(useLayerStore.getState().isDiatonicVisible).toBe(!initialState);
  },
};

/**
 * ストア連携統合テスト
 */
export const StoreIntegrationTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'useLayerStoreとの完全な連携をテストします。LayerController内での外部からのストア操作、UI操作、複数回の切り替え動作を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const diatonicSwitch = canvas.getByRole('switch', { name: 'Diatonic' });

    // 初期状態の確認(新しい初期状態はtrue)
    expect(useLayerStore.getState().isDiatonicVisible).toBe(true);
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');

    // 1. UI操作による状態変更(true -> false)
    await userEvent.click(diatonicSwitch);
    expect(useLayerStore.getState().isDiatonicVisible).toBe(false);
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'false');

    // 2. 外部ストア操作による状態変更(false -> true)
    useLayerStore.getState().toggleDiatonic();
    await new Promise(resolve => setTimeout(resolve, 10)); // re-render待ち
    expect(useLayerStore.getState().isDiatonicVisible).toBe(true);
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');

    // 3. 複数回の切り替えテスト(開始時はtrue)
    for (let i = 0; i < 3; i++) {
      await userEvent.click(diatonicSwitch);
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);
      await userEvent.click(diatonicSwitch);
      expect(useLayerStore.getState().isDiatonicVisible).toBe(true);
    }

    // 最終状態の確認
    expect(diatonicSwitch).toHaveAttribute('aria-checked', 'true');
  },
};
