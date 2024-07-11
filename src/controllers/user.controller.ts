/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { transporter } from '../config/nodemailer';
import { Request, Response, NextFunction, response } from 'express';
import { IUser } from '../interfaces/user.interface';
import { generateOTP, returnFrontendUserInfo } from '../utils/user.util';
import { Error } from 'mongoose';

class UserController {
  public UserService = new userService();

  /**
   * Controller to get all users available
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.getAllUsers();
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'All users fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to get a user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.getUser(req.params._id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'User fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to create new user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public newUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let userExists = await this.UserService.getUserByEmail(req.body.email);
      if (!userExists) {
        const encrytedbody = await this.UserService.hashPassword(req.body);
        const user = await this.UserService.newUser(encrytedbody);
        const token = await this.UserService.signToken(user);

        return res.status(HttpStatus.CREATED).json({
          data: returnFrontendUserInfo(user),
          token: token,
          status: HttpStatus.CREATED,
          message: 'User created successfully'
        });
      } else {
        return res.status(HttpStatus.CONFLICT).json({
          code: HttpStatus.CONFLICT,
          message: 'User already exists'
        });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to Login a  user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let user = await this.UserService.getUserByEmail(req.body.email);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User Does not exists. Create account'
        });
      } else {
        let token = await this.UserService.signToken(user);
        let correct = await this.UserService.comparePassword(
          user.password,
          req.body.password
        );
        if (correct) {
          return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: returnFrontendUserInfo(user),
            token: token,
            message: 'User logged in successfully'
          });
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            code: HttpStatus.UNAUTHORIZED,
            message: 'Incorrect password'
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to update a user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.updateUser(req.params._id, req.body);

      res.status(HttpStatus.ACCEPTED).json({
        code: HttpStatus.ACCEPTED,
        data: {
          id: data._id,
          email: data.email,
          'display-name': data.displayName,
          'State of residence': data.SOR,
          'full-name': data.fullName,
          'phone-number': data.phone,
          field: data.field
        },
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to send OTP to user email
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public sendOTPEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const user = await this.UserService.getUserByEmail(email);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User does Not Exist or No matching accout'
        });
      } else {
        const otp = generateOTP();
        user.OTP = otp;
        await this.UserService.updateUser(user._id, user);

        await transporter.sendMail(
          this.UserService.prepareOtpMailOptions(email, otp),
          function (error, info) {
            if (error) {
              console.log('Error', error);

              next(error);
            } else {
              console.log('Email sent:' + info.response);

              return res.status(HttpStatus.ACCEPTED).json({
                code: HttpStatus.ACCEPTED,
                message: 'Email successfully sent'
              });
            }
          }
        );
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to verify OTP
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public verifyOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, otp } = req.body;

      const user = await this.UserService.getUserByEmail(email);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User does Not Exist or No matching accout'
        });
      } else {
        if (user.OTP === otp) {
          await this.UserService.removeOTP(user._id);
          return res.status(HttpStatus.ACCEPTED).json({
            code: HttpStatus.ACCEPTED,
            message: 'OTP verified successfully'
          });
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            code: HttpStatus.UNAUTHORIZED,
            message: 'OTP verification failed'
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to delete a single user
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await this.UserService.deleteUser(req.params._id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: {},
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
