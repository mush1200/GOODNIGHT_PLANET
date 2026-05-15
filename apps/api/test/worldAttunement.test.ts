import { describe, expect, it } from 'vitest';
import {
  WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD,
  logicalDaysSinceLastOpen,
  worldAttunementState,
} from '../src/worldAttunement.js';

const shame = /失敗|活該|丟臉|你又不|沒救了|再不睡|你應該/i;

describe('worldAttunement (2.6.2)', () => {
  it('N1 matches game_balance_tables.md §7 (exclusive wilt)', () => {
    expect(WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD).toBe(3);
  });

  it('logicalDaysSinceLastOpen uses logical_sleep_date difference', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    const same = new Date('2026-05-13T08:00:00.000Z');
    expect(logicalDaysSinceLastOpen(same, now)).toBe(0);

    const threeApart = new Date('2026-05-10T12:00:00.000Z');
    expect(logicalDaysSinceLastOpen(threeApart, now)).toBe(3);

    const fourApart = new Date('2026-05-09T12:00:00.000Z');
    expect(logicalDaysSinceLastOpen(fourApart, now)).toBe(4);
  });

  it('null last open → 0 days, steady', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    expect(logicalDaysSinceLastOpen(null, now)).toBe(0);
    const s = worldAttunementState({
      lastOpenAt: null,
      now,
      ritualCountdownCompleted: false,
      sleepStarted: false,
    });
    expect(s.worldAttunement).toBe('steady');
    expect(s.attunementHint).toBeNull();
  });

  it('W1: gap > N1 and no ritual tonight → wilted + 想念語氣（禁羞恥）', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    const last = new Date('2026-05-09T12:00:00.000Z');
    const s = worldAttunementState({
      lastOpenAt: last,
      now,
      ritualCountdownCompleted: false,
      sleepStarted: false,
    });
    expect(s.worldAttunement).toBe('wilted');
    expect(s.daysSinceLastOpenLogical).toBeGreaterThan(WORLD_ATTUNEMENT_WILT_EXCLUSIVE_THRESHOLD);
    expect(s.attunementHint).toMatch(/小屋|等你/);
    expect(String(s.attunementHint)).not.toMatch(shame);
  });

  it('at N1 days exactly → not wilted (strict >)', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    const last = new Date('2026-05-10T12:00:00.000Z');
    const s = worldAttunementState({
      lastOpenAt: last,
      now,
      ritualCountdownCompleted: false,
      sleepStarted: false,
    });
    expect(s.daysSinceLastOpenLogical).toBe(3);
    expect(s.worldAttunement).toBe('steady');
  });

  it('W2: ritual tonight + would wilt → recovering', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    const last = new Date('2026-05-09T12:00:00.000Z');
    const s = worldAttunementState({
      lastOpenAt: last,
      now,
      ritualCountdownCompleted: true,
      sleepStarted: false,
    });
    expect(s.worldAttunement).toBe('recovering');
    expect(String(s.attunementHint)).not.toMatch(shame);
  });

  it('sleepStarted alone counts as ritual engagement', () => {
    const now = new Date('2026-05-13T12:00:00.000Z');
    const last = new Date('2026-05-09T12:00:00.000Z');
    const s = worldAttunementState({
      lastOpenAt: last,
      now,
      ritualCountdownCompleted: false,
      sleepStarted: true,
    });
    expect(s.worldAttunement).toBe('recovering');
  });
});
