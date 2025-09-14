import { Key } from '..'; // Removed ScalePattern - using Key factory methods now;
import { Chord } from '../chord';
import { Interval, Note, PitchClass } from '../common';

// --- 定数と型定義 ---

// 説明不能な数字は、意味のある名前を付けた定数にする
const JUMP_COST = 4;
const UNUSED_NOTE_PENALTY = 3;

interface FunctionalNuclei {
  primary: Interval[];
  secondary: Interval[];
}

interface TonalKey {
  nuclei: {
    tonic: FunctionalNuclei;
    subdominant: FunctionalNuclei;
    dominant: FunctionalNuclei;
  };
}
// Cメジャーキーの新しい定義

const _majorKeyHierarchical: TonalKey = {
  // root: PitchClass.C,

  nuclei: {
    tonic: {
      primary: [Interval.Root], // {1}
      secondary: [Interval.MajorThird, Interval.PerfectFifth], // {3, 5}
    },
    subdominant: {
      primary: [Interval.PerfectFourth], // {4}
      secondary: [Interval.MajorSixth, Interval.MajorSecond], // {6, 2}
    },
    dominant: {
      primary: [Interval.PerfectFourth, Interval.MajorSeventh], // {4, 7}
      secondary: [Interval.PerfectFifth], // {5}
    },
  },
};
// --- ChordAnalyzerクラス ---

export class ChordAnalyzer {
  private key: TonalKey;

  constructor(key: TonalKey) {
    this.key = key;
  }

  /**
   * 調性的引力を計算する
   */
  public calculateGravity(chord: Chord, keyRoot: PitchClass) {
    const { tonic, subdominant, dominant } = this.key.nuclei;

    // 各機能のスコアを計算
    const tScore = this.getGravityScore(chord, keyRoot, tonic);
    const sdScore = this.getGravityScore(chord, keyRoot, subdominant);
    const dScore = this.getGravityScore(chord, keyRoot, dominant);

    // 正規化して返す
    const total = tScore + sdScore + dScore;
    if (total === 0) {
      return { tonic: 0, subdominant: 0, dominant: 0 };
    }
    return {
      tonic: tScore / total,
      subdominant: sdScore / total,
      dominant: dScore / total,
    };
  }

  /**
   * 音声的慣性を計算する
   * @description
   * 注意：この実装は「貪欲法」であり、必ずしも最適解を保証しない。
   * より正確な結果のためには、ハンガリアン法などの割当問題を解くアルゴリズムが必要。
   */
  public calculateInertia(sourceChord: Chord, targetChord: Chord): number {
    const sourceNotes = sourceChord.constituentNotes;
    const targetNotes = targetChord.constituentNotes;

    const [smaller, larger] =
      sourceNotes.length < targetNotes.length
        ? [sourceNotes, targetNotes]
        : [targetNotes, sourceNotes];

    let totalCost = 0;
    const usedLargerIndexes = new Set<number>();

    for (const sNote of smaller) {
      const { cost, index } = this.findBestConnection(sNote, larger as Note[], usedLargerIndexes);
      totalCost += cost;
      if (index !== -1) {
        usedLargerIndexes.add(index);
      }
    }

    const unusedCount = larger.length - smaller.length;
    totalCost += unusedCount * UNUSED_NOTE_PENALTY;

    return 1 / (1 + totalCost);
  }

  // --- プライベートヘルパーメソッド ---

  /**
   * 特定の機能核に対する引力スコアを算出する
   */
  private getGravityScore(
    chord: Chord,
    keyRoot: PitchClass,
    targetNuclei: FunctionalNuclei
  ): number {
    let score = 0;
    const intervalsFromKey = chord.getIntervalsFromKey(keyRoot);

    // 比較を効率化するため、核の半音数をSetに変換しておく
    const primarySemitones = new Set(targetNuclei.primary.map(iv => iv.semitones));
    const secondarySemitones = new Set(targetNuclei.secondary.map(iv => iv.semitones));

    for (const interval of intervalsFromKey) {
      if (primarySemitones.has(interval.semitones)) {
        score += 3;
      } else if (secondarySemitones.has(interval.semitones)) {
        score += 1;
      }
    }
    return score;
  }

  /**
   * 1つの音符に対する最適な接続先（最小コスト）を見つける
   */
  private findBestConnection(
    sourceNote: Note,
    targetNotes: Note[],
    usedIndexes: Set<number>
  ): { cost: number; index: number } {
    let minCost = Infinity;
    let bestIndex = -1;

    targetNotes.forEach((tNote, i) => {
      if (usedIndexes.has(i)) return;

      const cost = this.getVoiceLeadingCost(sourceNote, tNote);
      if (cost < minCost) {
        minCost = cost;
        bestIndex = i;
      }
    });

    return { cost: minCost, index: bestIndex };
  }

  /**
   * 2音間のボイスリーディングコストを計算する
   */
  private getVoiceLeadingCost(n1: Note, n2: Note): number {
    const diff = Math.abs(n1._pitchClass.index - n2._pitchClass.index);
    const dist = Math.min(diff, 12 - diff);

    if (dist === 0) return 0; // 共通音
    if (dist === 1) return 1; // 半音進行
    if (dist === 2) return 2; // 全音進行
    return JUMP_COST; // それ以上
  }
}

/**
 * 責務の分離：分析結果を表示する関数
 */
export function printAnalysis(
  analyzer: ChordAnalyzer,
  chord: Chord,
  nextChord: Chord,
  keyRoot: PitchClass
) {
  const gravity = analyzer.calculateGravity(chord, keyRoot);
  const inertia = analyzer.calculateInertia(chord, nextChord);
  const cMajor = Key.major(PitchClass.C);

  console.log(
    `--- Analysis for Chord [${chord.getNameFor(cMajor)}] in Key [${keyRoot.sharpName}] ---`
  );
  console.log(`Tonal Gravity:`);
  console.log(`  - Tonic:       ${(gravity.tonic * 100).toFixed(1)}%`);
  console.log(`  - Subdominant: ${(gravity.subdominant * 100).toFixed(1)}%`);
  console.log(`  - Dominant:    ${(gravity.dominant * 100).toFixed(1)}%`);
  console.log(
    `Voice-Leading Inertia (to [${nextChord.getNameFor(cMajor)}]): ${inertia.toFixed(3)}`
  );
  console.log(`------------------------------------`);
}

// // --- 実行デモ ---
// const analyzer = new ChordAnalyzer(majorKeyHierarchical);

// // Case 1: G7 -> Cmaj7 (典型的なドミナントモーション)
// const G7: Chord = Chord.from(new Note(PitchClass.G, 4), ChordPattern.DominantSeventh);
// const C: Chord = Chord.from(new Note(PitchClass.C, 4), ChordPattern.MajorTriad);

// printAnalysis(analyzer, G7, C, PitchClass.C);
// // 予想される結果: Dominantの引力が非常に高く、Cmaj7への慣性も強い

// // Case 2: Db7 -> Cmaj7 (裏コード)
// const Db7: Chord = Chord.from(new Note(PitchClass.CSharp, 4), ChordPattern.DominantSeventh);
// printAnalysis(analyzer, Db7, C, PitchClass.C);

// // // 予想される結果: G7と同じくDominantの核(F,B)を持つため、引力はDominantに。さらに半音進行が多いため慣性も非常に強いはず。

// // // Case 3: C#dim -> Dm7 (経過和音)
// const CsharpDim: Chord = Chord.from(new Note(PitchClass.DSharp, 4), ChordPattern.DiminishedTriad);
// const Dm7: Chord = Chord.from(new Note(PitchClass.D, 4), ChordPattern.MinorSeventh);
// // // Dm7の構成音に合わせてC#dim7も4和音にするとより正確
// // const CsharpDim7_4: Chord = [noteToPitchClass('C#'), noteToPitchClass('E'), noteToPitchClass('G'), noteToPitchClass('Bb')];
// printAnalysis(analyzer, CsharpDim, Dm7, PitchClass.C);

// // 予想される結果: 引力はどの機能にも偏らないが、Dm7への慣性が非常に強いはず。

// const FSharpM7: Chord = Chord.from(new Note(PitchClass.FSharp, 4), ChordPattern.MajorSeventh);
// printAnalysis(analyzer, C, FSharpM7, PitchClass.C);
