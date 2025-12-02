import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useViewController } from '../useViewController';
import { useHubStore } from '../../../../stores/hubStore';
import { getHubOptions } from '../../../../shared/constants/hubs';

// getHubOptionsの戻り値をモック用に事前取得
const mockHubOptions = getHubOptions();

describe('useViewController', () => {
  // テスト前にストアを初期状態にリセット
  beforeEach(() => {
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // DOM要素をクリア
    document.body.innerHTML = '';

    // console.errorをモック（不要なエラーログを抑制）
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('初期化', () => {
    it('正常ケース: フックが正常に初期化される', () => {
      const { result } = renderHook(() => useViewController());

      expect(result.current).toHaveProperty('hubType');
      expect(result.current).toHaveProperty('hubOptions');
      expect(result.current).toHaveProperty('selectedOption');
      expect(result.current).toHaveProperty('radioGroupRef');
      expect(result.current).toHaveProperty('handleHubTypeChange');
      expect(result.current).toHaveProperty('handleKeyDown');
    });

    it('正常ケース: 初期状態でcircle-of-fifthsが選択されている', () => {
      const { result } = renderHook(() => useViewController());

      expect(result.current.hubType).toBe('circle-of-fifths');
    });

    it('正常ケース: hubOptionsが正しく取得される', () => {
      const { result } = renderHook(() => useViewController());

      expect(result.current.hubOptions).toEqual(mockHubOptions);
      expect(result.current.hubOptions).toHaveLength(2);
    });

    it('正常ケース: selectedOptionが正しく設定される', () => {
      const { result } = renderHook(() => useViewController());

      expect(result.current.selectedOption).toEqual({
        value: 'circle-of-fifths',
        label: 'Circle of Fifths',
        description: 'Keys arranged by fifths',
      });
    });

    it('正常ケース: radioGroupRefが初期化される', () => {
      const { result } = renderHook(() => useViewController());

      expect(result.current.radioGroupRef).toBeDefined();
      expect(result.current.radioGroupRef.current).toBeNull();
    });
  });

  describe('hubType変更', () => {
    it('正常ケース: hubStoreの状態変更が反映される', () => {
      const { result } = renderHook(() => useViewController());

      // 初期状態の確認
      expect(result.current.hubType).toBe('circle-of-fifths');

      // ストアの状態を変更
      act(() => {
        useHubStore.getState().setHubType('chromatic-circle');
      });

      // フックの状態が更新されることを確認
      expect(result.current.hubType).toBe('chromatic-circle');
    });

    it('正常ケース: hubType変更時にselectedOptionが更新される', () => {
      const { result } = renderHook(() => useViewController());

      // 初期状態
      expect(result.current.selectedOption?.value).toBe('circle-of-fifths');

      // 状態変更
      act(() => {
        useHubStore.getState().setHubType('chromatic-circle');
      });

      // selectedOptionの更新を確認
      expect(result.current.selectedOption).toEqual({
        value: 'chromatic-circle',
        label: 'Chromatic Circle',
        description: 'Notes arranged chromatically',
      });
    });
  });

  describe('handleHubTypeChange', () => {
    it('正常ケース: circle-of-fifthsに変更できる', () => {
      const { result } = renderHook(() => useViewController());

      // chromatic-circleに変更してから戻す
      act(() => {
        useHubStore.getState().setHubType('chromatic-circle');
      });

      act(() => {
        result.current.handleHubTypeChange('circle-of-fifths');
      });

      expect(result.current.hubType).toBe('circle-of-fifths');
    });

    it('正常ケース: chromatic-circleに変更できる', () => {
      const { result } = renderHook(() => useViewController());

      act(() => {
        result.current.handleHubTypeChange('chromatic-circle');
      });

      expect(result.current.hubType).toBe('chromatic-circle');
    });

    it('正常ケース: 連続して変更できる', () => {
      const { result } = renderHook(() => useViewController());

      act(() => {
        result.current.handleHubTypeChange('chromatic-circle');
      });
      expect(result.current.hubType).toBe('chromatic-circle');

      act(() => {
        result.current.handleHubTypeChange('circle-of-fifths');
      });
      expect(result.current.hubType).toBe('circle-of-fifths');
    });
  });

  describe('handleKeyDown', () => {
    // テスト用のキーボードイベントを作成するヘルパー関数
    const createKeyboardEvent = (key: string): React.KeyboardEvent<HTMLDivElement> =>
      ({
        key,
        preventDefault: vi.fn(),
        currentTarget: document.createElement('div'),
      }) as unknown as React.KeyboardEvent<HTMLDivElement>;

    describe('ArrowLeft/ArrowUpキー', () => {
      it('正常ケース: ArrowLeftで前のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // chromatic-circleに設定
        act(() => {
          useHubStore.getState().setHubType('chromatic-circle');
        });

        const event = createKeyboardEvent('ArrowLeft');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('circle-of-fifths');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('正常ケース: ArrowUpで前のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // chromatic-circleに設定
        act(() => {
          useHubStore.getState().setHubType('chromatic-circle');
        });

        const event = createKeyboardEvent('ArrowUp');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('circle-of-fifths');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('境界値ケース: 最初のオプションで前に移動すると最後のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // circle-of-fifths（最初のオプション）の状態で
        expect(result.current.hubType).toBe('circle-of-fifths');

        const event = createKeyboardEvent('ArrowLeft');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('chromatic-circle');
      });
    });

    describe('ArrowRight/ArrowDownキー', () => {
      it('正常ケース: ArrowRightで次のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // circle-of-fifths（初期状態）から
        expect(result.current.hubType).toBe('circle-of-fifths');

        const event = createKeyboardEvent('ArrowRight');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('chromatic-circle');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('正常ケース: ArrowDownで次のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        const event = createKeyboardEvent('ArrowDown');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('chromatic-circle');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('境界値ケース: 最後のオプションで次に移動すると最初のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // chromatic-circle（最後のオプション）に設定
        act(() => {
          useHubStore.getState().setHubType('chromatic-circle');
        });

        const event = createKeyboardEvent('ArrowRight');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('circle-of-fifths');
      });
    });

    describe('Home/Endキー', () => {
      it('正常ケース: Homeキーで最初のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // chromatic-circleに設定
        act(() => {
          useHubStore.getState().setHubType('chromatic-circle');
        });

        const event = createKeyboardEvent('Home');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('circle-of-fifths');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('正常ケース: Endキーで最後のオプションに移動', () => {
        const { result } = renderHook(() => useViewController());

        // circle-of-fifths（初期状態）から
        expect(result.current.hubType).toBe('circle-of-fifths');

        const event = createKeyboardEvent('End');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('chromatic-circle');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('境界値ケース: 既に最初のオプションでHomeキーを押しても変化なし', () => {
        const { result } = renderHook(() => useViewController());

        // circle-of-fifths（最初のオプション）の状態で
        expect(result.current.hubType).toBe('circle-of-fifths');

        const event = createKeyboardEvent('Home');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('circle-of-fifths');
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('境界値ケース: 既に最後のオプションでEndキーを押しても変化なし', () => {
        const { result } = renderHook(() => useViewController());

        // chromatic-circle（最後のオプション）に設定
        act(() => {
          useHubStore.getState().setHubType('chromatic-circle');
        });

        const event = createKeyboardEvent('End');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe('chromatic-circle');
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('その他のキー', () => {
      it('正常ケース: サポートされていないキーは何も実行しない', () => {
        const { result } = renderHook(() => useViewController());

        const initialHubType = result.current.hubType;
        const event = createKeyboardEvent('Enter');

        act(() => {
          result.current.handleKeyDown(event);
        });

        expect(result.current.hubType).toBe(initialHubType);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('正常ケース: 複数の無効なキーを連続して処理', () => {
        const { result } = renderHook(() => useViewController());

        const initialHubType = result.current.hubType;
        const keys = ['Enter', 'Space', 'Escape', 'Tab'];

        keys.forEach(key => {
          const event = createKeyboardEvent(key);
          act(() => {
            result.current.handleKeyDown(event);
          });
          expect(result.current.hubType).toBe(initialHubType);
        });
      });
    });
  });

  describe('フォーカス管理', () => {
    // テスト用のキーボードイベントを作成するヘルパー関数
    const createKeyboardEvent = (key: string): React.KeyboardEvent<HTMLDivElement> =>
      ({
        key,
        preventDefault: vi.fn(),
        currentTarget: document.createElement('div'),
      }) as unknown as React.KeyboardEvent<HTMLDivElement>;

    it('正常ケース: DOM要素が存在しない場合はエラーなし', () => {
      const { result } = renderHook(() => useViewController());

      // radioGroupRefにnullを設定
      act(() => {
        result.current.radioGroupRef.current = null;
      });

      const event = createKeyboardEvent('ArrowRight');

      // エラーが発生しないことを確認
      expect(() => {
        act(() => {
          result.current.handleKeyDown(event);
        });
      }).not.toThrow();
    });

    it('正常ケース: DOM要素が存在する場合のフォーカス処理', () => {
      const { result } = renderHook(() => useViewController());

      // モック DOM要素を作成
      const mockRadioGroup = document.createElement('div');
      const mockButton1 = document.createElement('button');
      const mockButton2 = document.createElement('button');

      mockButton1.setAttribute('role', 'radio');
      mockButton2.setAttribute('role', 'radio');
      mockButton1.focus = vi.fn();
      mockButton2.focus = vi.fn();

      mockRadioGroup.appendChild(mockButton1);
      mockRadioGroup.appendChild(mockButton2);

      // querySelectorAllをモック
      mockRadioGroup.querySelectorAll = vi.fn().mockReturnValue([mockButton1, mockButton2]);

      act(() => {
        result.current.radioGroupRef.current = mockRadioGroup;
      });

      const event = createKeyboardEvent('ArrowRight');

      act(() => {
        result.current.handleKeyDown(event);
      });

      // 2番目のボタンにフォーカスが移ることを確認
      expect(mockButton2.focus).toHaveBeenCalled();
    });
  });

  describe('メモ化の動作', () => {
    it('正常ケース: hubOptionsがメモ化される', () => {
      const { result, rerender } = renderHook(() => useViewController());

      const initialHubOptions = result.current.hubOptions;

      // 再レンダリング
      rerender();

      // 同じオブジェクト参照であることを確認
      expect(result.current.hubOptions).toBe(initialHubOptions);
    });

    it('正常ケース: hubTypeが変更されない場合はselectedOptionがメモ化される', () => {
      const { result, rerender } = renderHook(() => useViewController());

      const initialSelectedOption = result.current.selectedOption;

      // 再レンダリング（hubTypeは変更されない）
      rerender();

      // 同じオブジェクト参照であることを確認
      expect(result.current.selectedOption).toBe(initialSelectedOption);
    });

    it('正常ケース: hubTypeが変更されるとselectedOptionが更新される', () => {
      const { result } = renderHook(() => useViewController());

      const initialSelectedOption = result.current.selectedOption;

      // hubTypeを変更
      act(() => {
        useHubStore.getState().setHubType('chromatic-circle');
      });

      // selectedOptionが更新されることを確認
      expect(result.current.selectedOption).not.toBe(initialSelectedOption);
      expect(result.current.selectedOption?.value).toBe('chromatic-circle');
    });

    it('正常ケース: handleHubTypeChangeとhandleKeyDownがメモ化される', () => {
      const { result, rerender } = renderHook(() => useViewController());

      const initialHandleHubTypeChange = result.current.handleHubTypeChange;
      const initialHandleKeyDown = result.current.handleKeyDown;

      // 再レンダリング
      rerender();

      // 同じ関数参照であることを確認
      expect(result.current.handleHubTypeChange).toBe(initialHandleHubTypeChange);
      expect(result.current.handleKeyDown).toBe(initialHandleKeyDown);
    });
  });
});
