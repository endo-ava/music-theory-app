/**
 * ModeService ドメインサービス
 *
 * ある ScalePattern から新しい ScalePattern を導出するための操作を提供する。
 * 「メジャーパターンの2番目から始めるとドリアンパターンが生まれる」という
 * 音楽理論のルールをカプセル化する。
 *
 * 設計思想：
 * - 建築様式を考案する建築家のように、パターンの変換ルールを知る専門家
 * - チャーチモードの生成や、既存パターンからの派生を担当
 * - 音楽理論の深い知識を持つドメインサービス
 */

import { ScalePattern, type ScalePatternType } from '../common/ScalePattern';
import { Interval } from '../common/Interval';

/**
 * チャーチモードの種類と対応する度数
 */
export type ChurchMode = {
  name: string;
  type: ScalePatternType;
  degree: number; // メジャースケールの何度から始まるか（1-7）
};

/**
 * モード導出のためのドメインサービス
 *
 * ScalePatternから新しいScalePatternを生成する操作を提供し、
 * 音楽理論におけるモードの概念を実装する。
 */
export class ModeService {
  /**
   * チャーチモードの定義
   */
  private static readonly CHURCH_MODES: ChurchMode[] = [
    { name: 'Ionian', type: 'Major', degree: 1 }, // メジャー
    { name: 'Dorian', type: 'Dorian', degree: 2 }, // ドリアン
    { name: 'Phrygian', type: 'Phrygian', degree: 3 }, // フリジアン
    { name: 'Lydian', type: 'Lydian', degree: 4 }, // リディアン
    { name: 'Mixolydian', type: 'Mixolydian', degree: 5 }, // ミクソリディアン
    { name: 'Aeolian', type: 'Minor', degree: 6 }, // ナチュラルマイナー
    { name: 'Locrian', type: 'Locrian', degree: 7 }, // ロクリアン
  ];

  /**
   * 指定した度数から新しいパターンを導出
   *
   * @param basePattern 元となるパターン
   * @param startDegree 開始度数（1-based）
   * @param newName 新しいパターンの名前
   * @param newType 新しいパターンのタイプ
   * @returns 導出されたパターン
   */
  /**
   * 基準パターンから指定度数で新しいパターンを導出（短縮版）
   */
  static derive(basePattern: ScalePattern, startDegree: number, newName: string): ScalePattern {
    // パターンタイプを度数から推定
    const churchMode = this.CHURCH_MODES.find(mode => mode.degree === startDegree);
    const newType = churchMode?.type || 'Major'; // デフォルトはMajor

    return this.deriveFromDegree(basePattern, startDegree, newName, newType);
  }

  static deriveFromDegree(
    basePattern: ScalePattern,
    startDegree: number,
    newName: string,
    newType: ScalePatternType
  ): ScalePattern {
    if (startDegree < 1 || startDegree > basePattern.length) {
      throw new Error(
        `Invalid start degree: ${startDegree}. Must be between 1 and ${basePattern.length}`
      );
    }

    // 指定した度数から始まる新しい音程配列を構築
    const baseIntervals = basePattern.intervals;
    const startIndex = startDegree - 1; // 1-indexedから0-indexedに変換

    // 元パターンの開始点のセミトーン数を取得
    const startSemitones = baseIntervals[startIndex].semitones;

    // 新しい音程配列を計算
    const newIntervals: Interval[] = [];

    // 最初は必ずユニゾン
    newIntervals.push(Interval.unison());

    // 残りの音程を計算
    for (let i = 1; i < basePattern.length; i++) {
      const currentIndex = (startIndex + i) % basePattern.length;
      let currentSemitones = baseIntervals[currentIndex].semitones - startSemitones;

      // 負の値の場合はオクターブを加算
      if (currentSemitones < 0) {
        currentSemitones += 12;
      }

      // 既存の音程を超えない範囲でオクターブを正規化
      currentSemitones = currentSemitones % 12;

      newIntervals.push(Interval.fromSemitones(currentSemitones));
    }

    // 音程を昇順にソート
    newIntervals.sort((a, b) => a.semitones - b.semitones);

    return new ScalePattern(newName, newType, newIntervals);
  }

  /**
   * メジャースケールから指定したチャーチモードを生成
   *
   * @param churchModeName チャーチモード名
   * @returns 生成されたモードパターン
   */
  static generateChurchMode(churchModeName: string): ScalePattern {
    const mode = this.CHURCH_MODES.find(m => m.name === churchModeName);
    if (!mode) {
      throw new Error(`Unknown church mode: ${churchModeName}`);
    }

    // メジャーパターンを基準として、各モードを度数から導出
    const majorPattern = ScalePattern.Major;

    switch (mode.type) {
      case 'Major':
        return ScalePattern.Major;
      case 'Minor':
        return ScalePattern.Minor;
      case 'Dorian':
        return ScalePattern.Dorian;
      case 'Phrygian':
        return ScalePattern.Phrygian;
      case 'Lydian':
        return ScalePattern.Lydian;
      case 'Mixolydian':
        return ScalePattern.Mixolydian;
      case 'Locrian':
        return ScalePattern.Locrian;
      default:
        // その他のモードは導出で生成
        return this.deriveFromDegree(majorPattern, mode.degree, `${mode.name} Mode`, mode.type);
    }
  }

  /**
   * すべてのチャーチモードを生成
   *
   * @returns 7つのチャーチモードの配列
   */
  static generateAllChurchModes(): ScalePattern[] {
    return this.CHURCH_MODES.map(mode => this.generateChurchMode(mode.name));
  }

  /**
   * チャーチモードの情報を取得
   *
   * @returns チャーチモードの定義配列
   */
  static getChurchModeDefinitions(): ChurchMode[] {
    return [...this.CHURCH_MODES]; // コピーを返して不変性を保つ
  }

  /**
   * 指定したパターンがどのチャーチモードかを判定
   *
   * @param pattern 判定するパターン
   * @returns マッチするチャーチモード情報、見つからない場合はnull
   */
  static identifyChurchMode(pattern: ScalePattern): ChurchMode | null {
    // まずタイプで直接マッチを試行
    const directMatch = this.CHURCH_MODES.find(mode => mode.type === pattern.type);
    if (directMatch) {
      // セミトーンパターンも一致するか確認
      const modePattern = this.generateChurchMode(directMatch.name);
      if (pattern.getSemitonePattern().join(',') === modePattern.getSemitonePattern().join(',')) {
        return directMatch;
      }
    }

    // タイプが一致しない場合は、セミトーンパターンで判定
    for (const mode of this.CHURCH_MODES) {
      const modePattern = this.generateChurchMode(mode.name);
      if (pattern.getSemitonePattern().join(',') === modePattern.getSemitonePattern().join(',')) {
        return mode;
      }
    }

    return null;
  }

  /**
   * パターンを指定した度数だけ回転（循環）
   *
   * @param pattern 元のパターン
   * @param steps 回転ステップ数（正の値で右回転、負の値で左回転）
   * @returns 回転後のパターン
   */
  static rotatePattern(pattern: ScalePattern, steps: number): ScalePattern {
    const normalizedSteps = ((steps % pattern.length) + pattern.length) % pattern.length;

    if (normalizedSteps === 0) {
      return pattern; // 回転しない場合は元のパターンをそのまま返す
    }

    const startDegree = normalizedSteps + 1; // 0-indexedから1-indexedに変換
    return this.deriveFromDegree(pattern, startDegree, `Rotated ${pattern.name}`, pattern.type);
  }

  /**
   * 2つのパターンが回転関係にあるかチェック
   *
   * @param pattern1 第一のパターン
   * @param pattern2 第二のパターン
   * @returns 回転関係にある場合はtrue
   */
  static areRotationRelated(pattern1: ScalePattern, pattern2: ScalePattern): boolean {
    if (pattern1.length !== pattern2.length) {
      return false;
    }

    // すべての可能な回転を試行
    for (let i = 0; i < pattern1.length; i++) {
      const rotated = this.rotatePattern(pattern1, i);
      if (rotated.getSemitonePattern().join(',') === pattern2.getSemitonePattern().join(',')) {
        return true;
      }
    }

    return false;
  }

  /**
   * パターンの明度（明るさ）を数値で取得
   * メジャー系を高く、マイナー系を低く評価
   *
   * @param pattern 評価するパターン
   * @returns 明度値（高いほど明るい）
   */
  static getBrightnessValue(pattern: ScalePattern): number {
    const brightnessMap: Partial<Record<ScalePatternType, number>> = {
      Lydian: 6, // 最も明るい
      Major: 5, // 明るい
      Mixolydian: 4, // やや明るい
      Dorian: 3, // 中間
      Minor: 2, // やや暗い
      Phrygian: 1, // 暗い
      Locrian: 0, // 最も暗い
    };

    return brightnessMap[pattern.type] ?? 3; // デフォルトは中間値
  }

  /**
   * パターンを明度順でソート
   *
   * @param patterns ソートするパターン配列
   * @param ascending trueで昇順（暗い→明るい）、falseで降順（明るい→暗い）
   * @returns ソート済みパターン配列
   */
  static sortByBrightness(patterns: ScalePattern[], ascending: boolean = true): ScalePattern[] {
    return [...patterns].sort((a, b) => {
      const valueA = this.getBrightnessValue(a);
      const valueB = this.getBrightnessValue(b);
      return ascending ? valueA - valueB : valueB - valueA;
    });
  }
}
