import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { CustomOrderService } from './customOrder.service';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';

const createCustomOrder = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user;
    const picture = req.file;
    const payload = req.body;

    const result = await CustomOrderService.createCustomOrder(
      picture,
      user?._id,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Your custom order is placed',
      data: result,
    });
  }
);

export const CustomOrderController = {
  createCustomOrder,
};
