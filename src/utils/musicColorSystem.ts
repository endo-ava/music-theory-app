import { PitchClass } from '@/domain/common/PitchClass';
import type { IMusicalContext, KeyDTO } from '@/domain';
import { AbstractMusicalContext } from '@/domain/common/AbstractMusicalContext';
import { Key } from '@/domain/key';

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
 * IMusicalContextから音楽色相システムのCSS変数名を生成
 * @param context 音楽文脈（Key、ModalContext等）
 * @returns CSS変数名（例: "key-c-ionian", "key-d-dorian"）
 */
export function getMusicColorKey(context: IMusicalContext): string {
  const pitchClass = context.centerPitch;
  const pitchName = pitchClass.sharpName.toLowerCase().replace('#', 'sharp');

  // スケールパターン名からモード名を取得
  let modeName = context.scale.pattern.name.toLowerCase();

  // CSS変数名に合わせて正規化
  // ScalePattern.Major.name → "major" → "ionian"
  // ScalePattern.Aeolian.name → "minor" → "aeolian"
  if (modeName === 'major') modeName = 'ionian';
  if (modeName === 'minor') modeName = 'aeolian';

  return `key-${pitchName}-${modeName}`;
}

/**
 * Key/KeyDTO/MusicalContextから音楽色相システムのCSS変数を取得する
 * @param key キー情報（Key、KeyDTO、MusicalContext、またはnull）
 * @returns CSS変数文字列（例: "var(--color-key-c-ionian)"）またはフォールバック値
 */
export function getMusicColorVariable(key: KeyDTO | IMusicalContext | null): string {
  if (!key) {
    return 'var(--border)';
  }

  let context: IMusicalContext;
  if (key instanceof AbstractMusicalContext) {
    // 既にIMusicalContextの場合
    context = key;
  } else {
    // KeyDTOの場合、IMusicalContextに変換
    // KeyDTOは後方互換性のため、Major/Minorのみサポート
    const keyDTO = key as KeyDTO;
    context = Key.fromCircleOfFifths(keyDTO.fifthsIndex, keyDTO.isMajor);
  }

  const colorKey = getMusicColorKey(context);
  return `var(--color-${colorKey})`;
}
