/**
 * ChordBuilder ドメインサービスのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ChordBuilder } from '../ChordBuilder';
import { Note, Octave } from '../../value-objects/Note';
import { Chord } from '../../entities/Chord';
import type { FifthsIndex } from '../../types/FifthsIndex';

describe('ChordBuilder', () => {
  let chordBuilder: ChordBuilder;

  beforeEach(() => {
    chordBuilder = new ChordBuilder();
  });

  describe('buildMajorTriadFromPosition', () => {
    it('正常ケース: 各五度圏ポジションからメジャートライアドを構築', () => {
      const testCases: Array<[FifthsIndex, string, string[]]> = [
        [0, 'C', ['C4', 'E4', 'G4']], // C major
        [1, 'G', ['G4', 'B4', 'D5']], // G major
        [2, 'D', ['D4', 'F#4', 'A4']], // D major
        [3, 'A', ['A4', 'C#5', 'E5']], // A major
        [4, 'E', ['E4', 'G#4', 'B4']], // E major
        [5, 'B', ['B4', 'D#5', 'F#5']], // B major
        [6, 'F#', ['F#4', 'A#4', 'C#5']], // F# major
        [7, 'C#', ['C#4', 'F4', 'G#4']], // C# major
        [8, 'G#', ['G#4', 'C5', 'D#5']], // G# major
        [9, 'D#', ['D#4', 'G4', 'A#4']], // D# major
        [10, 'A#', ['A#4', 'D5', 'F5']], // A# major
        [11, 'F', ['F4', 'A4', 'C5']], // F major
      ];

      testCases.forEach(([fifthsIndex, expectedName, expectedTones]) => {
        const chord = chordBuilder.buildMajorTriadFromPosition(fifthsIndex);

        expect(chord.name).toBe(expectedName);
        expect(chord.type).toBe('major');
        expect(chord.toneNotations).toEqual(expectedTones);
        expect(chord.notes.length).toBe(3);
      });
    });

    it('正常ケース: デフォルトオクターブ4での構築', () => {
      const chord = chordBuilder.buildMajorTriadFromPosition(0); // C major

      expect(chord.root.octave).toBe(4);
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: カスタムオクターブでの構築', () => {
      const testCases: Array<[FifthsIndex, number, string[]]> = [
        [0, 3, ['C3', 'E3', 'G3']], // C major, octave 3
        [1, 5, ['G5', 'B5', 'D6']], // G major, octave 5
        [11, 2, ['F2', 'A2', 'C3']], // F major, octave 2
      ];

      testCases.forEach(([fifthsIndex, octave, expectedTones]) => {
        const chord = chordBuilder.buildMajorTriadFromPosition(fifthsIndex, octave as Octave);

        expect(chord.root.octave).toBe(octave);
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });

    it('正常ケース: 構築した和音がChordインスタンス', () => {
      const chord = chordBuilder.buildMajorTriadFromPosition(0);

      expect(chord).toBeInstanceOf(Chord);
      expect(chord.root).toBeInstanceOf(Note);
      expect(chord.notes.every(note => note instanceof Note)).toBe(true);
    });
  });

  describe('buildMinorTriadFromPosition', () => {
    it('正常ケース: 各五度圏ポジションからマイナートライアドを構築', () => {
      const testCases: Array<[FifthsIndex, string, string[]]> = [
        [0, 'Cm', ['C4', 'D#4', 'G4']], // C minor
        [1, 'Gm', ['G4', 'A#4', 'D5']], // G minor
        [2, 'Dm', ['D4', 'F4', 'A4']], // D minor
        [3, 'Am', ['A4', 'C5', 'E5']], // A minor
        [4, 'Em', ['E4', 'G4', 'B4']], // E minor
        [5, 'Bm', ['B4', 'D5', 'F#5']], // B minor
        [6, 'F#m', ['F#4', 'A4', 'C#5']], // F# minor
        [7, 'C#m', ['C#4', 'E4', 'G#4']], // C# minor
        [8, 'G#m', ['G#4', 'B4', 'D#5']], // G# minor
        [9, 'D#m', ['D#4', 'F#4', 'A#4']], // D# minor
        [10, 'A#m', ['A#4', 'C#5', 'F5']], // A# minor
        [11, 'Fm', ['F4', 'G#4', 'C5']], // F minor
      ];

      testCases.forEach(([fifthsIndex, expectedName, expectedTones]) => {
        const chord = chordBuilder.buildMinorTriadFromPosition(fifthsIndex);

        expect(chord.name).toBe(expectedName);
        expect(chord.type).toBe('minor');
        expect(chord.toneNotations).toEqual(expectedTones);
        expect(chord.notes.length).toBe(3);
      });
    });

    it('正常ケース: デフォルトオクターブ4での構築', () => {
      const chord = chordBuilder.buildMinorTriadFromPosition(3); // A minor

      expect(chord.root.octave).toBe(4);
      expect(chord.toneNotations).toEqual(['A4', 'C5', 'E5']);
    });

    it('正常ケース: カスタムオクターブでの構築', () => {
      const testCases: Array<[FifthsIndex, number, string[]]> = [
        [3, 3, ['A3', 'C4', 'E4']], // A minor, octave 3
        [4, 5, ['E5', 'G5', 'B5']], // E minor, octave 5
        [11, 2, ['F2', 'G#2', 'C3']], // F minor, octave 2
      ];

      testCases.forEach(([fifthsIndex, octave, expectedTones]) => {
        const chord = chordBuilder.buildMinorTriadFromPosition(fifthsIndex, octave as Octave);

        expect(chord.root.octave).toBe(octave);
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });

    it('正常ケース: 構築した和音がChordインスタンス', () => {
      const chord = chordBuilder.buildMinorTriadFromPosition(3);

      expect(chord).toBeInstanceOf(Chord);
      expect(chord.root).toBeInstanceOf(Note);
      expect(chord.notes.every(note => note instanceof Note)).toBe(true);
    });
  });

  describe('音楽理論的整合性', () => {
    it('正常ケース: 同じポジションのメジャーとマイナーコードのルート音一致', () => {
      const allPositions: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allPositions.forEach(position => {
        const majorChord = chordBuilder.buildMajorTriadFromPosition(position);
        const minorChord = chordBuilder.buildMinorTriadFromPosition(position);

        expect(majorChord.root.noteName).toBe(minorChord.root.noteName);
        expect(majorChord.root.octave).toBe(minorChord.root.octave);
      });
    });

    it('正常ケース: 五度圏の理論的関係性', () => {
      // 隣接する五度圏ポジションは完全5度の関係
      const testCases: Array<[FifthsIndex, FifthsIndex, string, string]> = [
        [0, 1, 'C', 'G'], // C → G (完全5度上)
        [1, 2, 'G', 'D'], // G → D (完全5度上)
        [2, 3, 'D', 'A'], // D → A (完全5度上)
        [11, 0, 'F', 'C'], // F → C (完全5度上)
      ];

      testCases.forEach(([pos1, pos2, name1, name2]) => {
        const chord1 = chordBuilder.buildMajorTriadFromPosition(pos1);
        const chord2 = chordBuilder.buildMajorTriadFromPosition(pos2);

        expect(chord1.root.noteName).toBe(name1);
        expect(chord2.root.noteName).toBe(name2);
      });
    });

    it('正常ケース: 相対メジャー・マイナー関係', () => {
      // メジャーキーとその相対マイナーキーの関係性
      const relativeKeyPairs: Array<[FifthsIndex, string, string]> = [
        [0, 'C', 'Am'], // C major ↔ A minor
        [1, 'G', 'Em'], // G major ↔ E minor
        [2, 'D', 'Bm'], // D major ↔ B minor
        [11, 'F', 'Dm'], // F major ↔ D minor
      ];

      relativeKeyPairs.forEach(([position, majorName, expectedMinorName]) => {
        const majorChord = chordBuilder.buildMajorTriadFromPosition(position);
        // 相対マイナーは短3度下（五度圏で3ポジション右回り）
        const relativeMinorPosition = ((position + 3) % 12) as FifthsIndex;
        const minorChord = chordBuilder.buildMinorTriadFromPosition(relativeMinorPosition);

        expect(majorChord.name).toBe(majorName);
        expect(minorChord.name).toBe(expectedMinorName);
      });
    });
  });

  describe('境界値・エッジケース', () => {
    it('境界値ケース: 五度圏の境界ポジション', () => {
      // 最初と最後のポジション
      const firstPosition = chordBuilder.buildMajorTriadFromPosition(0);
      const lastPosition = chordBuilder.buildMajorTriadFromPosition(11);

      expect(firstPosition.name).toBe('C');
      expect(lastPosition.name).toBe('F');
    });

    it('境界値ケース: オクターブの境界値', () => {
      const testCases: Array<[number, boolean]> = [
        [0, true], // 最低オクターブ
        [8, true], // 最高オクターブ
      ];

      testCases.forEach(([octave, shouldSucceed]) => {
        if (shouldSucceed) {
          expect(() => chordBuilder.buildMajorTriadFromPosition(0, octave as Octave)).not.toThrow();
        }
      });
    });

    it('正常ケース: 全ポジションでの一貫性', () => {
      const allPositions: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allPositions.forEach(position => {
        const majorChord = chordBuilder.buildMajorTriadFromPosition(position);
        const minorChord = chordBuilder.buildMinorTriadFromPosition(position);

        // 両方とも有効な和音が構築される
        expect(majorChord.notes.length).toBe(3);
        expect(minorChord.notes.length).toBe(3);

        // 和音タイプが正しい
        expect(majorChord.type).toBe('major');
        expect(minorChord.type).toBe('minor');

        // 名前が生成される
        expect(majorChord.name).toBeTruthy();
        expect(minorChord.name).toBeTruthy();
        expect(minorChord.name.endsWith('m')).toBe(true);
      });
    });
  });

  describe('パフォーマンス・再利用性', () => {
    it('正常ケース: 同じBuilderインスタンスでの複数回構築', () => {
      const chord1 = chordBuilder.buildMajorTriadFromPosition(0);
      const chord2 = chordBuilder.buildMajorTriadFromPosition(1);
      const chord3 = chordBuilder.buildMinorTriadFromPosition(3);

      // 各和音が独立して正しく構築される
      expect(chord1.name).toBe('C');
      expect(chord2.name).toBe('G');
      expect(chord3.name).toBe('Am');

      // インスタンスが異なる
      expect(chord1).not.toBe(chord2);
      expect(chord2).not.toBe(chord3);
    });

    it('正常ケース: 新しいBuilderインスタンスでの一貫性', () => {
      const builder1 = new ChordBuilder();
      const builder2 = new ChordBuilder();

      const chord1 = builder1.buildMajorTriadFromPosition(0);
      const chord2 = builder2.buildMajorTriadFromPosition(0);

      // 異なるBuilderでも同じ結果
      expect(chord1.equals(chord2)).toBe(true);
    });
  });

  describe('実用的な使用例', () => {
    it('正常ケース: 基本的な和音進行の構築', () => {
      // I-V-vi-IV進行（Cメジャーキー）
      const progression = [
        chordBuilder.buildMajorTriadFromPosition(0), // I (C)
        chordBuilder.buildMajorTriadFromPosition(1), // V (G)
        chordBuilder.buildMinorTriadFromPosition(3), // vi (Am)
        chordBuilder.buildMajorTriadFromPosition(11), // IV (F)
      ];

      expect(progression[0].name).toBe('C');
      expect(progression[1].name).toBe('G');
      expect(progression[2].name).toBe('Am');
      expect(progression[3].name).toBe('F');
    });

    it('正常ケース: 異なるオクターブでの和音展開', () => {
      // 低音から高音への和音展開
      const expansion = [
        chordBuilder.buildMajorTriadFromPosition(0, 2), // C2
        chordBuilder.buildMajorTriadFromPosition(0, 3), // C3
        chordBuilder.buildMajorTriadFromPosition(0, 4), // C4
        chordBuilder.buildMajorTriadFromPosition(0, 5), // C5
      ];

      expansion.forEach((chord, index) => {
        expect(chord.name).toBe('C');
        expect(chord.root.octave).toBe(index + 2);
      });
    });

    it('正常ケース: 五度圏を一周する和音シーケンス', () => {
      const circleSequence: string[] = [];

      for (let i = 0; i < 12; i++) {
        const chord = chordBuilder.buildMajorTriadFromPosition(i as FifthsIndex);
        circleSequence.push(chord.name);
      }

      const expectedSequence = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
      expect(circleSequence).toEqual(expectedSequence);
    });
  });
});
