import { describe, expect, it } from 'vitest';

import {
  isHumanSleepValidationRecord,
  validateHumanSleepValidationBundle,
} from './humanSleepValidation';

describe('humanSleepValidation', () => {
  it('accepts a minimal valid record', () => {
    expect(
      isHumanSleepValidationRecord({
        calm: 4,
        pressure: 2,
        clarity_10s: 5,
        blockingIssues: [],
        notes: '首屏清楚，儀式末段夠安靜。',
      }),
    ).toBe(true);
  });

  it('rejects passed bundles without a full window or with blocking issues', () => {
    const result = validateHumanSleepValidationBundle({
      checklistItem: '12.2.1',
      status: 'passed',
      windowDays: 7,
      schema: 'human_sleep_validation.schema.json',
      records: [
        {
          calm: 4,
          pressure: 2,
          clarity_10s: 5,
          blockingIssues: ['太亮'],
          notes: 'blocked',
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          'passed bundles require a full validation window',
          'passed bundles cannot include blockingIssues',
        ]),
      );
    }
  });

  it('accepts a completed passed bundle', () => {
    const records = Array.from({ length: 7 }, (_, index) => ({
      calm: 4,
      pressure: 2,
      clarity_10s: 5,
      blockingIssues: [],
      notes: `night ${index + 1}`,
    }));
    const result = validateHumanSleepValidationBundle({
      checklistItem: '12.2.1',
      status: 'passed',
      windowDays: 7,
      schema: 'human_sleep_validation.schema.json',
      records,
    });
    expect(result.ok).toBe(true);
  });
});
