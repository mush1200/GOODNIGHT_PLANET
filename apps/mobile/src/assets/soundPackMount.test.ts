import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { resolveEmotionalPacing } from '../emotionalPacing';
import { notificationSoundForProfile } from '../nightSoundscape';
import { resolveSoundProfile } from '../soundProfile';
import {
  LISTENING_SOUND_KEYS,
  SOUND_PACK_PROFILE_KEYS,
  isSoundPackKey,
  listeningKeyForProfileKey,
  soundPackAssetPath,
  soundPackKeysForProfile,
} from './soundPack';

describe('sound pack mount (12.3.2)', () => {
  it('ships the minimum sound_direction keys on disk', () => {
    for (const key of SOUND_PACK_PROFILE_KEYS) {
      expect(isSoundPackKey(key)).toBe(true);
      const listeningKey = listeningKeyForProfileKey(key);
      if (!listeningKey) continue;
      expect(existsSync(soundPackAssetPath(key))).toBe(true);
      expect(readFileSync(soundPackAssetPath(key)).subarray(0, 4).toString('utf8')).toBe('RIFF');
    }
  });

  it('keeps notification sound muted when night sound is off', () => {
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing: resolveEmotionalPacing({ phase: 'ritual', ritualSecondsLeft: 4 }),
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: false,
      pushSoundEnabled: true,
    });
    expect(notificationSoundForProfile(profile)).toBeNull();
    expect(soundPackKeysForProfile(profile)).not.toContain('push_goodnight_whisper');
  });

  it('maps profile keys to the listening-tier soft pack', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const manifest = JSON.parse(
      readFileSync(path.join(dir, '..', '..', 'assets', 'sounds', 'manifest.json'), 'utf8'),
    ) as { tier: string; version: number; listening: string[] };
    expect(manifest.tier).toBe('listening');
    expect(manifest.version).toBeGreaterThanOrEqual(3);
    expect(manifest.listening).toEqual([...LISTENING_SOUND_KEYS]);
    expect(listeningKeyForProfileKey('ui_confirm_gentle')).toBe('ui_confirm_soft');
    expect(listeningKeyForProfileKey('push_goodnight_whisper')).toBe('push_preview_soft');
    expect(listeningKeyForProfileKey('bed_home_gentle')).toBe('ritual_breath_soft');
  });
});
