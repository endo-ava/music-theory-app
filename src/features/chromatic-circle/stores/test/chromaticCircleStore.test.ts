import { describe, test, expect, beforeEach } from 'vitest';
import { useChromaticCircleStore } from '../chromaticCircleStore';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

describe('chromaticCircleStore', () => {
  beforeEach(() => {
    // ストアをリセット
    const { setSelectedPitchClass, setHoveredPitchClass } = useChromaticCircleStore.getState();
    setSelectedPitchClass(null);
    setHoveredPitchClass(null);
  });

  describe('初期状態', () => {
    test('正常ケース: selectedPitchClassがnullである', () => {
      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass).toBeNull();
    });

    test('正常ケース: hoveredPitchClassがnullである', () => {
      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass).toBeNull();
    });
  });

  describe('setSelectedPitchClass', () => {
    test('正常ケース: ピッチクラスを選択できる', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };

      setSelectedPitchClass(segment);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass).toEqual(segment);
    });

    test('正常ケース: 異なるピッチクラスを選択できる', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      const segmentG: ChromaticSegmentDTO = {
        position: 7,
        pitchClassName: 'G',
      };

      setSelectedPitchClass(segmentG);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass?.position).toBe(7);
      expect(selectedPitchClass?.pitchClassName).toBe('G');
    });

    test('正常ケース: 選択を解除できる（nullに設定）', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      // まず選択
      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };
      setSelectedPitchClass(segment);

      // 選択を解除
      setSelectedPitchClass(null);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass).toBeNull();
    });

    test('正常ケース: 選択を上書きできる', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      const segmentC: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      const segmentG: ChromaticSegmentDTO = { position: 7, pitchClassName: 'G' };

      setSelectedPitchClass(segmentC);
      setSelectedPitchClass(segmentG);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass).toEqual(segmentG);
    });
  });

  describe('setHoveredPitchClass', () => {
    test('正常ケース: ピッチクラスをホバーできる', () => {
      const { setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };

      setHoveredPitchClass(segment);

      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass).toEqual(segment);
    });

    test('正常ケース: 異なるピッチクラスをホバーできる', () => {
      const { setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segmentD: ChromaticSegmentDTO = {
        position: 2,
        pitchClassName: 'D',
      };

      setHoveredPitchClass(segmentD);

      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass?.position).toBe(2);
      expect(hoveredPitchClass?.pitchClassName).toBe('D');
    });

    test('正常ケース: ホバーを解除できる（nullに設定）', () => {
      const { setHoveredPitchClass } = useChromaticCircleStore.getState();

      // まずホバー
      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };
      setHoveredPitchClass(segment);

      // ホバーを解除
      setHoveredPitchClass(null);

      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass).toBeNull();
    });

    test('正常ケース: ホバーを上書きできる', () => {
      const { setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segmentC: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      const segmentE: ChromaticSegmentDTO = { position: 4, pitchClassName: 'E' };

      setHoveredPitchClass(segmentC);
      setHoveredPitchClass(segmentE);

      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass).toEqual(segmentE);
    });
  });

  describe('複合操作', () => {
    test('正常ケース: selectedとhoveredが独立して動作する', () => {
      const { setSelectedPitchClass, setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segmentC: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      const segmentG: ChromaticSegmentDTO = { position: 7, pitchClassName: 'G' };

      setSelectedPitchClass(segmentC);
      setHoveredPitchClass(segmentG);

      const { selectedPitchClass, hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass?.position).toBe(0);
      expect(hoveredPitchClass?.position).toBe(7);
    });

    test('正常ケース: selectedとhoveredに同じピッチクラスを設定できる', () => {
      const { setSelectedPitchClass, setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segmentC: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };

      setSelectedPitchClass(segmentC);
      setHoveredPitchClass(segmentC);

      const { selectedPitchClass, hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass).toEqual(segmentC);
      expect(hoveredPitchClass).toEqual(segmentC);
    });

    test('正常ケース: selectedを設定してもhoveredは影響を受けない', () => {
      const { setSelectedPitchClass, setHoveredPitchClass } = useChromaticCircleStore.getState();

      const segmentC: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      const segmentG: ChromaticSegmentDTO = { position: 7, pitchClassName: 'G' };

      setHoveredPitchClass(segmentC);
      setSelectedPitchClass(segmentG);

      const { hoveredPitchClass } = useChromaticCircleStore.getState();
      expect(hoveredPitchClass).toEqual(segmentC); // 変わらない
    });
  });

  describe('境界値ケース', () => {
    test('正常ケース: position 0 のピッチクラスを選択できる', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      const segment: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      setSelectedPitchClass(segment);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass?.position).toBe(0);
    });

    test('正常ケース: position 11 のピッチクラスを選択できる', () => {
      const { setSelectedPitchClass } = useChromaticCircleStore.getState();

      const segment: ChromaticSegmentDTO = { position: 11, pitchClassName: 'B' };
      setSelectedPitchClass(segment);

      const { selectedPitchClass } = useChromaticCircleStore.getState();
      expect(selectedPitchClass?.position).toBe(11);
    });
  });
});
