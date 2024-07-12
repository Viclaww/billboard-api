import { Document } from 'mongoose';

export interface IBillboard extends Document {
  _id: string | undefined;
  image: string | undefined;
  size:
    | 'Portrait'
    | 'Large Format'
    | '48 Sheet'
    | 'Spectacular Billboard'
    | 'Gantry'
    | 'Unipole';
  rentPerMonth: Number | undefined;
  location: string | undefined;
  ownerId: string | undefined;
  available: boolean;
  state: string | undefined;
  target: string | undefined;
  bookedBy: string | undefined | null;
}
