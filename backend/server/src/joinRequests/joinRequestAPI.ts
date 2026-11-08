import { Router } from 'express';
import { z } from 'zod';
import type { JoinRequestService } from './JoinRequestService.js';
import type { AuthUser } from '../login/AuthUser.js';

export function joinRequestAPI(service: JoinRequestService, authGuard: any) {
  const router = Router();

  const me = (req: any) => req.res.locals.user as AuthUser;

  router.get('/me', authGuard, async (req, res, next) => {
    try {
      res.json({ data: await service.listForUser(me(req)) });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:activityId/join', authGuard, async (req, res, next) => {
    try {
      res.status(201).json({
        data: await service.create(me(req), req.params.activityId),
      });
    } catch (e) {
      next(e);
    }
  });

  router.get('/:activityId/requests', authGuard, async (req, res, next) => {
    try {
      res.json({
        data: await service.list(me(req), req.params.activityId),
      });
    } catch (e) {
      next(e);
    }
  });

  router.patch('/:id', authGuard, async (req, res, next) => {
    try {
      const { status } = z
        .object({ status: z.enum(['accepted', 'rejected']) })
        .parse(req.body);

      res.json({
        data: await service.updateStatus(me(req), req.params.id, status),
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
