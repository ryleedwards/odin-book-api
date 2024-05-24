import { Router } from 'express';
import { getUsers } from '../handlers/users';

const router = Router();

// api/users
router.get('/', getUsers);

export default router;
