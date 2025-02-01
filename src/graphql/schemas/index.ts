import { userTypeDefs } from './user.schema.js';
import { postTypeDefs } from './post.schema.js';

export const baseTypeDefs = `#graphql
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, postTypeDefs];
