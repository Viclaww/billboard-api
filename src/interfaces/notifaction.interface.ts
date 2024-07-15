import { Document } from 'mongoose';

export interface INotification extends Document {
  type: string;
  message: string;
  read: boolean;
}
