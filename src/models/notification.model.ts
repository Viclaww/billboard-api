import { model, Schema } from 'mongoose';
import { INotification } from '../interfaces/notifaction.interface';

const notificationSchema = new Schema(
  {
    type: String,
    message: String,
    read: Boolean
  },
  { timestamps: true }
);

export default model<INotification>('Notification', notificationSchema);
