import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPostId,
} from '../handlers/posts';

const router = Router();

// GET api/posts
router.get('/', getPosts);
// GET api/posts/:id
router.get('/:id', getPostById);
// POST api/posts
router.post('/', createPost);
// PATCH api/posts/:id
router.patch('/:id', updatePost);
// DELETE api/posts/:id
router.delete('/:id', deletePost);
// GET api/posts/:postId/comments
router.get('/:postId/comments', getCommentsByPostId);

export default router;
