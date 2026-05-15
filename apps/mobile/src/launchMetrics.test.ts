import { describe, expect, it, afterEach } from 'vitest';

import {
  LAUNCH_METRIC_EVENTS,
  readLaunchMetricBuffer,
  resetLaunchMetrics,
  trackLaunchMetric,
} from './launchMetrics';

describe('launchMetrics (12.2.5)', () => {
  afterEach(() => {
    resetLaunchMetrics();
  });

  it('reserves §7.3.3 event names', () => {
    expect(LAUNCH_METRIC_EVENTS).toEqual([
      'home_open',
      'home_start_ritual_tap',
      'ritual_countdown_complete',
      'ritual_sleep_start',
      'ritual_cancel',
      'home_secondary_expand',
      'home_details_expand',
    ]);
  });

  it('buffers launch metric events until a sink is attached', () => {
    trackLaunchMetric('home_open');
    trackLaunchMetric('home_start_ritual_tap', { phase: 'home' });
    expect(readLaunchMetricBuffer().map((row) => row.event)).toEqual([
      'home_open',
      'home_start_ritual_tap',
    ]);
  });
});
