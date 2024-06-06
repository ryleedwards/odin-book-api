import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
} from '../handlers/posts';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.patch('/:id', updatePost);

export default router;
