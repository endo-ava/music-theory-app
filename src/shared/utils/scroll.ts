/**
 * スクロール関連のユーティリティ関数
 */

/**
 * ドラッグ方向の定義
 */
export type DragDirection = 'up' | 'down';

/**
 * スクロール可能な要素を検索するヘルパー関数
 * data-scrollable属性がある要素、またはoverflow-yがauto/scrollの要素を探す
 *
 * @param target - 検索開始要素
 * @returns スクロール可能な親要素、または null
 */
export const findScrollableParent = (target: HTMLElement): HTMLElement | null => {
  // data-scrollable属性がある要素を優先検索
  const scrollableElement = target.closest('[data-scrollable]');
  if (scrollableElement) {
    return scrollableElement as HTMLElement;
  }

  // CSSのoverflowプロパティでスクロール可能な要素を検索
  let current = target;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return current;
    }
    current = current.parentElement as HTMLElement;
  }

  return null;
};

/**
 * ドラッグ方向とスクロール位置に基づいてドラッグ許可を判定するヘルパー関数
 *
 * @param element - スクロール可能な要素
 * @param dragDirection - ドラッグ方向
 * @returns ドラッグを許可するかどうか
 */
export const shouldAllowDrag = (element: HTMLElement, dragDirection: DragDirection): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  const atTop = scrollTop === 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px余裕を持たせる

  // 上スワイプでコンテンツが最上部でない場合、コンテンツスクロールを優先
  if (dragDirection === 'up' && !atTop) {
    return false;
  }

  // 下スワイプでコンテンツが最下部でない場合、コンテンツスクロールを優先
  if (dragDirection === 'down' && !atBottom) {
    return false;
  }

  return true;
};
