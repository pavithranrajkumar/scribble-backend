import { AuthService } from '../../services/auth.service.js';
import type { Context } from '../context.js';
import type { RegisterInput, LoginInput } from '../../utils/validators.js';

export const userResolvers = {
  Query: {
    me: (_: unknown, __: unknown, { user }: Context) => user,
  },

  Mutation: {
    register: async (_: unknown, { input }: { input: RegisterInput }) => {
      return AuthService.register(input);
    },

    login: async (_: unknown, { input }: { input: LoginInput }) => {
      return AuthService.login(input);
    },
  },
};
