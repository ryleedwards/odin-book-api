import { Router } from 'express';
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from '../handlers/profile';

// need { mergeParams: true } in order to get params from parent router
const router = Router({ mergeParams: true });

// GET users/:id/profile
router.get('/', getProfile);

// POST users/:id/profile
router.post('/', createProfile);

// PATCH users/:id/profile
router.patch('/', updateProfile);

// DELETE users/:id/profile
router.delete('/', deleteProfile);

export default router;
