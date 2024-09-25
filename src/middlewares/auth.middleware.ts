/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
  req: AuthenticatedRequest,ct} res
 * @param {Function} next
 */
export const userAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let bearerToken = req.header('Authorization').split(' ')[1].trim();
    if (!bearerToken) {
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization is required'
      };
    } else {
      await jwt.verify(
        bearerToken,
        process.env.JWT_SECRET,
        (error, decodedToken) => {
          if (error) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              message: 'Not authorized or wrong token'
            });
          } else {
            req.user = decodedToken;
            next();
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
};
