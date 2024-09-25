import express, { IRouter, Router } from 'express';
import ChatController from '../controllers/chat.controller';
class ChatRoutes {
  private chatController = new ChatController();
  public router: Router = express.Router();
  constructor() {
    this.routes();
  }
  private routes() {
    this.router.get('/forums', this.chatController.getForums);
    this.router.get('/forums/:id', this.chatController.getForum);
    this.router.post('/forums', this.chatController.createForum);
    this.router.delete('/forums/:id', this.chatController.deleteForum);
    this.router.put('/forums/:id', this.chatController.updateForum);
    this.router.post(
      '/forums/:groupId/messages',
      this.chatController.sendMessage
    );
    this.router.get(
      '/forums/:groupId/messages',
      this.chatController.getMessages
    );
  }
  public getRoutes(): IRouter {
    return this.router;
  }
}

export default ChatRoutes;
