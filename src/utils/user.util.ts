import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';

export const hashPassword = async (body) => {
  let data = {
    ...body,
    password: await hash(body.password)
  };
  return data;
};

export const returnFrontendUserInfo = (data) => {
  // returning save data to frontend
  return {
    id: data._id,
    email: data.email,
    'display-name': data.displayName,
    'State of residence': data.SOR,
    'full-name': data.fullName,
    'phone-number': data.phone,
    field: data.field
  };
};

// compare password in utils
export const comparePasswordUtil = async (pass1, pass2) => {
  let correct = await verify(pass1, pass2);
  return correct;
};

// creating authentications tokens
export const signToken = async (body) => {
  let JWT_SECRET = process.env.JWT_SECRET;
  let token = await jwt.sign(
    {
      email: body.email,
      password: body.password
    },
    JWT_SECRET,
    {
      expiresIn: '3d'
    }
  );
  return token;
};

// generating random otp for users
export const generateOTP = (): string => {
  let otpnum = Math.floor(100000 + Math.random() * 900000);
  let otp = otpnum.toString().slice(0, 6);
  return otp.toString();
};
