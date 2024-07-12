import { Schema, model } from 'mongoose';
import { IBillboard } from '../interfaces/billboard.interface';

const billboardSchema = new Schema(
  {
    image: String,
    size: {
      type: String,
      enum: [
        'Portrait',
        'Large Format',
        '48 Sheet',
        'Spectacular Billboard',
        'Gantry',
        'Unipole'
      ]
    },
    rentPerMonth: Number,
    location: String,
    state: String,
    ownerId: String,
    available: Boolean,
    target: String,
    bookedBy: String
  },
  { timestamps: true }
);

export default model<IBillboard>('Billboard', billboardSchema);
