import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { string } from '@hapi/joi';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    displayName: {
      type: String
    },
    fullName: {
      type: String
    },
    phone: {
      type: String
    },
    SOR: {
      // state of residence
      type: String
    },
    field: {
      type: String,
      enum: [
        'Billboard Owner',
        'Advertising Agent',
        'State Agent',
        'Business Owner'
      ]
    },
    OTP: String,
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);
