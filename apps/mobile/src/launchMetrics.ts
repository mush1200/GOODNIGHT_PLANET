export const LAUNCH_METRIC_EVENTS = [
  'home_open',
  'home_start_ritual_tap',
  'ritual_countdown_complete',
  'ritual_sleep_start',
  'ritual_cancel',
  'home_secondary_expand',
  'home_details_expand',
] as const;

export type LaunchMetricEvent = (typeof LAUNCH_METRIC_EVENTS)[number];

export type LaunchMetricRecord = {
  event: LaunchMetricEvent;
  at: number;
  props?: Record<string, string | number | boolean | null>;
};

type LaunchMetricSink = (record: LaunchMetricRecord) => void;

let sink: LaunchMetricSink | null = null;
const buffer: LaunchMetricRecord[] = [];

export function setLaunchMetricSink(next: LaunchMetricSink | null): void {
  sink = next;
}

export function readLaunchMetricBuffer(): readonly LaunchMetricRecord[] {
  return buffer;
}

export function resetLaunchMetrics(): void {
  buffer.length = 0;
  sink = null;
}

export function trackLaunchMetric(
  event: LaunchMetricEvent,
  props?: LaunchMetricRecord['props'],
): void {
  const record: LaunchMetricRecord = { event, at: Date.now(), props };
  if (sink) sink(record);
  else buffer.push(record);
}
