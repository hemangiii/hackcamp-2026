import { Router } from 'express';
import type { SchoolRepository } from '../repositories/SchoolRepository.js';

/** Returns the schools available in the profile dropdown. */
export function schoolAPI(schools: SchoolRepository) {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      data: schools.list().map(({ id, name }) => ({ id, name })),
    });
  });

  return router;
}
