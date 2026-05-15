import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('device E2E flow (7.4.2 / 12.1.4)', () => {
  it('ships a Maestro night-flow recipe', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const flow = readFileSync(
      path.join(dir, '..', '..', 'mobile', '.maestro', 'night-flow.yaml'),
      'utf8',
    );
    expect(flow).toMatch(/home-start-ritual/);
    expect(flow).toMatch(/ritual-sleep-start/);
    expect(flow).toMatch(/sleeping-wake-unbox/);
    expect(flow).toMatch(/unbox-to-memory/);
    expect(flow).toMatch(/memory-to-world/);
    expect(flow).toMatch(/world-back-home/);
    expect(flow).toMatch(/home-open-memory/);
    expect(flow).toMatch(/home-day-closure/);
    expect(flow).toMatch(/sleep-settings-screen/);
    expect(flow).toMatch(/EXPO_PUBLIC_RITUAL_SECONDS/);
  });

  it('records a passed Maestro device run for RC', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const record = JSON.parse(
      readFileSync(path.join(dir, '..', '..', 'mobile', 'acceptance', 'maestro_device_run.json'), 'utf8'),
    ) as { status: string; flow: string };
    expect(record.status).toBe('passed');
    expect(record.flow).toBe('night-flow.yaml');
  });
});