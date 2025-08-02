/**
 * クラス名計算ユーティリティ
 *
 * KeyAreaコンポーネントで使用されるCSSクラス名の計算ロジックを提供します。
 * 状態に応じた適切なクラス名を決定し、スタイリングの一貫性を保証します。
 */

import type { KeyDTO } from '@/domain';
import type { FillClassName, TextClassName } from '../types';

/**
 * キーエリアの塗りつぶしクラス名を計算します
 * @param key キーのDTO
 * @param isSelected 選択状態かどうか
 * @param isHovered ホバー状態かどうか
 * @returns 適切な塗りつぶしクラス名
 */
export function calculateFillClassName(
  key: KeyDTO,
  isSelected: boolean,
  isHovered: boolean
): FillClassName {
  if (isSelected) {
    return 'fill-key-area-selected';
  }
  if (isHovered) {
    return 'fill-key-area-hover';
  }
  return key.isMajor ? 'fill-key-area-major' : 'fill-key-area-minor';
}

/**
 * キーエリアのテキストクラス名を計算します
 * @param key キーのDTO
 * @returns 適切なテキストクラス名
 */
export function calculateTextClassName(key: KeyDTO): TextClassName {
  return key.isMajor ? 'text-key-major font-key-major' : 'text-key-minor font-key-minor';
}

/**
 * キーの状態チェック関数
 * @param key チェックするキー
 * @param targetKey 対象キー（null可能）
 * @returns キーが一致するかどうか
 */
export function isKeyMatch(key: KeyDTO, targetKey: KeyDTO | null): boolean {
  if (!targetKey) return false;
  return targetKey.shortName === key.shortName && targetKey.isMajor === key.isMajor;
}
