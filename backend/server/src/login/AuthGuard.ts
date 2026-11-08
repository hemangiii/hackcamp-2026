import type { Request, Response, NextFunction } from 'express';
import { AuthUser } from './AuthUser.js';

const NS = 'https://oncampus.app';

export class AuthGuard {
  static requireVerified(req: Request, res: Response, next: NextFunction): void {
    const payload = req.auth?.payload;
    if (!payload?.sub) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = new AuthUser(
      payload.sub,
      (payload[`${NS}/email`] as string) ?? null,
      payload[`${NS}/email_verified`] === true,
    );

    if (!user.canUseApp()) {
      res.status(403).json({ error: 'Please verify your school email first' });
      return;
    }

    res.locals.user = user;
    next();
  }
}