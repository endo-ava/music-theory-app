import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';
import { Scale } from '../scale';
import { AbstractMusicalContext } from '../common/AbstractMusicalContext';
import type { KeyDTO } from '../common/IMusicalContext';

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
    super(tonalCenter, scale);
    this.tonalCenter = tonalCenter;
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
