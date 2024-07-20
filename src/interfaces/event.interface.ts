import { Date, Document } from 'mongoose';

export interface IEvent extends Document {
  organizer: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventFlier: string;
}
