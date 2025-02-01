import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/errors.js';
import { RegisterInput, LoginInput } from '../utils/validators.js';
import { environment } from '../config/environment.js';
import type { UserDocument } from '../types/model.types.js';

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await User.findOne({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      throw AppError.BadRequest('User already exists');
    }

    const user = await User.create(input);
    const token = this.generateToken(user.id);

    return { token, user };
  }

  static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw AppError.BadRequest('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      throw AppError.BadRequest('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { token, user };
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, environment.jwtSecret, {
      expiresIn: '7d',
    });
  }
}
