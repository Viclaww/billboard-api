/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { transporter } from '../config/nodemailer';
import { Request, Response, NextFunction, response } from 'express';
import jwt from 'jsonwebtoken';
import { generateOTP, returnFrontendUserInfo } from '../utils/user.util';
import passport from 'passport';

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
  ): Promise<Response> => {
    try {
      const data = await this.UserService.getAllUsers();
      return res.status(HttpStatus.OK).json({
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
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const data = await this.UserService.getUser(req.params._id);
      return res.status(HttpStatus.OK).json({
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

  public getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      let bearerToken = req.header('Authorization').split(' ')[1].trim();
      if (bearerToken) {
        let user = this.UserService.getUserbyBearerToken(bearerToken);

        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          data: returnFrontendUserInfo(user),
          message: 'User profile fetched successfully!'
        });
      } else {
        return res.status(HttpStatus.NOT_ACCEPTABLE).json({
          code: HttpStatus.NOT_ACCEPTABLE,
          message: 'Not Authorized!'
        });
      }
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
  ): Promise<Response> => {
    try {
      // check if user already exists
      let userExists = await this.UserService.getUserByEmail(req.body.email);
      if (!userExists) {
        const encrytedbody = await this.UserService.hashPassword(req.body); //hashing the password
        const user = await this.UserService.newUser(encrytedbody); // creating user
        const token = await this.UserService.signToken(user); // creating token

        return res.status(HttpStatus.CREATED).json({
          data: returnFrontendUserInfo(user),
          token: token,
          status: HttpStatus.CREATED,
          message: 'User created successfully'
        });
      } else {
        // if user exists
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
      let user = await this.UserService.getUserByEmail(req.body.email); // check for user
      console.log(req.body);
      if (!user) {
        // if user doesnt exist
        console.log(user);

        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User Does not exists. Create account'
        });
      } else {
        // if user exists
        let token = await this.UserService.signToken(user);
        let correct = await this.UserService.comparePassword(
          user.password,
          req.body.password
        ); // check if password is correct
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
      let data;
      if (req.params.id) {
        data = await this.UserService.updateUser(req.params._id, req.body);
      } else {
        let bearerToken = req.header('Authorization').split(' ')[1].trim();
        if (bearerToken) {
          let user = await this.UserService.getUserbyBearerToken(bearerToken);
          data = await this.UserService.updateUser(user._id, req.body);
        }
      }

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
        message: 'Profile updated successfully'
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
      // sending otp to user email
      const { email } = req.body;
      console.log('got her');
      const user = await this.UserService.getUserByEmail(email);
      console.log(user);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User does Not Exist or No matching accout'
        });
      } else {
        const otp = generateOTP(); //generating otp

        user.OTP = otp; // setting the otp to the user

        const updatedUser = await this.UserService.updateUser(user._id, user); // update the user
        await this.UserService.removeOTPAfterTimeout(updatedUser._id);
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
      console.log(req.body);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'User does Not Exist or No matching accout'
        });
      } else {
        if (user.OTP === otp) {
          await this.UserService.removeOTP(user._id); // removimg otp after verification
          await this.UserService.changeResetPasswordProperty(user._id, true);

          setTimeout(async () => {
            await this.UserService.changeResetPasswordProperty(user._id, false);
          }, 10 * 60 * 1000); // this resets the password property to false after 10 minutes
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
   * Controller to change password
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const user = await this.UserService.getUserByEmail(email);

      if (user) {
        if (user.resetingPassword) {
          const updatedUser = await this.UserService.changePassword(
            user.id,
            password
          );
          await this.UserService.changeResetPasswordProperty(
            updatedUser._id,
            false
          );
          const token = await this.UserService.signToken(updatedUser);
          return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: returnFrontendUserInfo(updatedUser),
            token,
            message: 'User logged in successfully'
          });
        } else {
          return res.status(HttpStatus.NOT_ACCEPTABLE).json({
            code: HttpStatus.NOT_ACCEPTABLE,
            message: 'You are not allowed to access this Route'
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
  ): Promise<Response> => {
    try {
      await this.UserService.deleteUser(req.params._id);
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: {},
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controllers for google authentication
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public authenticateGoogleToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const token = req.body.token;
      const user = await this.UserService.verifyGoogleToken(token);
      return (req as any).login(user, async (error) => {
        if (error) {
          return res.status(500).send('failed to login');
        }
        return res.status(200).json({
          code: HttpStatus.OK,
          data: returnFrontendUserInfo(user),
          message: 'User logged in successfully'
        });
      });
    } catch (error) {
      //  res.status(401).send('Invalid ID token');
      next(error);
    }
  };

  public signUpWithGoogle = async () => {
    // implement google sign up
    passport.authenticate('google', { scope: ['profile', 'email'] });
  };

  public googleCallback = async () => {
    // implement google callback
    passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      };
  };
}

export default UserController;
