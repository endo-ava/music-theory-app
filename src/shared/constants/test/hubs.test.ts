import { describe, it, expect } from 'vitest';
import { HUBS, getHubDisplayNameEn, getHubOptions } from '../hubs';
import type { HubType } from '../../types';

describe('hubs constants', () => {
  describe('getHubDisplayNameEn関数', () => {
    it('正常ケース: circle-of-fifthsの英語名を取得', () => {
      const result = getHubDisplayNameEn('circle-of-fifths');
      expect(result).toBe('Circle of Fifths');
    });

    it('正常ケース: chromatic-circleの英語名を取得', () => {
      const result = getHubDisplayNameEn('chromatic-circle');
      expect(result).toBe('Chromatic Circle');
    });

    it('境界値ケース: 全てのHubTypeの英語名を正しく取得', () => {
      const hubTypes: HubType[] = ['circle-of-fifths', 'chromatic-circle'];

      hubTypes.forEach(hubType => {
        const result = getHubDisplayNameEn(hubType);
        expect(typeof result).toBe('string');
        expect(result).not.toBe('');
        expect(result).toBe(HUBS[hubType].nameEn);
      });
    });
  });

  describe('getHubOptions関数', () => {
    it('正常ケース: 正しいオプション配列を生成', () => {
      const result = getHubOptions();

      expect(result).toEqual([
        {
          value: 'circle-of-fifths',
          label: 'Circle of Fifths',
          description: 'Keys arranged by fifths',
        },
        {
          value: 'chromatic-circle',
          label: 'Chromatic Circle',
          description: 'Notes arranged chromatically',
        },
      ]);
    });

    it('正常ケース: 配列の各要素が正しい型構造を持つ', () => {
      const result = getHubOptions();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);

      result.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('description');

        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
        expect(typeof option.description).toBe('string');

        // valueは有効なHubTypeである
        expect(['circle-of-fifths', 'chromatic-circle']).toContain(option.value);
      });
    });

    it('正常ケース: shortNameがlabelに使用される', () => {
      const result = getHubOptions();

      result.forEach(option => {
        const hubInfo = HUBS[option.value as HubType];
        expect(option.label).toBe(hubInfo.shortName);
      });
    });

    it('正常ケース: descriptionがHUBSデータと一致する', () => {
      const result = getHubOptions();

      result.forEach(option => {
        const hubInfo = HUBS[option.value as HubType];
        expect(option.description).toBe(hubInfo.description);
      });
    });

    it('境界値ケース: 全てのHubTypeがオプションに含まれる', () => {
      const result = getHubOptions();
      const hubTypes: HubType[] = ['circle-of-fifths', 'chromatic-circle'];

      const resultValues = result.map(option => option.value);
      expect(resultValues).toEqual(expect.arrayContaining(hubTypes));
      expect(resultValues).toHaveLength(hubTypes.length);
    });

    it('正常ケース: 関数の呼び出しが冪等である', () => {
      const result1 = getHubOptions();
      const result2 = getHubOptions();

      expect(result1).toEqual(result2);
    });
  });
});
