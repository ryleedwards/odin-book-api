import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';

const prisma = new PrismaClient();

// GET api/users/:id/follows

export const getFollowsByUserId = [
  // validate request params
  param('userId').isInt(),
  async (req: Request<{ userId: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.userId;
    // Submit query to get users that requested user follows
    const followings = await prisma.follow.findMany({
      where: {
        followerId: Number(userId),
      },
      include: {
        following: {
          include: { profile: true },
        },
      },
    });
    res.send(followings);
  },
];

export const getFollowersByUserId = [
  // validate request params
  param('userId').isInt(),
  async (req: Request<{ userId: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.userId;
    // Submit query to get users that requested user follows
    const followers = await prisma.follow.findMany({
      where: {
        followingId: Number(userId),
      },
      include: {
        follower: {
          include: { profile: true },
        },
      },
    });
    res.send(followers);
  },
];

export const createFollow = [
  // Validate the request params
  param('userId').isInt(),
  body('followerId').isInt(),
  async (
    req: Request<{ userId: Number }>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.userId;
    const { followerId } = req.body;
    // Submit query to create follow
    try {
      const follow = await prisma.follow.create({
        data: {
          followerId: Number(followerId),
          followingId: Number(userId),
        },
        include: {
          follower: {
            include: { profile: true },
          },
          following: {
            include: { profile: true },
          },
        },
      });
      // Return follow
      res.json(follow);
    } catch (error) {
      next(error);
    }
  },
];
