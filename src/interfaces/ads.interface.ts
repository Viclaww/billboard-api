import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IAds extends Document {
  image: String;
  message: string;
  author: IUser;
}
