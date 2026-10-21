import express from 'express';

import docs from './docs.ts';
import user from './user.ts';
import { hasAuthentication } from '#src/middleware/authentication';
import { requestContext } from '#src/types/context';

const router = express.Router();
router.use(hasAuthentication());

// Populate the node AsyncLocalStorage for the repositories
router.use((_req, res, next) => {
  requestContext.run(
    {
      principal: res.locals.currentContext.userId
    },
    next
  );
});

// Base v1 Responder
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: ['/docs', '/user']
  });
});

router.use('/docs', docs);
router.use('/user', user);

export default router;
