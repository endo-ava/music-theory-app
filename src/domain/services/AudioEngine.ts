/**
 * リアル音源対応の音響エンジン
 */

import * as Tone from 'tone';
import { Note, PitchClass } from '../common';
import { Chord } from '../chord';
import { Scale } from '../scale';

/**
 * 音響アセット設定
 */

/**
 * ピアノサンプル音源のURL設定
 * 本番環境では独自のアセットに置き換え可能
 */
export const PIANO_SAMPLE_URLS = {
  C4: 'https://tonejs.github.io/audio/salamander/C4.mp3',
  'D#4': 'https://tonejs.github.io/audio/salamander/Ds4.mp3',
  'F#4': 'https://tonejs.github.io/audio/salamander/Fs4.mp3',
  A4: 'https://tonejs.github.io/audio/salamander/A4.mp3',
} as const;

/**
 * サンプラーの基本設定
 */
export const SAMPLER_CONFIG = {
  /** サンプル音源のURLマップ */
  urls: PIANO_SAMPLE_URLS,
  /** リリース時間（秒） */
  release: 1,
  /** ベースURL（相対パス使用時） */
  baseUrl: '',
} as const;

/**
 * 音響エンジン - リアルなピアノサンプルを使用
 */
export class AudioEngine {
  private static sampler: Tone.Sampler | null = null;

  // 設定オプション
  private static config = {
    volume: -10, // 音量 (dB)
    arpeggioDelay: 100, // アルペジオ間隔 (ms)
    arpeggioDelaySlow: 150, // アルペジオ間隔 (ms)
    release: 1.5, // ノートの長さ (秒)
  };

  /**
   * 音量設定
   */
  static setVolume(db: number): void {
    this.config.volume = db;
    if (this.sampler) {
      this.sampler.volume.value = db;
    }
  }

  /**
   * アルペジオ速度設定
   */
  static setArpeggioSpeed(ms: number): void {
    this.config.arpeggioDelay = Math.max(50, Math.min(500, ms)); // 50-500ms制限
  }

  /**
   * 与えられた音源をアルペジオで再生
   * @param source 単音、コード、スケールのいずれか
   */
  static async play(source: Note | Chord | Scale): Promise<void> {
    await this.ensureSampler();
    // sourceの種類に応じて、再生すべきNote配列を解決する
    const notesToPlay = this.resolveNotes(source);
    // scaleならdelay多め
    const delay =
      source instanceof Scale ? this.config.arpeggioDelaySlow : this.config.arpeggioDelay;

    // アルペジオ再生
    notesToPlay.forEach((note, i) => {
      setTimeout(() => {
        if (this.sampler) {
          // 開発環境でのみログ出力
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `🎹 Playing note: ${note.toString} (delay: ${i * this.config.arpeggioDelay}ms)`
            );
          }

          this.sampler.triggerAttackRelease(note.toString, this.config.release);
        }
      }, i * delay);
    });
  }

  /**
   * 最終的に再生するNote配列を解決する
   */
  private static resolveNotes(source: Note | Chord | Scale): readonly Note[] {
    // Noteインスタンスの場合
    if (source instanceof Note) {
      return [source];
    }
    // Chordインスタンス場合
    if (source instanceof Chord) {
      const rootPitchClass = source.rootNote._pitchClass;
      const optimalOctave = this.getOptimalOctave(rootPitchClass);
      return Chord.from(new Note(rootPitchClass, optimalOctave), source.quality).getNotes();
    }
    // Scaleインスタンスの場合
    if (source instanceof Scale) {
      const rootPitchClass = source.root;
      const optimalOctave = this.getOptimalOctave(rootPitchClass);
      return new Scale(source.root, source.pattern, optimalOctave).getNotes();
    }

    throw new Error('Unsupported playable source');
  }

  /**
   * 音楽理論的に最適なオクターブを取得する
   * G# (index: 8) 以上の音は3オクターブ、それ以下は4オクターブ
   * @param pitchClass 対象のピッチクラス
   * @returns 最適なオクターブ値
   */
  private static getOptimalOctave(pitchClass: PitchClass): number {
    return pitchClass.index >= 8 ? 3 : 4;
  }

  /**
   * ピアノサンプラーの準備
   */
  private static async ensureSampler(): Promise<void> {
    if (this.sampler) return;

    // Tone.js開始（ユーザー操作時）
    const REQUIRED_CONTEXT_STATE = 'running' as const;
    if (Tone.getContext().state !== REQUIRED_CONTEXT_STATE) {
      await Tone.start();
    }

    // ピアノサンプラー作成（設定ファイルから音源URL取得）
    return new Promise<void>(resolve => {
      this.sampler = new Tone.Sampler({
        urls: SAMPLER_CONFIG.urls,
        release: SAMPLER_CONFIG.release,
        baseUrl: SAMPLER_CONFIG.baseUrl,
        onload: () => {
          if (this.sampler) {
            this.sampler.volume.value = this.config.volume;
          }
          resolve();
        },
      }).toDestination();
    });
  }
}
