import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';
import { uploadToCloudinary } from '../middlewares/uploadImage.middleware';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    //route to get all users
    this.router.get('', this.UserController.getAllUsers);

    //route to create a new user
    this.router.post('/signup', this.UserController.newUser);

    //route to login a user
    this.router.post('/login', this.UserController.loginUser);

    //route to get a single user
    this.router.get('/:_id', userAuth, this.UserController.getUserById);

    this.router.get('/profile', userAuth, this.UserController.getUserProfile);

    this.router.get(
      '/profile/update',
      userAuth,
      uploadToCloudinary,
      this.UserController.updateUser
    );

    //routes to update a single user
    this.router.put('/:_id', this.UserController.updateUser);

    //send otp to email
    this.router.post('/forgot-password', this.UserController.sendOTPEmail);

    // change-password
    this.router.post('/change-password', this.UserController.changePaassword);

    // verify otp
    this.router.post('/verify-otp', this.UserController.verifyOTP);

    //route to delete a single user
    this.router.delete('/:_id', this.UserController.deleteUser);

    // route for google login
    this.router.get('/google', this.UserController.signUpWithGoogle);
    this.router.get('/google/callback', this.UserController.googleCallback);
    this.router.post(
      '/google/token',
      this.UserController.authenticateGoogleToken
    );

    this.router.get('/logout', (req: any, res: any) => {
      req.logout();
      res.redirect('/');
    });
  };
  public getRoutes(): IRouter {
    return this.router;
  }
}

export default UserRoutes;
