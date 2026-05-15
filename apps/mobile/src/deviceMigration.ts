export const DEVICE_KEY = 'gp_device_v1';
export const DEVICE_BACKUP_KEY = 'gp_device_backup_v1';

/** Launch 外：手動補登僅保留 API（checklist 2.1.2 / §9.2.6）。 */
export const MANUAL_SLEEP_RECORD_LAUNCH_EXCLUDED = true;

export async function rememberDeviceForMigration(
  read: (key: string) => Promise<string | null>,
  write: (key: string, value: string) => Promise<void>,
): Promise<void> {
  const current = await read(DEVICE_KEY);
  if (!current) return;
  await write(DEVICE_BACKUP_KEY, current);
}

export async function restoreDeviceFromBackup(
  read: (key: string) => Promise<string | null>,
  write: (key: string, value: string) => Promise<void>,
): Promise<string | null> {
  const backup = await read(DEVICE_BACKUP_KEY);
  if (!backup) return null;
  await write(DEVICE_KEY, backup);
  return backup;
}
