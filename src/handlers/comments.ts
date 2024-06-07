import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';
import { CreateCommentDto } from '../dtos/CreateComment.dto';
import { UpdateCommentDto } from '../dtos/UpdateComment.dto';
import { User, Post } from '../types/response';

const prisma = new PrismaClient();

// GET api/comments
export const getComments = async (req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({
    include: {
      author: true,
    },
  });
  res.json(comments);
};

// GET api/comments/:id
export const getCommentById = [
  param('id').isInt(),
  async (req: Request, res: Response) => {
    // Validate the request params
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // No errors
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        author: true,
      },
    });
    res.json(comment);
  },
];

// POST api/comments
export const createComment = [
  // Validate the request body
  body('authorId').isInt(),
  body('postId').isInt(),
  body('content').isString(),
  async (
    req: Request<{}, {}, CreateCommentDto>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors >> extract data from request body
    const { authorId, postId, content } = req.body;
    let user: User | null;
    try {
      user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
      if (!user) {
        return res.status(422).json({
          error:
            'Comment author does not exist, please check supplied authorId',
        });
      }
      let post: Post | null;
      post = await prisma.post.findUnique({
        where: { id: Number(postId) },
        include: {
          author: true,
        },
      });
      if (!post) {
        return res.status(422).json({
          error: 'Post does not exist, please check supplied postId',
        });
      }

      const comment = await prisma.comment.create({
        data: {
          authorId: Number(authorId),
          postId: Number(postId),
          content,
        },
      });
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  },
];

// PATCH api/comments/:id
export const updateComment = [
  // Validate the request params
  param('id').isInt(),
  // Validate the request body
  body('content').isString().optional(),
  async (req: Request<{ id: Number }, {}, UpdateCommentDto>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to update comment
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
      include: {
        author: true,
      },
    });
    res.json(comment);
  },
];
