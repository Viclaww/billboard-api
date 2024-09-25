import { model, Schema } from 'mongoose';
import { IMessage } from '../interfaces/chat.interface';

const messageModel = new Schema(
  {
    content: String,
    sender: String,
    receiver: String,
    read: Boolean,
    groupId: String,
    repliedto: Object
  },
  { timestamps: true }
);

export default model<IMessage>('Message', messageModel);
