import { Router } from 'express';

import v1 from './v1/index.ts';
import { state } from '../../state.ts';

import type { Request, Response } from 'express';

const router = Router();

/** Root Endpoint. */
router.get('/', (_req: Request, res: Response): void => {
  res.status(200).json({
    endpoints: ['/live', '/ready', '/v1'],
    gitRev: state.gitRev,
    versions: [1]
  });
});

/** Liveness Endpoint. */
router.get('/live', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok' });
});

/** Readiness Endpoint. */
router.get('/ready', (_req: Request, res: Response): void => {
  if (state.ready && !state.shutdown) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

/** v1 Endpoint. */
router.use(process.env.SERVER_APIPATH ?? '/v1', v1);

export default router;
