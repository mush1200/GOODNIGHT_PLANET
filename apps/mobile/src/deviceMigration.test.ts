import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEVICE_BACKUP_KEY, DEVICE_KEY, MANUAL_SLEEP_RECORD_LAUNCH_EXCLUDED, rememberDeviceForMigration, restoreDeviceFromBackup } from './deviceMigration';

describe('device migration (7.4.4)', () => {
  it('backs up the active device id before writes', async () => {
    const store = new Map<string, string>([[DEVICE_KEY, 'gp_test']]);
    await rememberDeviceForMigration(
      async (key) => store.get(key) ?? null,
      async (key, value) => {
        store.set(key, value);
      },
    );
    expect(store.get(DEVICE_BACKUP_KEY)).toBe('gp_test');
  });

  it('restores the backed up device id', async () => {
    const store = new Map<string, string>([
      [DEVICE_KEY, 'gp_new'],
      [DEVICE_BACKUP_KEY, 'gp_old'],
    ]);
    const restored = await restoreDeviceFromBackup(
      async (key) => store.get(key) ?? null,
      async (key, value) => {
        store.set(key, value);
      },
    );
    expect(restored).toBe('gp_old');
    expect(store.get(DEVICE_KEY)).toBe('gp_old');
  });

  it('documents manual sleep record as launch-excluded API surface', () => {
    expect(MANUAL_SLEEP_RECORD_LAUNCH_EXCLUDED).toBe(true);
  });

  it('anchors launch decisions for account, content, and navigation scope', () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const decisions = JSON.parse(
      readFileSync(path.join(dir, '..', 'acceptance', 'launch_decisions.json'), 'utf8'),
    ) as {
      accountMultidevice: { decision: string };
      tabDeepLinkManualRecord: { decision: string };
    };
    expect(decisions.accountMultidevice.decision).toBe('post_launch');
    expect(decisions.tabDeepLinkManualRecord.decision).toBe('excluded_from_slice');
  });
});
