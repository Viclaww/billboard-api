import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

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
    this.router.get('/:_id', userAuth, this.UserController.getUser);

    //routes to update a single user
    this.router.put('/:_id', this.UserController.updateUser);
    this.router.patch('/:_id', this.UserController.updateUser);
    //send otp to email
    this.router.post('/forgot-password', this.UserController.sendOTPEmail);

    // verify otp
    this.router.post('/verify-otp', this.UserController.verifyOTP);

    //route to delete a single user
    this.router.delete('/:_id', this.UserController.deleteUser);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
