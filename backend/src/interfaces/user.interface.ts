import type { Document, Types } from 'mongoose';

export type UserRole = 'Admin' | 'Sales User';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
