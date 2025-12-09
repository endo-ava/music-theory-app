import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { findScrollableParent, shouldAllowDrag, DragDirection } from '../scroll';

describe('scroll utils', () => {
  describe('findScrollableParent', () => {
    let mockElement: HTMLElement;
    let mockParent: HTMLElement;
    let mockGrandParent: HTMLElement;
    let mockScrollableParent: HTMLElement;

    beforeEach(() => {
      // DOM要素のモックを作成
      mockElement = document.createElement('div');
      mockParent = document.createElement('div');
      mockGrandParent = document.createElement('div');
      mockScrollableParent = document.createElement('div');

      // DOM構造をプロパティディスクリプタで設定
      Object.defineProperty(mockElement, 'parentElement', {
        value: mockParent,
        configurable: true,
      });
      Object.defineProperty(mockParent, 'parentElement', {
        value: mockGrandParent,
        configurable: true,
      });
      Object.defineProperty(mockGrandParent, 'parentElement', {
        value: mockScrollableParent,
        configurable: true,
      });

      // getComputedStyleのモック
      vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
        const computedStyle = {
          overflowY: 'visible',
        } as CSSStyleDeclaration;

        // 特定の要素にスクロールスタイルを設定
        if (element === mockScrollableParent) {
          computedStyle.overflowY = 'auto';
        }

        return computedStyle;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('正常系', () => {
      it('正常ケース: data-scrollable属性がある要素を優先的に検索する', () => {
        // data-scrollable属性を持つ要素を作成
        const scrollableElement = document.createElement('div');
        scrollableElement.setAttribute('data-scrollable', 'true');

        // closestメソッドのモック
        vi.spyOn(mockElement, 'closest').mockImplementation(selector => {
          if (selector === '[data-scrollable]') {
            return scrollableElement;
          }
          return null;
        });

        const result = findScrollableParent(mockElement);
        expect(result).toBe(scrollableElement);
      });

      it('正常ケース: overflow-y: auto の要素を検索する', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        const result = findScrollableParent(mockElement);
        expect(result).toBe(mockScrollableParent);
      });

      it('正常ケース: overflow-y: scroll の要素を検索する', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        // getComputedStyleのモックを更新
        vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
          const computedStyle = {
            overflowY: 'visible',
          } as CSSStyleDeclaration;

          if (element === mockScrollableParent) {
            computedStyle.overflowY = 'scroll';
          }

          return computedStyle;
        });

        const result = findScrollableParent(mockElement);
        expect(result).toBe(mockScrollableParent);
      });

      it('正常ケース: 複数の親要素を遡って検索する', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        // 中間の親要素にはスクロールスタイルなし
        vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
          const computedStyle = {
            overflowY: 'visible',
          } as CSSStyleDeclaration;

          if (element === mockScrollableParent) {
            computedStyle.overflowY = 'auto';
          }

          return computedStyle;
        });

        const result = findScrollableParent(mockElement);
        expect(result).toBe(mockScrollableParent);
      });
    });

    describe('境界値・異常系', () => {
      it('境界値ケース: スクロール可能な親要素が存在しない場合はnullを返す', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        // すべての要素でスクロールスタイルがない場合
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
          overflowY: 'visible',
        } as CSSStyleDeclaration);

        const result = findScrollableParent(mockElement);
        expect(result).toBeNull();
      });

      it('境界値ケース: document.bodyに到達した場合はnullを返す', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        // document.bodyを親要素として設定
        const bodyElement = document.createElement('body');
        Object.defineProperty(mockElement, 'parentElement', {
          value: bodyElement,
          configurable: true,
        });

        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
          overflowY: 'visible',
        } as CSSStyleDeclaration);

        const result = findScrollableParent(mockElement);
        expect(result).toBeNull();
      });

      it('境界値ケース: parentElementがnullの場合はnullを返す', () => {
        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(mockElement, 'closest').mockReturnValue(null);

        // parentElementをnullに設定
        Object.defineProperty(mockElement, 'parentElement', {
          value: null,
          configurable: true,
        });

        const result = findScrollableParent(mockElement);
        expect(result).toBeNull();
      });

      it('境界値ケース: targetがdocument.bodyの場合はnullを返す', () => {
        const bodyElement = document.createElement('body');

        // closestメソッドで data-scrollable 要素が見つからない場合
        vi.spyOn(bodyElement, 'closest').mockReturnValue(null);

        const result = findScrollableParent(bodyElement);
        expect(result).toBeNull();
      });
    });
  });

  describe('shouldAllowDrag', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
    });

    describe('正常系', () => {
      it('上方向ドラッグ + 最上部の場合はドラッグを許可する', () => {
        // 最上部の状態を設定
        Object.defineProperty(mockElement, 'scrollTop', { value: 0, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const result = shouldAllowDrag(mockElement, 'up');
        expect(result).toBe(true);
      });

      it('正常ケース: 上方向ドラッグ + 最上部以外の場合はドラッグを不許可にする', () => {
        // 最上部以外の状態を設定
        Object.defineProperty(mockElement, 'scrollTop', { value: 10, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const result = shouldAllowDrag(mockElement, 'up');
        expect(result).toBe(false);
      });

      it('正常ケース: 下方向ドラッグ + 最下部の場合はドラッグを許可する', () => {
        // 最下部の状態を設定 (scrollTop + clientHeight >= scrollHeight - 1)
        Object.defineProperty(mockElement, 'scrollTop', { value: 99, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const result = shouldAllowDrag(mockElement, 'down');
        expect(result).toBe(true);
      });

      it('正常ケース: 下方向ドラッグ + 最下部以外の場合はドラッグを不許可にする', () => {
        // 最下部以外の状態を設定
        Object.defineProperty(mockElement, 'scrollTop', { value: 50, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const result = shouldAllowDrag(mockElement, 'down');
        expect(result).toBe(false);
      });
    });

    describe('境界値', () => {
      it('境界値ケース: scrollTop = 0 の場合（最上部）', () => {
        Object.defineProperty(mockElement, 'scrollTop', { value: 0, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const resultUp = shouldAllowDrag(mockElement, 'up');
        const resultDown = shouldAllowDrag(mockElement, 'down');

        expect(resultUp).toBe(true);
        expect(resultDown).toBe(false);
      });

      it('境界値ケース: scrollTop + clientHeight = scrollHeight - 1 の場合（1px余裕の境界）', () => {
        // scrollTop(99) + clientHeight(100) = 199, scrollHeight(200) - 1 = 199
        Object.defineProperty(mockElement, 'scrollTop', { value: 99, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const resultUp = shouldAllowDrag(mockElement, 'up');
        const resultDown = shouldAllowDrag(mockElement, 'down');

        expect(resultUp).toBe(false);
        expect(resultDown).toBe(true);
      });

      it('境界値ケース: scrollTop + clientHeight = scrollHeight の場合（完全な最下部）', () => {
        // scrollTop(100) + clientHeight(100) = 200, scrollHeight(200)
        Object.defineProperty(mockElement, 'scrollTop', { value: 100, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const resultUp = shouldAllowDrag(mockElement, 'up');
        const resultDown = shouldAllowDrag(mockElement, 'down');

        expect(resultUp).toBe(false);
        expect(resultDown).toBe(true);
      });

      it('境界値ケース: scrollTop + clientHeight > scrollHeight の場合（理論的には起こらないが）', () => {
        // scrollTop(101) + clientHeight(100) = 201, scrollHeight(200)
        Object.defineProperty(mockElement, 'scrollTop', { value: 101, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const resultUp = shouldAllowDrag(mockElement, 'up');
        const resultDown = shouldAllowDrag(mockElement, 'down');

        expect(resultUp).toBe(false);
        expect(resultDown).toBe(true);
      });

      it('境界値ケース: スクロールがない場合（scrollHeight = clientHeight）', () => {
        Object.defineProperty(mockElement, 'scrollTop', { value: 0, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 100, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const resultUp = shouldAllowDrag(mockElement, 'up');
        const resultDown = shouldAllowDrag(mockElement, 'down');

        expect(resultUp).toBe(true);
        expect(resultDown).toBe(true);
      });
    });

    describe('DragDirection型の網羅', () => {
      it('正常ケース: up方向のドラッグをテストする', () => {
        Object.defineProperty(mockElement, 'scrollTop', { value: 0, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const dragDirection: DragDirection = 'up';
        const result = shouldAllowDrag(mockElement, dragDirection);
        expect(result).toBe(true);
      });

      it('正常ケース: down方向のドラッグをテストする', () => {
        Object.defineProperty(mockElement, 'scrollTop', { value: 99, configurable: true });
        Object.defineProperty(mockElement, 'scrollHeight', { value: 200, configurable: true });
        Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });

        const dragDirection: DragDirection = 'down';
        const result = shouldAllowDrag(mockElement, dragDirection);
        expect(result).toBe(true);
      });
    });
  });
});
