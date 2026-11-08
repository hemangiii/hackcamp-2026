import type { Request, Response, NextFunction } from 'express';
import { AuthUser } from './AuthUser.js';

const NS = process.env.AUTH0_CLAIMS_NAMESPACE ?? 'https://oncampus.app';

export class AuthGuard {
  static requireVerified(req: Request, res: Response, next: NextFunction): void {
    const payload = req.auth?.payload;
    if (!payload?.sub) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Auth0 only includes email claims when an Action adds them to the API token.
    // Accept standard claims too, which is useful with custom token configurations.
    const email = (payload.email as string | undefined) ?? (payload[`${NS}/email`] as string | undefined) ?? null;
    const emailVerified = payload.email_verified === true || payload[`${NS}/email_verified`] === true;
    const user = new AuthUser(
      payload.sub,
      email?.trim().toLowerCase() ?? null,
      emailVerified,
    );

    if (!user.canUseApp()) {
      res.status(403).json({ error: 'Use a verified UBC, SFU, or UVic school email' });
      return;
    }

    res.locals.user = user;
    next();
  }
}
