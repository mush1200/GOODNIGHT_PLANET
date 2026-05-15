import type { DreamKey } from '../api/openapiTypes';

export const DREAM_NAMES: Record<DreamKey, string> = {
  rain_city: '雨天夢',
  star_path: '星光夢',
  train_whisper: '列車囈語',
  lake_mirror: '湖光夢',
  aurora_hint: '極光預感',
};

export function dreamNameForKey(key: string | undefined): string {
  if (key && key in DREAM_NAMES) return DREAM_NAMES[key as DreamKey];
  return '今夜夢';
}
