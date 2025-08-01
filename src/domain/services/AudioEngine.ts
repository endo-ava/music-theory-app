/**
 * リアル音源対応の音響エンジン
 */

import * as Tone from 'tone';
import { Chord } from '../chord';

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
  static config = {
    volume: -10, // 音量 (dB)
    arpeggioDelay: 100, // アルペジオ間隔 (ms)
    release: 1.5, // ノートの長さ (秒)
  };

  /**
   * 和音をアルペジオで再生
   */
  static async playChord(chord: Chord): Promise<void> {
    await this.ensureSampler();

    const notes = chord.toneNotations;

    // アルペジオ再生
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.sampler) {
          // 開発環境でのみログ出力
          if (process.env.NODE_ENV === 'development') {
            console.log(`🎹 Playing note: ${note} (delay: ${i * this.config.arpeggioDelay}ms)`);
          }

          this.sampler.triggerAttackRelease(note, this.config.release);
        }
      }, i * this.config.arpeggioDelay);
    });
  }

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
