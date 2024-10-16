import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { OAuth2Client } from 'google-auth-library';
import {
  comparePasswordUtil,
  hashPassword,
  signToken
} from '../utils/user.util';
import jwt from 'jsonwebtoken';
import { hash } from 'argon2';
import { otpMail } from './html/otpmail';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';

class UserService {
  //get all users
  public getAllUsers = async (): Promise<IUser[]> => {
    const data = await User.find();
    return data;
  };
  public client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

  public getUserbyBearerToken = async (bearerToken: string) => {
    const decodedToken = jwt.decode(bearerToken) as { email: string };
    // getting the user  threugh decodedtoken
    const user = await this.getUserByEmail(decodedToken.email);
    return user;
  };

  //get a single user by id
  public getUser = async (_id: string): Promise<IUser> => {
    const data = await User.findById(_id);
    return data;
  };

  // get a single user by email
  public getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email: email });
    return user;
  };

  //  create the options for the nodemailer transporter
  public prepareOtpMailOptions = (email: string, otp: string) => {
    const mailOptions = {
      from: '"Lawrence from billboard" victor@demomailtrap.com',
      to: `${email}`,
      subject: 'OTP for password reset',
      html: otpMail(otp),
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '/html/logo.png'),
          cid: 'billboardlogo' //same cid value as in the html img src
        },
        {
          filename: 'postbox.png',
          path: path.join(__dirname, '/html/mail.png'),
          cid: 'postbox' //same cid value as in the html img src
        }
      ]
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
    const passwordHash = await hash(password);
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        password: passwordHash
      },
      {
        new: true
      }
    );
    return updatedUser;
  };

  // to change resetpassword property
  public changeResetPasswordProperty = async (
    _id: string | number,
    value: boolean
  ): Promise<IUser> => {
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id
      },
      {
        resetingPassword: value
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
      this.removeOTP(_id); // resseting otp after it expires
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
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

  public verifyGoogleToken = async (idToken: string): Promise<any> => {
    // Verify the ID token using Google API or a library
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload['email'];

    // Find or create the user in your database
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user if not found
      user = new User({
        googleId: payload['sub'],
        fullName: payload['name'],
        email: payload['email']

        // Add other fields as required
      });
      await user.save();
    } else {
      // Update existing user with googleId if not already set
      if (!user.googleId) {
        user.googleId = payload['sub'];
        await user.save();
      }
    }
    return user;
  };
}

export default UserService;
