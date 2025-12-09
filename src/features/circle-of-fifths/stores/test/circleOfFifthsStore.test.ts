import { describe, test, expect, beforeEach } from 'vitest';
import { useCircleOfFifthsStore } from '../circleOfFifthsStore';
import { Key, PitchClass } from '@/domain';

describe('circleOfFifthsStore', () => {
  beforeEach(() => {
    // ストアをリセット
    const { setSelectedKey, setHoveredKey, setIsPlaying } = useCircleOfFifthsStore.getState();
    setSelectedKey(null);
    setHoveredKey(null);
    setIsPlaying(false);
  });

  describe('初期状態', () => {
    test('正常ケース: selectedKeyがnullである', () => {
      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey).toBeNull();
    });

    test('正常ケース: hoveredKeyがnullである', () => {
      const { hoveredKey } = useCircleOfFifthsStore.getState();
      expect(hoveredKey).toBeNull();
    });

    test('正常ケース: isPlayingがfalseである', () => {
      const { isPlaying } = useCircleOfFifthsStore.getState();
      expect(isPlaying).toBe(false);
    });
  });

  describe('setSelectedKey', () => {
    test('正常ケース: キーを選択できる', () => {
      const { setSelectedKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const keyDTO = cMajor.toJSON();

      setSelectedKey(keyDTO);

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey).toEqual(keyDTO);
    });

    test('正常ケース: 異なるキーを選択できる', () => {
      const { setSelectedKey } = useCircleOfFifthsStore.getState();

      const gMajor = Key.major(PitchClass.G);
      const keyDTO = gMajor.toJSON();

      setSelectedKey(keyDTO);

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey?.shortName).toBe('G');
      expect(selectedKey?.isMajor).toBe(true);
    });

    test('正常ケース: マイナーキーを選択できる', () => {
      const { setSelectedKey } = useCircleOfFifthsStore.getState();

      const aMinor = Key.minor(PitchClass.A);
      const keyDTO = aMinor.toJSON();

      setSelectedKey(keyDTO);

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey?.shortName).toBe('Am');
      expect(selectedKey?.isMajor).toBe(false);
    });

    test('正常ケース: 選択を解除できる（nullに設定）', () => {
      const { setSelectedKey } = useCircleOfFifthsStore.getState();

      // まず選択
      const cMajor = Key.major(PitchClass.C);
      setSelectedKey(cMajor.toJSON());

      // 選択を解除
      setSelectedKey(null);

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey).toBeNull();
    });

    test('正常ケース: キーを選択するとisPlayingがfalseになる', () => {
      const { setSelectedKey, setIsPlaying } = useCircleOfFifthsStore.getState();

      // isPlayingをtrueに設定
      setIsPlaying(true);

      // キーを選択
      const cMajor = Key.major(PitchClass.C);
      setSelectedKey(cMajor.toJSON());

      const { isPlaying } = useCircleOfFifthsStore.getState();
      expect(isPlaying).toBe(false);
    });

    test('正常ケース: 選択を上書きできる', () => {
      const { setSelectedKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const gMajor = Key.major(PitchClass.G);

      setSelectedKey(cMajor.toJSON());
      setSelectedKey(gMajor.toJSON());

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey?.shortName).toBe('G');
    });
  });

  describe('setHoveredKey', () => {
    test('正常ケース: キーをホバーできる', () => {
      const { setHoveredKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const keyDTO = cMajor.toJSON();

      setHoveredKey(keyDTO);

      const { hoveredKey } = useCircleOfFifthsStore.getState();
      expect(hoveredKey).toEqual(keyDTO);
    });

    test('正常ケース: キーをホバーするとisPlayingがtrueになる', () => {
      const { setHoveredKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      setHoveredKey(cMajor.toJSON());

      const { isPlaying } = useCircleOfFifthsStore.getState();
      expect(isPlaying).toBe(true);
    });

    test('正常ケース: ホバーを解除するとisPlayingがfalseになる', () => {
      const { setHoveredKey } = useCircleOfFifthsStore.getState();

      // まずホバー
      const cMajor = Key.major(PitchClass.C);
      setHoveredKey(cMajor.toJSON());

      expect(useCircleOfFifthsStore.getState().isPlaying).toBe(true);

      // ホバーを解除
      setHoveredKey(null);

      const { hoveredKey, isPlaying } = useCircleOfFifthsStore.getState();
      expect(hoveredKey).toBeNull();
      expect(isPlaying).toBe(false);
    });

    test('正常ケース: ホバーを上書きできる', () => {
      const { setHoveredKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const gMajor = Key.major(PitchClass.G);

      setHoveredKey(cMajor.toJSON());
      setHoveredKey(gMajor.toJSON());

      const { hoveredKey } = useCircleOfFifthsStore.getState();
      expect(hoveredKey?.shortName).toBe('G');
    });
  });

  describe('setIsPlaying', () => {
    test('正常ケース: isPlayingをtrueに設定できる', () => {
      const { setIsPlaying } = useCircleOfFifthsStore.getState();

      setIsPlaying(true);

      const { isPlaying } = useCircleOfFifthsStore.getState();
      expect(isPlaying).toBe(true);
    });

    test('正常ケース: isPlayingをfalseに設定できる', () => {
      const { setIsPlaying } = useCircleOfFifthsStore.getState();

      setIsPlaying(true);
      setIsPlaying(false);

      const { isPlaying } = useCircleOfFifthsStore.getState();
      expect(isPlaying).toBe(false);
    });

    test('正常ケース: isPlayingを複数回切り替えられる', () => {
      const { setIsPlaying } = useCircleOfFifthsStore.getState();

      setIsPlaying(true);
      expect(useCircleOfFifthsStore.getState().isPlaying).toBe(true);

      setIsPlaying(false);
      expect(useCircleOfFifthsStore.getState().isPlaying).toBe(false);

      setIsPlaying(true);
      expect(useCircleOfFifthsStore.getState().isPlaying).toBe(true);
    });
  });

  describe('複合操作', () => {
    test('正常ケース: selectedとhoveredが独立して動作する', () => {
      const { setSelectedKey, setHoveredKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const gMajor = Key.major(PitchClass.G);

      setSelectedKey(cMajor.toJSON());
      setHoveredKey(gMajor.toJSON());

      const { selectedKey, hoveredKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey?.shortName).toBe('C');
      expect(hoveredKey?.shortName).toBe('G');
    });

    test('正常ケース: hoveredKeyを設定してもselectedKeyは影響を受けない', () => {
      const { setSelectedKey, setHoveredKey } = useCircleOfFifthsStore.getState();

      const cMajor = Key.major(PitchClass.C);
      const gMajor = Key.major(PitchClass.G);

      setSelectedKey(cMajor.toJSON());
      setHoveredKey(gMajor.toJSON());

      const { selectedKey } = useCircleOfFifthsStore.getState();
      expect(selectedKey?.shortName).toBe('C'); // 変わらない
    });
  });
});
