import PagesController from '../controllers/pages.controller';
import express, { IRouter } from 'express';

class PagesRoutes {
  public PagesController = new PagesController();

  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Home Screeen data
    this.router.get('/home', this.PagesController.getHomeData);
  };
}
