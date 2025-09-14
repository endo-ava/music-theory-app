import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';
import { Scale } from '../scale';
import { Chord } from '../chord';
import type { IMusicalContext, IAnalysisResult } from '../common/IMusicalContext';

/**
 * ModalContext（旋法的文脈）
 *
 * IMusicalContextインターフェースを実装するシンプルな旋法文脈クラス。
 * 最小限の実装で、基本的なインターフェース要件のみを満たす。
 */
export class ModalContext implements IMusicalContext<IAnalysisResult> {
  /** 中心音（Tonal Center） */
  public readonly tonalCenter: PitchClass;

  /** この文脈で使用されるスケール */
  public readonly scale: Scale;

  /**
   * ModalContextを生成する
   * @param tonalCenter 中心音となる音名
   * @param scalePattern モードのスケールパターン
   */
  constructor(tonalCenter: PitchClass, scalePattern: ScalePattern) {
    this.tonalCenter = tonalCenter;
    this.scale = new Scale(tonalCenter, scalePattern);
  }

  /**
   * IMusicalContextインターフェース実装 - centerPitch
   */
  get centerPitch(): PitchClass {
    return this.tonalCenter;
  }

  /**
   * IMusicalContextインターフェース実装 - getDiatonicChords
   * 基本的なダイアトニック和音一覧を返す
   */
  get diatonicChords(): readonly Chord[] {
    // 基本実装：スケールの各度数に対して三和音を生成
    const scaleNotes = this.scale.getNotes().slice(0, 7);
    const chords: Chord[] = [];

    for (let i = 0; i < 7; i++) {
      const root = scaleNotes[i];
      const third = scaleNotes[(i + 2) % 7];
      const fifth = scaleNotes[(i + 4) % 7];

      try {
        const chord = Chord.fromNotes([root, third, fifth]);
        chords.push(chord);
      } catch {
        // 認識できないコード品質の場合はスキップ
        continue;
      }
    }

    return Object.freeze(chords);
  }

  /**
   * IMusicalContextインターフェース実装 - analyzeChord
   * 最小限のコード分析を提供
   */
  analyzeChord(_chordToAnalyze: Chord): IAnalysisResult {
    // 最小限の実装
    return {
      romanDegreeName: 'I', // 簡略化
      isDiatonic: true, // 簡略化
    };
  }
}
