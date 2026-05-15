import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

import {
  fetchMemoryEntries,
  postDayClosure,
  postEarlyBed,
  postSleepCancel,
  fetchReminderPreview,
} from './client';

function mockFetchResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const ok = init.ok ?? true;
  const status = init.status ?? (ok ? 200 : 400);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status,
      text: async () => JSON.stringify(body),
    })),
  );
}

describe('memory entries contract (9.1.1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses items from GET /v1/memory-entries', async () => {
    const items = [
      {
        id: 'm1',
        logicalSleepDate: '2026-05-10',
        dreamKey: 'star_path',
        nightSkyKey: 'clear_star',
        narrative: '今晚記住了：星光小路。',
        createdAt: '2026-05-11T00:00:00.000Z',
      },
    ];
    mockFetchResponse({ items });
    const result = await fetchMemoryEntries('dev');
    expect(result).toEqual(items);
  });
});

describe('day closure contract (9.1.2)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts action complete in JSON body', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          logicalSleepDate: '2026-05-12',
          dayClosureCompleted: true,
          dayClosureSkipped: false,
        }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    await postDayClosure('dev', 'complete');
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ action: 'complete' });
  });
});

describe('early bed contract (9.1.3)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts earlyBed boolean in JSON body', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ earlyBedForDream: true }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    await postEarlyBed('dev', true);
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(init.body))).toEqual({ earlyBed: true });
    expect(JSON.parse(String(init.body))).not.toHaveProperty('enabled');
  });
});

describe('reminder preview contract (9.1.4)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests templateKey query', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          mock: true,
          channel: 'push',
          templateKey: 'evening_nudge',
          deviceId: 'dev',
          pushEmotionalState: 'steady',
          title: '晚安星球',
          body: '睡前輕輕回來就好。',
        }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchReminderPreview('dev', 'evening_nudge');
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain('templateKey=evening_nudge');
  });

  it('requests optional pushEmotionalState query', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          mock: true,
          channel: 'push',
          templateKey: 'evening_nudge',
          deviceId: 'dev',
          pushEmotionalState: 'steady_companion',
          title: '小屋裡還亮著燈',
          body: '今晚的風有點安靜。',
        }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchReminderPreview('dev', 'evening_nudge', 'steady_companion');
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain('pushEmotionalState=steady_companion');
  });
});

describe('cancel sleep contract (9.1.5)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses cancelled and message from POST /v1/sleep/cancel', async () => {
    mockFetchResponse({ cancelled: true, message: '今晚先到這裡，明天再慢慢來。' });
    const res = await postSleepCancel('dev');
    expect(res.cancelled).toBe(true);
    expect(res.message).toMatch(/今晚先到這裡/);
  });

  it('returns flexible message on 400 without throwing', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ error: 'cannot_cancel', message: '今晚的夢已收好，不能撤回。' }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await postSleepCancel('dev');
    expect(res.cancelled).toBe(false);
    expect(res.message).toMatch(/不能撤回/);
  });
});
