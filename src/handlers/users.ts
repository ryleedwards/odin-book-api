import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { body, param, validationResult } from 'express-validator';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = [
  // Validate the request params
  param('id').isInt(),
  async (req: Request<{ id: Number }>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to get user
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    // If user doesn't exist, return 404
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return user
    res.json(user);
  },
];

export const createUser = [
  // Validate the request body
  body('email').isEmail(),
  body('name').isString(),
  body('password').isString(),
  // Submit query to create user
  async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Gather validation errors
      const errors = validationResult(req);
      // If there are errors, return with 400 status and validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // No errors, create user
      const { email, name, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword },
      });
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
];

export const updateUser = [
  // Validate the request params
  param('id').isInt(),
  // Validate the request body
  body('email').isEmail().optional(),
  body('name').isString().optional(),
  body('password').isString().optional(),
  async (req: Request<{ id: Number }, {}, UpdateUserDto>, res: Response) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to update user
    const { email, name } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, name },
    });
    // Return user
    res.json(user);
  },
];

export const deleteUser = [
  // Validate the request params
  param('id').isInt(),
  async (req: Request<{ id: Number }>, res: Response, next: NextFunction) => {
    // Gather validation errors
    const errors = validationResult(req);
    // If there are errors, return with 400 status and validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // No errors, get id from params
    const id = req.params.id;
    // Submit query to delete user
    try {
      // Check if user exists
      const userExists = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user exists, delete user
      const user = await prisma.user.delete({ where: { id: Number(id) } });
      // Return user
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  },
];
