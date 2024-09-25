import { model, Schema } from 'mongoose';
import { IForum } from '../interfaces/chat.interface';

const forumSchema = new Schema(
  {
    name: String,
    description: String,
    members: [String],
    admin: String,
    image: String
  },
  { timestamps: true }
);
export default model<IForum>('Forum', forumSchema);
