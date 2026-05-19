import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import type { IUserDocument, IUserPublic } from '../interfaces/user.interface';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

const toPublicUser = (user: IUserDocument): IUserPublic => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create(input);
  const token = signToken(user);

  return {
    token,
    user: toPublicUser(user),
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user || !(await user.comparePassword(input.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user);

  return {
    token,
    user: toPublicUser(user),
  };
};

export const getSalesUsers = async (): Promise<IUserPublic[]> => {
  const users = await User.find({ role: { $in: ['Admin', 'Sales User'] } }).select(
    'name email role'
  );
  return users.map((u) => toPublicUser(u));
};
