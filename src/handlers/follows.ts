import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, query, validationResult } from 'express-validator';

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

// GET api/users/:id/followers
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

// GET api/users/:id/followed
export const isCurrentlyFollowed = [
  // Validate the request params
  param('userId').isInt(),
  query('currentUserId').isInt(),
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
    const profileUserId = req.params.userId;
    const { currentUserId } = req.query;
    // Submit query to check if user is followed
    try {
      const followRecord = await prisma.follow.findFirst({
        where: {
          followerId: Number(currentUserId),
          followingId: Number(profileUserId),
        },
      });
      const isFollowed = followRecord !== null;
      res.json({ isFollowed });
    } catch (error) {
      next(error);
    }
  },
];

// POST api/users/:id/follow
export const createFollow = [
  // Validate the request params
  param('userId').isInt(),
  body('followerId').isInt(),
  async (
    req: Request<{ userId: Number }>,
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.body);
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

// DELETE api/users/:id/follow
export const deleteFollow = [
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
    // Submit query to delete follow
    try {
      const follow = await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: Number(followerId),
            followingId: Number(userId),
          },
        },
      });
      // Return follow
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  },
];
