import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../handlers/users';

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

export default router;
