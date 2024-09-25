import { Document } from 'mongoose';

export interface IMessage extends Document {
  message: string;
  senderId: string;
  groupId: string;
  receiverId: string;
  seenIds: string[] | boolean;
}

export interface IForum extends Document {
  name: string;
  members: string[];
  admin: string[];
}
