import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      // TODO: Implement
    }
  )
);
