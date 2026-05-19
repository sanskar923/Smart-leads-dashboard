import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { IUserDocument } from '../interfaces/user.interface';

interface TokenPayload {
  id: string;
  role: string;
}

export const signToken = (user: IUserDocument): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};
