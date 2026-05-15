import { describe, expect, it } from 'vitest';
import {
  STARDUST_FOR_RITUAL_COUNTDOWN,
  STARDUST_FOR_SLEEP_START,
  STARDUST_FOR_SLEEP_WAKE,
  STARDUST_FOR_UNBOX,
  STARDUST_FULL_NIGHT_FLOW_TOTAL,
  stardustDeltaForCancelSleep,
} from '../src/stardust.js';

describe('stardust constants (2.7.1 / game_balance_tables §8)', () => {
  it('full vertical night sum matches ledger design', () => {
    expect(STARDUST_FULL_NIGHT_FLOW_TOTAL).toBe(
      STARDUST_FOR_RITUAL_COUNTDOWN + STARDUST_FOR_SLEEP_START + STARDUST_FOR_SLEEP_WAKE + STARDUST_FOR_UNBOX,
    );
    expect(STARDUST_FULL_NIGHT_FLOW_TOTAL).toBe(15);
  });

  it('cancel_sleep delta mirrors growth revert 10 / 15', () => {
    expect(stardustDeltaForCancelSleep(10)).toBe(-STARDUST_FOR_SLEEP_START);
    expect(stardustDeltaForCancelSleep(15)).toBe(-(STARDUST_FOR_SLEEP_START + STARDUST_FOR_SLEEP_WAKE));
    expect(stardustDeltaForCancelSleep(0)).toBe(0);
  });
});
