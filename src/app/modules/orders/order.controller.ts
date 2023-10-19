/* eslint-disable no-console */
import { Request, Response } from 'express';
import catchAsyncError from '../../../shared/catchAsyncError';
import { OrderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IOrder } from './order.interface';
import pick from '../../../shared/pick';
import { orderFilterableFields } from '../image/order.constant';

const createOrder = catchAsyncError(async (req: Request, res: Response) => {
  const ordersData = req.body;
  const user = req.user;

  const orderResults = [];

  for (const orderData of ordersData) {
    const result = await OrderService.createOrder(orderData, user?._id);
    orderResults.push(result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: orderResults,
  });
});

const getAllOrders = catchAsyncError(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const result = await OrderService.getAllOrders(filters);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All orders retrived succesfully',
    data: result,
  });
});

const cancelOrder = catchAsyncError(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderService.cancelOrder(orderId);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order cancelled succesfully',
    data: result,
  });
});
const deliverOrder = catchAsyncError(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderService.deliverOrder(orderId);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order delivered succesfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  cancelOrder,
  deliverOrder,
};
