import { IForum } from '../interfaces/chat.interface';
import { IUser } from '../interfaces/user.interface';
import groupModel from '../models/group.model';
import messageModel from '../models/message.model';

class ChatService {
  async createForum(body: IForum, user: IUser) {
    const forum = await groupModel.create({ ...body, admin: user._id });
    return forum;
  }

  async getForums() {
    const forums = await groupModel.find();
    return forums;
  }

  async getForum(id: string) {
    const forum = await groupModel.findById(id);
    return forum;
  }

  async deleteForum(id: string) {
    const forum = await groupModel.findByIdAndDelete(id);
    return forum;
  }

  async updateForum(id: string, body: IForum) {
    const forum = await groupModel.findByIdAndUpdate(
      {
        _id: id
      },
      body,
      {
        new: true
      }
    );
    return forum;
  }

  async sendMessage(
    sender: string,
    receiver: string,
    content: string,
    groupId: string
  ) {
    const message = await messageModel.create({
      sender,
      receiver,
      content,
      groupId
    });
    return message;
  }

  async getMessages(groupId: string) {
    const messages = await messageModel
      .find({ groupId })
      .sort({ timestamp: 1 });
    return messages;
  }
}

export default ChatService;
