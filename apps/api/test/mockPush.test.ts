import { describe, expect, it } from 'vitest';
import { buildReminderPushPayload } from '../src/push/mockPush.js';

describe('mockPush adapter (2.9.2)', () => {
  it('builds deterministic mock payload with emotional state and title', () => {
    const p = buildReminderPushPayload({
      deviceId: 'gp_test_device',
      templateKey: 'evening_nudge',
      petArchetype: 'shy',
      pushEmotionalState: 'steady_companion',
    });
    expect(p.mock).toBe(true);
    expect(p.deviceId).toBe('gp_test_device');
    expect(p.channel).toBe('push');
    expect(p.pushEmotionalState).toBe('steady_companion');
    expect(p.title.length).toBeGreaterThan(2);
    expect(p.body.length).toBeGreaterThan(4);
  });
});
