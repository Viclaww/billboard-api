import { Date, Document } from 'mongoose';

export interface IEvent extends Document {
  host: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventFlier: string;
  slug: string;
}
