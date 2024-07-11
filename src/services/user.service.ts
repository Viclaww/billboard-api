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

  //get a single user
  public getUser = async (_id: string): Promise<IUser> => {
    const data = await User.findById(_id);
    return data;
  };
  public getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });
    return user;
  };

  public prepareOtpMailOptions = (email: string, otp: string) => {
    const mailOptions = {
      from: '"Lawrence from billboard" victor@demomailtrap.com',
      to: `${email}`,
      subject: 'OTP for password reset',
      html: `<p>Your OTP for password reset is <strong>${otp}</strong></p>`
    };
    return mailOptions;
  };

  public verifyOTP = (otp: string, userOtp: string): boolean => {
    if (otp === userOtp) {
      return true;
    }
    return false;
  };

  public removeOTPAfterTimeout = async (
    _id: string | number
  ): Promise<void> => {
    setTimeout(async () => {
      await User.findByIdAndUpdate(
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
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };

  public removeOTP = async (_id: string | number): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        OTP: ''
      },
      {
        new: true
      }
    );
    return data;
  };

  public hashPassword = async (body: IUser): Promise<IUser> => {
    let data = await hashPassword(body); // hashes the password of the body
    return data;
  };
  public comparePassword = async (pass1, pass2): Promise<boolean> => {
    const match = await comparePasswordUtil(pass1, pass2);
    return match;
  };
  public signToken = async (body: IUser): Promise<string> => {
    let token = await signToken(body);
    return token;
  };
}

export default UserService;
