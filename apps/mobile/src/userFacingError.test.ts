import { describe, expect, it } from 'vitest';
import { userFacingError } from './userFacingError';

describe('userFacingError (8.3.1)', () => {
  it('maps internal codes to tone-safe copy', () => {
    expect(userFacingError('load_failed')).toMatch(/小屋/);
    expect(userFacingError('today_401')).not.toMatch(/today_401/);
    expect(userFacingError('bootstrap_500')).not.toMatch(/bootstrap_500/);
  });
});
