import { Router } from 'express';
import { getUsers, getUserById } from '../handlers/users';

const router = Router();

// GET api/users
router.get('/', getUsers);

// GET api/users/:id
router.get('/:id', getUserById);

export default router;
