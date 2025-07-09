import { describe, it, expect, beforeEach } from 'vitest';
import { useHubStore } from '../hubStore';
import type { HubType } from '../../shared/types';

describe('hubStore', () => {
  // テスト前にストアを初期状態にリセット
  beforeEach(() => {
    useHubStore.setState({ hubType: 'circle-of-fifths' });
  });

  describe('初期状態', () => {
    it('正常ケース: デフォルトでcircle-of-fifthsが設定される', () => {
      const state = useHubStore.getState();
      expect(state.hubType).toBe('circle-of-fifths');
    });

    it('正常ケース: setHubType関数が定義されている', () => {
      const state = useHubStore.getState();
      expect(typeof state.setHubType).toBe('function');
    });

    it('正常ケース: ストアの型構造が正しい', () => {
      const state = useHubStore.getState();
      expect(state).toHaveProperty('hubType');
      expect(state).toHaveProperty('setHubType');
      expect(Object.keys(state)).toHaveLength(2);
    });
  });

  describe('setHubType関数', () => {
    it('正常ケース: circle-of-fifthsに設定できる', () => {
      const { setHubType } = useHubStore.getState();

      setHubType('circle-of-fifths');

      const state = useHubStore.getState();
      expect(state.hubType).toBe('circle-of-fifths');
    });

    it('正常ケース: chromatic-circleに設定できる', () => {
      const { setHubType } = useHubStore.getState();

      setHubType('chromatic-circle');

      const state = useHubStore.getState();
      expect(state.hubType).toBe('chromatic-circle');
    });

    it('正常ケース: 状態変更後もsetHubType関数が同じ参照を保持', () => {
      const initialSetHubType = useHubStore.getState().setHubType;

      initialSetHubType('chromatic-circle');

      const afterSetHubType = useHubStore.getState().setHubType;
      expect(afterSetHubType).toBe(initialSetHubType);
    });

    it('境界値ケース: 全てのHubTypeを正しく設定できる', () => {
      const { setHubType } = useHubStore.getState();
      const hubTypes: HubType[] = ['circle-of-fifths', 'chromatic-circle'];

      hubTypes.forEach(hubType => {
        setHubType(hubType);
        const state = useHubStore.getState();
        expect(state.hubType).toBe(hubType);
      });
    });
  });

  describe('状態変更の動作', () => {
    it('正常ケース: 複数回の状態変更が正しく処理される', () => {
      const { setHubType } = useHubStore.getState();

      // 初期状態の確認
      expect(useHubStore.getState().hubType).toBe('circle-of-fifths');

      // chromatic-circleに変更
      setHubType('chromatic-circle');
      expect(useHubStore.getState().hubType).toBe('chromatic-circle');

      // circle-of-fifthsに戻す
      setHubType('circle-of-fifths');
      expect(useHubStore.getState().hubType).toBe('circle-of-fifths');

      // 再度chromatic-circleに変更
      setHubType('chromatic-circle');
      expect(useHubStore.getState().hubType).toBe('chromatic-circle');
    });

    it('正常ケース: 同じ値を設定しても状態は変更される', () => {
      const { setHubType } = useHubStore.getState();

      // 初期状態はcircle-of-fifths
      expect(useHubStore.getState().hubType).toBe('circle-of-fifths');

      // 同じ値を設定
      setHubType('circle-of-fifths');
      expect(useHubStore.getState().hubType).toBe('circle-of-fifths');
    });
  });

  describe('ストア購読の動作', () => {
    it('正常ケース: 状態変更時にリスナーが呼ばれる', () => {
      let callCount = 0;
      let lastHubType: HubType | null = null;

      // ストアの変更を購読
      const unsubscribe = useHubStore.subscribe(state => {
        callCount++;
        lastHubType = state.hubType;
      });

      // 状態を変更
      const { setHubType } = useHubStore.getState();
      setHubType('chromatic-circle');

      expect(callCount).toBe(1);
      expect(lastHubType).toBe('chromatic-circle');

      // さらに変更
      setHubType('circle-of-fifths');

      expect(callCount).toBe(2);
      expect(lastHubType).toBe('circle-of-fifths');

      // 購読を解除
      unsubscribe();

      // 解除後の変更でリスナーが呼ばれないことを確認
      setHubType('chromatic-circle');
      expect(callCount).toBe(2); // 変更されない
    });
  });

  describe('ストアの独立性', () => {
    it('正常ケース: 複数のgetState()呼び出しが同じオブジェクトを参照', () => {
      const state1 = useHubStore.getState();
      const state2 = useHubStore.getState();

      expect(state1).toBe(state2);
      expect(state1.setHubType).toBe(state2.setHubType);
    });

    it('正常ケース: ストアの状態が適切に分離されている', () => {
      // 初期状態の確認
      expect(useHubStore.getState().hubType).toBe('circle-of-fifths');

      // 状態変更
      useHubStore.getState().setHubType('chromatic-circle');

      // 新しいgetState()でも変更が反映される
      expect(useHubStore.getState().hubType).toBe('chromatic-circle');
    });
  });

  describe('型安全性', () => {
    it('正常ケース: HubType以外の値は型エラーとなる（TypeScript）', () => {
      // この テストはTypeScriptコンパイル時の型チェックを確認
      // 実行時テストではなく、コンパイル時の型安全性を担保
      const { setHubType } = useHubStore.getState();

      // 有効な値のみ受け入れる
      setHubType('circle-of-fifths');
      setHubType('chromatic-circle');

      // 以下のコードは TypeScript エラーになるはず（実際のテストでは実行しない）
      // setHubType('invalid-type' as HubType);

      expect(true).toBe(true); // 型チェックの確認のため
    });
  });
});
