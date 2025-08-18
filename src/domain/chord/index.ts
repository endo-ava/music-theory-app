import { Interval, Note, PitchClass } from '../common';
import type { Key, KeyDTO } from '../key';

/**
 * コードの品質（レシピ）を定義する不変の値オブジェクト
 * 例：メジャートライアドは「ルート音、長3度、完全5度」というレシピを持つ
 */
export class ChordQuality {
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

  /** 全てのqualities */
  private static readonly qualities: readonly ChordQuality[] = [
    this.MajorTriad,
    this.MinorTriad,
    this.DominantSeventh,
    this.MajorSeventh,
    this.MinorSeventh,
    this.DiminishedTriad,
  ];
  public readonly nameSuffix: string;
  public readonly intervals: readonly Interval[];

  private constructor(nameSuffix: string, intervals: readonly Interval[]) {
    this.nameSuffix = nameSuffix;
    // 渡された配列をソートして不変にする
    this.intervals = Object.freeze(Interval.sort(intervals as Interval[]));
    Object.freeze(this);
  }

  /**
   * 与えられたインターバル配列がこのクオリティと一致するか判定する
   */
  public matches(intervalsToCompare: Interval[]): boolean {
    if (this.intervals.length !== intervalsToCompare.length) {
      return false;
    }
    const sortedToCompare = Interval.sort(intervalsToCompare);
    return this.intervals.every((interval, i) => interval.equals(sortedToCompare[i]));
  }

  /**
   * インターバル配列から、合致するChordQualityを検索する
   */
  public static findByIntervals(intervals: Interval[]): ChordQuality | null {
    return this.qualities.find(quality => quality.matches(intervals)) || null;
  }

  /**
   * ローマ数字での表記を取得する
   * @param degreeName rootのディグリーネーム（Ⅰ ~ Ⅶ）
   * @returns コードのディグリーネーム
   */
  getChordDegreeName(degreeName: string): string {
    let roman = degreeName;

    // コード品質に応じて表記を調整する
    switch (this.nameSuffix) {
      case 'dim':
        roman += '°';
        break;
      case 'half-diminished':
        roman += 'ø';
        break;
      case 'aug':
        roman += '+';
        break;
      default:
        roman += this.nameSuffix;
    }

    return roman;
  }
}

/**
 * 和音を表現する集約（Aggregate Root）
 */
export class Chord {
  public readonly rootNote: Note;
  public readonly constituentNotes: readonly Note[];
  public readonly quality: ChordQuality;

  /**
   * Chordのインスタンス化はファクトリメソッド経由で行うため、privateにする
   */
  private constructor(rootNote: Note, quality: ChordQuality) {
    this.rootNote = rootNote;
    this.quality = quality;

    // ルート音と、ルート音を各インターバルで移調した音で構成音を生成
    const notes = [rootNote];
    for (const interval of quality.intervals) {
      notes.push(rootNote.transposeBy(interval));
    }
    this.constituentNotes = Object.freeze(notes);

    Object.freeze(this);
  }

  /** 与えられたKey文脈におけるChord Nameを取得する */
  public getNameFor(key: Key): string {
    return `${this.rootNote._pitchClass.getNameFor(key.keySignature)}${this.quality.nameSuffix}`;
  }

  /** 五度圏表示用のコード名 メジャーは♭、マイナーは♯ */
  public getNameForCircleOfFifth(): string {
    return this.quality.nameSuffix === ''
      ? `${this.rootNote._pitchClass.flatName}${this.quality.nameSuffix}`
      : `${this.rootNote._pitchClass.sharpName}${this.quality.nameSuffix}`;
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
    return this.constituentNotes.map(note => note.toString);
  }

  /**
   * 指定されたキーのルート音から各構成音へのInterval配列を返す
   * @param keyRoot キーのルート音（PitchClass）
   * @returns キールートからの各構成音のInterval配列
   * @example
   * // CキーにおけるG7コード (G, B, D, F) の場合
   * // G: C→Gは完全5度 (P5)
   * // B: C→Bは長7度 (M7)
   * // D: C→Dは長2度 (M2)
   * // F: C→Fは完全4度 (P4)
   * // 結果: [P5, M7, M2, P4]
   */
  getIntervalsFromKey(keyRoot: PitchClass): Interval[] {
    return this.constituentNotes.map(note => Interval.between(keyRoot, note._pitchClass));
  }

  /**
   * KeyDTOからトニックコード（主和音）を生成する
   * @param keyDTO キーDTO（五度圏上の選択されたキー情報）
   * @param octave オクターブ（デフォルト: 4）
   * @returns キーに対応するトニックコード
   */
  static fromKeyDTO(keyDTO: KeyDTO, octave: number = 4): Chord {
    // KeyDTOの五度圏インデックスからPitchClassを取得
    const rootPitchClass = PitchClass.fromCircleOfFifths(keyDTO.fifthsIndex);

    // 最適なオクターブを決定（指定されていない場合）
    const finalOctave = octave ?? this.getOptimizedOctave(rootPitchClass);

    // ルート音を生成
    const rootNote = new Note(rootPitchClass, finalOctave);

    // キーの種類に応じてコードを生成
    if (keyDTO.isMajor) {
      return Chord.major(rootNote);
    } else {
      return Chord.minor(rootNote);
    }
  }

  /**
   * 構成音配列からChordを生成する
   * @param constituentNotes 構成音配列（最低音がルート音として扱われる）
   * @throws Error 構成音配列が空の場合
   * @throws Error 認識可能なコード品質が見つからない場合
   */
  static fromNotes(constituentNotes: Note[]): Chord {
    // バリデーション
    if (constituentNotes.length === 0) {
      throw new Error('構成音配列が空です');
    }

    // null/undefinedを除外
    const validNotes = constituentNotes.filter(note => note && note._pitchClass);
    if (validNotes.length === 0) {
      throw new Error('有効な構成音が見つかりません');
    }

    // 最低音をルート音として決定
    const sortedNotes = Note.sortByPitch(validNotes);
    const rootNote = sortedNotes[0];

    // ルート音以外の音を使って、ルートからのインターバル配列を生成
    const intervals = sortedNotes
      .slice(1) // ルート音自身は除く
      .map(note => Interval.between(rootNote._pitchClass, note._pitchClass));

    // 既知のコード品質と一致するかチェック
    const quality = ChordQuality.findByIntervals(intervals);
    if (!quality) {
      const intervalNames = intervals.map(i => i.name).join(', ');
      throw new Error(`認識可能なコード品質が見つかりません。インターバル: [${intervalNames}]`);
    }

    return new Chord(rootNote, quality);
  }

  // =========================================================
  // プライベート・ヘルパーメソッド
  // =========================================================

  // オクターブ決定の閾値定数
  private static readonly HIGH_PITCH_THRESHOLD_INDEX = 8; // G# (index: 8)
  private static readonly LOW_OCTAVE = 3;
  private static readonly HIGH_OCTAVE = 4;

  /**
   * ルート音の音名から最適なオクターブを決定 (G#/A♭以上は3、それ以下は4)
   * @param pitchClass 判定対象のピッチクラス
   */
  static getOptimizedOctave(pitchClass: PitchClass): number {
    // G# (index: HIGH_PITCH_THRESHOLD_INDEX) 以上の音は低いオクターブにする
    return pitchClass.index >= Chord.HIGH_PITCH_THRESHOLD_INDEX
      ? Chord.LOW_OCTAVE
      : Chord.HIGH_OCTAVE;
  }

  /**
   * 2つのChordが等しいかどうかを判定する
   * @param other 比較対象のChord
   * @returns 等しい場合true
   */
  equals(other: Chord): boolean {
    if (!other || !(other instanceof Chord)) {
      return false;
    }

    // ルート音とコード品質が同じかチェック
    return (
      this.rootNote._pitchClass.equals(other.rootNote._pitchClass) && this.quality === other.quality
    );
  }
}
