import { PitchClass } from '@/domain/common/PitchClass';
import { Key } from '@/domain';
import type { KeyDTO } from '@/domain';

/**
 * 12音×7モード色相システム
 */

// モード明度（Lydian=70% → Locrian=28%、7%刻み）
const MODE_LIGHTNESS = [70, 63, 56, 49, 42, 35, 28];
const MODE_NAMES = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];

/**
 * 84色のCSS変数文字列を生成
 */
export function generateMusicColorTheme(): string {
  const variables = PitchClass.ALL_PITCH_CLASSES.flatMap((pitchClass, pitchIndex) =>
    MODE_NAMES.map((mode, modeIndex) => {
      const pitchName = pitchClass.sharpName.toLowerCase().replace('#', 'sharp');
      const hue = pitchIndex * 30;
      const lightness = MODE_LIGHTNESS[modeIndex];
      return `  --color-key-${pitchName}-${mode}: hsl(${hue}, 85%, ${lightness}%);`;
    })
  );

  return `/* 12音×7モード色相システム */\n${variables.join('\n')}`;
}

/**
 * KeyDTOから音楽色相システムのCSS変数名を生成
 * @param keyDTO キー情報
 * @returns CSS変数名（例: "key-c-ionian", "key-a-aeolian"）
 */
export function getMusicColorKey(keyDTO: KeyDTO): string {
  const pitchClass = PitchClass.fromCircleOfFifths(keyDTO.fifthsIndex);
  const pitchName = pitchClass.sharpName.toLowerCase().replace('#', 'sharp');
  const mode = keyDTO.isMajor ? 'ionian' : 'aeolian';

  return `key-${pitchName}-${mode}`;
}

/**
 * Key/KeyDTOから音楽色相システムのCSS変数を取得する
 * @param key キー情報（Key、KeyDTO、またはnull）
 * @returns CSS変数文字列（例: "var(--color-key-c-ionian)"）またはフォールバック値
 */
export function getMusicColorVariable(key: Key | KeyDTO | null): string {
  if (!key) {
    return 'var(--border)';
  }

  const keyDTO = key instanceof Key ? key.toJSON() : key;
  const colorKey = getMusicColorKey(keyDTO);

  return `var(--color-${colorKey})`;
}
