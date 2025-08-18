import { PitchClass } from '@/domain/common/PitchClass';

/**
 * 12音×7モード色相システム（最小実装）
 */

// 五度圏順の音名（色相30°刻み）
const PITCH_CLASSES = [
  PitchClass.C,
  PitchClass.G,
  PitchClass.D,
  PitchClass.A,
  PitchClass.E,
  PitchClass.B,
  PitchClass.FSharp,
  PitchClass.CSharp,
  PitchClass.GSharp,
  PitchClass.DSharp,
  PitchClass.ASharp,
  PitchClass.F,
];

// モード明度（Lydian=70% → Locrian=28%、7%刻み）
const MODE_LIGHTNESS = [70, 63, 56, 49, 42, 35, 28];
const MODE_NAMES = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];

/**
 * 84色のCSS変数文字列を生成
 */
export function generateMusicColorTheme(): string {
  const variables = PITCH_CLASSES.flatMap((pitchClass, pitchIndex) =>
    MODE_NAMES.map((mode, modeIndex) => {
      const pitchName = pitchClass.sharpName.toLowerCase().replace('#', 'sharp');
      const hue = pitchIndex * 30;
      const lightness = MODE_LIGHTNESS[modeIndex];
      return `  --color-key-${pitchName}-${mode}: hsl(${hue}, 85%, ${lightness}%);`;
    })
  );

  return `/* 12音×7モード色相システム */\n${variables.join('\n')}`;
}
