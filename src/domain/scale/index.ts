import { PitchClass, ScalePattern, Note } from '../common';

/** スケールにおける度数と調号変化の状態
 * 例：
 * F#m in D Majar -> degree:3, alteration:natural
 * F in D Majar -> degree:3, alteration:flat
 */
export type DegreeInfo = {
  /** スケール上の度数 (1-7) */
  degree: number;
  /** 変化の状態 ('natural'はダイアトニック音そのもの) */
  alteration: 'sharp' | 'flat' | 'natural';
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
   * Tone.js用の音符表記配列
   */
  get toneNotations(): string[] {
    return this.notes.map(note => note.toString);
  }

  /**
   * あらゆる音名（PitchClass）が、このスケールにおいて何度に相当するかを、変化記号を含めて正確に分析する。
   * @param pitchClassToFind 分析したい音名
   * @returns 度数と、その度数のダイアトニック音からの変化の関係({degree, alteration})。
   */
  public getDegreeInfo(pitchClassToFind: PitchClass): DegreeInfo {
    // --- STEP 1: 分析対象の音の「文字としての名前」を特定する --- ('C#'や'C♭' -> 'C')
    const baseLetter = pitchClassToFind.sharpName.charAt(0);

    // --- STEP 2: スケールの中から、同じ文字を持つダイアトニック音を探す --- ( = 基準点 )
    const diatonicBaseNoteIndex = this.notes.findIndex(
      note => note._pitchClass.sharpName.charAt(0) === baseLetter
    );

    const diatonicBaseNote = this.notes[diatonicBaseNoteIndex];
    const degree = diatonicBaseNoteIndex + 1;

    // --- STEP 3: 「基準点」と「分析対象」の半音階インデックスを比較する ---
    // これにより、分析対象が基準点からどれだけ変化しているかがわかる。
    const chromaticDiff = pitchClassToFind.index - diatonicBaseNote._pitchClass.index;

    if (chromaticDiff === 0) {
      // 差がゼロなら、それはダイアトニック音そのもの。
      // DメジャースケールにF#が来た場合、基準はF#、差は0。よって'natural'。
      return { degree, alteration: 'natural' };
    } else if (chromaticDiff > 0) {
      // 入力音の方が高ければ'sharp'。
      // DメジャースケールにF##が来た場合、基準はF#、差は+1。よって'sharp'。
      return { degree, alteration: 'sharp' };
    } else {
      // chromaticDiff < 0
      // 入力音の方が低ければ'flat'。
      // DメジャースケールにFナチュラルが来た場合、基準はF#、差は-1。よって'flat'。
      return { degree, alteration: 'flat' };
    }
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
