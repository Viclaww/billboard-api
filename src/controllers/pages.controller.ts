import { NextFunction, Request, Response } from 'express';
import BillboardService from '../services/billlboard.service';
import UserService from '../services/user.service';
import HttpStatus from 'http-status-codes';
class PagesController {
  public billboardService = new BillboardService();
  public userService = new UserService();

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

  public Marketplace = async (
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
}
export default PagesController;
