import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDiatonicChordHighlight } from '../useDiatonicChordHighlight';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLayerStore } from '@/stores/layerStore';
import { KeyDTO, Key, PitchClass } from '@/domain';

// テスト用のヘルパー関数：KeyDTOを生成
const createKeyDTO = (
  fifthsIndex: number,
  isMajor: boolean
): KeyDTO & { pitchClassName: string } => ({
  fifthsIndex,
  isMajor,
  keyName: `Test-${fifthsIndex}-${isMajor}`,
  pitchClassName: `TestPitch-${fifthsIndex}`,
  shortName: '',
});

describe('useDiatonicChordHighlight hook', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    useLayerStore.setState({ isDiatonicChordsVisible: false });
    useCurrentKeyStore.setState({
      currentKey: Key.major(PitchClass.C), // C major
    });
  });

  describe('getHighlightInfo function', () => {
    test('正常ケース: ダイアトニックコード非表示時、常にfalseを返す', () => {
      // ダイアトニックコード非表示に設定
      useLayerStore.setState({ isDiatonicChordsVisible: false });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      // 任意のKeyDTOでテスト
      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true); // C major
      const highlightInfo = result.current.getHighlightInfo(testKeyDTO);

      expect(highlightInfo.shouldHighlight).toBe(false);
      expect(highlightInfo.romanNumeral).toBe(null);
    });

    test('正常ケース: ダイアトニックコード表示時、該当コードでtrueを返す', () => {
      // ダイアトニックコード表示に設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });
      // C majorキーに設定
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C), // C major
      });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      // C majorキーのダイアトニックコードをテスト
      // C major (tonic) - fifthsIndex: 0, major: true
      const cMajorKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);
      const cMajorResult = result.current.getHighlightInfo(cMajorKeyDTO);

      expect(cMajorResult.shouldHighlight).toBe(true);
      expect(cMajorResult.romanNumeral).toBe('Ⅰ'); // C major の I度

      // D minor (supertonic) - fifthsIndex: 2, major: false
      const dMinorKeyDTO = createKeyDTO(PitchClass.D.fifthsIndex, false);
      const dMinorResult = result.current.getHighlightInfo(dMinorKeyDTO);

      expect(dMinorResult.shouldHighlight).toBe(true);
      expect(dMinorResult.romanNumeral).toBe('Ⅱm'); // C major の ii度
    });

    test('正常ケース: ダイアトニックコード表示時、非該当コードでfalseを返す', () => {
      // ダイアトニックコード表示に設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });
      // C majorキーに設定
      useCurrentKeyStore.setState({
        currentKey: Key.major(PitchClass.C), // C major
      });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      // C majorキーのダイアトニックコードではないコードをテスト
      // C# major - C majorのダイアトニックコードではない
      const cSharpMajorKeyDTO = createKeyDTO(PitchClass.CSharp.fifthsIndex, true);
      const result1 = result.current.getHighlightInfo(cSharpMajorKeyDTO);

      expect(result1.shouldHighlight).toBe(false);
      expect(result1.romanNumeral).toBe(null);
    });

    test('境界値ケース: 異なるキーでのダイアトニックコード判定', () => {
      // ダイアトニックコード表示に設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      // G majorキーに変更（fifthsIndex: 7）
      act(() => {
        useCurrentKeyStore.setState({
          currentKey: Key.major(PitchClass.G), // G major
        });
      });

      // G majorキーのダイアトニックコードをテスト
      // G major (tonic) - fifthsIndex: 1, major: true
      const gMajorKeyDTO = createKeyDTO(PitchClass.G.fifthsIndex, true);
      const gMajorResult = result.current.getHighlightInfo(gMajorKeyDTO);

      expect(gMajorResult.shouldHighlight).toBe(true);
      expect(gMajorResult.romanNumeral).toBe('Ⅰ'); // G major の I度

      // C major - G majorのダイアトニックコード（IV度）
      const cMajorKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);
      const cMajorResult = result.current.getHighlightInfo(cMajorKeyDTO);

      expect(cMajorResult.shouldHighlight).toBe(true);
      expect(cMajorResult.romanNumeral).toBe('Ⅳ'); // G major の IV度
    });

    test('ストア変更テスト: layerStore状態変更時の再計算', () => {
      const { result } = renderHook(() => useDiatonicChordHighlight());

      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);

      // 初期状態（非表示）
      let highlightInfo = result.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(false);

      // ダイアトニックコード表示に変更
      act(() => {
        useLayerStore.setState({ isDiatonicChordsVisible: true });
      });

      highlightInfo = result.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(true);

      // 再度非表示に変更
      act(() => {
        useLayerStore.setState({ isDiatonicChordsVisible: false });
      });

      highlightInfo = result.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(false);
    });

    test('ストア変更テスト: currentKeyStore状態変更時の再計算', () => {
      // ダイアトニックコード表示に設定
      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true); // C major

      // C majorキー時
      let highlightInfo = result.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(true);
      expect(highlightInfo.romanNumeral).toBe('Ⅰ');

      // D majorキーに変更（C majorはダイアトニックコードではない）
      act(() => {
        useCurrentKeyStore.setState({
          currentKey: Key.major(PitchClass.D), // D major
        });
      });

      highlightInfo = result.current.getHighlightInfo(testKeyDTO);
      expect(highlightInfo.shouldHighlight).toBe(false);
      expect(highlightInfo.romanNumeral).toBe(null);
    });

    test('メモ化テスト: 同じ引数で複数回呼び出した際の一貫性', () => {
      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const { result } = renderHook(() => useDiatonicChordHighlight());

      const testKeyDTO = createKeyDTO(PitchClass.C.fifthsIndex, true);

      // 複数回呼び出して結果の一貫性を確認
      const result1 = result.current.getHighlightInfo(testKeyDTO);
      const result2 = result.current.getHighlightInfo(testKeyDTO);
      const result3 = result.current.getHighlightInfo(testKeyDTO);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1.shouldHighlight).toBe(true);
      expect(result1.romanNumeral).toBe('Ⅰ');
    });
  });

  describe('createCompositeKey utility function', () => {
    test('正常ケース: 異なる引数で異なるキーを生成', () => {
      useLayerStore.setState({ isDiatonicChordsVisible: true });

      const { result } = renderHook(() => useDiatonicChordHighlight());

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
