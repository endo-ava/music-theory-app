import { describe, test, expect } from 'vitest';
import * as utilsIndex from '../index';

describe('utils index exports', () => {
  test('エクスポートの確認: すべてのモジュールが正しくエクスポートされている', () => {
    // validation モジュールのエクスポート確認
    expect(utilsIndex.validation).toBeDefined();
    expect(typeof utilsIndex.validation.isValidPosition).toBe('function');

    // pathGeneration モジュールのエクスポート確認
    expect(utilsIndex.pathGeneration).toBeDefined();
    expect(typeof utilsIndex.pathGeneration.generatePizzaSlicePath).toBe('function');
    expect(typeof utilsIndex.pathGeneration.generateThreeSegmentPaths).toBe('function');
  });

  test('エクスポートの確認: ネームスペース形式でアクセス可能', () => {
    // validation 関数のテスト
    expect(utilsIndex.validation.isValidPosition(5)).toBe(true);
    expect(utilsIndex.validation.isValidPosition(-1)).toBe(false);
  });

  test('エクスポートの確認: 各モジュールが独立している', () => {
    // 各モジュールが異なるオブジェクトであることを確認
    expect(utilsIndex.validation).not.toBe(utilsIndex.pathGeneration);
  });
});
