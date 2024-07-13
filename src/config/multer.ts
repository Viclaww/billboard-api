import multer, { Multer } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
// Configure multer storage
const storage = multer.diskStorage({});

// Configure multer uploaded
export const upload = multer({ storage });

// Declare 'fileUrl' property on Request type
declare global {
  namespace Express {
    interface Request {
      fileUrl?: string;
      file?: Multer.File;
    }
  }
}
// Configure Cloudinary
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

export default cloudinary;
