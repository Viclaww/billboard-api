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
  rentPerMonth: Number;
  location: string;
  ownerId: string;
  available: boolean;
  state: string;
}
