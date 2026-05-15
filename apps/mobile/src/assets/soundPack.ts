import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PetArchetype } from '../api/openapiTypes';
import type { SoundProfile } from '../soundProfile';

const dir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(path.join(dir, '..', '..', 'assets', 'sounds', 'manifest.json'), 'utf8'),
) as { keys: string[]; listening: string[] };

export const SOUND_PACK_KEYS = manifest.keys as readonly string[];
export const LISTENING_SOUND_KEYS = manifest.listening as readonly string[];

export type SoundPackKey = (typeof SOUND_PACK_KEYS)[number];
export type ListeningSoundKey = (typeof LISTENING_SOUND_KEYS)[number];

const archetypes: PetArchetype[] = ['gentle', 'sleepy', 'shy', 'night_owl'];

export const SOUND_PACK_PROFILE_KEYS = [
  ...archetypes.map((archetype) => `ui_confirm_${archetype}`),
  ...archetypes.map((archetype) => `ritual_breath_${archetype}`),
  ...archetypes.map((archetype) => `bed_home_${archetype}`),
  'reveal_unbox',
  'transition_soft',
  'push_goodnight_whisper',
] as const;

const LISTENING_ALIAS: Record<string, ListeningSoundKey> = {
  ui_confirm_gentle: 'ui_confirm_soft',
  ui_confirm_sleepy: 'ui_confirm_soft',
  ui_confirm_shy: 'ui_confirm_soft',
  ui_confirm_night_owl: 'ui_confirm_soft',
  ritual_breath_gentle: 'ritual_breath_soft',
  ritual_breath_sleepy: 'ritual_breath_soft',
  ritual_breath_shy: 'ritual_breath_soft',
  ritual_breath_night_owl: 'ritual_breath_soft',
  bed_home_gentle: 'ritual_breath_soft',
  bed_home_sleepy: 'ritual_breath_soft',
  bed_home_shy: 'ritual_breath_soft',
  bed_home_night_owl: 'ritual_breath_soft',
  reveal_unbox: 'reveal_unbox_soft',
  transition_soft: 'transition_soft',
  push_goodnight_whisper: 'push_preview_soft',
};

export function isSoundPackKey(key: string): key is SoundPackKey {
  return (SOUND_PACK_KEYS as readonly string[]).includes(key);
}

export function listeningKeyForProfileKey(key: string): ListeningSoundKey | null {
  if (key in LISTENING_ALIAS) {
    return LISTENING_ALIAS[key];
  }
  return null;
}

export function soundPackAssetPath(key: string): string {
  const listeningKey = listeningKeyForProfileKey(key);
  if (!listeningKey) {
    throw new Error(`unknown_sound_pack_key:${key}`);
  }
  return path.join(dir, '..', '..', 'assets', 'sounds', 'listening', `${listeningKey}.wav`);
}

export function soundPackKeysForProfile(profile: SoundProfile): string[] {
  const keys = [
    profile.uiConfirmAssetKey,
    profile.ritualBreathAssetKey,
    profile.revealAssetKey,
    profile.transitionAssetKey,
  ];
  if (profile.ambientBedAssetKey) keys.push(profile.ambientBedAssetKey);
  if (profile.notificationSoundKey !== 'silent') keys.push(profile.notificationSoundKey);
  return keys;
}

export function soundPackModuleForKey(key: string): number {
  const listeningKey = listeningKeyForProfileKey(key);
  if (!listeningKey) {
    throw new Error(`unknown_sound_pack_key:${key}`);
  }
  switch (listeningKey) {
    case 'ui_confirm_soft':
      return require('../../assets/sounds/listening/ui_confirm_soft.wav');
    case 'ritual_breath_soft':
      return require('../../assets/sounds/listening/ritual_breath_soft.wav');
    case 'reveal_unbox_soft':
      return require('../../assets/sounds/listening/reveal_unbox_soft.wav');
    case 'transition_soft':
      return require('../../assets/sounds/listening/transition_soft.wav');
    case 'push_preview_soft':
      return require('../../assets/sounds/listening/push_preview_soft.wav');
    default:
      throw new Error(`unknown_listening_key:${listeningKey}`);
  }
}
