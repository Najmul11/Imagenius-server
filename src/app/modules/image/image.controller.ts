/* eslint-disable no-undef */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { ImageService } from './image.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IImage } from './image.interface';
import { imageFilterableFields } from './image.constant';
import { paginationFields } from '../../../pagination/pagination.constant';
import pick from '../../../shared/pick';

const addImage = catchAsyncError(async (req: Request, res: Response) => {
  const imageInfo = req.body;
  const image = req.file;

  const result = await ImageService.addImage(imageInfo, image);

  sendResponse<IImage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image added successfully',
    data: result,
  });
});

const getAllmages = catchAsyncError(async (req: Request, res: Response) => {
  const filters = pick(req.query, imageFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await ImageService.getAllmages(filters, paginationOptions);

  sendResponse<IImage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All images retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleImage = catchAsyncError(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const result = await ImageService.getSingleImage(imageId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image retrieved successfully',
    data: result,
  });
});

const editImage = catchAsyncError(async (req: Request, res: Response) => {
  const payload = req.body;
  const { imageId } = req.params;
  const result = await ImageService.editImage(payload, imageId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image data edited successfully',
    data: result,
  });
});

const deleteImage = catchAsyncError(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const result = await ImageService.deleteImage(imageId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image deleted successfully',
    data: result,
  });
});

export const ImageController = {
  getAllmages,
  addImage,
  deleteImage,
  editImage,
  getSingleImage,
};
