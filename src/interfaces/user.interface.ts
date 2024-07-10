import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string | number | undefined;
  email: string | undefined;
  fullName: string | undefined;
  phone: string | undefined;
  displayName: string | undefined;
  password: string | Promise<string> | undefined;
  SOR: string | undefined;
  OTP: String | undefined | null;
  field:
    | 'Billboard Owner'
    | 'Advertising Agent'
    | 'State Agent'
    | 'Business Owner'
    | undefined;
}
