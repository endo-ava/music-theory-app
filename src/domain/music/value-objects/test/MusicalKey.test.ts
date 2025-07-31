import { describe, it, expect } from 'vitest';
import { MusicalKey } from '../MusicalKey';
import { Note } from '../Note';
import { Scale } from '../Scale';

describe('MusicalKey', () => {
  describe('調の作成', () => {
    it('メジャーキーを作成できる', () => {
      const root = new Note('C', 4);
      const musicalKey = MusicalKey.major(root);

      expect(musicalKey.root.noteName).toBe('C');
      expect(musicalKey.root.octave).toBe(4);
      expect(musicalKey.isMajor).toBe(true);
      expect(musicalKey.isMinor).toBe(false);
    });

    it('マイナーキーを作成できる', () => {
      const root = new Note('A', 4);
      const musicalKey = MusicalKey.minor(root);

      expect(musicalKey.root.noteName).toBe('A');
      expect(musicalKey.isMinor).toBe(true);
      expect(musicalKey.isMajor).toBe(false);
    });

    it('キー名文字列からメジャーキーを作成できる', () => {
      const musicalKey = MusicalKey.fromKeyName('G');

      expect(musicalKey.root.noteName).toBe('G');
      expect(musicalKey.isMajor).toBe(true);
    });

    it('キー名文字列からマイナーキーを作成できる', () => {
      const musicalKey = MusicalKey.fromKeyName('Em');

      expect(musicalKey.root.noteName).toBe('E');
      expect(musicalKey.isMinor).toBe(true);
    });

    it('無効なメジャーキー名でエラーが発生する', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => MusicalKey.fromKeyName('X' as any)).toThrow('Invalid major key name: X');
    });

    it('無効なマイナーキー名でエラーが発生する', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => MusicalKey.fromKeyName('Xm' as any)).toThrow('Invalid minor key name: Xm');
    });

    it('カスタムスケールから調を作成できる', () => {
      const root = new Note('D', 4);
      const scale = Scale.minor();
      const musicalKey = MusicalKey.fromScale(root, scale);

      expect(musicalKey.root.noteName).toBe('D');
      expect(musicalKey.scale.type).toBe('minor');
    });
  });

  describe('デフォルト調', () => {
    it('デフォルト調はC Majorである', () => {
      const defaultKey = MusicalKey.getDefault();

      expect(defaultKey.root.noteName).toBe('C');
      expect(defaultKey.isMajor).toBe(true);
    });
  });

  describe('表示名とフォーマット', () => {
    it('メジャーキーの表示名を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('F#');
      expect(musicalKey.getDisplayName()).toBe('F# Major');
    });

    it('マイナーキーの表示名を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('Dm');
      expect(musicalKey.getDisplayName()).toBe('D Minor');
    });

    it('メジャーキーの省略表記を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('G');
      expect(musicalKey.getShortName()).toBe('G');
    });

    it('マイナーキーの省略表記を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('Am');
      expect(musicalKey.getShortName()).toBe('Am');
    });

    it('toString()で表示名を取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('D');
      expect(musicalKey.toString()).toBe('D Major');
    });
  });

  describe('調に含まれる音符', () => {
    it('Cメジャーキーの音符を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('C');
      const notes = musicalKey.getNotes();

      expect(notes).toHaveLength(7);
      expect(notes[0].noteName).toBe('C'); // 1度
      expect(notes[1].noteName).toBe('D'); // 2度
      expect(notes[2].noteName).toBe('E'); // 3度
      expect(notes[3].noteName).toBe('F'); // 4度
      expect(notes[4].noteName).toBe('G'); // 5度
      expect(notes[5].noteName).toBe('A'); // 6度
      expect(notes[6].noteName).toBe('B'); // 7度
    });

    it('Aマイナーキーの音符を正しく取得できる', () => {
      const musicalKey = MusicalKey.fromKeyName('Am');
      const notes = musicalKey.getNotes();

      expect(notes).toHaveLength(7);
      expect(notes[0].noteName).toBe('A'); // 1度
      expect(notes[1].noteName).toBe('B'); // 2度
      expect(notes[2].noteName).toBe('C'); // 3度
      expect(notes[3].noteName).toBe('D'); // 4度
      expect(notes[4].noteName).toBe('E'); // 5度
      expect(notes[5].noteName).toBe('F'); // 6度
      expect(notes[6].noteName).toBe('G'); // 7度
    });
  });

  describe('等価性判定', () => {
    it('同じ調は等価である', () => {
      const key1 = MusicalKey.fromKeyName('C');
      const key2 = MusicalKey.fromKeyName('C');

      expect(key1.equals(key2)).toBe(true);
    });

    it('異なるルート音の調は等価でない', () => {
      const key1 = MusicalKey.fromKeyName('C');
      const key2 = MusicalKey.fromKeyName('G');

      expect(key1.equals(key2)).toBe(false);
    });

    it('異なるスケールタイプの調は等価でない', () => {
      const key1 = MusicalKey.fromKeyName('C');
      const key2 = MusicalKey.fromKeyName('Cm');

      expect(key1.equals(key2)).toBe(false);
    });
  });

  describe('レガシー互換性', () => {
    it('tonicプロパティが正しく動作する（メジャー）', () => {
      const musicalKey = MusicalKey.fromKeyName('G');
      expect(musicalKey.tonic).toBe('G');
    });

    it('tonicプロパティが正しく動作する（マイナー）', () => {
      const musicalKey = MusicalKey.fromKeyName('Em');
      expect(musicalKey.tonic).toBe('Em');
    });

    it('modeプロパティが正しく動作する（メジャー）', () => {
      const musicalKey = MusicalKey.fromKeyName('C');
      expect(musicalKey.mode).toBe('major');
    });

    it('modeプロパティが正しく動作する（マイナー）', () => {
      const musicalKey = MusicalKey.fromKeyName('Am');
      expect(musicalKey.mode).toBe('minor');
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const musicalKey = MusicalKey.fromKeyName('F#');
      const json = musicalKey.toJSON();

      expect(json.root.noteName).toBe('F#');
      expect(json.root.octave).toBe(4);
      expect(json.scale.type).toBe('major');
    });

    it('JSONから復元できる', () => {
      const json = {
        root: { noteName: 'G' as const, octave: 4 as const },
        scale: { type: 'major' as const, intervals: [0, 2, 4, 5, 7, 9, 11] },
      };
      const musicalKey = MusicalKey.fromJSON(json);

      expect(musicalKey.root.noteName).toBe('G');
      expect(musicalKey.scaleType).toBe('major');
    });

    it('JSON変換と復元で同じ調になる', () => {
      const originalKey = MusicalKey.fromKeyName('A');
      const json = originalKey.toJSON();
      const restoredKey = MusicalKey.fromJSON(json);

      expect(originalKey.equals(restoredKey)).toBe(true);
    });
  });

  describe('すべての有効なキーのテスト', () => {
    const validMajorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    const validMinorKeys = [
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'D#m',
      'A#m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ];

    it.each(validMajorKeys)('メジャーキー %s で調を作成できる', keyName => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => MusicalKey.fromKeyName(keyName as any)).not.toThrow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const musicalKey = MusicalKey.fromKeyName(keyName as any);
      expect(musicalKey.isMajor).toBe(true);
    });

    it.each(validMinorKeys)('マイナーキー %s で調を作成できる', keyName => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => MusicalKey.fromKeyName(keyName as any)).not.toThrow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const musicalKey = MusicalKey.fromKeyName(keyName as any);
      expect(musicalKey.isMinor).toBe(true);
    });
  });
});
