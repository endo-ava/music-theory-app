import { describe, it, expect } from 'vitest';
import { Scale } from '../Scale';

describe('Scale', () => {
  describe('スケール作成', () => {
    it('メジャースケールを作成できる', () => {
      const scale = Scale.major();

      expect(scale.type).toBe('major');
      expect(scale.isMajor).toBe(true);
      expect(scale.isMinor).toBe(false);
      expect(scale.intervals).toHaveLength(7);
    });

    it('マイナースケールを作成できる', () => {
      const scale = Scale.minor();

      expect(scale.type).toBe('minor');
      expect(scale.isMajor).toBe(false);
      expect(scale.isMinor).toBe(true);
      expect(scale.intervals).toHaveLength(7);
    });

    it('メジャースケールの音程が正しい', () => {
      const scale = Scale.major();
      const expectedSemitones = [0, 2, 4, 5, 7, 9, 11]; // 全全半全全全半

      expect(scale.getSemitonePattern()).toEqual(expectedSemitones);
    });

    it('マイナースケールの音程が正しい', () => {
      const scale = Scale.minor();
      const expectedSemitones = [0, 2, 3, 5, 7, 8, 10]; // 全半全全半全全

      expect(scale.getSemitonePattern()).toEqual(expectedSemitones);
    });
  });

  describe('デフォルトスケール', () => {
    it('デフォルトスケールはメジャースケールである', () => {
      const defaultScale = Scale.getDefault();

      expect(defaultScale.type).toBe('major');
      expect(defaultScale.isMajor).toBe(true);
    });
  });

  describe('表示名とフォーマット', () => {
    it('メジャースケールの表示名を正しく取得できる', () => {
      const scale = Scale.major();
      expect(scale.getDisplayName()).toBe('Major Scale');
    });

    it('マイナースケールの表示名を正しく取得できる', () => {
      const scale = Scale.minor();
      expect(scale.getDisplayName()).toBe('Natural Minor Scale');
    });

    it('メジャースケールの省略表記を正しく取得できる', () => {
      const scale = Scale.major();
      expect(scale.getShortName()).toBe('Maj');
    });

    it('マイナースケールの省略表記を正しく取得できる', () => {
      const scale = Scale.minor();
      expect(scale.getShortName()).toBe('Min');
    });

    it('toString()で表示名を取得できる', () => {
      const scale = Scale.major();
      expect(scale.toString()).toBe('Major Scale');
    });
  });

  describe('等価性判定', () => {
    it('同じスケールは等価である', () => {
      const scale1 = Scale.major();
      const scale2 = Scale.major();

      expect(scale1.equals(scale2)).toBe(true);
    });

    it('異なるタイプのスケールは等価でない', () => {
      const scale1 = Scale.major();
      const scale2 = Scale.minor();

      expect(scale1.equals(scale2)).toBe(false);
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const scale = Scale.minor();
      const json = scale.toJSON();

      expect(json).toEqual({
        type: 'minor',
        intervals: [0, 2, 3, 5, 7, 8, 10],
      });
    });

    it('JSONから復元できる', () => {
      const json = {
        type: 'major' as const,
        intervals: [0, 2, 4, 5, 7, 9, 11],
      };
      const scale = Scale.fromJSON(json);

      expect(scale.type).toBe('major');
      expect(scale.getSemitonePattern()).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('JSON変換と復元で同じスケールになる', () => {
      const originalScale = Scale.major();
      const json = originalScale.toJSON();
      const restoredScale = Scale.fromJSON(json);

      expect(originalScale.equals(restoredScale)).toBe(true);
    });
  });

  describe('音程の妥当性検証', () => {
    it('空の音程配列でエラーが発生する', () => {
      expect(() => {
        Scale.fromJSON({ type: 'major', intervals: [] });
      }).toThrow('Scale must have at least one interval');
    });

    it('最初の音程がユニゾンでない場合エラーが発生する', () => {
      expect(() => {
        Scale.fromJSON({ type: 'major', intervals: [2, 4, 5] });
      }).toThrow('First interval must be unison (0 semitones)');
    });

    it('音程が昇順でない場合エラーが発生する', () => {
      expect(() => {
        Scale.fromJSON({ type: 'major', intervals: [0, 4, 2, 5] });
      }).toThrow('Intervals must be in ascending order');
    });

    it('オクターブを超える音程でエラーが発生する', () => {
      expect(() => {
        Scale.fromJSON({ type: 'major', intervals: [0, 2, 4, 12] });
      }).toThrow('Scale intervals must not exceed an octave (12 semitones)');
    });
  });
});
