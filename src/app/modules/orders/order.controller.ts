import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IOrder } from './order.interface';

const createOrder = catchAsyncError(async (req: Request, res: Response) => {
  const orderData = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsyncError(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All orders retrived succesfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
};
