import { PitchClass, ScalePattern, Note, Accidental } from '../common';

/** Degreeと変化記号のペア */
export type DegreeWithAccidental = {
  degree: number;
  accidental: Accidental;
};

/** Steps数からDegree分析の結果 */
export type DegreeAnalysisResult = {
  /** スケール音かどうか */
  isScaleDegree: boolean;
  /** シャープ表記でのdegree（例: C# = 1度のシャープ） */
  sharpNotation: DegreeWithAccidental;
  /** フラット表記でのdegree（例: Db = 2度のフラット） */
  flatNotation: DegreeWithAccidental;
};

/**
 * 具体的な音階を表す集約（Aggregate Root）
 */
export class Scale {
  public readonly root: PitchClass;
  public readonly pattern: ScalePattern;
  private readonly notes: readonly Note[];

  /**
   * Scaleを生成する
   * @param root ルートとなる音名
   * @param pattern スケールパターン
   * @param rootOctave ルート音のオクターブ（任意、デフォルトは4）
   */
  constructor(root: PitchClass, pattern: ScalePattern, rootOctave: number = 4) {
    this.root = root;
    this.pattern = pattern;
    this.notes = this.generateNotes(new Note(root, rootOctave));
    Object.freeze(this);
  }

  /**
   * スケールの構成音リストを取得する
   */
  getNotes(): readonly Note[] {
    return this.notes;
  }

  /**
   * 指定された度数の音を取得する
   * @param degree 度数（1から始まる）
   */
  getNoteForDegree(degree: number): Note | undefined {
    if (degree < 1 || degree > this.notes.length) {
      return undefined;
    }
    return this.notes[degree - 1];
  }

  /**
   * 指定されたStep数（半音階での距離）からDegree分析を行う
   * @param step ルートからの半音階での距離（0-11）
   * @returns DegreeAnalysisResult 分析結果（シャープ/フラット両方の表記を含む）
   */
  getDegreeFromSteps(step: number): DegreeAnalysisResult {
    const normalizedStep = PitchClass.modulo12(step);
    // 例: [0, 2, 3, 5, 7, 8, 10, 12]
    const scaleIntervals = this.pattern.getIntervalsFromRootAsArray();

    // 1. ダイアトニック音かどうかをチェック
    const scaleIndex = scaleIntervals.indexOf(normalizedStep);
    if (scaleIndex !== -1) {
      const degree = scaleIndex + 1;
      return {
        isScaleDegree: true,
        sharpNotation: { degree, accidental: Accidental.NATURAL },
        flatNotation: { degree, accidental: Accidental.NATURAL },
      };
    }

    // 2. ノンダイアトニック音を上から挟むダイアトニック音を探す
    const upperIndex = scaleIntervals.findIndex(interval => interval > normalizedStep);

    const scaleSize = scaleIntervals.length - 1;
    // ディグリーがスケールの構成音数を超えた場合は、1に戻す（例: 8度 -> 1度）
    const flatDegree = upperIndex + 1 > scaleSize ? 1 : upperIndex + 1;

    return {
      isScaleDegree: false,
      sharpNotation: { degree: upperIndex, accidental: Accidental.SHARP },
      flatNotation: { degree: flatDegree, accidental: Accidental.FLAT },
    };
  }

  /**
   * ルート音とパターンから、具体的な構成音の配列を生成する
   * @param rootNote ルート音（オクターブ情報を含む）
   */
  private generateNotes(rootNote: Note): readonly Note[] {
    const generated: Note[] = [rootNote];
    let currentNote = rootNote;

    // パターンのすべてのインターバルを適用してスケールの構成音を生成
    for (let i = 0; i < this.pattern.intervals.length; i++) {
      const interval = this.pattern.intervals[i];
      const nextNote = currentNote.transposeBy(interval);
      generated.push(nextNote);
      currentNote = nextNote;
    }

    return Object.freeze(generated);
  }
}
