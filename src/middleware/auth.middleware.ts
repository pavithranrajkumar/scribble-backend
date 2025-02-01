import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/errors.js';
import { environment } from '../config/environment.js';
import type { UserDocument } from '../types/model.types.js';

interface JwtPayload {
  id: string;
}

export const getUser = async (token: string): Promise<UserDocument | null> => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, environment.jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
};

type ResolverFn = (parent: any, args: any, context: { user: UserDocument | null }, info: any) => any;

export const requireAuth = (resolver: ResolverFn): ResolverFn => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new AppError('Authentication required', 401);
    }
    return resolver(parent, args, context, info);
  };
};
