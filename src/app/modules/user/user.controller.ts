/* eslint-disable no-console */
import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import config from '../../../config';
import {
  IRefreshTokenResponse,
  IUserLoginResponse,
} from '../../../jwt/jwt.interface';
import catchAsyncError from '../../../shared/catchAsyncError';
import sendResponse from '../../../shared/sendResponse';

const createUser = catchAsyncError(async (req: Request, res: Response) => {
  const user = req.body;
  const avatar = req.file;

  const result = await UserService.createUser(user, avatar);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser = catchAsyncError(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await UserService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === ' production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IUserLoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user logged in successfully!',
    data: others,
  });
});

const refreshToken = catchAsyncError(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await UserService.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === ' production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully',
    data: result,
  });
});

const getAllUsers = catchAsyncError(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result,
  });
});

const makeAdmin = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await UserService.makeAdmin(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User promoted as admin successfully',
    data: result,
  });
});
const removeAdmin = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await UserService.removeAdmin(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User demoted from admin successfully',
    data: result,
  });
});

const getProfile = catchAsyncError(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getProfile(user?._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;

  const result = await UserService.updateProfile(payload, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const changePaymentMethod = catchAsyncError(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;

    const result = await UserService.changePaymentMethod(payload, user?._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment method changed successfully',
      data: result,
    });
  }
);
const changePassword = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;

  const result = await UserService.changePassword(payload, user?._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password  updated successfully',
    data: result,
  });
});

const deleteUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = req.user;

  const result = await UserService.deleteUser(userId, user?.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  loginUser,
  refreshToken,
  getProfile,
  getAllUsers,
  makeAdmin,
  removeAdmin,
  deleteUser,
  changePaymentMethod,
  changePassword,
  updateProfile,
};
