import { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import usersRouter from './users';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json('Welcome to the Odin Book API');
});

router.use('/api/users', usersRouter);

export default router;
