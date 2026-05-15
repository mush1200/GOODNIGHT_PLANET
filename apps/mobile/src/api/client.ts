import { Platform } from 'react-native';
import type {
  DreamKey,
  NightSkyKey,
  OnboardingPhase,
  PetArchetype,
  WorldAttunement,
} from './openapiTypes';

const FALLBACK_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const baseUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? `http://${FALLBACK_HOST}:3333`;

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

async function deviceFetch(
  path: string,
  deviceId: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'x-device-id': deviceId,
    },
  });
}

export type BootstrapResponse = {
  userId: string;
  petName: string;
  petArchetype: PetArchetype;
};

export type TodayResponse = {
  logicalSleepDate: string;
  nightSky: { key: NightSkyKey; displayName: string };
  forecastSummary: string;
  rarityNarrativeTag: string;
  streakDays: number;
  nightsCompleted?: number;
  lastCompletedLogicalDate?: string | null;
  lastSleepLogicalDate?: string | null;
  worldTier: number;
  worldGrowthValue: number;
  worldProgressFraction: number;
  worldAttunement?: WorldAttunement;
  daysSinceLastOpenLogical?: number;
  attunementHint?: string | null;
  ritualCountdownCompleted: boolean;
  sleepStarted: boolean;
  sleeping: boolean;
  unboxed: boolean;
  dayClosureCompleted?: boolean;
  dayClosureSkipped?: boolean;
  goodnightLine: string;
  petArchetype: PetArchetype;
  stardustBalance?: number;
  homeDockHint?: string | null;
  onboardingPhase?: OnboardingPhase | 'steady';
  moonGuardCanUse?: boolean;
  moonGuardIsoWeek?: string;
  moonGuardUsesThisWeek?: number;
  targetSleepTimeLocal?: string | null;
  wakeTimeLocal?: string | null;
  targetSleepDurationMinutes?: number | null;
  pushReminderEnabled?: boolean;
  earlyBedForDream?: boolean;
};

export type UnboxResponse = {
  logicalSleepDate: string;
  dreamKey: DreamKey;
  dreamName: string;
  memoryLine: string;
  worldTier: number;
  worldGrowthValue: number;
  stardustBalance?: number;
};

export type MemoryEntry = {
  id: string;
  logicalSleepDate: string;
  dreamKey: DreamKey;
  nightSkyKey: NightSkyKey;
  narrative: string;
  createdAt: string;
};

export type MoonGuardStatus = {
  isoWeek: string;
  usesThisWeek: number;
  canUse: boolean;
};

export type MoonGuardTriggerResponse = {
  ok?: boolean;
  error?: 'on_cooldown';
  isoWeek: string;
  usesThisWeek: number;
  message: string;
};

export type SleepSchedulePatch = {
  targetSleepTimeLocal?: string | null;
  wakeTimeLocal?: string | null;
  pushReminderEnabled?: boolean;
};

export type SleepScheduleResponse = SleepSchedulePatch & {
  targetSleepDurationMinutes?: number | null;
};

export type CancelSleepResponse = {
  cancelled: boolean;
  message: string;
};

export type DayClosureAction = 'complete' | 'skip';

export type DayClosureResponse = {
  logicalSleepDate: string;
  dayClosureCompleted: boolean;
  dayClosureSkipped: boolean;
};

export type ReminderPreview = {
  mock: boolean;
  channel: 'push';
  templateKey: 'evening_nudge' | 'ritual_invite';
  deviceId: string;
  pushEmotionalState?: import('./push/pushEmotionalState').PushEmotionalState;
  title?: string;
  petArchetype?: PetArchetype;
  body: string;
};

export async function bootstrap(deviceId: string): Promise<BootstrapResponse> {
  const res = await fetch(`${baseUrl}/v1/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId }),
  });
  if (!res.ok) throw new Error(`bootstrap_${res.status}`);
  return parseJson<BootstrapResponse>(res);
}

export async function fetchToday(deviceId: string): Promise<TodayResponse> {
  const res = await deviceFetch('/v1/today', deviceId);
  if (!res.ok) throw new Error(`today_${res.status}`);
  return parseJson<TodayResponse>(res);
}

export async function postRitualCountdownComplete(deviceId: string): Promise<void> {
  const res = await deviceFetch('/v1/ritual/countdown-complete', deviceId, { method: 'POST' });
  if (!res.ok) throw new Error(`ritual_countdown_${res.status}`);
}

export async function postSleepStart(deviceId: string): Promise<void> {
  const res = await deviceFetch('/v1/sleep/start', deviceId, { method: 'POST' });
  if (!res.ok) throw new Error(`sleep_start_${res.status}`);
}

export async function postSleepCancel(deviceId: string): Promise<CancelSleepResponse> {
  const res = await deviceFetch('/v1/sleep/cancel', deviceId, { method: 'POST' });
  const body = await parseJson<CancelSleepResponse & { error?: string; message?: string }>(res);
  if (!res.ok) {
    if (body.message) {
      return { cancelled: false, message: body.message };
    }
    throw new Error(`sleep_cancel_${res.status}`);
  }
  return {
    cancelled: Boolean(body.cancelled),
    message: body.message ?? '今晚先到這裡，明天再慢慢來。',
  };
}

export async function postWake(deviceId: string): Promise<void> {
  const res = await deviceFetch('/v1/sleep/wake', deviceId, { method: 'POST' });
  if (!res.ok) throw new Error(`wake_${res.status}`);
}

export async function postUnbox(deviceId: string): Promise<UnboxResponse> {
  const res = await deviceFetch('/v1/unbox', deviceId, { method: 'POST' });
  if (!res.ok) throw new Error(`unbox_${res.status}`);
  return parseJson<UnboxResponse>(res);
}

export async function postDayClosure(
  deviceId: string,
  action: DayClosureAction = 'complete',
): Promise<DayClosureResponse> {
  const res = await deviceFetch('/v1/ritual/day-closure', deviceId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error(`day_closure_${res.status}`);
  return parseJson<DayClosureResponse>(res);
}

export async function fetchMemoryEntries(deviceId: string): Promise<MemoryEntry[]> {
  const res = await deviceFetch('/v1/memory-entries', deviceId);
  if (!res.ok) throw new Error(`memory_entries_${res.status}`);
  const body = await parseJson<{ items: MemoryEntry[] }>(res);
  return body.items ?? [];
}

export async function fetchMoonGuardStatus(deviceId: string): Promise<MoonGuardStatus> {
  const res = await deviceFetch('/v1/moon-guard/status', deviceId);
  if (!res.ok) throw new Error(`moon_guard_status_${res.status}`);
  return parseJson<MoonGuardStatus>(res);
}

export async function postMoonGuardTrigger(deviceId: string): Promise<MoonGuardTriggerResponse> {
  const res = await deviceFetch('/v1/moon-guard/trigger', deviceId, { method: 'POST' });
  if (!res.ok) throw new Error(`moon_guard_trigger_${res.status}`);
  return parseJson<MoonGuardTriggerResponse>(res);
}

export async function patchSleepSchedule(
  deviceId: string,
  body: SleepSchedulePatch,
): Promise<SleepScheduleResponse> {
  const res = await deviceFetch('/v1/me/sleep-schedule', deviceId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`sleep_schedule_${res.status}`);
  return parseJson<SleepScheduleResponse>(res);
}

export async function postEarlyBed(deviceId: string, earlyBed: boolean): Promise<{ earlyBedForDream: boolean }> {
  const res = await deviceFetch('/v1/daily/early-bed', deviceId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ earlyBed }),
  });
  if (!res.ok) throw new Error(`early_bed_${res.status}`);
  return parseJson<{ earlyBedForDream: boolean }>(res);
}

export async function fetchReminderPreview(
  deviceId: string,
  templateKey: ReminderPreview['templateKey'] = 'evening_nudge',
  pushEmotionalState?: ReminderPreview['pushEmotionalState'],
): Promise<ReminderPreview> {
  const query = new URLSearchParams({ templateKey });
  if (pushEmotionalState) query.set('pushEmotionalState', pushEmotionalState);
  const res = await deviceFetch(`/v1/push/reminder-preview?${query.toString()}`, deviceId);
  if (!res.ok) throw new Error(`reminder_preview_${res.status}`);
  return parseJson<ReminderPreview>(res);
}

export async function fetchTemplateGoodnight(
  deviceId: string,
  templateKey: ReminderPreview['templateKey'] = 'evening_nudge',
  pushEmotionalState?: ReminderPreview['pushEmotionalState'],
): Promise<{ body: string; title?: string; pushEmotionalState?: ReminderPreview['pushEmotionalState'] }> {
  const query = new URLSearchParams({ templateKey });
  if (pushEmotionalState) query.set('pushEmotionalState', pushEmotionalState);
  const res = await deviceFetch(`/v1/push/template-goodnight?${query.toString()}`, deviceId);
  if (!res.ok) throw new Error(`template_goodnight_${res.status}`);
  return parseJson<{ body: string; title?: string; pushEmotionalState?: ReminderPreview['pushEmotionalState'] }>(res);
}
