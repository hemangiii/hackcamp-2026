import { Router } from 'express';
import { z } from 'zod';
import type { ActivityService } from './ActivityService.js';
import type { AuthUser } from '../login/AuthUser.js';
import { ACTIVITY_TYPES } from '../types.js';

const schema = z.object({
  name: z.string(),
  description: z.string().default(''),
  type: z.enum(ACTIVITY_TYPES),
  location: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  link: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? null : value,
    z.string()
      .url('Link must be a valid URL')
      .refine((value) => value.startsWith('http://') || value.startsWith('https://'), {
        message: 'Links must start with http:// or https://',
      })
      .nullable()
      .optional(),
  ),
});

export function activityAPI(service: ActivityService, authGuard: any) {
  const router = Router();

  const me = (req: any) => req.res.locals.user as AuthUser;
  const q = (v: unknown) => (typeof v === 'string' ? v : undefined);

  router.get('/', authGuard, async (req, res, next) => {
    try {
      res.json({
        data: await service.list(me(req), {
          type: q(req.query.type) as any,
          location: q(req.query.location),
          startTime: q(req.query.startTime),
          endTime: q(req.query.endTime),
        }),
      });
    } catch (e) {
      next(e);
    }
  });

  router.post('/', authGuard, async (req, res, next) => {
    try {
      res.status(201).json({
        data: await service.create(me(req), schema.parse(req.body)),
      });
    } catch (e) {
      next(e);
    }
  });

  router.put('/:id', authGuard, async (req, res, next) => {
    try {
      res.json({
        data: await service.update(me(req), req.params.id, schema.parse(req.body)),
      });
    } catch (e) {
      next(e);
    }
  });

  router.delete('/:id', authGuard, async (req, res, next) => {
    try {
      await service.delete(me(req), req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  router.get('/:id', authGuard, async (req, res, next) => {
    try {
      const data = await service.get(req.params.id);
      if (!data) return res.status(404).json({ error: 'Activity not found' });
      res.json({ data });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
