import type { UserDocument } from '../types/model.types.js';

export interface Context {
  user: UserDocument | null;
}
