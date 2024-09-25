import { Schema, model } from 'mongoose';
import { IAds } from '../interfaces/ads.interface';
import userModel from './user.model';

const adsSchema = new Schema(
  {
    image: String,
    message: String,
    author: userModel.schema
  },
  { timestamps: true }
);

export default model<IAds>('AdsModel', adsSchema);
