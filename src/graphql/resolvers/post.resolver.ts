import { PostService } from '../../services/post.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import type { Context } from '../context.js';
import type { CreatePostInput, UpdatePostInput } from '../../utils/validators.js';
import { Types } from 'mongoose';

export const postResolvers = {
  Query: {
    posts: async (_: unknown, { offset, limit, userId }: { offset?: number; limit?: number; userId?: Types.ObjectId }) => {
      return PostService.getPosts(offset, limit, userId);
    },

    post: async (_: unknown, { id }: { id: string }) => {
      return PostService.getPostById(id);
    },
  },

  Mutation: {
    createPost: requireAuth(async (_: unknown, { input }: { input: CreatePostInput }, { user }: Context) => {
      return PostService.createPost(input, user!);
    }),

    updatePost: requireAuth(async (_: unknown, { input }: { input: UpdatePostInput }, { user }: Context) => {
      return PostService.updatePost(input, user!.id);
    }),

    deletePost: requireAuth(async (_: unknown, { id }: { id: string }, { user }: Context) => {
      return PostService.deletePost(id, user!.id);
    }),

    likePost: requireAuth(async (_: unknown, { id }: { id: string }, { user }: Context) => {
      return PostService.likePost(id, user!.id);
    }),

    dislikePost: requireAuth(async (_: unknown, { id }: { id: string }, { user }: Context) => {
      return PostService.dislikePost(id, user!.id);
    }),
  },

  Post: {
    likeCount: (post: any) => post.likes.length,
    dislikeCount: (post: any) => post.dislikes.length,
    isLiked: (post: any, _: unknown, { user }: Context) => (user ? post.likes.includes(user.id) : false),
    isDisliked: (post: any, _: unknown, { user }: Context) => (user ? post.dislikes.includes(user.id) : false),
  },
};
