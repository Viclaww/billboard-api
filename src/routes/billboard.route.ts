import BillboardController from '../controllers/billboard.controller';
import express, { IRouter } from 'express';
import { userAuth } from '../middlewares/auth.middleware';
import { uploadToCloudinary } from '../middlewares/uploadImage.middleware';

class BillboardRoutes {
  public billboardController = new BillboardController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // create a new billboard
    this.router.post(
      '/new',
      userAuth,
      uploadToCloudinary,
      this.billboardController.createNewBillboard
    );

    //  get the billboards sorted by newest
    this.router.get(
      '/list/new',
      userAuth,
      this.billboardController.getBillboardByNewest
    );
  };
  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default BillboardRoutes;
