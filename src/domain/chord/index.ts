import { Interval, Note, PitchClass } from '..';

/**
 * コードの品質（レシピ）を定義する不変の値オブジェクト
 * 例：メジャートライアドは「ルート音、長3度、完全5度」というレシピを持つ
 */
export class ChordQuality {
  constructor(
    /** 例: "Major Triad", "m7" */
    public readonly nameSuffix: string,
    /** ルート音からのインターバルの配列 */
    public readonly intervals: readonly Interval[]
  ) {
    Object.freeze(this);
  }

  // --- 一般的なコード品質の定義 ---
  static readonly MajorTriad = new ChordQuality('', [Interval.MajorThird, Interval.PerfectFifth]);
  static readonly MinorTriad = new ChordQuality('m', [Interval.MinorThird, Interval.PerfectFifth]);
  static readonly DominantSeventh = new ChordQuality('7', [
    Interval.MajorThird,
    Interval.PerfectFifth,
    Interval.MinorSeventh,
  ]);
  static readonly MajorSeventh = new ChordQuality('maj7', [
    Interval.MajorThird,
    Interval.PerfectFifth,
    Interval.MajorSeventh,
  ]);
  static readonly MinorSeventh = new ChordQuality('m7', [
    Interval.MinorThird,
    Interval.PerfectFifth,
    Interval.MinorSeventh,
  ]);
  static readonly DiminishedTriad = new ChordQuality('dim', [
    Interval.MinorThird,
    Interval.Tritone,
  ]);
}

/**
 * 和音を表現する集約（Aggregate Root）
 */
export class Chord {
  public readonly rootNote: Note;
  public readonly constituentNotes: readonly Note[];
  public readonly name: string;
  public readonly quality: ChordQuality;

  /**
   * Chordのインスタンス化はファクトリメソッド経由で行うため、privateにする
   */
  private constructor(rootNote: Note, quality: ChordQuality) {
    this.rootNote = rootNote;
    this.quality = quality;
    this.name = `${rootNote._pitchClass.name}${quality.nameSuffix}`;

    // ルート音と、ルート音を各インターバルで移調した音で構成音を生成
    const notes = [rootNote];
    for (const interval of quality.intervals) {
      notes.push(rootNote.transposeBy(interval));
    }
    this.constituentNotes = Object.freeze(notes);

    Object.freeze(this);
  }

  /**
   * ルート音とコード品質からChordを生成する
   * @param rootNote ルート音
   * @param quality コード品質（レシピ）
   */
  static from(rootNote: Note, quality: ChordQuality): Chord {
    return new Chord(rootNote, quality);
  }

  // ファクトリメソッド

  static major(rootNote: Note): Chord {
    return new Chord(rootNote, ChordQuality.MajorTriad);
  }

  static minor(rootNote: Note): Chord {
    return new Chord(rootNote, ChordQuality.MinorTriad);
  }

  static dominantSeventh(rootNote: Note): Chord {
    return new Chord(rootNote, ChordQuality.DominantSeventh);
  }

  /**
   * Tone.js用の音符表記配列
   */
  get toneNotations(): string[] {
    return [...this.constituentNotes].map(note => note.toString);
  }

  /**
   * 五度圏インデックスからメジャーコードを生成する
   * @param circleIndex 五度圏インデックス (C=0, G=1...)
   * @param octave オクターブ（未指定時は音名に応じて最適化）
   */
  static fromCircleOfFifths(circleIndex: number, octave?: number): Chord {
    const rootPitch = PitchClass.fromCircleOfFifths(circleIndex);
    const finalOctave = octave ?? this.getOptimizedOctave(rootPitch);
    const rootNote = new Note(rootPitch, finalOctave);
    return Chord.major(rootNote);
  }

  /**
   * 五度圏インデックスから、その相対マイナーコードを生成する
   * @param circleIndex 五度圏インデックス (C=0 の場合、Amが生成される)
   * @param octave オクターブ（未指定時は音名に応じて最適化）
   */
  static relativeMinorFromCircleOfFifths(circleIndex: number, octave?: number): Chord {
    // 相対マイナーのルート音を取得（メジャーキーから短3度下）
    const majorRoot = PitchClass.fromCircleOfFifths(circleIndex);
    const minorRoot = majorRoot.transposeBy(Interval.MinorThird.invert()); // 短3度下に移調

    const finalOctave = octave ?? this.getOptimizedOctave(minorRoot);
    const rootNote = new Note(minorRoot, finalOctave);
    return Chord.minor(rootNote);
  }

  // =========================================================
  // プライベート・ヘルパーメソッド
  // =========================================================

  /**
   * ルート音の音名から最適なオクターブを決定 (G#/A♭以上は3、それ以下は4)
   * @param pitchClass 判定対象のピッチクラス
   */
  private static getOptimizedOctave(pitchClass: PitchClass): number {
    // G# (chromaticIndex: 8) 以上の音は低いオクターブにする
    return pitchClass.chromaticIndex >= 8 ? 3 : 4;
  }
}
