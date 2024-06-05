import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';
import { CreatePostDto } from '../dtos/CreatePost.dto';
import { User } from '../types/response';

const prisma = new PrismaClient();

// GET api/posts
export const getPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
};

// GET api/posts/:id
export const getPostById = [
  // Validate the request params
  param('id').isInt(),
  async (req: Request, res: Response) => {
    async (req: Request<{ id: Number }>, res: Response) => {
      // Gather validation errors
      const errors = validationResult(req);
      // If there are errors, return with 400 status and validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // No errors, get id from params
      const id = req.params.id;
      // Submit query to get post
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      // If post doesn't exist, return 404
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      // Return post
      res.json(post);
    };
  },
];

// POST api/posts
export const createPost = [
  // Validate the request body
  body('authorId').isInt(),
  body('content').isString(),
  async (
    req: Request<{}, {}, CreatePostDto>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors >> validate authorId matches user in db
    const { authorId, content } = req.body;
    let user: User | null;
    try {
      user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
      if (!user) {
        return res.status(422).json({
          error: 'Post author does not exist, please check supplied authorId',
        });
      }
    } catch (e) {
      next(e);
    }
    const post = await prisma.post.create({
      data: { authorId, content },
    });
    // Return post
    res.status(201).json(post);
  },
];
