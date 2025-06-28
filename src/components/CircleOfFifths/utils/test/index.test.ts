import { describe, test, expect } from 'vitest';
import * as utilsIndex from '../index';

describe('utils index exports', () => {
  test('エクスポートの確認: すべてのモジュールが正しくエクスポートされている', () => {
    // validation モジュールのエクスポート確認
    expect(utilsIndex.validation).toBeDefined();
    expect(typeof utilsIndex.validation.isValidPosition).toBe('function');
    expect(typeof utilsIndex.validation.isValidKey).toBe('function');
    
    // geometry モジュールのエクスポート確認
    expect(utilsIndex.geometry).toBeDefined();
    expect(typeof utilsIndex.geometry.calculateAngle).toBe('function');
    expect(typeof utilsIndex.geometry.normalizeAngle).toBe('function');
    expect(typeof utilsIndex.geometry.polarToCartesian).toBe('function');
    expect(typeof utilsIndex.geometry.calculateTextPosition).toBe('function');
    expect(typeof utilsIndex.geometry.calculateTextRotation).toBe('function');
    
    // pathGeneration モジュールのエクスポート確認
    expect(utilsIndex.pathGeneration).toBeDefined();
    expect(typeof utilsIndex.pathGeneration.generatePizzaSlicePath).toBe('function');
    expect(typeof utilsIndex.pathGeneration.generateThreeSegmentPaths).toBe('function');
    
    // dataOperations モジュールのエクスポート確認
    expect(utilsIndex.dataOperations).toBeDefined();
    expect(typeof utilsIndex.dataOperations.getKeyInfo).toBe('function');
  });
  
  test('エクスポートの確認: ネームスペース形式でアクセス可能', () => {
    // validation 関数のテスト
    expect(utilsIndex.validation.isValidPosition(5)).toBe(true);
    expect(utilsIndex.validation.isValidPosition(-1)).toBe(false);
    
    // geometry 関数のテスト
    expect(utilsIndex.geometry.calculateTextRotation()).toBe(0);
    expect(utilsIndex.geometry.normalizeAngle(0)).toBe(0);
    
    // 関数が実際に動作することを確認
    const result = utilsIndex.geometry.polarToCartesian(100, 0);
    expect(result.x).toBeCloseTo(100);
    expect(result.y).toBeCloseTo(0);
  });
  
  test('エクスポートの確認: 各モジュールが独立している', () => {
    // 各モジュールが異なるオブジェクトであることを確認
    expect(utilsIndex.validation).not.toBe(utilsIndex.geometry);
    expect(utilsIndex.geometry).not.toBe(utilsIndex.pathGeneration);
    expect(utilsIndex.pathGeneration).not.toBe(utilsIndex.dataOperations);
    expect(utilsIndex.dataOperations).not.toBe(utilsIndex.validation);
  });
});