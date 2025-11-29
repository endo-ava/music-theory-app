import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDiatonicChordHighlight } from '../useDiatonicChordHighlight';
import { KeyDTO, Key, PitchClass } from '@/domain';

// テスト用のヘルパー関数：KeyDTOを生成
const createKeyDTO = (
  fifthsIndex: number,
  isMajor: boolean
): KeyDTO & { pitchClassName: string } => ({
  fifthsIndex,
  isMajor,
  contextName: `Test-${fifthsIndex}-${isMajor}`,
  pitchClassName: `TestPitch-${fifthsIndex}`,
  shortName: '',
  type: 'key',
});

describe('useDiatonicChordHighlight hook', () => {
  describe('getHighlightInfo function', () => {
    test('正常ケース: 該当するダイアトニックコードでtrueを返す', () => {
      // C majorキーを引数として渡す
      const currentKey = Key.major(PitchClass.C);
      const { result } = renderHook(() => useDiatonicChordHighlight(currentKey));

      // C majorキーのダイアトニックコードをテスト
      // C major (tonic) - fifthsIndex: 0, major: true
      const cMajorKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);
      const cMajorResult = result.current.getHighlightInfo(cMajorKeyDTO);

      expect(cMajorResult.shouldHighlight).toBe(true);
      expect(cMajorResult.romanNumeral).toBe('Ⅰ'); // C major の I度
      expect(cMajorResult.isTonic).toBe(true);

      // D minor (supertonic) - fifthsIndex: 2, major: false
      const dMinorKeyDTO = createKeyDTO(PitchClass.D.fifthsIndex, false);
      const dMinorResult = result.current.getHighlightInfo(dMinorKeyDTO);

      expect(dMinorResult.shouldHighlight).toBe(true);
      expect(dMinorResult.romanNumeral).toBe('Ⅱm'); // C major の ii度
      expect(dMinorResult.isTonic).toBe(false);
    });

    test('正常ケース: 非該当コードでfalseを返す', () => {
      // C majorキーを引数として渡す
      const currentKey = Key.major(PitchClass.C);
      const { result } = renderHook(() => useDiatonicChordHighlight(currentKey));

      // C majorキーのダイアトニックコードではないコードをテスト
      // C# major - C majorのダイアトニックコードではない
      const cSharpMajorKeyDTO = createKeyDTO(PitchClass.CSharp.fifthsIndex, true);
      const result1 = result.current.getHighlightInfo(cSharpMajorKeyDTO);

      expect(result1.shouldHighlight).toBe(false);
      expect(result1.romanNumeral).toBe(null);
      expect(result1.isTonic).toBe(false);
    });

    test('境界値ケース: 異なるキーでのダイアトニックコード判定', () => {
      // G majorキーを引数として渡す
      const currentKey = Key.major(PitchClass.G);
      const { result } = renderHook(() => useDiatonicChordHighlight(currentKey));

      // G majorキーのダイアトニックコードをテスト
      // G major (tonic) - fifthsIndex: 1, major: true
      const gMajorKeyDTO = createKeyDTO(PitchClass.G.fifthsIndex, true);
      const gMajorResult = result.current.getHighlightInfo(gMajorKeyDTO);

      expect(gMajorResult.shouldHighlight).toBe(true);
      expect(gMajorResult.romanNumeral).toBe('Ⅰ'); // G major の I度
      expect(gMajorResult.isTonic).toBe(true);

      // C major - G majorのダイアトニックコード（IV度）
      const cMajorKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);
      const cMajorResult = result.current.getHighlightInfo(cMajorKeyDTO);

      expect(cMajorResult.shouldHighlight).toBe(true);
      expect(cMajorResult.romanNumeral).toBe('Ⅳ'); // G major の IV度
      expect(cMajorResult.isTonic).toBe(false);
    });

    test('キー変更テスト: 異なるキー引数での動作確認', () => {
      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true); // C major

      // C majorキーでのテスト
      const { result: cMajorResult } = renderHook(() =>
        useDiatonicChordHighlight(Key.major(PitchClass.C))
      );
      let highlightInfo = cMajorResult.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(true);
      expect(highlightInfo.romanNumeral).toBe('Ⅰ');
      expect(highlightInfo.isTonic).toBe(true);

      // D majorキーでのテスト（C majorはダイアトニックコードではない）
      const { result: dMajorResult } = renderHook(() =>
        useDiatonicChordHighlight(Key.major(PitchClass.D))
      );
      highlightInfo = dMajorResult.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(false);
      expect(highlightInfo.romanNumeral).toBe(null);
      expect(highlightInfo.isTonic).toBe(false);
    });

    test('メモ化テスト: 同じ引数で複数回呼び出した際の一貫性', () => {
      // C majorキーを引数として渡す
      const currentKey = Key.major(PitchClass.C);
      const { result } = renderHook(() => useDiatonicChordHighlight(currentKey));

      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);

      // 複数回呼び出して結果の一貫性を確認
      const result1 = result.current.getHighlightInfo(testKeyDTO);
      const result2 = result.current.getHighlightInfo(testKeyDTO);
      const result3 = result.current.getHighlightInfo(testKeyDTO);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1.shouldHighlight).toBe(true);
      expect(result1.romanNumeral).toBe('Ⅰ');
      expect(result1.isTonic).toBe(true);
    });
  });

  describe('createCompositeKey utility function', () => {
    test('正常ケース: 異なる引数で異なるキーを生成', () => {
      // C majorキーを引数として渡す
      const currentKey = Key.major(PitchClass.C);
      const { result } = renderHook(() => useDiatonicChordHighlight(currentKey));

      // 異なる複合キーが生成されることを間接的に確認
      const keyDTO1 = createKeyDTO(0, true);
      const keyDTO2 = createKeyDTO(0, false);
      const keyDTO3 = createKeyDTO(1, true);

      const result1 = result.current.getHighlightInfo(keyDTO1);
      const result2 = result.current.getHighlightInfo(keyDTO2);
      const result3 = result.current.getHighlightInfo(keyDTO3);

      // それぞれ異なる結果が返ることを確認（異なる複合キーが使われている証拠）
      expect(result1).not.toEqual(result2);
      expect(result2).not.toEqual(result3);
      expect(result1).not.toEqual(result3);
    });
  });
});
