import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPostId,
  createCommentByPostId,
} from '../handlers/posts';

import { getLikesByPostId, createLike, deleteLike } from '../handlers/likes';

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
// POST api/posts/:postId/comments
router.post('/:postId/comments', createCommentByPostId);
// GET api/posts/:id/likes
router.get('/:postId/likes', getLikesByPostId);
// POST api/posts/:id/likes
router.post('/:postId/likes', createLike);
// DELETE api/posts/:id/likes
router.delete('/:postId/likes', deleteLike);

export default router;
