import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import BillboardService from '../services/billlboard.service';
import jwt from 'jsonwebtoken';
import { IBillboard } from '../interfaces/billboard.interface';
import UserService from '../services/user.service';

class BillboardController {
  public billboardService = new BillboardService();
  public userService = new UserService();
  /**
   * Controller to get all billboards sorted by newest
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getBillboardByNewest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const billboards = await this.billboardService.getBillBoardByNewest();
      return res.status(HttpStatus.OK).json({
        code: 200,
        data: billboards,
        message: 'New billboards fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public getABillboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const data = await this.billboardService.getSingleBillboardById(id);
      if (data) {
        console.log(data);

        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: data,
          message: 'Billboard fetched Successful!'
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Billboard Not found'
        });
      }
    } catch (error) {}
  };
  /**
   * Controller to get all billboards
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public getBillboards = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const billboards = await this.billboardService.getAllBillboards();
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: billboards,
        message: 'All users fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public getSingleBillboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {}
  };

  /**
   * Controller to create a billboard
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public createNewBillboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      let ownerId;
      let bearerToken = req.header('Authorization').split(' ')[1].trim();
      const decodedToken = jwt.decode(bearerToken) as { email: string }; // decoding the bearer token
      ownerId = (await this.userService.getUserByEmail(decodedToken.email))._id; // getting the owners Id
      const image = req.fileUrl;
      const billboard = await this.billboardService.newBillboard({
        ...req.body,
        image,
        ownerId,
        available: true
      });
      return res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: billboard,
        message: 'Billboard Created successfully!'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default BillboardController;
