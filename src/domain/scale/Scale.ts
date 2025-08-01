/**
 * Scale集約
 *
 * 具体的な音階を表現する集約。
 * PitchClass（主音）とScalePattern（設計図）の組み合わせで構成される。
 *
 * 設計思想：
 * - 特定の土地に特定の様式で建てられた具体的な建物
 * - 具体的な PitchClass の集合を管理し、実用的な音楽操作を提供
 * - 度数での音高クラスの取得、移調などの実務的な機能を担う
 */

import { PitchClass } from '../common/PitchClass';
import { ScalePattern } from '../common/ScalePattern';

import { Interval } from '../common/Interval';

/**
 * 音階の集約
 *
 * 主音（PitchClass）と音階パターン（ScalePattern）から構成され、
 * 具体的な音の集合と音楽的操作を提供する。
 */
export class Scale {
  constructor(
    private readonly _root: PitchClass,
    private readonly _pattern: ScalePattern
  ) {
    this.validateScale();
  }

  /**
   * 主音（ルート）を取得
   */
  get root(): PitchClass {
    return this._root;
  }

  /**
   * 音階パターンを取得
   */
  get pattern(): ScalePattern {
    return this._pattern;
  }

  /**
   * パターンタイプを取得（便利メソッド）
   */
  get type(): string {
    return this._pattern.type;
  }

  /**
   * 音程配列を取得（便利メソッド）
   */
  get intervals(): readonly Interval[] {
    return this._pattern.intervals;
  }

  /**
   * 音階の長さ（音数）を取得
   */
  get length(): number {
    return this._pattern.length;
  }

  /**
   * この音階の音高クラス配列を取得
   */
  getPitchClasses(): PitchClass[] {
    return this._pattern.intervals.map(interval => this._root.transpose(interval.semitones));
  }

  /**
   * 指定した度数の音高クラスを取得
   */
  getPitchClassAtDegree(degree: number): PitchClass {
    if (degree < 1 || degree > this._pattern.length) {
      throw new Error(`Invalid degree: ${degree}. Must be between 1 and ${this._pattern.length}`);
    }

    const interval = this._pattern.intervals[degree - 1]; // 1-indexedから0-indexedに変換
    return this._root.transpose(interval.semitones);
  }

  /**
   * 指定したPitchClassがこの音階に含まれるかチェック
   */
  contains(pitchClass: PitchClass): boolean {
    const scalePitchClasses = this.getPitchClasses();
    return scalePitchClasses.some(scalePitchClass => scalePitchClass.equals(pitchClass));
  }

  /**
   * この音階を指定したセミトーン数だけ移調
   */
  transpose(semitones: number): Scale {
    const newRoot = this._root.transpose(semitones);
    return new Scale(newRoot, this._pattern);
  }

  /**
   * メジャースケールかどうか判定
   */
  get isMajor(): boolean {
    return this._pattern.type === 'Major';
  }

  /**
   * マイナースケールかどうか判定
   */
  get isMinor(): boolean {
    return this._pattern.type === 'Minor';
  }

  /**
   * モードかどうか判定
   */
  get isMode(): boolean {
    return this._pattern.isMode();
  }

  /**
   * 7音階かどうか判定
   */
  get isHeptatonic(): boolean {
    return this._pattern.isHeptatonic();
  }

  /**
   * ペンタトニックかどうか判定
   */
  get isPentatonic(): boolean {
    return this._pattern.isPentatonic();
  }

  /**
   * 表示名を取得
   */
  getDisplayName(): string {
    return `${this._root.name} ${this._pattern.getDisplayName()}`;
  }

  /**
   * 短縮表示名を取得
   */
  getShortName(): string {
    return `${this._root.name}${this._pattern.getShortName()}`;
  }

  /**
   * セミトーンパターンを取得（分析用）
   */
  getSemitonePattern(): number[] {
    return this._pattern.getSemitonePattern();
  }

  /**
   * 等価性判定
   */
  equals(other: Scale): boolean {
    return this._root.equals(other._root) && this._pattern.equals(other._pattern);
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.getDisplayName();
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): {
    root: { name: import('../common/PitchClass').PitchClassName };
    pattern: {
      name: string;
      type: import('../common/ScalePattern').ScalePatternType;
      intervals: number[];
    };
  } {
    return {
      root: this._root.toJSON(),
      pattern: this._pattern.toJSON(),
    };
  }

  /**
   * C Major スケールを作成
   */
  static cMajor(): Scale {
    return new Scale(new PitchClass('C'), ScalePattern.Major);
  }

  /**
   * A Minor スケールを作成
   */
  static aMinor(): Scale {
    return new Scale(new PitchClass('A'), ScalePattern.Minor);
  }

  /**
   * メジャースケールを作成
   */
  static major(root: PitchClass): Scale {
    return new Scale(root, ScalePattern.Major);
  }

  /**
   * マイナースケールを作成
   */
  static minor(root: PitchClass): Scale {
    return new Scale(root, ScalePattern.Minor);
  }

  /**
   * ドリアンモードを作成
   */
  static dorian(root: PitchClass): Scale {
    return new Scale(root, ScalePattern.Dorian);
  }

  /**
   * 任意のパターンでスケールを作成
   */
  static fromPattern(root: PitchClass, pattern: ScalePattern): Scale {
    return new Scale(root, pattern);
  }

  /**
   * デフォルトスケール（C Major）を取得
   */
  static getDefault(): Scale {
    return Scale.cMajor();
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: {
    root: { name: import('../common/PitchClass').PitchClassName };
    pattern: {
      name: string;
      type: import('../common/ScalePattern').ScalePatternType;
      intervals: number[];
    };
  }): Scale {
    const root = PitchClass.fromJSON(json.root);
    const pattern = ScalePattern.fromJSON(json.pattern);
    return new Scale(root, pattern);
  }

  /**
   * 音階の妥当性検証
   */
  private validateScale(): void {
    if (!this._root) {
      throw new Error('Scale must have a root PitchClass');
    }
    if (!this._pattern) {
      throw new Error('Scale must have a ScalePattern');
    }
  }
}
