import { NextFunction, Request, Response } from 'express';
import BillboardService from '../services/billlboard.service';
import UserService from '../services/user.service';
import HttpStatus from 'http-status-codes';
import AdsService from '../services/ads.service';
import ChatService from '../services/chat.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
class PagesController {
  public billboardService = new BillboardService();
  public userService = new UserService();
  public adsService = new AdsService();
  public chatService = new ChatService();

  /**
   * Controller to get all data for the Home screen
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getHomeData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const newBillboards = await this.billboardService.getBillBoardByNewest();
      const popularBillboards = await this.billboardService.getAllBillboards();

      return res.status(HttpStatus.OK).json({
        code: 200,
        data: {
          new: newBillboards,
          popular: popularBillboards
        },
        message: 'Data fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to get all data for the MarketPlace screen
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public marketplace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const newBillboards = await this.billboardService.getBillBoardByNewest();
      const popularBillboards = await this.billboardService.getAllBillboards();

      return res.status(HttpStatus.OK).json({
        code: 200,
        data: {
          featured: newBillboards,
          explore: popularBillboards
        },
        message: 'Data fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public community = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ads = await this.adsService.getAllAds();
      const groups = await this.chatService.getForums();

      return res.status(HttpStatus.OK).json({
        advertisements: ads,
        groups
      });
    } catch (error) {
      next(error);
    }
  };
  public getAllAds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ads = await this.adsService.getAllAds();
      return res.status(HttpStatus.OK).json({ ads });
    } catch (error) {
      next(error);
    }
  };
  public getAnAd = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ad = await this.adsService.getSingleAd(req.params.id);
      return res.status(HttpStatus.OK).json({ ad });
    } catch (error) {
      next(error);
    }
  };

  public createAd = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ad = await this.adsService.createAd({
        ...req.body,
        image: req.fileUrl,
        author: {
          email: (await this.userService.getUserByEmail(req.user.email)).email,
          name: (
            await this.userService.getUserByEmail(req.user.email)
          ).displayName,
          id: (await this.userService.getUserByEmail(req.user.email)).id,
          image: (await this.userService.getUserByEmail(req.user.email)).image
        }
      });
      return res.status(HttpStatus.OK).json({ ad });
    } catch (error) {
      next(error);
    }
  };
}
export default PagesController;
