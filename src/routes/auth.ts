import { Prisma, PrismaClient, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import {
  Strategy as JwtStrategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Local strategy for authenticating email/password
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

// JWT strategy for issuing JWT for protecting routes

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {}));

const router = Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    // // Generate access token
    if (!process.env.JWT_SECRET) {
      res.status(500).json('Internal server error');
    }
    const accessToken = jwt.sign(
      req.user as User,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
    );

    res.json({ accessToken, user: req.user });
  }
);

export default router;
