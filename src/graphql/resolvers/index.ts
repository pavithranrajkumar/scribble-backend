import { postResolvers } from './post.resolver.js';
import { userResolvers } from './user.resolver.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  Post: postResolvers.Post,
};
