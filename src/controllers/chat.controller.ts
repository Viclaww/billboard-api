import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import ChatService from '../services/chat.service';

class ChatController {
  public chatService = new ChatService();

  async createForum(req: AuthenticatedRequest, res: Response) {
    try {
      const forum = await this.chatService.createForum(req.body, req.user);
      return res.status(HttpStatus.OK).json({ forum });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  async getForums(req: AuthenticatedRequest, res: Response) {
    const forums = await this.chatService.getForums();
    res.json({ forums });
  }

  async getForum(req: AuthenticatedRequest, res: Response) {
    try {
      const forum = await this.chatService.getForum(req.params.id);
      res.json({ forum });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  async deleteForum(req: AuthenticatedRequest, res: Response) {
    try {
      const forum = await this.chatService.getForum(req.params.id);
      if (forum.admin.includes(req.user._id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'You are not authorized to delete this forum' });
      }

      await this.chatService.deleteForum(req.params.id);
      res.json({ message: 'Forum deleted successfully' });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  async updateForum(req: AuthenticatedRequest, res: Response) {
    try {
      const forum = await this.chatService.getForum(req.params.id);
      if (forum.admin.includes(req.user._id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'You are not authorized to update this forum' });
      }

      const updatedForum = await this.chatService.updateForum(
        req.params.id,
        req.body
      );
      res.json({ updatedForum });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const message = await this.chatService.sendMessage(
        req.user._id,
        req.body.receiver,
        req.body.content,
        req.params.groupId
      );
      res.json({ message });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }

  async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const messages = await this.chatService.getMessages(req.params.groupId);
      res.json({ messages });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error });
    }
  }
}

export default ChatController;
