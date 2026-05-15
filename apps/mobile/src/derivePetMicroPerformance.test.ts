import { describe, expect, it } from 'vitest';

import { derivePetMicroPerformance } from './derivePetMicroPerformance';
import { makeToday } from './test/todayFixture';

describe('derivePetMicroPerformance', () => {
  it('maps sleeping to dozing', () => {
    expect(derivePetMicroPerformance(makeToday({ sleeping: true }))).toMatchObject({
      pose: 'dozing',
      animationPreset: 'breathing',
    });
  });

  it('maps wilted attunement to dim_breath', () => {
    expect(
      derivePetMicroPerformance(
        makeToday({ worldAttunement: 'wilted', nightSky: { key: 'clear_star', displayName: '星光' } }),
      ),
    ).toMatchObject({
      pose: 'dim_breath',
      overlay: 'dim_veil',
    });
  });

  it('maps blue moon to by_window', () => {
    expect(
      derivePetMicroPerformance(
        makeToday({
          worldAttunement: 'steady',
          nightSky: { key: 'blue_moon', displayName: '偏藍的月光' },
        }),
      ),
    ).toMatchObject({
      pose: 'by_window',
      overlay: 'window_glow',
    });
  });

  it('maps steady streak to kept_lamp', () => {
    expect(
      derivePetMicroPerformance(
        makeToday({
          streakDays: 3,
          worldAttunement: 'steady',
          nightSky: { key: 'clear_star', displayName: '星光' },
        }),
      ),
    ).toMatchObject({
      pose: 'kept_lamp',
      overlay: 'lamp_warm',
    });
  });

  it('maps incomplete ritual to holding_pillow', () => {
    expect(
      derivePetMicroPerformance(
        makeToday({
          streakDays: 0,
          ritualCountdownCompleted: false,
          sleepStarted: false,
          worldAttunement: 'steady',
          nightSky: { key: 'clear_star', displayName: '星光' },
        }),
      ),
    ).toMatchObject({
      pose: 'holding_pillow',
      overlay: 'pillow',
    });
  });
});
