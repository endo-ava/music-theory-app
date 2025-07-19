/**
 * キー名の値オブジェクト
 */

/**
 * メジャーキーの名前
 */
export type MajorKeyName =
  | 'C'
  | 'G'
  | 'D'
  | 'A'
  | 'E'
  | 'B'
  | 'F#'
  | 'C#'
  | 'G#'
  | 'D#'
  | 'A#'
  | 'F';

/**
 * マイナーキーの名前
 */
export type MinorKeyName =
  | 'Am'
  | 'Em'
  | 'Bm'
  | 'F#m'
  | 'C#m'
  | 'G#m'
  | 'D#m'
  | 'A#m'
  | 'Fm'
  | 'Cm'
  | 'Gm'
  | 'Dm';

/**
 * キー名（メジャー・マイナー統合）
 */
export type KeyName = MajorKeyName | MinorKeyName;
