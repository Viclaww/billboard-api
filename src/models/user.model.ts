import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    image: String,
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
    resetingPassword: Boolean,
    password: {
      type: String,
      required: true
    },
    googleId: String
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);
