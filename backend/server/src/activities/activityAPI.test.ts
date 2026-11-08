import express from 'express';
import { createServer, type Server } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
import { activityAPI } from './activityAPI.js';
import type { ActivityService } from './ActivityService.js';

const service = {
  create: async () => ({ id: 'activity-1' }),
  get: async () => null,
  list: async () => [],
  update: async () => ({ id: 'activity-1' }),
  delete: async () => undefined,
} as unknown as ActivityService;

const authGuard = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.locals.user = { id: 'user-1' };
  next();
};

let server: Server | undefined;

function request(method: string, path: string, body?: unknown, authenticated = true): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.json());
    app.use('/api/activities', activityAPI(service, authGuard));
    server = createServer(app).listen(0, () => {
      const address = server!.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      const req = fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: 'Bearer test' } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      req.then(async (response) => resolve({ status: response.status, body: await response.json().catch(() => null) })).catch(reject);
    });
  });
}

afterEach(() => server?.close());

describe('activity API', () => {
  it('returns 401 when authentication is missing', async () => {
    const response = await request('GET', '/api/activities', undefined, false);
    expect(response.status).toBe(401);
  });

  it('returns 400 for an invalid request body', async () => {
    const response = await request('POST', '/api/activities', { name: 'missing required fields' });
    expect(response.status).toBe(400);
  });

  it('returns 201 for a valid activity request', async () => {
    const response = await request('POST', '/api/activities', { name: 'Study', description: '', type: 'study', location: 'Library', startTime: '2030-01-01T10:00:00Z', endTime: '2030-01-01T11:00:00Z' });
    expect(response.status).toBe(201);
  });

  it('returns 404 when an activity does not exist', async () => {
    const response = await request('GET', '/api/activities/missing');
    expect(response.status).toBe(404);
  });
});
