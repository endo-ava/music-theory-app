import { describe, test, expect, beforeEach } from 'vitest';
import { useLayerStore } from '../layerStore';

describe('layerStore', () => {
  beforeEach(() => {
    // 各テスト前にストアを初期状態にリセット
    useLayerStore.setState({ isDiatonicChordsVisible: false });
  });

  describe('initial state', () => {
    test('正常ケース: 初期状態でダイアトニックコード非表示', () => {
      const state = useLayerStore.getState();
      expect(state.isDiatonicChordsVisible).toBe(false);
    });
  });

  describe('toggleDiatonicChords action', () => {
    test('正常ケース: falseからtrueに切り替わる', () => {
      const initialState = useLayerStore.getState();
      expect(initialState.isDiatonicChordsVisible).toBe(false);

      // toggleDiatonicChordsを実行
      useLayerStore.getState().toggleDiatonicChords();

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicChordsVisible).toBe(true);
    });

    test('正常ケース: trueからfalseに切り替わる', () => {
      // 初期状態をtrueに設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const initialState = useLayerStore.getState();
      expect(initialState.isDiatonicChordsVisible).toBe(true);

      // toggleDiatonicChordsを実行
      useLayerStore.getState().toggleDiatonicChords();

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicChordsVisible).toBe(false);
    });

    test('正常ケース: 複数回のトグル動作', () => {
      const { toggleDiatonicChords } = useLayerStore.getState();

      // 初期状態の確認
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(false);

      // 1回目: false -> true
      toggleDiatonicChords();
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(true);

      // 2回目: true -> false
      toggleDiatonicChords();
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(false);

      // 3回目: false -> true
      toggleDiatonicChords();
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(true);

      // 4回目: true -> false
      toggleDiatonicChords();
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(false);
    });

    test('正常ケース: 関数の参照が安定している', () => {
      const action1 = useLayerStore.getState().toggleDiatonicChords;
      const action2 = useLayerStore.getState().toggleDiatonicChords;

      // 同じ参照であることを確認
      expect(action1).toBe(action2);
    });
  });

  describe('state immutability', () => {
    test('正常ケース: setState後に元のstateが変更されない', () => {
      const initialState = useLayerStore.getState();
      const initialValue = initialState.isDiatonicChordsVisible;

      // 新しい状態を設定
      useLayerStore.setState({ isDiatonicChordsVisible: !initialValue });

      // 元の状態オブジェクトの値は変更されていないことを確認
      expect(initialState.isDiatonicChordsVisible).toBe(initialValue);

      // 新しい状態が正しく設定されていることを確認
      const newState = useLayerStore.getState();
      expect(newState.isDiatonicChordsVisible).toBe(!initialValue);
    });

    test('正常ケース: toggleDiatonicChords後の不変性', () => {
      const initialState = useLayerStore.getState();
      const initialToggle = initialState.toggleDiatonicChords;

      // アクションを実行
      initialToggle();

      // 新しい状態を取得
      const newState = useLayerStore.getState();

      // state objectが新しいインスタンスであることを確認
      expect(newState).not.toBe(initialState);

      // アクション関数は同じ参照であることを確認
      expect(newState.toggleDiatonicChords).toBe(initialToggle);
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
      useLayerStore.getState().toggleDiatonicChords();

      // subscriberが1回呼ばれることを確認
      expect(callCount).toBe(1);
      expect(receivedState!.isDiatonicChordsVisible).toBe(true);

      // もう一度状態を変更
      useLayerStore.getState().toggleDiatonicChords();

      // subscriberが2回目も呼ばれることを確認
      expect(callCount).toBe(2);
      expect(receivedState!.isDiatonicChordsVisible).toBe(false);

      // subscription解除
      unsubscribe();

      // subscription解除後は呼ばれないことを確認
      useLayerStore.getState().toggleDiatonicChords();
      expect(callCount).toBe(2); // 増えない
    });
  });

  describe('direct state manipulation', () => {
    test('正常ケース: setStateによる直接的な状態変更', () => {
      // 初期状態の確認
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(false);

      // 直接状態を設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(true);

      // 再度直接状態を設定
      useLayerStore.setState({ isDiatonicChordsVisible: false });
      expect(useLayerStore.getState().isDiatonicChordsVisible).toBe(false);
    });

    test('正常ケース: 部分的な状態更新', () => {
      // 初期状態からアクションは保持されることを確認
      const initialAction = useLayerStore.getState().toggleDiatonicChords;

      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const newState = useLayerStore.getState();
      expect(newState.isDiatonicChordsVisible).toBe(true);
      expect(newState.toggleDiatonicChords).toBe(initialAction);
    });
  });

  describe('type safety', () => {
    test('正常ケース: 型安全な状態アクセス', () => {
      const state = useLayerStore.getState();

      // TypeScriptの型チェックが通ることを確認
      expect(typeof state.isDiatonicChordsVisible).toBe('boolean');
      expect(typeof state.toggleDiatonicChords).toBe('function');

      // 存在しないプロパティにアクセスしようとするとTypeScriptエラーになる
      // @ts-expect-error - 存在しないプロパティ
      expect(state.nonExistentProperty).toBeUndefined();
    });
  });
});
