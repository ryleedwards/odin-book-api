import { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import passport from 'passport';

import authRouter from './auth';
import usersRouter from './users';
import postsRouter from './posts';
import commentsRouter from './comments';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json('Welcome to the Odin Book API');
});

router.use('/api/auth', authRouter);
router.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRouter
);
router.use(
  '/api/posts',
  passport.authenticate('jwt', { session: false }),
  postsRouter
);
router.use(
  '/api/comments',
  passport.authenticate('jwt', { session: false }),
  commentsRouter
);

export default router;
