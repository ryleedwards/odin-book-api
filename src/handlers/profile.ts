import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';
import { CreatePostDto } from '../dtos/CreatePost.dto';
import { UpdatePostDto } from '../dtos/UpdatePost.dto';
import { UpdateProfileDto } from '../dtos/UpdateProfile.dto';
import { CreateProfileDto } from '../dtos/CreateProfile.dto';
import { handleUpload, handleDelete } from '../helpers/cloudinary';

const prisma = new PrismaClient();

export const getProfile = [
  param('id').isInt(),
  async (req: Request<{ id: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.id;
    // Submit query to get profile
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: true,
      },
    });

    // If profile doesn't exist, return 404
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    // Return profile
    res.json(profile);
  },
];

export const createProfile = [
  body('about').isString().optional(),
  body('image').isURL().optional(),
  async (
    req: Request<{}, {}, CreateProfileDto>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors
    const profile = await prisma.profile.create({
      data: req.body,
      include: {
        user: true,
      },
    });
    // Return profile
    res.json(profile);
  },
];

export const updateProfile = [
  param('id').isInt(),
  body('about').isString().optional(),
  body('image').isURL().optional({ values: 'null' }),
  async (
    req: Request<{ id: Number }, {}, UpdateProfileDto>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.id;
    // Submit query to update profile
    try {
      const profile = await prisma.profile.update({
        where: { userId: Number(userId) },
        data: req.body,
        include: {
          user: true,
        },
      });
      // Return profile
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },
];

export const deleteProfile = [
  param('id').isInt(),
  async (req: Request<{ id: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.id;
    // Submit query to delete profile
    const profile = await prisma.profile.delete({
      where: { userId: Number(userId) },
    });
    // Return profile
    res.json(profile);
  },
];

export const uploadProfilePicture = [
  param('id').isInt(),
  async (
    req: Request<{ id: string }, {}, { file: Express.Multer.File }>,
    res: Response,
    next: NextFunction
  ) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const userId = req.params.id;
    try {
      // Check if file was uploaded
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get current profile picture publicId for deletion
      const currentProfile = await prisma.profile.findUnique({
        where: { userId: Number(userId) },
      });

      // Upload new profile picture to cloudinary
      const b64 = Buffer.from(fileBuffer).toString('base64');
      let dataURI = `data:${req.file?.mimetype};base64,${b64}`;
      const cldRes = await handleUpload(dataURI);

      // Delete old profile picture from cloudinary
      if (currentProfile?.image) {
        await handleDelete(currentProfile.image);
      }

      // Submit query to update profile with new publicId
      const profile = await prisma.profile.update({
        where: { userId: Number(userId) },
        data: { image: cldRes.public_id },
      });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
];
