import { PitchClass } from '@/domain/common/PitchClass';
import type { KeyDTO } from '@/domain';

/**
 * KeyDTOから音楽色相システムの色を取得するユーティリティ
 */

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
