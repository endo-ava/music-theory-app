import { Key } from '@/types/circleOfFifths';

// 五度圏のキー定義
export const KEYS: Key[] = [
  { name: 'C', isMajor: true, position: 0 },
  { name: 'G', isMajor: true, position: 1 },
  { name: 'D', isMajor: true, position: 2 },
  { name: 'A', isMajor: true, position: 3 },
  { name: 'E', isMajor: true, position: 4 },
  { name: 'B', isMajor: true, position: 5 },
  { name: 'F#', isMajor: true, position: 6 },
  { name: 'C#', isMajor: true, position: 7 },
  { name: 'G#', isMajor: true, position: 8 },
  { name: 'D#', isMajor: true, position: 9 },
  { name: 'A#', isMajor: true, position: 10 },
  { name: 'F', isMajor: true, position: 11 },
  { name: 'Am', isMajor: false, position: 0 },
  { name: 'Em', isMajor: false, position: 1 },
  { name: 'Bm', isMajor: false, position: 2 },
  { name: 'F#m', isMajor: false, position: 3 },
  { name: 'C#m', isMajor: false, position: 4 },
  { name: 'G#m', isMajor: false, position: 5 },
  { name: 'D#m', isMajor: false, position: 6 },
  { name: 'A#m', isMajor: false, position: 7 },
  { name: 'Fm', isMajor: false, position: 8 },
  { name: 'Cm', isMajor: false, position: 9 },
  { name: 'Gm', isMajor: false, position: 10 },
  { name: 'Dm', isMajor: false, position: 11 },
];

// キーの位置計算用の定数
export const CIRCLE_CONSTANTS = {
  RADIUS: 300, // 円の半径（ピクセル）
  INNER_RADIUS: 200, // 内側の円の半径（ピクセル）
  KEY_COUNT: 12, // 1周のキーの数
  ANGLE_OFFSET: -90, // 開始角度（度）
} as const;
