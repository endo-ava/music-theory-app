import { Interval } from './Interval';
import { PitchClass } from './PitchClass';

// スケールパターンの基本的な性質を定義する型
export type ScaleQuality = 'major' | 'minor' | 'diminished' | 'other';

/**
 * 音階の設計図（インターバルパターン）を表現する値オブジェクト
 */
export class ScalePattern {
  public readonly quality: ScaleQuality;
  /**
   * この ScalePattern が派生元パターンの何度目から始まっているかを示す度数
   * null の場合は、他のパターンから派生していない基本パターン（Major, HarmonicMinor等）
   *
   * @example
   * ScalePattern.Dorian.derivedFromDegree // 2 (Majorの2度から派生)
   * ScalePattern.Lydian.derivedFromDegree // 4 (Majorの4度から派生)
   * ScalePattern.Major.derivedFromDegree  // null (基本パターン)
   * ScalePattern.HarmonicMinor.derivedFromDegree // null (基本パターン)
   */
  public readonly derivedFromDegree: number | null;

  private constructor(
    public readonly name: string,
    public readonly intervals: readonly Interval[],
    public readonly shortSymbol: string,
    derivedFromDegree: number | null = null
  ) {
    this.quality = this.determineQuality();
    this.derivedFromDegree = derivedFromDegree;
    Object.freeze(this);
  }

  /**
   * 自身のパターンと開始度数から、新しいモードのスケールパターンを導出する
   *
   * @param startDegree 派生開始度数（1から7）。この度数からインターバルパターンを開始する
   * @param newName 新しいパターンの名前
   * @param newShortSymbol 新しいパターンの短縮記号
   * @returns 導出された新しいScalePattern（derivedFromDegree に startDegree が設定される）
   *
   * @example
   * // Majorパターンの2度から開始してDorianモードを生成
   * const dorian = ScalePattern.Major.derive(2, 'Dorian', 'dor');
   * console.log(dorian.derivedFromDegree); // 2
   */
  derive(startDegree: number, newName: string, newShortSymbol: string): ScalePattern {
    if (startDegree < 1 || startDegree > this.intervals.length) {
      throw new Error('開始度数がパターンの音数を超えています。');
    }
    const startIndex = startDegree - 1;
    const rotatedIntervals = [
      ...this.intervals.slice(startIndex),
      ...this.intervals.slice(0, startIndex),
    ];
    return new ScalePattern(newName, rotatedIntervals, newShortSymbol, startDegree);
  }

  // --- アプリケーションが知っている全ての「設計図」を定義 ---

  // 1. 基盤となるパターンを定義
  static readonly Major = new ScalePattern(
    'Major',
    [
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
      Interval.Whole,
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
    ],
    ''
  );

  static readonly HarmonicMinor = new ScalePattern(
    'Harmonic Minor',
    [
      Interval.Whole,
      Interval.Half,
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
      Interval.MinorThird,
      Interval.Half,
    ],
    'hm'
  );

  /**
   * Majorスケールの各度数から派生するモードの定義
   * 度数とモード名の対応を1箇所に集約し、保守性を向上させる
   * @internal この定数はMajorスケールパターンに固有の知識
   */
  static readonly MAJOR_MODE_DEFINITIONS = {
    1: { name: 'Major', symbol: '' },
    2: { name: 'Dorian', symbol: 'dor' },
    3: { name: 'Phrygian', symbol: 'phr' },
    4: { name: 'Lydian', symbol: 'lyd' },
    5: { name: 'Mixolydian', symbol: 'mix' },
    6: { name: 'Minor', symbol: 'm' },
    7: { name: 'Locrian', symbol: 'loc' },
  } as const;

  // 2. Majorパターンのインスタンスメソッドを呼び出して各モードを導出
  static readonly Dorian = ScalePattern.Major.derive(
    2,
    ScalePattern.MAJOR_MODE_DEFINITIONS[2].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[2].symbol
  );
  static readonly Phrygian = ScalePattern.Major.derive(
    3,
    ScalePattern.MAJOR_MODE_DEFINITIONS[3].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[3].symbol
  );
  static readonly Lydian = ScalePattern.Major.derive(
    4,
    ScalePattern.MAJOR_MODE_DEFINITIONS[4].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[4].symbol
  );
  static readonly Mixolydian = ScalePattern.Major.derive(
    5,
    ScalePattern.MAJOR_MODE_DEFINITIONS[5].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[5].symbol
  );
  static readonly Aeolian = ScalePattern.Major.derive(
    6,
    ScalePattern.MAJOR_MODE_DEFINITIONS[6].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[6].symbol
  );
  static readonly Locrian = ScalePattern.Major.derive(
    7,
    ScalePattern.MAJOR_MODE_DEFINITIONS[7].name,
    ScalePattern.MAJOR_MODE_DEFINITIONS[7].symbol
  );

  /**
   * Majorスケールから派生するモードを導出度数順に並べた配列
   * インデックス0がIonian(Major)、1がDorian、...、6がLocrianに対応
   * @internal Majorスケールの構造的知識
   */
  static readonly MAJOR_MODES_BY_DEGREE = [
    ScalePattern.Major, // 1度
    ScalePattern.Dorian, // 2度
    ScalePattern.Phrygian, // 3度
    ScalePattern.Lydian, // 4度
    ScalePattern.Mixolydian, // 5度
    ScalePattern.Aeolian, // 6度
    ScalePattern.Locrian, // 7度
  ] as const;

  /**
   * Majorスケールから派生するモードを明るさ順（五度圏/調号順）に並べた配列
   * Lydian(最も明るい/♯側)からLocrian(最も暗い/♭側)への順序
   * 音楽理論的には、各モードが持つ調号の数の順序に対応
   * @internal Majorスケールの音楽理論的性質
   */
  static readonly MAJOR_MODES_BY_BRIGHTNESS = [
    ScalePattern.Lydian,
    ScalePattern.Major,
    ScalePattern.Mixolydian,
    ScalePattern.Dorian,
    ScalePattern.Aeolian,
    ScalePattern.Phrygian,
    ScalePattern.Locrian,
  ] as const;

  /**
   * このスケールパターンが長3度を含むかどうか
   * keyName生成時の調号選択（♭ vs #）の基準として使用
   */
  get hasMajorThird(): boolean {
    const intervalsFromRoot = this.getIntervalsFromRoot();
    return intervalsFromRoot.has(Interval.MajorThird.semitones);
  }

  /**
   * ルートからの各音のインターバル（半音数）を配列として取得（0を含む）
   * @returns 半音インデックス配列（例: Majorスケール = [0, 2, 4, 5, 7, 9, 11, 12]）
   */
  public getIntervalsFromRootAsArray(): number[] {
    return [0, ...Array.from(this.getIntervalsFromRoot())];
  }

  /**
   * ルートからの各音を五度圏インデックスの配列として取得
   * Circle of Fifthsでの可視化などに使用
   * オクターブ（12半音=0 in fifths）は除外され、スケールの7音のみを返す
   * @returns 五度圏インデックス配列（例: Majorスケール = [0, 2, 4, 11, 1, 3, 5]）
   * @example
   * ScalePattern.Major.getFifthsIndexArrayFromRoot()
   * // [0, 2, 4, 11, 1, 3, 5]
   * // C=0, D=2, E=4, F=11, G=1, A=3, B=5 (in Circle of Fifths order)
   */
  public getFifthsIndexArrayFromRoot(): number[] {
    // getIntervalsFromRootAsArray()はオクターブ(12)を含むため、それを除外
    const intervals = this.getIntervalsFromRootAsArray().filter(semitones => semitones < 12);
    return intervals.map(semitones => PitchClass.semitonesToFifthsIndex(semitones));
  }

  /**
   * ルートからの各音のインターバル（半音数）をセットとして取得（0は含まない）
   * hasMajorThirdとdetermineQualityで共通利用
   */
  private getIntervalsFromRoot(): Set<number> {
    const intervalsFromRoot = new Set<number>();
    let cumulativeSemitones = 0;
    for (const interval of this.intervals) {
      cumulativeSemitones += interval.semitones;
      intervalsFromRoot.add(cumulativeSemitones);
    }
    return intervalsFromRoot;
  }

  /**
   * インターバル配列から自身の基本的な性質（Major/Minorなど）を判定する
   */
  private determineQuality(): ScaleQuality {
    const intervalsFromRoot = this.getIntervalsFromRoot();

    // セットに特定のインターバルが含まれているかチェックする
    const hasMajorThird = intervalsFromRoot.has(Interval.MajorThird.semitones);
    const hasMinorThird = intervalsFromRoot.has(Interval.MinorThird.semitones);
    const hasPerfectFifth = intervalsFromRoot.has(Interval.PerfectFifth.semitones);
    const hasDiminishedFifth = intervalsFromRoot.has(Interval.Tritone.semitones);

    if (hasMajorThird && hasPerfectFifth) return 'major';
    if (hasMinorThird && hasPerfectFifth) return 'minor';
    if (hasMinorThird && hasDiminishedFifth) return 'diminished';

    return 'other'; // 上記のいずれでもない場合
  }
}
