import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';

const prisma = new PrismaClient();

// GET /api/posts/:id/likes
export const getLikesByPostId = [
  // Validate the request params
  param('postId').isInt(),
  async (req: Request<{ postId: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const postId = req.params.postId;
    // Submit query to get posts
    const likes = await prisma.like.findMany({
      where: { postId: Number(postId) },
      include: { user: true },
    });
    // Return posts
    res.json(likes);
  },
];

// POST /api/posts/:id/likes
export const createLike = [
  // Validate the request params
  param('postId').isInt(),
  // Validate the request body
  body('userId').isInt(),
  async (
    req: Request<{ postId: Number }, {}, { userId: Number }>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // No errors, get id from params
      const { userId } = req.body;
      const { postId } = req.params;
      // Submit query to create like
      const like = await prisma.like.create({
        data: {
          postId: Number(postId),
          userId: Number(userId),
        },
      });
      // Return like
      res.status(201).json(like);
    } catch (error) {
      next(error);
    }
  },
];

// DELETE /api/posts/:id/likes
export const deleteLike = [
  // Validate the request params
  param('postId').isInt(),
  // Validate the request body
  body('userId').isInt(),
  async (
    req: Request<{ postId: Number }, {}, { userId: Number }>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // No errors, get id from params
      const { userId } = req.body;
      const { postId } = req.params;
      // Submit query to delete like
      const like = await prisma.like.delete({
        where: {
          userId_postId: {
            postId: Number(postId),
            userId: Number(userId),
          },
        },
      });
      // Return 204 code for successful delete
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  },
];
