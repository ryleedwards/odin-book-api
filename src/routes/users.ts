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
import {
  createFollow,
  deleteFollow,
  getFollowersByUserId,
  getFollowsByUserId,
  isCurrentlyFollowed,
} from '../handlers/follows';

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

// GET api/users/:id/follows
router.get('/:userId/follows', getFollowsByUserId);

// GET api/users/:id/followers
router.get('/:userId/followers', getFollowersByUserId);

// GET /api/users/:id/follow
router.get('/:userId/follow', isCurrentlyFollowed);

// POST api/users/:id/follow
router.post('/:userId/follow', createFollow);

// DELETE api/users/:id/follow
router.delete('/:userId/follow', deleteFollow);

export default router;
