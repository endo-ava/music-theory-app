import { describe, it, expect } from 'vitest';
import { ModeService } from '../ModeService';
import { ScalePattern } from '../../common/ScalePattern';

describe('ModeService', () => {
  describe('度数からの導出', () => {
    it('メジャースケールの2度から始めるとドリアンが生成される', () => {
      const major = ScalePattern.Major;
      const dorian = ModeService.deriveFromDegree(major, 2, 'Derived Dorian', 'Dorian');

      // ドリアンの期待されるセミトーンパターン: [0, 2, 3, 5, 7, 9, 10]
      expect(dorian.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 9, 10]);
    });

    it('メジャースケールの3度から始めるとフリジアンが生成される', () => {
      const major = ScalePattern.Major;
      const phrygian = ModeService.deriveFromDegree(major, 3, 'Derived Phrygian', 'Phrygian');

      // フリジアンの期待されるセミトーンパターン: [0, 1, 3, 5, 7, 8, 10]
      expect(phrygian.getSemitonePattern()).toEqual([0, 1, 3, 5, 7, 8, 10]);
    });

    it('メジャースケールの6度から始めるとナチュラルマイナーが生成される', () => {
      const major = ScalePattern.Major;
      const minor = ModeService.deriveFromDegree(major, 6, 'Derived Minor', 'Minor');

      // ナチュラルマイナーの期待されるセミトーンパターン: [0, 2, 3, 5, 7, 8, 10]
      expect(minor.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 8, 10]);
    });

    it('無効な度数でエラーが発生する', () => {
      const major = ScalePattern.Major;

      expect(() => {
        ModeService.deriveFromDegree(major, 0, 'Invalid', 'Major');
      }).toThrow('Invalid start degree: 0');

      expect(() => {
        ModeService.deriveFromDegree(major, 8, 'Invalid', 'Major');
      }).toThrow('Invalid start degree: 8');
    });
  });

  describe('チャーチモード生成', () => {
    it('イオニアン（メジャー）を生成できる', () => {
      const ionian = ModeService.generateChurchMode('Ionian');
      const major = ScalePattern.Major;

      expect(ionian.getSemitonePattern()).toEqual(major.getSemitonePattern());
    });

    it('ドリアンを生成できる', () => {
      const dorian = ModeService.generateChurchMode('Dorian');
      const expected = ScalePattern.Dorian;

      expect(dorian.getSemitonePattern()).toEqual(expected.getSemitonePattern());
    });

    it('エオリアン（ナチュラルマイナー）を生成できる', () => {
      const aeolian = ModeService.generateChurchMode('Aeolian');
      const minor = ScalePattern.Minor;

      expect(aeolian.getSemitonePattern()).toEqual(minor.getSemitonePattern());
    });

    it('無効なモード名でエラーが発生する', () => {
      expect(() => {
        ModeService.generateChurchMode('InvalidMode');
      }).toThrow('Unknown church mode: InvalidMode');
    });

    it('すべてのチャーチモードを生成できる', () => {
      const allModes = ModeService.generateAllChurchModes();

      expect(allModes).toHaveLength(7);

      // 各モードが期待される特徴を持つかチェック
      const modeNames = [
        'Ionian',
        'Dorian',
        'Phrygian',
        'Lydian',
        'Mixolydian',
        'Aeolian',
        'Locrian',
      ];
      modeNames.forEach((modeName, index) => {
        const generated = ModeService.generateChurchMode(modeName);
        expect(allModes[index].getSemitonePattern()).toEqual(generated.getSemitonePattern());
      });
    });
  });

  describe('チャーチモード定義', () => {
    it('チャーチモード定義を取得できる', () => {
      const definitions = ModeService.getChurchModeDefinitions();

      expect(definitions).toHaveLength(7);
      expect(definitions[0]).toEqual({
        name: 'Ionian',
        type: 'Major',
        degree: 1,
      });
      expect(definitions[1]).toEqual({
        name: 'Dorian',
        type: 'Dorian',
        degree: 2,
      });
      expect(definitions[5]).toEqual({
        name: 'Aeolian',
        type: 'Minor',
        degree: 6,
      });
    });

    it('定義の不変性が保たれる', () => {
      const definitions1 = ModeService.getChurchModeDefinitions();
      const definitions2 = ModeService.getChurchModeDefinitions();

      // 異なるインスタンスであることを確認
      expect(definitions1).not.toBe(definitions2);
      // しかし内容は同じ
      expect(definitions1).toEqual(definitions2);
    });
  });

  describe('チャーチモード識別', () => {
    it('メジャーパターンをイオニアンとして識別できる', () => {
      const major = ScalePattern.Major;
      const identified = ModeService.identifyChurchMode(major);

      expect(identified).not.toBeNull();
      expect(identified!.name).toBe('Ionian');
      expect(identified!.type).toBe('Major');
    });

    it('ドリアンパターンを正しく識別できる', () => {
      const dorian = ScalePattern.Dorian;
      const identified = ModeService.identifyChurchMode(dorian);

      expect(identified).not.toBeNull();
      expect(identified!.name).toBe('Dorian');
      expect(identified!.type).toBe('Dorian');
    });

    it('マイナーパターンをエオリアンとして識別できる', () => {
      const minor = ScalePattern.Minor;
      const identified = ModeService.identifyChurchMode(minor);

      expect(identified).not.toBeNull();
      expect(identified!.name).toBe('Aeolian');
      expect(identified!.type).toBe('Minor');
    });

    it('チャーチモードでないパターンはnullを返す', () => {
      const pentatonic = ScalePattern.Pentatonic;
      const identified = ModeService.identifyChurchMode(pentatonic);

      expect(identified).toBeNull();
    });
  });

  describe('パターン回転', () => {
    it('パターンを正の値で右回転できる', () => {
      const major = ScalePattern.Major;
      const rotated1 = ModeService.rotatePattern(major, 1);

      // 1ステップ回転すると2度から始まる（ドリアン的な）パターンになる
      // ただし、これは新しいパターンなので完全なドリアンとは異なる場合がある
      expect(rotated1.length).toBe(major.length);
      expect(rotated1.getSemitonePattern()[0]).toBe(0); // 最初は必ずユニゾン
    });

    it('パターンを負の値で左回転できる', () => {
      const major = ScalePattern.Major;
      const rotated = ModeService.rotatePattern(major, -1);

      expect(rotated.length).toBe(major.length);
      expect(rotated.getSemitonePattern()[0]).toBe(0);
    });

    it('0ステップ回転は元のパターンを返す', () => {
      const major = ScalePattern.Major;
      const rotated = ModeService.rotatePattern(major, 0);

      expect(rotated).toBe(major); // 同じインスタンス
    });

    it('フルサイクル回転は元のパターンと同等になる', () => {
      const major = ScalePattern.Major;
      const rotated = ModeService.rotatePattern(major, major.length);

      expect(rotated.getSemitonePattern()).toEqual(major.getSemitonePattern());
    });
  });

  describe('回転関係判定', () => {
    it('メジャーとドリアンは回転関係にある', () => {
      const major = ScalePattern.Major;
      const dorian = ScalePattern.Dorian;

      expect(ModeService.areRotationRelated(major, dorian)).toBe(true);
    });

    it('メジャーとマイナーは回転関係にある', () => {
      const major = ScalePattern.Major;
      const minor = ScalePattern.Minor;

      expect(ModeService.areRotationRelated(major, minor)).toBe(true);
    });

    it('異なる長さのパターンは回転関係にない', () => {
      const major = ScalePattern.Major; // 7音
      const pentatonic = ScalePattern.Pentatonic; // 5音

      expect(ModeService.areRotationRelated(major, pentatonic)).toBe(false);
    });

    it('完全に異なるパターンは回転関係にない', () => {
      const major = ScalePattern.Major;
      const harmonic = ScalePattern.HarmonicMinor;

      // ハーモニックマイナーは7音だが、メジャーとは回転関係にない
      expect(ModeService.areRotationRelated(major, harmonic)).toBe(false);
    });
  });

  describe('明度評価', () => {
    it('各パターンの明度値が正しい', () => {
      expect(ModeService.getBrightnessValue(ScalePattern.Lydian)).toBe(6);
      expect(ModeService.getBrightnessValue(ScalePattern.Major)).toBe(5);
      expect(ModeService.getBrightnessValue(ScalePattern.Mixolydian)).toBe(4);
      expect(ModeService.getBrightnessValue(ScalePattern.Dorian)).toBe(3);
      expect(ModeService.getBrightnessValue(ScalePattern.Minor)).toBe(2);
      expect(ModeService.getBrightnessValue(ScalePattern.Phrygian)).toBe(1);
      expect(ModeService.getBrightnessValue(ScalePattern.Locrian)).toBe(0);
    });

    it('未定義のパターンはデフォルト値を返す', () => {
      const pentatonic = ScalePattern.Pentatonic;
      expect(ModeService.getBrightnessValue(pentatonic)).toBe(3);
    });

    it('明度順でソートできる（昇順）', () => {
      const patterns = [
        ScalePattern.Major,
        ScalePattern.Minor,
        ScalePattern.Lydian,
        ScalePattern.Locrian,
      ];

      const sorted = ModeService.sortByBrightness(patterns, true);

      expect(ModeService.getBrightnessValue(sorted[0])).toBe(0); // Locrian
      expect(ModeService.getBrightnessValue(sorted[1])).toBe(2); // Minor
      expect(ModeService.getBrightnessValue(sorted[2])).toBe(5); // Major
      expect(ModeService.getBrightnessValue(sorted[3])).toBe(6); // Lydian
    });

    it('明度順でソートできる（降順）', () => {
      const patterns = [
        ScalePattern.Major,
        ScalePattern.Minor,
        ScalePattern.Lydian,
        ScalePattern.Locrian,
      ];

      const sorted = ModeService.sortByBrightness(patterns, false);

      expect(ModeService.getBrightnessValue(sorted[0])).toBe(6); // Lydian
      expect(ModeService.getBrightnessValue(sorted[1])).toBe(5); // Major
      expect(ModeService.getBrightnessValue(sorted[2])).toBe(2); // Minor
      expect(ModeService.getBrightnessValue(sorted[3])).toBe(0); // Locrian
    });

    it('ソートは元の配列を変更しない', () => {
      const patterns = [ScalePattern.Major, ScalePattern.Minor, ScalePattern.Lydian];
      const originalOrder = [...patterns];

      const sorted = ModeService.sortByBrightness(patterns);

      expect(patterns).toEqual(originalOrder);
      expect(sorted).not.toBe(patterns);
    });
  });

  describe('統合テスト', () => {
    it('すべてのチャーチモードが相互に回転関係にある', () => {
      const allModes = ModeService.generateAllChurchModes();

      // 任意の2つのモードを選んで回転関係をチェック
      for (let i = 0; i < allModes.length; i++) {
        for (let j = i + 1; j < allModes.length; j++) {
          expect(ModeService.areRotationRelated(allModes[i], allModes[j])).toBe(true);
        }
      }
    });

    it('生成されたモードが正しく識別される', () => {
      const definitions = ModeService.getChurchModeDefinitions();

      definitions.forEach(definition => {
        const generated = ModeService.generateChurchMode(definition.name);
        const identified = ModeService.identifyChurchMode(generated);

        expect(identified).not.toBeNull();
        expect(identified!.name).toBe(definition.name);
        expect(identified!.type).toBe(definition.type);
      });
    });
  });
});
