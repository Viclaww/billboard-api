import { Schema, model } from 'mongoose';
import { IAds } from '../interfaces/ads.interface';
import userModel from './user.model';

const adsSchema = new Schema(
  {
    image: String,
    message: String,
    author: {
      email: String,
      name: String,
      id: String,
      image: String
    }
  },
  { timestamps: true }
);

export default model<IAds>('AdsModel', adsSchema);
