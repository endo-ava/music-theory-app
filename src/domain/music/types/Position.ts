/**
 * 音楽理論における位置の基本型定義
 */

/**
 * 五度圏における位置（0-11の12ポジション）
 *
 * 12音階における絶対的な位置を表現する。
 * 0 = C/Am, 1 = G/Em, ..., 11 = F/Dm
 */
export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 位置が有効な範囲内かどうかをチェック
 */
export function isValidPosition(position: number): position is Position {
  return Number.isInteger(position) && position >= 0 && position < 12;
}
