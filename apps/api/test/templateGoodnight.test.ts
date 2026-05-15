import { describe, expect, it } from 'vitest';
import { GOODNIGHT_LINES } from '../src/goodnightLines.js';
import {
  PET_ARCHETYPES,
  TEMPLATE_GOODNIGHT_KEYS,
  normalizePetArchetype,
  pushTemplatePayload,
  pushTemplateTitle,
  templateGoodnightBody,
} from '../src/templateGoodnight.js';
import { PUSH_EMOTIONAL_STATES } from '../src/pushEmotionalState.js';

const ipUnsafe = /SSR|UR\b|NO\.\s*\d+|圖鑑/u;
const shame = /失敗|活該|丟臉|你又不|沒救了|再不睡|你應該|治療失眠|睡眠障礙/i;

describe('templateGoodnight (2.5.5 push / system copy)', () => {
  it('every template × state × archetype is short and tone-safe', () => {
    for (const key of TEMPLATE_GOODNIGHT_KEYS) {
      for (const state of PUSH_EMOTIONAL_STATES) {
        for (const arch of PET_ARCHETYPES) {
          const body = templateGoodnightBody(key, arch, state);
          expect(body.length).toBeGreaterThan(4);
          expect(body.length).toBeLessThanOrEqual(48);
          expect(body).not.toMatch(ipUnsafe);
          expect(body).not.toMatch(shame);
        }
      }
    }
  });

  it('templates are not drawn from the in-app goodnight line pool', () => {
    const pool = new Set(GOODNIGHT_LINES);
    for (const key of TEMPLATE_GOODNIGHT_KEYS) {
      for (const state of PUSH_EMOTIONAL_STATES) {
        for (const arch of PET_ARCHETYPES) {
          expect(pool.has(templateGoodnightBody(key, arch, state))).toBe(false);
        }
      }
    }
  });

  it('normalizePetArchetype falls back to gentle', () => {
    expect(normalizePetArchetype(undefined)).toBe('gentle');
    expect(normalizePetArchetype('unknown')).toBe('gentle');
    expect(normalizePetArchetype('night_owl')).toBe('night_owl');
  });

  it('pushTemplatePayload includes title and emotional state', () => {
    const p = pushTemplatePayload('ritual_invite', 'shy', 'recovering');
    expect(p.channel).toBe('push');
    expect(p.templateKey).toBe('ritual_invite');
    expect(p.petArchetype).toBe('shy');
    expect(p.pushEmotionalState).toBe('recovering');
    expect(p.title).toBe(pushTemplateTitle('recovering'));
    expect(p.body).toBe(templateGoodnightBody('ritual_invite', 'shy', 'recovering'));
  });
});
