import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { resolveEmotionalPacing, RITUAL_FINAL_QUIET_SECONDS } from './emotionalPacing';
import {
  resolveNightSoundscapePlayback,
  slicePhaseToAppPhase,
} from './nightSoundscapePlayback';
import { resolveSoundProfile } from './soundProfile';
import { validateHumanSleepValidationBundle } from './humanSleepValidation';

describe('nightSoundscapePlayback (phase 1)', () => {
  it('maps slice phases to home, ritual, sleeping, and unbox reveal', () => {
    expect(slicePhaseToAppPhase({ slicePhase: 'home' })).toBe('home');
    expect(slicePhaseToAppPhase({ slicePhase: 'ritual', ritualSecondsLeft: 12 })).toBe('ritual');
    expect(slicePhaseToAppPhase({ slicePhase: 'sleeping' })).toBe('sleeping');
    expect(slicePhaseToAppPhase({ slicePhase: 'unbox-reveal' })).toBe('unboxing');
    expect(slicePhaseToAppPhase({ slicePhase: 'sleep-settings' })).toBeNull();
  });

  it('plays a single home ambience bed when night sound is enabled', () => {
    const pacing = resolveEmotionalPacing({ phase: 'home' });
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing,
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushSoundEnabled: false,
    });
    const plan = resolveNightSoundscapePlayback('home', profile, undefined, true);
    expect(plan.silent).toBe(false);
    expect(plan.loopAssetKey).toBe('bed_home_gentle');
    expect(plan.loopVolume).toBeGreaterThan(0);
  });

  it('lowers ritual breath during the final quiet window', () => {
    const pacing = resolveEmotionalPacing({
      phase: 'ritual',
      ritualSecondsLeft: RITUAL_FINAL_QUIET_SECONDS,
    });
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing,
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushSoundEnabled: false,
    });
    expect(pacing.allowUiClickSound).toBe(false);
    const plan = resolveNightSoundscapePlayback('ritual', profile, RITUAL_FINAL_QUIET_SECONDS, true);
    expect(plan.loopAssetKey).toBe('ritual_breath_gentle');
    expect(plan.loopVolume).toBeLessThan(0.1);
    expect(plan.oneShotAssetKey).toBeNull();
  });

  it('plays a single reveal on unbox and mutes sleeping', () => {
    const pacing = resolveEmotionalPacing({ phase: 'unbox-reveal' });
    const profile = resolveSoundProfile({
      archetype: 'gentle',
      pacing,
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: true,
      pushSoundEnabled: false,
    });
    const reveal = resolveNightSoundscapePlayback('unboxing', profile, undefined, true);
    expect(reveal.oneShotAssetKey).toBe('reveal_unbox');
    expect(reveal.loopAssetKey).toBeNull();

    const sleeping = resolveNightSoundscapePlayback('sleeping', profile, undefined, true);
    expect(sleeping.silent).toBe(true);
  });

  it('mutes playback when night sound is disabled', () => {
    const homePacing = resolveEmotionalPacing({ phase: 'home' });
    const mutedProfile = resolveSoundProfile({
      archetype: 'gentle',
      pacing: homePacing,
      reduceMotion: false,
      soundEnabled: true,
      nightSoundEnabled: false,
      pushSoundEnabled: false,
    });
    expect(resolveNightSoundscapePlayback('home', mutedProfile, undefined, false)).toEqual({
      loopAssetKey: null,
      loopVolume: 0,
      oneShotAssetKey: null,
      oneShotVolume: 0,
      silent: true,
    });
  });
});

describe('human sleep validation schema (phase 1)', () => {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const acceptanceDir = path.join(dir, '..', 'acceptance');

  it('ships the minimal record schema', () => {
    const schema = JSON.parse(
      readFileSync(path.join(acceptanceDir, 'human_sleep_validation.schema.json'), 'utf8'),
    ) as { required: string[] };
    expect(schema.required).toEqual(
      expect.arrayContaining(['calm', 'pressure', 'clarity_10s', 'blockingIssues', 'notes']),
    );
  });

  it('tracks seven-night validation as in progress until records are complete', () => {
    const bundle = JSON.parse(
      readFileSync(path.join(acceptanceDir, 'human_sleep_validation.json'), 'utf8'),
    );
    const validation = validateHumanSleepValidationBundle(bundle);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.bundle.status).toBe('in_progress');
      expect(validation.bundle.records.length).toBeLessThan(validation.bundle.windowDays);
    }
  });
});
