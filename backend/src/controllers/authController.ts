import type { Request, Response } from 'express';
import * as authService from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body as RegisterInput);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body as LoginInput);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  res.status(200).json({
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await authService.getSalesUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});
