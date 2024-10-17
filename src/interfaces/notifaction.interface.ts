import { Document } from 'mongoose';

export interface INotification extends Document {
  type: string;
  title: string;
  message: string;
  read: boolean;
}
