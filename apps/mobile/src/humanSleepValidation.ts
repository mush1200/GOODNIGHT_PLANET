export type HumanSleepValidationRecord = {
  calm: number;
  pressure: number;
  clarity_10s: number;
  blockingIssues: string[];
  notes: string;
};

export type HumanSleepValidationBundle = {
  checklistItem: string;
  status: 'in_progress' | 'passed';
  windowDays: number;
  schema: string;
  records: HumanSleepValidationRecord[];
};

function scoreInRange(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function isHumanSleepValidationRecord(value: unknown): value is HumanSleepValidationRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (!scoreInRange(record.calm)) return false;
  if (!scoreInRange(record.pressure)) return false;
  if (!scoreInRange(record.clarity_10s)) return false;
  if (!Array.isArray(record.blockingIssues)) return false;
  if (!record.blockingIssues.every((issue) => typeof issue === 'string' && issue.trim().length > 0)) {
    return false;
  }
  return typeof record.notes === 'string';
}

export function validateHumanSleepValidationBundle(
  bundle: unknown,
): { ok: true; bundle: HumanSleepValidationBundle } | { ok: false; errors: string[] } {
  if (!bundle || typeof bundle !== 'object') {
    return { ok: false, errors: ['bundle must be an object'] };
  }

  const candidate = bundle as Record<string, unknown>;
  const errors: string[] = [];

  if (candidate.checklistItem !== '12.2.1') {
    errors.push('checklistItem must be 12.2.1');
  }
  if (candidate.status !== 'in_progress' && candidate.status !== 'passed') {
    errors.push('status must be in_progress or passed');
  }
  if (typeof candidate.windowDays !== 'number' || candidate.windowDays < 7) {
    errors.push('windowDays must be at least 7');
  }
  if (candidate.schema !== 'human_sleep_validation.schema.json') {
    errors.push('schema must be human_sleep_validation.schema.json');
  }
  if (!Array.isArray(candidate.records)) {
    errors.push('records must be an array');
    return { ok: false, errors };
  }

  candidate.records.forEach((record, index) => {
    if (!isHumanSleepValidationRecord(record)) {
      errors.push(`records[${index}] is invalid`);
    }
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const parsed = candidate as HumanSleepValidationBundle;
  if (parsed.status === 'passed') {
    if (parsed.records.length < parsed.windowDays) {
      errors.push('passed bundles require a full validation window');
    }
    if (parsed.records.some((record) => record.blockingIssues.length > 0)) {
      errors.push('passed bundles cannot include blockingIssues');
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, bundle: parsed };
}
