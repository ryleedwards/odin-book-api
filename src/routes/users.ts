import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPostsByUser,
} from '../handlers/users';

import profileRouter from './profile';

const router = Router();

// GET api/users
router.get('/', getUsers);

// GET api/users/:id
router.get('/:id', getUserById);

// POST api/users
router.post('/', createUser);

// PATCH api/users/:id
router.patch('/:id', updateUser);

// DELETE api/users/:id
router.delete('/:id', deleteUser);

// GET api/users/:id/posts
router.get('/:userId/posts', getPostsByUser);

// GET api/users/:id/profile
router.use('/:id/profile', profileRouter);

export default router;
