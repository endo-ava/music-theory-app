import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';
import { Scale } from '../scale';
import { AbstractMusicalContext } from '../common/AbstractMusicalContext';
import type { KeyDTO } from '../common/IMusicalContext';
import { KeySignature } from '../common';

/**
 * ModalContext（旋法的文脈）
 *
 * IMusicalContextインターフェースを実装するシンプルな旋法文脈クラス。
 * 最小限の実装で、基本的なインターフェース要件のみを満たす。
 */
export class ModalContext extends AbstractMusicalContext {
  /** 中心音（Tonal Center） */
  public readonly tonalCenter: PitchClass;

  /**
   * ModalContextを生成する
   * @param tonalCenter 中心音となる音名
   * @param scalePattern モードのスケールパターン
   */
  constructor(tonalCenter: PitchClass, scalePattern: ScalePattern) {
    const scale = new Scale(tonalCenter, scalePattern);
    super(tonalCenter, scale, KeySignature.fromFifthsIndex(1)); // TODO
    this.tonalCenter = tonalCenter;
  }

  /**
   * この文脈の相対的メジャートニックを返す
   * モード文脈では、対応するメジャー調のトニックを計算する
   * @returns 相対的メジャートニックのPitchClass
   */
  public getRelativeMajorTonic(): PitchClass {
    // TODO: FIX
    return this.centerPitch;
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
