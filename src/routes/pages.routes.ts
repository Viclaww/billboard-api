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
    this.router.get('/marketplace', this.PagesController.marketplace);
    this.router.get('/community', this.PagesController.community);

    this.router.post('/advertisements', this.PagesController.createAd);

    this.router.get('/advertisements/:id', this.PagesController.getAnAd);
    this.router.get('/advertisements', this.PagesController.getAllAds);
  };
  public getRoutes(): IRouter {
    return this.router;
  }
}

export default PagesRoutes;
