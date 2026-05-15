import AsyncStorage from '@react-native-async-storage/async-storage';

export type OfflineJob =
  | { type: 'ritual_countdown_complete' }
  | { type: 'sleep_start' }
  | { type: 'sleep_cancel' }
  | { type: 'day_closure_complete' }
  | { type: 'day_closure_skip' };

const QUEUE_KEY = 'gp_offline_queue_v1';

export async function readOfflineQueue(): Promise<OfflineJob[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as OfflineJob[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function enqueueOfflineJob(job: OfflineJob): Promise<void> {
  const queue = await readOfflineQueue();
  queue.push(job);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function flushOfflineQueue(
  deviceId: string,
  handlers: Record<OfflineJob['type'], (deviceId: string) => Promise<void>>,
): Promise<{ flushed: number; failed: boolean }> {
  const queue = await readOfflineQueue();
  if (queue.length === 0) return { flushed: 0, failed: false };

  const remaining: OfflineJob[] = [];
  let flushed = 0;
  let failed = false;

  for (const job of queue) {
    try {
      await handlers[job.type](deviceId);
      flushed += 1;
    } catch {
      remaining.push(job);
      failed = true;
    }
  }

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return { flushed, failed };
}

export const OFFLINE_RETRY_COPY = '連線稍後再試，小屋會替你留著這一步。';
