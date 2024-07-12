import multer, { Multer } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Response, Request } from 'express';
// Configure multer storage
const storage = multer.diskStorage({});

// Configure multer upload
const upload = multer({ storage });

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

// Middleware to upload files to Cloudinary
const uploadToCloudinary = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.file);

  upload.single('file')(req, res, (err: any) => {
    if (err) {
      // Handle multer error
      return next(err);
    }
    // Upload file to Cloudinary
    const file = req.file;
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        return next(error); // Pass error to the next middleware
      }
      // Handle Cloudinary response
      req.fileUrl = result.secure_url;
      next();
    });
  });
};

export default uploadToCloudinary;
