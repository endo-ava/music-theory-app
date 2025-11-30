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
    nameJa: 'Circle of Fifths',
    nameEn: 'Circle of Fifths',
    description: 'Keys arranged by fifths',
    shortName: 'Circle of Fifths',
  },
  'chromatic-circle': {
    nameJa: 'Chromatic Circle',
    nameEn: 'Chromatic Circle',
    description: 'Notes arranged chromatically',
    shortName: 'Chromatic Circle',
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
    label: hub.shortName,
    description: hub.description,
  }));
};
