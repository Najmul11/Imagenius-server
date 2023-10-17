/* eslint-disable no-console */
import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { CategoryService } from './categories.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const getAllCategories = catchAsyncError(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();
    console.log('hit');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All categories retrieved successfully',
      data: result,
    });
  }
);

export const CategoryController = {
  getAllCategories,
};
