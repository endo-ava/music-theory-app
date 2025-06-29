/**
 * GlobalHeaderコンポーネント専用の型定義
 *
 * このファイルには、GlobalHeaderコンポーネントで使用される
 * コンポーネント固有の型定義が含まれています。
 */

/**
 * ナビゲーションリンクの型定義
 */
export interface NavigationLink {
  /** リンクのラベル */
  label: string;
  /** リンク先のパス */
  href: string;
  /** 内部的な識別子 */
  id: string;
}
