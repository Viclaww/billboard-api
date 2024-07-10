import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string | number;
  firstName: string;
  lastName: string;
  username: string | undefined;
  password: string;
  role: string | null | undefined;
}
