import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult, query } from 'express-validator';
import { CreatePostDto } from '../dtos/CreatePost.dto';
import { UpdatePostDto } from '../dtos/UpdatePost.dto';
import { Post, User } from '../types/response';
import { CreateCommentDto } from '../dtos/CreateComment.dto';

const prisma = new PrismaClient();

// GET api/posts
export const getPosts = [
  // Validate query params
  query('sort_by').isString().optional(),
  query('order_by').isString().optional(),
  query('view').isString().optional(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sortBy = (req.query.sort_by as string) || 'createdAt';
      const orderBy = (req.query.order_by as string) || 'desc';
      // Validate order_by parameter
      const validOrder = orderBy.toLowerCase() === 'asc' ? 'asc' : 'desc';

      const view = (req.query.view as string) || 'all';

      // Following view >> return posts by authors followed + current user posts
      if (view === 'following') {
        const user = req.user as User;
        const posts = await prisma.post.findMany({
          where: {
            OR: [
              {
                // Return posts by author if user is following them
                author: {
                  followers: { some: { followerId: user.id } },
                },
              },
              // Return posts by the current user
              {
                authorId: user.id,
              },
            ],
          },
          include: {
            author: { include: { profile: true } },
            likes: { include: { user: true } },
            comments: { include: { author: { include: { profile: true } } } },
          },
        });
        res.json(posts);
      } else {
        const posts = await prisma.post.findMany({
          include: {
            author: { include: { profile: true } },
            likes: { include: { user: true } },
            comments: {
              include: { author: { include: { profile: true } } },
            },
          },
          orderBy: {
            [sortBy]: validOrder,
          },
        });
        res.json(posts);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
];
// GET api/posts/:id
export const getPostById = [
  // Validate the request params
  param('id').isInt(),
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
      include: {
        author: { include: { profile: true } },
        likes: { include: { user: true } },
        comments: { include: { author: { include: { profile: true } } } },
      },
    });
    // If post doesn't exist, return 404
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Return post
    res.json(post);
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
      include: {
        author: true,
      },
    });
    // Return post
    res.status(201).json(post);
  },
];

export const updatePost = [
  // Validate the request params
  param('id').isInt(),
  // Validate the request body
  body('content').isString().optional(),
  async (req: Request<{ id: Number }, {}, UpdatePostDto>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to update post
    const { content } = req.body;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { content },
      include: {
        author: true,
        likes: true,
      },
    });
    // Return post
    res.json(post);
  },
];

export const deletePost = [
  // Validate the request params
  param('id').isInt(),
  async (req: Request<{ id: Number }>, res: Response, next: NextFunction) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to delete post
    try {
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
          author: true,
        },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      await prisma.post.delete({ where: { id: Number(id) } });
      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  },
];

// GET api/posts/:postId/comments
export const getCommentsByPostId = [
  param('postId').isInt(),
  async (req: Request<{ postId: Number }>, res: Response) => {
    // Validate the request params
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors
    const comments = await prisma.comment.findMany({
      where: { postId: Number(req.params.postId) },
      include: {
        author: { include: { profile: true } },
      },
    });
    res.json(comments);
  },
];

// POST api/posts/:postId/comments
export const createCommentByPostId = [
  param('postId').isInt(),
  body('authorId').isInt(),
  body('content').isString(),
  async (
    req: Request<{ postId: Number }, {}, CreateCommentDto>,
    res: Response,
    next: NextFunction
  ) => {
    // Validate the request params
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors
    const { postId } = req.params;
    const { content, authorId } = req.body;

    try {
      // Check if author exists
      let user: User | null;
      user = await prisma.user.findUnique({
        where: { id: Number(authorId) },
      });
      if (!user) {
        return res.status(422).json({
          error:
            'Comment author does not exist, please check supplied authorId',
        });
      }

      // Check if post exists
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
