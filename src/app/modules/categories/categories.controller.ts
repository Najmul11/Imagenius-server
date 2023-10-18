/* eslint-disable no-console */
import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { CategoryService } from './categories.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { categoryFilterableFields } from './category.contant';
import { paginationFields } from '../../../pagination/pagination.constant';

const getAllCategories = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, categoryFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CategoryService.getAllCategories(
      filters,
      paginationOptions
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All categories retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const CategoryController = {
  getAllCategories,
};
