/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { jwtHelpers } from '../../jwt/jwtHelper';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

export enum ENUM_USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super admin',
}

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, ' You are not authorized');
      }

      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
