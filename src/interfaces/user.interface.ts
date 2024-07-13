import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string | number | undefined;
  image: string | undefined;
  email: string;
  fullName: string | undefined;
  phone: string | undefined;
  displayName: string | undefined;
  password: string | Promise<string> | undefined;
  SOR: string | undefined;
  OTP: String | undefined | null;
  resetingPassword: Boolean;
  googleId: string | undefined;
  field:
    | 'Billboard Owner'
    | 'Advertising Agent'
    | 'State Agent'
    | 'Business Owner'
    | undefined;
}
