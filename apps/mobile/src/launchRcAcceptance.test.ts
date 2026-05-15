import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { LAUNCH_METRIC_EVENTS } from './launchMetrics';
import { validateHumanSleepValidationBundle } from './humanSleepValidation';

const dir = path.dirname(fileURLToPath(import.meta.url));
const acceptanceDir = path.join(dir, '..', 'acceptance');

function readAcceptance<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(acceptanceDir, name), 'utf8')) as T;
}

describe('launch RC acceptance records (12.1.4–12.3.4)', () => {
  it('records Maestro and Expo Go RC evidence', () => {
    const maestro = readAcceptance<{ status: string; flow: string }>('maestro_device_run.json');
    const manual = readAcceptance<{ status: string; testIds: string[] }>('expo_go_manual_ux.json');
    expect(maestro.status).toBe('passed');
    expect(maestro.flow).toBe('night-flow.yaml');
    expect(manual.status).toBe('passed');
    expect(manual.testIds).toContain('TonightHome');
  });

  it('records human validation windows for §12.2', () => {
    const sleep = readAcceptance<{
      status: string;
      windowDays: number;
      records: unknown[];
      schema: string;
    }>('human_sleep_validation.json');
    const rhythm = readAcceptance<{ status: string; anchors: number[] }>('rhythm_milestone_qualitative.json');
    const home = readAcceptance<{ status: string }>('home_ia_review.json');
    const ritual = readAcceptance<{ status: string }>('ritual_pacing_review.json');
    const validation = validateHumanSleepValidationBundle(sleep);
    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.bundle.schema).toBe('human_sleep_validation.schema.json');
      expect(validation.bundle.windowDays).toBeGreaterThanOrEqual(7);
      expect(validation.bundle.status).toBe('in_progress');
      expect(validation.bundle.records.length).toBeLessThan(validation.bundle.windowDays);
    }
    expect(rhythm.anchors).toEqual([1, 3, 7, 14, 30]);
    expect(home.status).toBe('passed');
    expect(ritual.status).toBe('passed');
  });

  it('records launch metrics event names without analytics panel', () => {
    const metrics = readAcceptance<{ events: string[]; implementation: string }>('launch_metrics_events.json');
    expect(metrics.events).toEqual([...LAUNCH_METRIC_EVENTS]);
    expect(metrics.implementation).toMatch(/launchMetrics\.ts$/);
  });

  it('records push and store RC sign-off', () => {
    const push = readAcceptance<{ status: string; anchor: string }>('push_device_validation.json');
    const store = readAcceptance<{ status: string; manifest: string }>('store_release_signoff.json');
    expect(push.status).toBe('passed');
    expect(push.anchor).toBe('targetSleepTimeLocal');
    expect(store.status).toBe('passed');
    expect(store.manifest).toBe('docs/store_assets_manifest.json');
  });
});

describe('launch decisions (12.4)', () => {
  it('documents RC product boundaries', () => {
    const decisions = readAcceptance<{
      accountMultidevice: { decision: string };
      tierFourAndContent: { decision: string };
      tabDeepLinkManualRecord: { decision: string };
    }>('launch_decisions.json');
    expect(decisions.accountMultidevice.decision).toBe('post_launch');
    expect(decisions.tierFourAndContent.decision).toMatch(/tier_four/);
    expect(decisions.tabDeepLinkManualRecord.decision).toBe('excluded_from_slice');
  });
});
