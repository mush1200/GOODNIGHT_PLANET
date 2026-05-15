import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('sleep start gate (9.3.2)', () => {
  it('rejects sleep/start before ritual countdown completes', async () => {
    const deviceId = `test-sleep-gate-${crypto.randomUUID()}`;
    await request(app).post('/v1/bootstrap').send({ deviceId });
    await request(app).get('/v1/today').set('x-device-id', deviceId);
    const blocked = await request(app).post('/v1/sleep/start').set('x-device-id', deviceId);
    expect(blocked.status).toBe(400);
    expect(blocked.body.error).toBe('ritual_incomplete');

    await request(app).post('/v1/ritual/countdown-complete').set('x-device-id', deviceId);
    const allowed = await request(app).post('/v1/sleep/start').set('x-device-id', deviceId);
    expect(allowed.status).toBe(200);
    expect(allowed.body.sleeping).toBe(true);
  });
});
