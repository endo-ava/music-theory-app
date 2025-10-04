import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';
import { Scale } from '../scale';
import { AbstractMusicalContext } from '../common/AbstractMusicalContext';
import type { KeyDTO } from '../common/IMusicalContext';
import { KeySignature } from '../common';
import { Key } from '../key';

/**
 * ModalContext（旋法的文脈）
 *
 * IMusicalContextインターフェースを実装するシンプルな旋法文脈クラス。
 * 最小限の実装で、基本的なインターフェース要件のみを満たす。
 */
export class ModalContext extends AbstractMusicalContext {
  /** このモードの元となった親のKey */
  public readonly parentKey: Key;

  /** 親Keyの何番目のモードか（1-indexed） */
  public readonly modeOf: number;

  /**
   * ModalContextを生成する。直接のインスタンス化は非推奨。
   * @param centerPitch 主音となる音名
   * @param scalePattern モードのスケールパターン（Majorから派生したモードのみ）
   * @throws {Error} Majorから派生していないパターンが渡された場合
   */
  public constructor(centerPitch: PitchClass, scalePattern: ScalePattern) {
    // そのモードスケールがメジャースケールの何番目をRootとして作られるか
    const modeIndex = ScalePattern.MAJOR_MODES_BY_DEGREE.findIndex(
      pattern => pattern === scalePattern
    );
    // モードスケール以外が渡されたらエラー
    if (modeIndex === -1) {
      throw new Error(
        `ModalContext requires a mode derived from Major scale. Received: ${scalePattern.name}`
      );
    }

    // 相対メジャーのトニックを計算
    const offset = ScalePattern.Major.getIntervalsFromRootAsArray()[modeIndex];
    const relativeMajorSemitone = PitchClass.modulo12(centerPitch.index - offset);
    const relativeMajorTonic = PitchClass.fromChromaticIndex(relativeMajorSemitone);
    // 調号を計算
    const keySignature = KeySignature.fromFifthsIndex(relativeMajorTonic.fifthsIndex);

    super(centerPitch, new Scale(centerPitch, scalePattern), keySignature);
    this.parentKey = Key.major(relativeMajorTonic);
    this.modeOf = modeIndex + 1;
  }

  /**
   * この文脈の相対的メジャートニックを返す
   * モード文脈では、対応するメジャー調のトニックを計算する
   * @returns 相対的メジャートニックのPitchClass
   * @example
   * // D Dorian → C Major
   * const dorian = new ModalContext(PitchClass.D, ScalePattern.Dorian);
   * dorian.getRelativeMajorTonic(); // PitchClass.C
   */
  public getRelativeMajorTonic(): PitchClass {
    return this.parentKey.centerPitch;
  }

  /**
   * JSON形式で出力（ModalContext固有の実装）
   */
  public override toJSON(): KeyDTO {
    return {
      ...super.toJSON(),
      type: 'modal',
    };
  }
}
