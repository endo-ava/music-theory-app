import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyController } from '../useKeyController';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { PitchClass, ScalePattern } from '@/domain/common';
import { Key } from '@/domain/key';
import { ModalContext } from '@/domain/modal-context';

describe('useKeyController', () => {
  beforeEach(() => {
    // 各テスト前にストアをC Majorにリセット
    const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
    useCurrentKeyStore.getState().setCurrentKey(cMajor);
  });

  describe('初期化と基本プロパティ', () => {
    it('正常ケース: 初期値がC Majorである', () => {
      const { result } = renderHook(() => useKeyController());

      expect(result.current.currentKey).toBeDefined();
      expect(result.current.currentTonic.sharpName).toBe('C');
      expect(result.current.currentModeIndex).toBe(1); // Major = Ionian = index 1
    });

    it('正常ケース: currentTonicがAbstractMusicalContextのcenterPitchを参照する', () => {
      const { result } = renderHook(() => useKeyController());

      const tonic = result.current.currentTonic;
      const centerPitch = result.current.currentKey.centerPitch;

      expect(tonic).toBe(centerPitch);
      expect(tonic.sharpName).toBe('C');
    });
  });

  describe('currentModeIndex計算', () => {
    it('正常ケース: Major（Ionian）の場合は1を返す', () => {
      const { result } = renderHook(() => useKeyController());

      expect(result.current.currentModeIndex).toBe(1); // Ionian = index 1 in MAJOR_MODES_BY_BRIGHTNESS
    });

    it('正常ケース: Dorianの場合は3を返す', () => {
      const dDorian = new ModalContext(PitchClass.fromCircleOfFifths(2), ScalePattern.Dorian);
      useCurrentKeyStore.getState().setCurrentKey(dDorian);

      const { result } = renderHook(() => useKeyController());

      // Dorian = index 3 in MAJOR_MODES_BY_BRIGHTNESS
      expect(result.current.currentModeIndex).toBe(3);
    });

    it('正常ケース: Lydianの場合は0を返す（最も明るい）', () => {
      const cLydian = new ModalContext(PitchClass.fromCircleOfFifths(0), ScalePattern.Lydian);
      useCurrentKeyStore.getState().setCurrentKey(cLydian);

      const { result } = renderHook(() => useKeyController());

      expect(result.current.currentModeIndex).toBe(0); // Lydian = index 0 (最も明るい)
    });

    it('正常ケース: Aeolian（Minor）の場合は4を返す', () => {
      const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3)); // A minor
      useCurrentKeyStore.getState().setCurrentKey(aMinor);

      const { result } = renderHook(() => useKeyController());

      // Aeolian = index 4 in MAJOR_MODES_BY_BRIGHTNESS
      expect(result.current.currentModeIndex).toBe(4);
    });

    it('正常ケース: Locrianの場合は6を返す（最も暗い）', () => {
      const bLocrian = new ModalContext(PitchClass.fromCircleOfFifths(5), ScalePattern.Locrian);
      useCurrentKeyStore.getState().setCurrentKey(bLocrian);

      const { result } = renderHook(() => useKeyController());

      expect(result.current.currentModeIndex).toBe(6); // Locrian = index 6 (最も暗い)
    });
  });

  describe('handleRootChange - Root（Tonic）変更', () => {
    it('正常ケース: Major時にTonicを変更するとKeyインスタンスが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      // C Major → D Major
      const dPitchClass = PitchClass.fromCircleOfFifths(2); // D

      act(() => {
        result.current.handleRootChange(dPitchClass);
      });

      expect(result.current.currentTonic.sharpName).toBe('D');
      expect(result.current.currentKey).toBeInstanceOf(Key);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Major);
    });

    it('正常ケース: Aeolian（Minor）時にTonicを変更するとKeyインスタンスが生成される', () => {
      // A Minor に設定
      const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3));
      useCurrentKeyStore.getState().setCurrentKey(aMinor);

      const { result } = renderHook(() => useKeyController());

      // A Minor → E Minor
      const ePitchClass = PitchClass.fromCircleOfFifths(4); // E

      act(() => {
        result.current.handleRootChange(ePitchClass);
      });

      expect(result.current.currentTonic.sharpName).toBe('E');
      expect(result.current.currentKey).toBeInstanceOf(Key);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Aeolian);
    });

    it('正常ケース: Dorianモード時にTonicを変更するとModalContextが生成される', () => {
      // D Dorian に設定
      const dDorian = new ModalContext(PitchClass.fromCircleOfFifths(2), ScalePattern.Dorian);
      useCurrentKeyStore.getState().setCurrentKey(dDorian);

      const { result } = renderHook(() => useKeyController());

      // D Dorian → E Dorian
      const ePitchClass = PitchClass.fromCircleOfFifths(4); // E

      act(() => {
        result.current.handleRootChange(ePitchClass);
      });

      expect(result.current.currentTonic.sharpName).toBe('E');
      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('正常ケース: Lydianモード時にTonicを変更するとModalContextが生成される', () => {
      // C Lydian に設定
      const cLydian = new ModalContext(PitchClass.fromCircleOfFifths(0), ScalePattern.Lydian);
      useCurrentKeyStore.getState().setCurrentKey(cLydian);

      const { result } = renderHook(() => useKeyController());

      // C Lydian → F Lydian
      const fPitchClass = PitchClass.fromCircleOfFifths(11); // F

      act(() => {
        result.current.handleRootChange(fPitchClass);
      });

      expect(result.current.currentTonic.sharpName).toBe('F');
      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Lydian);
    });
  });

  describe('handleModeChange - Mode変更', () => {
    it('正常ケース: Ionian（index=1）に変更するとKey.majorが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      // 現在C Major（index=1）なので、まずDorianに変更
      act(() => {
        result.current.handleModeChange(3); // Dorian
      });

      // 再度Ionianに変更
      act(() => {
        result.current.handleModeChange(1); // Ionian (Major)
      });

      expect(result.current.currentKey).toBeInstanceOf(Key);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Major);
      expect(result.current.currentTonic.sharpName).toBe('C');
    });

    it('正常ケース: Aeolian（index=4）に変更するとKey.minorが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      act(() => {
        result.current.handleModeChange(4); // Aeolian (Natural Minor)
      });

      expect(result.current.currentKey).toBeInstanceOf(Key);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Aeolian);
      expect(result.current.currentTonic.sharpName).toBe('C'); // Tonicは維持
    });

    it('正常ケース: Lydian（index=0）に変更するとModalContextが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      act(() => {
        result.current.handleModeChange(0); // Lydian
      });

      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Lydian);
      expect(result.current.currentTonic.sharpName).toBe('C'); // Tonicは維持
    });

    it('正常ケース: Dorian（index=3）に変更するとModalContextが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      act(() => {
        result.current.handleModeChange(3); // Dorian
      });

      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
      expect(result.current.currentTonic.sharpName).toBe('C'); // Tonicは維持
    });

    it('正常ケース: Locrian（index=6）に変更するとModalContextが生成される', () => {
      const { result } = renderHook(() => useKeyController());

      act(() => {
        result.current.handleModeChange(6); // Locrian
      });

      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Locrian);
      expect(result.current.currentTonic.sharpName).toBe('C'); // Tonicは維持
    });

    it('正常ケース: Tonicを維持したまま異なるモードに変更', () => {
      // D Major に設定
      const dMajor = Key.major(PitchClass.fromCircleOfFifths(2));
      useCurrentKeyStore.getState().setCurrentKey(dMajor);

      const { result } = renderHook(() => useKeyController());

      expect(result.current.currentTonic.sharpName).toBe('D');

      // D Major → D Dorian
      act(() => {
        result.current.handleModeChange(3); // Dorian
      });

      expect(result.current.currentTonic.sharpName).toBe('D'); // Tonic維持
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('異常ケース: 範囲外のインデックス（-1）ではwarningを出力し、変更しない', () => {
      const { result } = renderHook(() => useKeyController());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const beforeKey = result.current.currentKey;

      act(() => {
        result.current.handleModeChange(-1);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Invalid mode index: -1');
      expect(result.current.currentKey).toBe(beforeKey); // 変更されていない

      consoleSpy.mockRestore();
    });

    it('異常ケース: 範囲外のインデックス（7以上）ではwarningを出力し、変更しない', () => {
      const { result } = renderHook(() => useKeyController());
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const beforeKey = result.current.currentKey;

      act(() => {
        result.current.handleModeChange(7);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Invalid mode index: 7');
      expect(result.current.currentKey).toBe(beforeKey); // 変更されていない

      consoleSpy.mockRestore();
    });
  });

  describe('統合テスト - RootとModeの組み合わせ', () => {
    it('正常ケース: Root変更→Mode変更の順で実行', () => {
      const { result } = renderHook(() => useKeyController());

      // C Major → D Major
      act(() => {
        result.current.handleRootChange(PitchClass.fromCircleOfFifths(2)); // D
      });

      expect(result.current.currentTonic.sharpName).toBe('D');
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Major);

      // D Major → D Dorian
      act(() => {
        result.current.handleModeChange(3); // Dorian
      });

      expect(result.current.currentTonic.sharpName).toBe('D');
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('正常ケース: Mode変更→Root変更の順で実行', () => {
      const { result } = renderHook(() => useKeyController());

      // C Major → C Dorian
      act(() => {
        result.current.handleModeChange(3); // Dorian
      });

      expect(result.current.currentTonic.sharpName).toBe('C');
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);

      // C Dorian → E Dorian
      act(() => {
        result.current.handleRootChange(PitchClass.fromCircleOfFifths(4)); // E
      });

      expect(result.current.currentTonic.sharpName).toBe('E');
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('正常ケース: Major→Dorian→Minor→Lydianと連続変更', () => {
      const { result } = renderHook(() => useKeyController());

      // C Major (初期状態)
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Major);

      // → C Dorian
      act(() => {
        result.current.handleModeChange(3);
      });
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Dorian);

      // → C Minor (Aeolian)
      act(() => {
        result.current.handleModeChange(4);
      });
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Aeolian);
      expect(result.current.currentKey).toBeInstanceOf(Key);

      // → C Lydian
      act(() => {
        result.current.handleModeChange(0);
      });
      expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Lydian);
      expect(result.current.currentKey).toBeInstanceOf(ModalContext);
    });
  });

  describe('エッジケースと境界値', () => {
    it('境界値ケース: 全12音のTonicに対してMajorキーを設定', () => {
      const { result } = renderHook(() => useKeyController());

      for (let fifthsIndex = 0; fifthsIndex < 12; fifthsIndex++) {
        const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);

        act(() => {
          result.current.handleRootChange(pitchClass);
        });

        // まずMajorに設定
        act(() => {
          result.current.handleModeChange(1);
        });

        expect(result.current.currentTonic).toBe(pitchClass);
        expect(result.current.currentKey.scale.pattern).toBe(ScalePattern.Major);
      }
    });

    it('境界値ケース: 全7モードに対してC音をTonicとして設定', () => {
      const { result } = renderHook(() => useKeyController());
      const cPitchClass = PitchClass.fromCircleOfFifths(0);

      for (let modeIndex = 0; modeIndex < 7; modeIndex++) {
        act(() => {
          result.current.handleModeChange(modeIndex);
        });

        expect(result.current.currentTonic).toBe(cPitchClass);

        const expectedPattern = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS[modeIndex];
        expect(result.current.currentKey.scale.pattern).toBe(expectedPattern);
      }
    });
  });
});
