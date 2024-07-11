import { Router } from 'express';
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from '../handlers/profile';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// POST users/:id/profile/upload-profile-picture
router.post(
  '/upload-profile-picture',
  upload.single('profile_picture'),
  uploadProfilePicture
);

export default router;
