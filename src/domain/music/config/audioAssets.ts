/**
 * 音響アセット設定
 */

/**
 * ピアノサンプル音源のURL設定
 * 本番環境では独自のアセットに置き換え可能
 */
export const PIANO_SAMPLE_URLS = {
  C4: 'https://tonejs.github.io/audio/salamander/C4.mp3',
  'D#4': 'https://tonejs.github.io/audio/salamander/Ds4.mp3',
  'F#4': 'https://tonejs.github.io/audio/salamander/Fs4.mp3',
  A4: 'https://tonejs.github.io/audio/salamander/A4.mp3',
} as const;

/**
 * サンプラーの基本設定
 */
export const SAMPLER_CONFIG = {
  /** サンプル音源のURLマップ */
  urls: PIANO_SAMPLE_URLS,
  /** リリース時間（秒） */
  release: 1,
  /** ベースURL（相対パス使用時） */
  baseUrl: '',
} as const;
