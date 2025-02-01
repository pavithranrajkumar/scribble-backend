import { Types } from 'mongoose';
import { Post } from '../models/post.model.js';
import { AppError } from '../utils/errors.js';
import type { UserDocument, PostDocument } from '../types/model.types.js';
import type { CreatePostInput, UpdatePostInput } from '../utils/validators.js';

export class PostService {
  static async getPosts(offset: number = 0, limit: number = 10, userId?: Types.ObjectId) {
    try {
      console.log(userId);
      const query = userId ? { author: userId } : {};
      const posts = await Post.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).populate('author');
      return posts;
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  static async getPostById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw AppError.BadRequest('Invalid post ID');
      }
      const post = await Post.findById(id).populate('author');
      if (!post) throw AppError.NotFound('Post not found');
      return post;
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  }

  static async createPost(input: CreatePostInput, user: UserDocument) {
    try {
      const post = await Post.create({
        ...input,
        author: new Types.ObjectId(user.id),
      });
      return post.populate('author');
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  static async updatePost(input: UpdatePostInput, userId: string) {
    try {
      const post = await this.getPostById(input.id);
      console.log(post.author.id.toString(), userId);
      if (post.author.id.toString() !== userId) {
        throw AppError.Forbidden();
      }
      Object.assign(post, input);
      await post.save();
      return post.populate('author');
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  }

  static async deletePost(id: string, userId: string) {
    try {
      const post = await this.getPostById(id);
      if (post.author.id.toString() !== userId) {
        throw AppError.Forbidden();
      }
      await post.deleteOne();
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  }

  static async likePost(postId: string, userId: string) {
    try {
      const post = await this.getPostById(postId);
      const userObjectId = new Types.ObjectId(userId);

      const dislikeIndex = post.dislikes.findIndex((id) => id.equals(userObjectId));
      if (dislikeIndex > -1) {
        post.dislikes.splice(dislikeIndex, 1);
      }

      const likeIndex = post.likes.findIndex((id) => id.equals(userObjectId));
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userObjectId);
      }

      await post.save();
      return post.populate('author');
    } catch (error) {
      console.error('Error in likePost:', error);
      throw error;
    }
  }

  static async dislikePost(postId: string, userId: string) {
    try {
      const post = await this.getPostById(postId);
      const userObjectId = new Types.ObjectId(userId);

      const likeIndex = post.likes.findIndex((id) => id.equals(userObjectId));
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
      }

      const dislikeIndex = post.dislikes.findIndex((id) => id.equals(userObjectId));
      if (dislikeIndex > -1) {
        post.dislikes.splice(dislikeIndex, 1);
      } else {
        post.dislikes.push(userObjectId);
      }

      await post.save();
      return post.populate('author');
    } catch (error) {
      console.error('Error in dislikePost:', error);
      throw error;
    }
  }
}
