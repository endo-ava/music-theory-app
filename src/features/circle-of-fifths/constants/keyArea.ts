/**
 * KeyAreaコンポーネント専用定数
 *
 * KeyAreaコンポーネントで使用されるUI関連の定数定義
 * スタイル、フォント、レイアウトオフセットなどを管理
 */

/**
 * 共通のテキストスタイル定数
 * userSelectなどの重複を解消
 */
export const COMMON_TEXT_STYLES = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
} as const;

/**
 * フォントサイズ定数
 * マジックナンバーの排除
 */
export const FONT_SIZES = {
  PRIMARY: '12px',
  ROMAN: '10px',
} as const;

/**
 * レイアウトオフセット定数
 * テキスト位置調整用の値
 */
export const LAYOUT_OFFSETS = {
  ROMAN_Y_OFFSET: 6,
  PRIMARY_Y_OFFSET: -6,
} as const;
