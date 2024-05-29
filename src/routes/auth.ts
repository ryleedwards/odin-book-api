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

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload);
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(jwt_payload) },
      });
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

const router = Router();

// POST auth/login
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    // // Generate access token
    if (!process.env.JWT_SECRET) {
      res.status(500).json('Internal server error');
    }
    const user = req.user as User;
    const accessToken = jwt.sign(
      user.id.toString(),
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
    );
    res.json({ accessToken, user: req.user });
  }
);

// POST auth/status
router.post(
  '/status',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ authenticated: false });
    } else {
      res.status(200).json({ authenticated: true, user: req.user });
    }
  }
);

export default router;
