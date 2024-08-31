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

    // get the billboards
    this.router.get('/list', userAuth, this.billboardController.getBillboards);

    // get a single billboard
    this.router.get('/:id', userAuth, this.billboardController.getABillboard);

    // get a user's billboards

    this.router.get(
      '/user/:id',
      userAuth,
      this.billboardController.getUsersBillboards
    );
  };
  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default BillboardRoutes;
