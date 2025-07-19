/**
 * 五度圏インデックスの基本型定義
 */

/**
 * 五度圏インデックス（0-11の12ポジション）
 *
 * 五度ずつ上行する順序での音の位置を表現する。
 * 0 = C/Am, 1 = G/Em, 2 = D/Bm, ..., 11 = F/Dm
 *
 * クロマチックサークルの位置（ChromaticIndex）とは異なる概念。
 */
export type FifthsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 五度圏インデックスが有効な範囲内かどうかをチェック
 */
export function isValidFifthsIndex(index: number): index is FifthsIndex {
  return Number.isInteger(index) && index >= 0 && index < 12;
}
