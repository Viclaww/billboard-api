import { model, Schema } from 'mongoose';
import { IEvent } from '../interfaces/event.interface';

const eventModel = new Schema({
  host: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventDate: {
    type: String,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  eventLocation: {
    type: String || Object
  },
  slug: String,
  eventFlier: {
    type: String,
    required: true
  }
});

export default model<IEvent>('Event', eventModel);
