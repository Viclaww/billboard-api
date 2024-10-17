import { NextFunction, Response, Request } from 'express';
import { upload } from '../config/multer';
import cloudinary from '../config/multer';

// Middleware to upload files to Cloudinary
export const uploadToCloudinary = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.file);

  if (!req.file) {
    next();
  }

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
