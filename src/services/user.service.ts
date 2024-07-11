import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import {
  comparePasswordUtil,
  hashPassword,
  signToken
} from '../utils/user.util';

class UserService {
  //get all users
  public getAllUsers = async (): Promise<IUser[]> => {
    const data = await User.find();
    return data;
  };

  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const data = await User.create(body);
    return data;
  };

  //update a user
  public updateUser = async (
    _id: string | number,
    body: IUser
  ): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(
      {
        _id
      },
      body,
      {
        new: true
      }
    );
    return data;
  };

  //delete a user
  public deleteUser = async (_id: string): Promise<string> => {
    await User.findByIdAndDelete(_id);
    return '';
  };

  //get a single user by id
  public getUser = async (_id: string): Promise<IUser> => {
    const data = await User.findById(_id);
    return data;
  };

  // get a single user by email
  public getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });
    return user;
  };

  //  create the options for the nodemailer transporter
  public prepareOtpMailOptions = (email: string, otp: string) => {
    const mailOptions = {
      from: '"Lawrence from billboard" victor@demomailtrap.com',
      to: `${email}`,
      subject: 'OTP for password reset',
      html: `<p>Your OTP for password reset is <strong>${otp}</strong></p>`
    };
    return mailOptions;
  };

  // verify the user's otp
  public verifyOTP = (otp: string, userOtp: string): boolean => {
    if (otp === userOtp) {
      return true;
    }
    return false;
  };

  // to change user password
  public changePassword = async (
    _id: string | number,
    password: string
  ): Promise<IUser> => {
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        password
      },
      {
        new: true
      }
    );
    return updatedUser;
  };

  // removing the otp after five minutes
  public removeOTPAfterTimeout = async (
    _id: string | number
  ): Promise<void> => {
    setTimeout(async () => {
      this.removeOTP(_id);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };

  // this removes otp
  public removeOTP = async (_id: string | number): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        OTP: null
      },
      {
        new: true
      }
    );
    return data;
  };

  //  hash the passwords
  public hashPassword = async (body: IUser): Promise<IUser> => {
    let data = await hashPassword(body); // hashes the password of the body
    return data;
  };

  // comparing passwords
  public comparePassword = async (pass1, pass2): Promise<boolean> => {
    const match = await comparePasswordUtil(pass1, pass2);
    return match;
  };

  // sign tokens with jwt
  public signToken = async (body: IUser): Promise<string> => {
    let token = await signToken(body);
    return token;
  };
}

export default UserService;
