/**
 * Hub共通データ構造とユーティリティ関数
 */

import type { HubType, HubInfo } from '../types';

/**
 * Hub定数データ
 *
 * 全てのHub情報の一元管理。現在は五度圏とクロマチックサークル
 */
export const HUBS: Record<HubType, HubInfo> = {
  'circle-of-fifths': {
    nameJa: '五度圏',
    nameEn: 'Circle of Fifths',
    description: '五度関係で配置された調の輪',
    shortName: '五度圏',
  },
  'chromatic-circle': {
    nameJa: 'クロマチックサークル',
    nameEn: 'Chromatic Circle',
    description: '半音階で配置された音の輪',
    shortName: 'クロマチック',
  },
};

/**
 * Hubの表示名（英語）を取得するユーティリティ関数
 *
 * @param hubType - Hub種類
 * @returns 英語表示名
 */
export const getHubDisplayNameEn = (hubType: HubType): string => {
  return HUBS[hubType].nameEn;
};

/**
 * Hubのオプション配列を取得（ViewControllerなどで使用）
 */
export const getHubOptions = () => {
  return Object.entries(HUBS).map(([key, hub]) => ({
    value: key as HubType,
    label: hub.shortName || hub.nameJa,
    description: hub.description,
  }));
};
