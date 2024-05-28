import { Prisma, PrismaClient, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return done(null, false, { message: 'Incorrect email' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    }
  )
);

const router = Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res, next) => {
    res.json('hello');
  }
);

export default router;
