import { Document, Types } from 'mongoose';

export interface PostDocument extends Document {
  title: string;
  description: string;
  author: Types.ObjectId | UserDocument;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
