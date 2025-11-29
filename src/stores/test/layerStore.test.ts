import { describe, test, expect, beforeEach } from 'vitest';
import { useLayerStore } from '../layerStore';

describe('layerStore', () => {
  beforeEach(() => {
    // 各テスト前にストアを初期状態にリセット
    useLayerStore.setState({
      isDiatonicVisible: false,
      isDegreeVisible: false,
      isFunctionalHarmonyVisible: false,
    });
  });

  describe('initial state', () => {
    test('正常ケース: 初期状態でダイアトニックコード非表示', () => {
      const state = useLayerStore.getState();
      expect(state.isDiatonicVisible).toBe(false);
    });
  });

  describe('toggleDiatonic action', () => {
    test('正常ケース: falseからtrueに切り替わる', () => {
      const initialState = useLayerStore.getState();
      expect(initialState.isDiatonicVisible).toBe(false);

      // toggleDiatonicを実行
      useLayerStore.getState().toggleDiatonic();

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicVisible).toBe(true);
    });

    test('正常ケース: trueからfalseに切り替わる', () => {
      // 初期状態をtrueに設定
      useLayerStore.setState({ isDiatonicVisible: true });

      const initialState = useLayerStore.getState();
      expect(initialState.isDiatonicVisible).toBe(true);

      // toggleDiatonicを実行
      useLayerStore.getState().toggleDiatonic();

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicVisible).toBe(false);
    });

    test('正常ケース: 複数回のトグル動作', () => {
      const { toggleDiatonic } = useLayerStore.getState();

      // 初期状態の確認
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);

      // 1回目: false -> true
      toggleDiatonic();
      expect(useLayerStore.getState().isDiatonicVisible).toBe(true);

      // 2回目: true -> false
      toggleDiatonic();
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);

      // 3回目: false -> true
      toggleDiatonic();
      expect(useLayerStore.getState().isDiatonicVisible).toBe(true);

      // 4回目: true -> false
      toggleDiatonic();
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);
    });

    test('正常ケース: 関数の参照が安定している', () => {
      const action1 = useLayerStore.getState().toggleDiatonic;
      const action2 = useLayerStore.getState().toggleDiatonic;

      // 同じ参照であることを確認
      expect(action1).toBe(action2);
    });
  });

  describe('toggleDegree action', () => {
    test('正常ケース: falseからtrueに切り替わる', () => {
      const initialState = useLayerStore.getState();
      expect(initialState.isDegreeVisible).toBe(false);

      // toggleDegreeを実行
      useLayerStore.getState().toggleDegree();

      const newState = useLayerStore.getState();
      expect(newState.isDegreeVisible).toBe(true);
    });

    test('正常ケース: trueからfalseに切り替わる', () => {
      // 初期状態をtrueに設定
      useLayerStore.setState({ isDegreeVisible: true });

      const initialState = useLayerStore.getState();
      expect(initialState.isDegreeVisible).toBe(true);

      // toggleDegreeを実行
      useLayerStore.getState().toggleDegree();

      const newState = useLayerStore.getState();
      expect(newState.isDegreeVisible).toBe(false);
    });

    test('正常ケース: 複数回のトグル動作', () => {
      const { toggleDegree } = useLayerStore.getState();

      // 初期状態の確認
      expect(useLayerStore.getState().isDegreeVisible).toBe(false);

      // 1回目: false -> true
      toggleDegree();
      expect(useLayerStore.getState().isDegreeVisible).toBe(true);

      // 2回目: true -> false
      toggleDegree();
      expect(useLayerStore.getState().isDegreeVisible).toBe(false);

      // 3回目: false -> true
      toggleDegree();
      expect(useLayerStore.getState().isDegreeVisible).toBe(true);

      // 4回目: true -> false
      toggleDegree();
      expect(useLayerStore.getState().isDegreeVisible).toBe(false);
    });

    test('正常ケース: 関数の参照が安定している', () => {
      const action1 = useLayerStore.getState().toggleDegree;
      const action2 = useLayerStore.getState().toggleDegree;

      // 同じ参照であることを確認
      expect(action1).toBe(action2);
    });
  });

  describe('toggleFunctionalHarmony action', () => {
    test('正常ケース: falseからtrueに切り替わる', () => {
      const initialState = useLayerStore.getState();
      expect(initialState.isFunctionalHarmonyVisible).toBe(false);

      // toggleFunctionalHarmonyを実行
      useLayerStore.getState().toggleFunctionalHarmony();

      const newState = useLayerStore.getState();
      expect(newState.isFunctionalHarmonyVisible).toBe(true);
    });

    test('正常ケース: trueからfalseに切り替わる', () => {
      // 初期状態をtrueに設定
      useLayerStore.setState({ isFunctionalHarmonyVisible: true });

      const initialState = useLayerStore.getState();
      expect(initialState.isFunctionalHarmonyVisible).toBe(true);

      // toggleFunctionalHarmonyを実行
      useLayerStore.getState().toggleFunctionalHarmony();

      const newState = useLayerStore.getState();
      expect(newState.isFunctionalHarmonyVisible).toBe(false);
    });

    test('正常ケース: 複数回のトグル動作', () => {
      const { toggleFunctionalHarmony } = useLayerStore.getState();

      // 初期状態の確認
      expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(false);

      // 1回目: false -> true
      toggleFunctionalHarmony();
      expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(true);

      // 2回目: true -> false
      toggleFunctionalHarmony();
      expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(false);

      // 3回目: false -> true
      toggleFunctionalHarmony();
      expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(true);

      // 4回目: true -> false
      toggleFunctionalHarmony();
      expect(useLayerStore.getState().isFunctionalHarmonyVisible).toBe(false);
    });

    test('正常ケース: 関数の参照が安定している', () => {
      const action1 = useLayerStore.getState().toggleFunctionalHarmony;
      const action2 = useLayerStore.getState().toggleFunctionalHarmony;

      // 同じ参照であることを確認
      expect(action1).toBe(action2);
    });
  });

  describe('state immutability', () => {
    test('正常ケース: setState後に元のstateが変更されない', () => {
      const initialState = useLayerStore.getState();
      const initialValue = initialState.isDiatonicVisible;

      // 新しい状態を設定
      useLayerStore.setState({ isDiatonicVisible: !initialValue });

      // 元の状態オブジェクトの値は変更されていないことを確認
      expect(initialState.isDiatonicVisible).toBe(initialValue);

      // 新しい状態が正しく設定されていることを確認
      const newState = useLayerStore.getState();
      expect(newState.isDiatonicVisible).toBe(!initialValue);
    });

    test('正常ケース: toggleDiatonic後の不変性', () => {
      const initialState = useLayerStore.getState();
      const initialToggle = initialState.toggleDiatonic;

      // アクションを実行
      initialToggle();

      // 新しい状態を取得
      const newState = useLayerStore.getState();

      // state objectが新しいインスタンスであることを確認
      expect(newState).not.toBe(initialState);

      // アクション関数は同じ参照であることを確認
      expect(newState.toggleDiatonic).toBe(initialToggle);
    });
  });

  describe('store subscription', () => {
    test('正常ケース: 状態変更時にsubscriberが呼ばれる', () => {
      let callCount = 0;
      let receivedState: ReturnType<typeof useLayerStore.getState> | null = null;

      // subscriberを設定
      const unsubscribe = useLayerStore.subscribe(state => {
        callCount++;
        receivedState = state;
      });

      // 状態を変更
      useLayerStore.getState().toggleDiatonic();

      // subscriberが1回呼ばれることを確認
      expect(callCount).toBe(1);
      expect(receivedState!.isDiatonicVisible).toBe(true);

      // もう一度状態を変更
      useLayerStore.getState().toggleDiatonic();

      // subscriberが2回目も呼ばれることを確認
      expect(callCount).toBe(2);
      expect(receivedState!.isDiatonicVisible).toBe(false);

      // subscription解除
      unsubscribe();

      // subscription解除後は呼ばれないことを確認
      useLayerStore.getState().toggleDiatonic();
      expect(callCount).toBe(2); // 増えない
    });
  });

  describe('direct state manipulation', () => {
    test('正常ケース: setStateによる直接的な状態変更', () => {
      // 初期状態の確認
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);

      // 直接状態を設定
      useLayerStore.setState({ isDiatonicVisible: true });
      expect(useLayerStore.getState().isDiatonicVisible).toBe(true);

      // 再度直接状態を設定
      useLayerStore.setState({ isDiatonicVisible: false });
      expect(useLayerStore.getState().isDiatonicVisible).toBe(false);
    });

    test('正常ケース: 部分的な状態更新', () => {
      // 初期状態からアクションは保持されることを確認
      const initialAction = useLayerStore.getState().toggleDiatonic;

      useLayerStore.setState({ isDiatonicVisible: true });

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicVisible).toBe(true);
      expect(newState.toggleDiatonic).toBe(initialAction);
    });
  });

  describe('type safety', () => {
    test('正常ケース: 型安全な状態アクセス', () => {
      const state = useLayerStore.getState();

      // TypeScriptの型チェックが通ることを確認
      expect(typeof state.isDiatonicVisible).toBe('boolean');
      expect(typeof state.isDegreeVisible).toBe('boolean');
      expect(typeof state.isFunctionalHarmonyVisible).toBe('boolean');
      expect(typeof state.toggleDiatonic).toBe('function');
      expect(typeof state.toggleDegree).toBe('function');
      expect(typeof state.toggleFunctionalHarmony).toBe('function');

      // 存在しないプロパティにアクセスしようとするとTypeScriptエラーになる
      // @ts-expect-error - 存在しないプロパティ
      expect(state.nonExistentProperty).toBeUndefined();
    });
  });
});
