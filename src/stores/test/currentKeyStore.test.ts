import { describe, it, expect, beforeEach } from 'vitest';
import { useCurrentKeyStore } from '../currentKeyStore';
import { Key } from '@/domain/key';
import { ModalContext } from '@/domain/modal-context';
import { PitchClass, ScalePattern } from '@/domain';

describe('currentKeyStore', () => {
  beforeEach(() => {
    // テスト前にストアをリセット
    useCurrentKeyStore.getState().resetToDefault();
  });

  it('初期状態はC Majorキーである', () => {
    const { currentKey } = useCurrentKeyStore.getState();

    expect(currentKey.centerPitch.sharpName).toBe('C');
    expect(currentKey.isMajor).toBe(true);
    expect(currentKey.contextName).toBe('C Major');
  });

  it('音楽キーを設定できる', () => {
    const newKey = Key.fromCircleOfFifths(1, true); // G Major

    useCurrentKeyStore.getState().setCurrentKey(newKey);

    const { currentKey } = useCurrentKeyStore.getState();
    expect(currentKey.centerPitch.sharpName).toBe('G');
    expect(currentKey.isMajor).toBe(true);
    expect(currentKey.contextName).toBe('G Major');
  });

  // setCurrentKeyFromKeyNameメソッドは現在コメントアウトされているためテストをスキップ

  // setCurrentKeyFromKeyNameメソッドのテストもスキップ

  it('デフォルトにリセットできる', () => {
    // まず別の音楽キーに設定
    useCurrentKeyStore.getState().setCurrentKey(Key.fromCircleOfFifths(4, false)); // E Minor

    expect(useCurrentKeyStore.getState().currentKey.centerPitch.sharpName).toBe('E');

    // デフォルトにリセット
    useCurrentKeyStore.getState().resetToDefault();

    const { currentKey } = useCurrentKeyStore.getState();
    expect(currentKey.centerPitch.sharpName).toBe('C');
    expect(currentKey.isMajor).toBe(true);
  });

  it('メジャーキーとマイナーキーを正しく区別する', () => {
    // メジャーキー
    useCurrentKeyStore.getState().setCurrentKey(Key.fromCircleOfFifths(6, true)); // F# Major

    const majorKey = useCurrentKeyStore.getState().currentKey as Key;
    expect(majorKey.isMajor).toBe(true);

    // マイナーキー
    useCurrentKeyStore.getState().setCurrentKey(Key.fromCircleOfFifths(2, false)); // D Minor

    const minorKey = useCurrentKeyStore.getState().currentKey as Key;
    expect(minorKey.isMajor).toBe(false);
  });

  describe('IMusicalContext型拡張（ModalContext対応）', () => {
    it('ModalContext型をsetCurrentKeyで設定できる', () => {
      const dDorian = new ModalContext(PitchClass.D, ScalePattern.Dorian);

      useCurrentKeyStore.getState().setCurrentKey(dDorian);

      const { currentKey } = useCurrentKeyStore.getState();
      expect(currentKey).toBe(dDorian);
      expect(currentKey.centerPitch).toBe(PitchClass.D);
      expect(currentKey.scale.pattern).toBe(ScalePattern.Dorian);
    });

    it('ModalContextの状態でgetRelativeMajorTonicが正しく動作', () => {
      const ePhrygian = new ModalContext(PitchClass.E, ScalePattern.Phrygian);

      useCurrentKeyStore.getState().setCurrentKey(ePhrygian);

      const relativeMajor = useCurrentKeyStore.getState().currentKey.getRelativeMajorTonic();
      expect(relativeMajor).toBe(PitchClass.C);
    });

    it('Key型とModalContext型を切り替えて設定できる', () => {
      // 最初にKey型を設定
      const cMajor = Key.fromCircleOfFifths(0, true);
      useCurrentKeyStore.getState().setCurrentKey(cMajor);
      expect(useCurrentKeyStore.getState().currentKey).toBe(cMajor);

      // 次にModalContext型を設定
      const fLydian = new ModalContext(PitchClass.F, ScalePattern.Lydian);
      useCurrentKeyStore.getState().setCurrentKey(fLydian);
      expect(useCurrentKeyStore.getState().currentKey).toBe(fLydian);

      // 再びKey型を設定
      const gMajor = Key.fromCircleOfFifths(1, true);
      useCurrentKeyStore.getState().setCurrentKey(gMajor);
      expect(useCurrentKeyStore.getState().currentKey).toBe(gMajor);
    });

    it('resetToDefaultでC Major Key（IMusicalContext）にリセットされる', () => {
      // ModalContextを設定
      const bLocrian = new ModalContext(PitchClass.B, ScalePattern.Locrian);
      useCurrentKeyStore.getState().setCurrentKey(bLocrian);

      expect(useCurrentKeyStore.getState().currentKey).toBe(bLocrian);

      // リセット
      useCurrentKeyStore.getState().resetToDefault();

      // C Major Keyに戻る
      const defaultKey = useCurrentKeyStore.getState().currentKey as Key;
      expect(defaultKey.centerPitch).toBe(PitchClass.C);
      expect(defaultKey.isMajor).toBe(true);
      expect(defaultKey.contextName).toBe('C Major');
    });
  });
});
