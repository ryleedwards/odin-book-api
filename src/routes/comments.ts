import { Router } from 'express';
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
} from '../handlers/comments';

const router = Router();

router.get('/', getComments);

router.get('/:id', getCommentById);

router.post('/', createComment);

router.patch('/:id', updateComment);

export default router;
